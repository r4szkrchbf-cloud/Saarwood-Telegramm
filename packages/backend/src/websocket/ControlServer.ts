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
  private state = {
    isPlaying: false,
    speed: 80,
    position: 0,
    direction: 'down' as 'down' | 'up',
  };

  constructor(httpServer: Server) {
    this.wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    this._init();
  }

  private _init(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientIp = req.socket.remoteAddress ?? 'unknown';
      console.log(`[WS] Client connected: ${clientIp}`);
      this.clients.add(ws);

      // Send current state on connect
      this._send(ws, {
        type: 'SYNC_STATE',
        payload: { ...this.state },
        timestamp: Date.now(),
      });

      ws.on('message', (raw: Buffer | string) => {
        this._handleMessage(ws, raw.toString());
      });

      ws.on('close', () => {
        console.log(`[WS] Client disconnected: ${clientIp}`);
        this.clients.delete(ws);
        this._broadcast(
          { type: 'CONTROLLER_DISCONNECTED', timestamp: Date.now() },
          ws,
        );
      });

      ws.on('error', (err: Error) => {
        console.error('[WS] Client error:', err.message);
        this.clients.delete(ws);
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

    // Update server state for sync-on-connect
    switch (msg.type) {
      case 'PLAY':
        this.state.isPlaying = true;
        break;
      case 'PAUSE':
      case 'STOP':
        this.state.isPlaying = false;
        if (msg.type === 'STOP') this.state.position = 0;
        break;
      case 'SET_SPEED': {
        const p = msg.payload as { speed?: number } | undefined;
        if (typeof p?.speed === 'number') this.state.speed = p.speed;
        break;
      }
      case 'SET_DIRECTION': {
        const p = msg.payload as { direction?: 'down' | 'up' } | undefined;
        if (p?.direction === 'down' || p?.direction === 'up') {
          this.state.direction = p.direction;
        }
        break;
      }
      case 'SET_POSITION': {
        const p = msg.payload as { position?: number } | undefined;
        if (typeof p?.position === 'number') this.state.position = p.position;
        break;
      }
      case 'HEARTBEAT':
        // Reply directly to sender with current state
        this._send(sender, {
          type: 'SYNC_STATE',
          payload: { ...this.state },
          timestamp: Date.now(),
        });
        return; // Do not broadcast heartbeats
    }

    // Relay to all other clients
    this._broadcast(msg, sender);
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

  private _broadcast(msg: WsMessage, exclude?: WebSocket): void {
    const data = JSON.stringify(msg);
    this.clients.forEach((client) => {
      if (client === exclude) return;
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private _send(ws: WebSocket, msg: WsMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }

  /** Clean shutdown. */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
