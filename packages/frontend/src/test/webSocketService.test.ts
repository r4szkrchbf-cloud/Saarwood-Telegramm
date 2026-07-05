import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketService } from '../services/WebSocketService';

// Mock the global WebSocket
class MockWebSocket {
  static OPEN = 1;
  static CONNECTING = 0;
  readyState = MockWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  sentMessages: string[] = [];

  constructor(_url: string) {
    // Simulate async open
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.readyState = 3; // CLOSED
    this.onclose?.();
  }
}

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWs: MockWebSocket | undefined;

  beforeEach(() => {
    mockWs = undefined;
    // The stub MUST expose OPEN=1 so WebSocketService's `readyState !== WebSocket.OPEN` check works
    const factory = function (url: string) {
      mockWs = new MockWebSocket(url);
      return mockWs;
    };
    (factory as unknown as Record<string, number>).OPEN = MockWebSocket.OPEN;
    vi.stubGlobal('WebSocket', factory);
    service = new WebSocketService('ws://localhost:4000/ws');
  });

  afterEach(() => {
    service.disconnect();
    vi.unstubAllGlobals();
  });

  it('connects and becomes connected after open', async () => {
    service.connect();
    await vi.waitFor(() => expect(service.connected).toBe(true));
  });

  it('sends a message when connected', async () => {
    service.connect();
    await vi.waitFor(() => expect(service.connected).toBe(true));

    service.send('PLAY');
    expect(mockWs!.sentMessages).toHaveLength(1);
    const msg = JSON.parse(mockWs!.sentMessages[0]);
    expect(msg.type).toBe('PLAY');
    expect(msg.timestamp).toBeTypeOf('number');
  });

  it('drops message and warns when not connected', () => {
    // connect() is NOT called — service has no socket open
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    service.send('PAUSE');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Not connected'),
      'PAUSE',
    );
    warn.mockRestore();
  });

  it('dispatches received messages to registered handlers', async () => {
    service.connect();
    await vi.waitFor(() => expect(service.connected).toBe(true));

    const received: string[] = [];
    const unsub = service.on('PLAY', (msg) => received.push(msg.type));

    mockWs!.onmessage?.({ data: JSON.stringify({ type: 'PLAY', timestamp: Date.now() }) });
    expect(received).toEqual(['PLAY']);

    unsub();
    mockWs!.onmessage?.({ data: JSON.stringify({ type: 'PLAY', timestamp: Date.now() }) });
    expect(received).toHaveLength(1); // unsubscribed
  });

  it('wildcard handler receives all message types', async () => {
    service.connect();
    await vi.waitFor(() => expect(service.connected).toBe(true));

    const types: string[] = [];
    service.on('*', (msg) => types.push(msg.type));

    mockWs!.onmessage?.({ data: JSON.stringify({ type: 'PLAY', timestamp: Date.now() }) });
    mockWs!.onmessage?.({ data: JSON.stringify({ type: 'PAUSE', timestamp: Date.now() }) });

    expect(types).toEqual(['PLAY', 'PAUSE']);
  });
});

