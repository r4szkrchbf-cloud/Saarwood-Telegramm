import { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { Server } from 'http';
import type { WsMessage } from '../types';

/**
 * ControlServer
 *
 * WebSocket server that relays control messages between all connected clients
 * (browser apps, smartphone remote controls, Bluetooth pedal relay services).
 *
 * All messages follow the WsMessage<T> envelope defined in types/index.ts.
 *
 * "Last-device-in-control" is enforced on the client side; the server is a
 * stateless message bus with these responsibilities:
 *   - Accept connections at /ws
 *   - Broadcast transport commands (PLAY, PAUSE, STOP, SET_SPEED, SET_POSITION)
 *     to all other connected clients
 *   - Broadcast MOS_UPDATE messages (forwarded from MosHandler)
 *   - Respond to HEARTBEAT messages with SYNC_STATE (current server state)
 *   - Log controller connect/disconnect events
 */
export class ControlServer {
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();
  private roomState = new Map<string, {
    isPlaying: boolean;
    speed: number;
    position: number;
    direction: 'down' | 'up';
  }>();
  private clientRoom = new Map<WebSocket, string>();
  private clientId = new Map<WebSocket, string>();
  private roomPositionOwner = new Map<string, string>();

  constructor(httpServer: Server) {
    this.wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    this._init();
  }

  private _init(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientIp = req.socket.remoteAddress ?? 'unknown';
      const room = this._resolveRoom(req);
      const client = this._resolveClientId(req);
      console.log(`[WS] Client connected: ${clientIp} (room=${room}, client=${client})`);
      this.clients.add(ws);
      this.clientRoom.set(ws, room);
      this.clientId.set(ws, client);

      // Send current state on connect
      this._send(ws, {
        type: 'SYNC_STATE',
        payload: { ...this._getRoomState(room) },
        timestamp: Date.now(),
      });

      ws.on('message', (raw: Buffer | string) => {
        this._handleMessage(ws, raw.toString());
      });

      ws.on('close', () => {
        console.log(`[WS] Client disconnected: ${clientIp} (room=${room}, client=${client})`);
        this.clients.delete(ws);
        this.clientRoom.delete(ws);
        this.clientId.delete(ws);
        const owner = this.roomPositionOwner.get(room);
        if (owner === client) {
          this.roomPositionOwner.delete(room);
        }
        this._cleanupRoomIfEmpty(room);
        this._broadcast(
          { type: 'CONTROLLER_DISCONNECTED', timestamp: Date.now() },
          ws,
          room,
        );
      });

      ws.on('error', (err: Error) => {
        console.error('[WS] Client error:', err.message);
        const errorRoom = this.clientRoom.get(ws);
        const errorClient = this.clientId.get(ws);
        if (errorRoom && errorClient && this.roomPositionOwner.get(errorRoom) === errorClient) {
          this.roomPositionOwner.delete(errorRoom);
        }
        this.clients.delete(ws);
        this.clientRoom.delete(ws);
        this.clientId.delete(ws);
        if (errorRoom) {
          this._cleanupRoomIfEmpty(errorRoom);
        }
      });
    });

    this.wss.on('error', (err: Error) => {
      console.error('[WS] Server error:', err.message);
    });
  }

  private _handleMessage(sender: WebSocket, raw: string): void {
    let msg: WsMessage;
    try {
      msg = JSON.parse(raw) as WsMessage;
    } catch {
      console.warn('[WS] Unparseable message from client');
      return;
    }

    const room = this.clientRoom.get(sender) ?? 'global';
    const senderClientId = this.clientId.get(sender) ?? 'client-anon';
    const state = this._getRoomState(room);

    // Update per-room state for sync-on-connect
    switch (msg.type) {
      case 'PLAY':
        state.isPlaying = true;
        break;
      case 'PAUSE':
      case 'STOP':
        state.isPlaying = false;
        if (msg.type === 'STOP') state.position = 0;
        break;
      case 'SET_SPEED': {
        const p = msg.payload as { speed?: number } | undefined;
        if (typeof p?.speed === 'number') state.speed = p.speed;
        break;
      }
      case 'SET_DIRECTION': {
        const p = msg.payload as { direction?: 'down' | 'up' } | undefined;
        if (p?.direction === 'down' || p?.direction === 'up') {
          state.direction = p.direction;
        }
        break;
      }
      case 'SET_POSITION': {
        const p = msg.payload as { position?: number; ownerId?: string } | undefined;
        if (typeof p?.position === 'number') {
          const nextOwner = typeof p.ownerId === 'string' && p.ownerId.trim().length > 0
            ? p.ownerId.trim()
            : senderClientId;
          const currentOwner = this.roomPositionOwner.get(room);
          if (!currentOwner) {
            this.roomPositionOwner.set(room, nextOwner);
          } else if (currentOwner !== nextOwner) {
            return; // Ignore position updates from non-owner clients.
          }
          state.position = p.position;
        }
        break;
      }
      case 'HEARTBEAT':
        // Reply directly to sender with current state
        this._send(sender, {
          type: 'SYNC_STATE',
          payload: { ...state },
          timestamp: Date.now(),
        });
        return; // Do not broadcast heartbeats
    }

    // Relay only within the same room
    this._broadcast(msg, sender, room);
  }

  /** Broadcast a MOS update to all connected clients (called by MosHandler). */
  broadcastMosUpdate(payload: unknown): void {
    this._broadcast({ type: 'MOS_UPDATE', payload, timestamp: Date.now() });
  }

  /**
   * Broadcast an ingest event to all connected clients as a SCRIPT_UPDATE.
   * Called by the /api/v1/ingest route handler.
   */
  broadcastIngest(payload: unknown): void {
    this._broadcast({ type: 'SCRIPT_UPDATE', payload, timestamp: Date.now() });
  }

  private _broadcast(msg: WsMessage, exclude?: WebSocket, room?: string): void {
    const data = JSON.stringify(msg);
    this.clients.forEach((client) => {
      if (client === exclude) return;
      if (room && this.clientRoom.get(client) !== room) return;
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private _resolveRoom(req: IncomingMessage): string {
    try {
      const parsed = new URL(req.url ?? '/ws', 'http://localhost');
      const raw = (parsed.searchParams.get('room') ?? '').trim();
      if (!raw) return 'global';
      return raw.slice(0, 80);
    } catch {
      return 'global';
    }
  }

  private _resolveClientId(req: IncomingMessage): string {
    try {
      const parsed = new URL(req.url ?? '/ws', 'http://localhost');
      const raw = (parsed.searchParams.get('client') ?? '').trim();
      if (!raw) return 'client-anon';
      return raw.slice(0, 80);
    } catch {
      return 'client-anon';
    }
  }

  private _getRoomState(room: string): {
    isPlaying: boolean;
    speed: number;
    position: number;
    direction: 'down' | 'up';
  } {
    const existing = this.roomState.get(room);
    if (existing) return existing;
    const initial = {
      isPlaying: false,
      speed: 80,
      position: 0,
      direction: 'down' as 'down' | 'up',
    };
    this.roomState.set(room, initial);
    return initial;
  }

  private _cleanupRoomIfEmpty(room: string): void {
    const stillHasClients = Array.from(this.clientRoom.values()).some((clientRoom) => clientRoom === room);
    if (stillHasClients) return;

    this.roomState.delete(room);
    this.roomPositionOwner.delete(room);
  }

  private _send(ws: WebSocket, msg: WsMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }

  get roomCount(): number {
    return this.roomState.size;
  }

  getRoomStats(): Array<{
    room: string;
    clients: number;
    isPlaying: boolean;
    speed: number;
    position: number;
    direction: 'down' | 'up';
  }> {
    const clientsPerRoom = new Map<string, number>();
    this.clientRoom.forEach((room) => {
      clientsPerRoom.set(room, (clientsPerRoom.get(room) ?? 0) + 1);
    });

    return Array.from(this.roomState.entries())
      .map(([room, state]) => ({
        room,
        clients: clientsPerRoom.get(room) ?? 0,
        ...state,
      }))
      .sort((left, right) => left.room.localeCompare(right.room));
  }

  /** Clean shutdown. */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
