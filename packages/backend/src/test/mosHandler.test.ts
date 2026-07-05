import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MosHandler } from '../mos/MosHandler';
import * as net from 'net';

// Use a non-standard port for tests to avoid conflicts
const TEST_MOS_PORT = 19540;

async function connectClient(): Promise<net.Socket> {
  return new Promise((resolve) => {
    const socket = net.createConnection(TEST_MOS_PORT, '127.0.0.1', () =>
      resolve(socket),
    );
  });
}

function sendXml(socket: net.Socket, xml: string): void {
  socket.write(xml);
}

function waitForData(socket: net.Socket, timeoutMs = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Timeout waiting for MOS response')),
      timeoutMs,
    );
    socket.once('data', (data: Buffer) => {
      clearTimeout(timeout);
      resolve(data.toString());
    });
  });
}

describe('MosHandler', () => {
  let handler: MosHandler;

  beforeEach(async () => {
    handler = new MosHandler(TEST_MOS_PORT);
    await handler.start();
  });

  afterEach(() => {
    handler.stop();
  });

  it('starts and accepts TCP connections', async () => {
    const socket = await connectClient();
    expect(socket.readyState).toBe('open');
    socket.destroy();
  });

  it('handles heartbeat and sends ACK', async () => {
    const socket = await connectClient();
    const heartbeatXml =
      '<?xml version="1.0"?><mos><mosID>NRCS</mosID><heartbeat><time>2026-01-01T00:00:00Z</time></heartbeat></mos>';
    sendXml(socket, heartbeatXml);
    const response = await waitForData(socket);
    expect(response).toContain('heartbeatAck');
    expect(response).toContain('ACK');
    socket.destroy();
  });

  it('emits heartbeat event', async () => {
    const socket = await connectClient();
    const events: string[] = [];
    handler.onEvent((e) => events.push(e.type));

    const heartbeatXml =
      '<?xml version="1.0"?><mos><mosID>NRCS</mosID><heartbeat><time>2026-01-01T00:00:00Z</time></heartbeat></mos>';
    sendXml(socket, heartbeatXml);

    await new Promise((r) => setTimeout(r, 100));
    expect(events).toContain('heartbeat');
    socket.destroy();
  });

  it('handles mosROCreate and emits roCreate event', async () => {
    const socket = await connectClient();
    const events: Array<{ type: string; roId?: string }> = [];
    handler.onEvent((e) => events.push({ type: e.type, roId: e.roId }));

    const roXml =
      '<?xml version="1.0"?><mos><mosID>NRCS</mosID>' +
      '<mosROCreate><roID>RO-001</roID><roSlug>Evening News</roSlug></mosROCreate>' +
      '</mos>';
    sendXml(socket, roXml);

    await new Promise((r) => setTimeout(r, 100));
    const roEvent = events.find((e) => e.type === 'roCreate');
    expect(roEvent).toBeDefined();
    expect(roEvent?.roId).toBe('RO-001');
    socket.destroy();
  });

  it('tracks connected NRCS client count', async () => {
    const s1 = await connectClient();
    const s2 = await connectClient();
    await new Promise((r) => setTimeout(r, 50));
    expect(handler.connectedNrcsCount).toBe(2);
    s1.destroy();
    s2.destroy();
  });
});
