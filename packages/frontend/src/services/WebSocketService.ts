import type { WsMessage, WsMessageType } from '../types';

type MessageHandler = (msg: WsMessage) => void;

/**
 * WebSocketService
 *
 * Singleton wrapper around a browser WebSocket connection to the backend
 * control server. Handles automatic reconnection with exponential back-off,
 * heartbeat keep-alive, and typed message dispatch.
 */
class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers = new Map<WsMessageType | '*', Set<MessageHandler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectDelay = 1000;   // ms – doubled on each failure (max 30 s)
  private readonly MAX_RECONNECT_DELAY = 30_000;
  private url: string;
  private _connected = false;

  constructor(url: string) {
    this.url = url;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    this._openSocket();
  }

  disconnect(): void {
    this._clearTimers();
    if (this.ws) {
      this.ws.onclose = null; // prevent reconnect
      this.ws.close();
      this.ws = null;
    }
    this._connected = false;
  }

  send<T>(type: WsMessageType, payload?: T): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Not connected – message dropped:', type);
      return;
    }
    const msg: WsMessage<T> = { type, payload, timestamp: Date.now() };
    this.ws.send(JSON.stringify(msg));
  }

  /** Subscribe to a specific message type or '*' for all messages. */
  on(type: WsMessageType | '*', handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
    return () => this.off(type, handler);
  }

  off(type: WsMessageType | '*', handler: MessageHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  get connected(): boolean {
    return this._connected;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private _openSocket(): void {
    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this._connected = true;
      this.reconnectDelay = 1000;
      this._startHeartbeat();
      this._dispatch({ type: 'HEARTBEAT', timestamp: Date.now() });
    };

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as WsMessage;
        this._dispatch(msg);
      } catch {
        console.warn('[WS] Failed to parse message:', event.data);
      }
    };

    this.ws.onerror = () => {
      // onerror is always followed by onclose; reconnect logic lives there
    };

    this.ws.onclose = () => {
      this._connected = false;
      this._clearHeartbeat();
      this._scheduleReconnect();
    };
  }

  private _dispatch(msg: WsMessage): void {
    this.handlers.get(msg.type)?.forEach((h) => h(msg));
    this.handlers.get('*')?.forEach((h) => h(msg));
  }

  private _scheduleReconnect(): void {
    if (this.reconnectTimer !== null) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this._openSocket();
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.MAX_RECONNECT_DELAY,
      );
    }, this.reconnectDelay);
  }

  private _startHeartbeat(): void {
    this._clearHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send('HEARTBEAT');
    }, 5000);
  }

  private _clearHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private _clearTimers(): void {
    this._clearHeartbeat();
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Derive backend WS URL from window.location so it works in any deployment
function buildWsUrl(): string {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${proto}//${host}/ws`;
}

export const wsService = new WebSocketService(buildWsUrl());
export { WebSocketService };
