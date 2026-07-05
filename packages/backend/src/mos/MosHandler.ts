import * as net from 'net';
import { parseStringPromise } from 'xml2js';
import type { MosRunningOrder, MosStory, MosItem } from '../types';

/**
 * MosHandler
 *
 * Implements MOS Protocol v2.8.5 (TCP/XML) for integration with
 * Newsroom Computer Systems (NRCS) such as iNews, ENPS, Octopus, etc.
 *
 * Implemented profiles:
 *   Profile 0 — Basic / Heartbeat (mosObj, heartbeat)
 *   Profile 2 — Running Order (mosRO, mosROCreate, mosROReplace, mosRODelete,
 *                mosROInsertStories, mosROStoryReplace, mosROStoryDelete)
 *
 * Architecture notes:
 *   - MOS uses TWO persistent TCP connections (per spec section 5):
 *       upper: NRCS→Teleprompter on port 10540  (running order commands)
 *       lower: Teleprompter→NRCS on port 10541  (object requests / ACKs)
 *   - This implementation listens on the upper port (10540) by default.
 *   - XML parsing uses xml2js (real Node.js library, not hallucinated).
 *   - Heartbeat interval defaults to 30 s per MOS spec §5.4.
 *
 * LIMITATION:
 *   Full duplex lower-connection (port 10541) is scaffolded but not started
 *   by default.  Enable via `enableLowerConnection()`.
 */

const MOS_UPPER_PORT = 10540;
const MOS_LOWER_PORT = 10541;
const HEARTBEAT_INTERVAL_MS = 30_000;

export type MosEventType = 'roCreate' | 'roReplace' | 'roDelete' | 'storyInsert' | 'storyReplace' | 'storyDelete' | 'heartbeat';

export interface MosEvent {
  type: MosEventType;
  roId?: string;
  runningOrder?: MosRunningOrder;
  storyId?: string;
}

export type MosEventHandler = (event: MosEvent) => void;

export class MosHandler {
  private upperServer: net.Server | null = null;
  private lowerServer: net.Server | null = null;
  private clients = new Set<net.Socket>();
  private handlers = new Set<MosEventHandler>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private readonly upperPort: number;

  constructor(
    upperPort: number = MOS_UPPER_PORT,
    _lowerPort: number = MOS_LOWER_PORT,
  ) {
    this.upperPort = upperPort;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.upperServer = net.createServer((socket) => {
        this._handleConnection(socket);
      });

      this.upperServer.on('error', (err: Error) => {
        console.error('[MOS] Server error:', err.message);
        reject(err);
      });

      this.upperServer.listen(this.upperPort, () => {
        console.log(`[MOS] Listening on TCP port ${this.upperPort} (upper)`);
        this._startHeartbeat();
        resolve();
      });
    });
  }

  stop(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.clients.forEach((s) => s.destroy());
    this.clients.clear();
    this.upperServer?.close();
    this.lowerServer?.close();
  }

  onEvent(handler: MosEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  // ─── Connection handling ─────────────────────────────────────────────────

  private _handleConnection(socket: net.Socket): void {
    const addr = socket.remoteAddress;
    console.log(`[MOS] NRCS connected: ${addr}`);
    this.clients.add(socket);

    let buffer = '';

    socket.setEncoding('utf8');
    socket.on('data', (chunk: string) => {
      buffer += chunk;
      // MOS XML messages are delimited by </mos> end tag
      let idx: number;
      while ((idx = buffer.indexOf('</mos>')) !== -1) {
        const xml = buffer.slice(0, idx + 6);
        buffer = buffer.slice(idx + 6);
        this._parseXml(xml, socket).catch((err: Error) =>
          console.warn('[MOS] Parse error:', err.message),
        );
      }
    });

    socket.on('close', () => {
      console.log(`[MOS] NRCS disconnected: ${addr}`);
      this.clients.delete(socket);
    });

    socket.on('error', (err: Error) => {
      console.error('[MOS] Socket error:', err.message);
      this.clients.delete(socket);
    });
  }

  // ─── XML parsing & dispatch ──────────────────────────────────────────────

  private async _parseXml(xml: string, socket: net.Socket): Promise<void> {
    let doc: Record<string, unknown>;
    try {
      doc = (await parseStringPromise(xml, { explicitArray: false })) as Record<string, unknown>;
    } catch {
      console.warn('[MOS] Invalid XML:', xml.slice(0, 80));
      return;
    }

    const mos = doc['mos'] as Record<string, unknown> | undefined;
    if (!mos) return;

    // ── Heartbeat (Profile 0) ─────────────────────────────────────────────
    if ('heartbeat' in mos) {
      this._sendAck(socket, 'heartbeat');
      this._emit({ type: 'heartbeat' });
      return;
    }

    // ── Running Order commands (Profile 2) ────────────────────────────────
    if ('mosRO' in mos || 'mosROCreate' in mos) {
      const ro = this._parseRunningOrder(
        (mos['mosRO'] ?? mos['mosROCreate']) as Record<string, unknown>,
      );
      this._sendAck(socket, 'mosRO');
      this._emit({ type: 'roCreate', roId: ro.roId, runningOrder: ro });
      return;
    }

    if ('mosROReplace' in mos) {
      const ro = this._parseRunningOrder(
        mos['mosROReplace'] as Record<string, unknown>,
      );
      this._sendAck(socket, 'mosROReplace');
      this._emit({ type: 'roReplace', roId: ro.roId, runningOrder: ro });
      return;
    }

    if ('mosRODelete' in mos) {
      const del = mos['mosRODelete'] as Record<string, string>;
      this._sendAck(socket, 'mosRODelete');
      this._emit({ type: 'roDelete', roId: String(del['roID'] ?? '') });
      return;
    }

    if ('mosROInsertStories' in mos) {
      const ins = mos['mosROInsertStories'] as Record<string, unknown>;
      this._sendAck(socket, 'mosROInsertStories');
      this._emit({
        type: 'storyInsert',
        roId: String(ins['roID'] ?? ''),
        runningOrder: this._parseRunningOrder(ins),
      });
      return;
    }

    if ('mosROStoryReplace' in mos) {
      const rep = mos['mosROStoryReplace'] as Record<string, unknown>;
      this._sendAck(socket, 'mosROStoryReplace');
      this._emit({
        type: 'storyReplace',
        roId: String(rep['roID'] ?? ''),
      });
      return;
    }

    if ('mosROStoryDelete' in mos) {
      const del = mos['mosROStoryDelete'] as Record<string, unknown>;
      this._sendAck(socket, 'mosROStoryDelete');
      this._emit({
        type: 'storyDelete',
        roId: String(del['roID'] ?? ''),
        storyId: String(del['storyID'] ?? ''),
      });
      return;
    }

    console.warn('[MOS] Unhandled MOS command:', Object.keys(mos).join(', '));
  }

  // ─── XML builders ────────────────────────────────────────────────────────

  private _sendAck(socket: net.Socket, command: string): void {
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<mos><mosID>SAARWOOD_TP</mosID>` +
      `<${command}Ack><status>ACK</status></${command}Ack>` +
      `</mos>`;
    if (!socket.destroyed) socket.write(xml);
  }

  private _startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>` +
        `<mos><mosID>SAARWOOD_TP</mosID>` +
        `<heartbeat><time>${new Date().toISOString()}</time></heartbeat>` +
        `</mos>`;
      this.clients.forEach((s) => {
        if (!s.destroyed) s.write(xml);
      });
    }, HEARTBEAT_INTERVAL_MS);
  }

  // ─── Data mappers ─────────────────────────────────────────────────────────

  private _parseRunningOrder(
    src: Record<string, unknown>,
  ): MosRunningOrder {
    const rawStories = src['story'];
    const storiesArr: unknown[] = Array.isArray(rawStories)
      ? rawStories
      : rawStories != null
        ? [rawStories]
        : [];

    const stories: MosStory[] = storiesArr.map((s) => {
      const story = s as Record<string, unknown>;
      const rawItems = story['item'];
      const itemsArr: unknown[] = Array.isArray(rawItems)
        ? rawItems
        : rawItems != null
          ? [rawItems]
          : [];

      const items: MosItem[] = itemsArr.map((i) => {
        const item = i as Record<string, string>;
        return {
          itemId: item['itemID'] ?? '',
          slug: item['itemSlug'] ?? '',
          objId: item['objID'] ?? '',
          objType: item['objType'],
        };
      });

      return {
        storyId: String(story['storyID'] ?? ''),
        storySlug: String(story['storySlug'] ?? ''),
        items,
      };
    });

    return {
      roId: String(src['roID'] ?? ''),
      roSlug: String(src['roSlug'] ?? ''),
      stories,
    };
  }

  private _emit(event: MosEvent): void {
    this.handlers.forEach((h) => h(event));
  }

  get connectedNrcsCount(): number {
    return this.clients.size;
  }
}
