import { describe, it, expect, afterEach } from 'vitest';
import { StubNdiAdapter } from '../ndi/NdiAdapter';

describe('StubNdiAdapter', () => {
  let adapter: StubNdiAdapter;

  afterEach(() => {
    adapter.destroy();
  });

  it('reports available=false (no native NDI)', async () => {
    adapter = new StubNdiAdapter();
    await adapter.init('Test Source');
    expect(adapter.getStatus().available).toBe(false);
  });

  it('reflects the source name after init', async () => {
    adapter = new StubNdiAdapter();
    await adapter.init('My Teleprompter');
    expect(adapter.getStatus().sourceName).toBe('My Teleprompter');
  });

  it('isStreaming is true after init and false after destroy', async () => {
    adapter = new StubNdiAdapter();
    await adapter.init('Test');
    expect(adapter.getStatus().isStreaming).toBe(true);
    adapter.destroy();
    expect(adapter.getStatus().isStreaming).toBe(false);
  });

  it('counts sent frames', async () => {
    adapter = new StubNdiAdapter();
    await adapter.init('Test');
    const dummyPixels = Buffer.alloc(1920 * 1080 * 4);
    const frameInfo = {
      width: 1920,
      height: 1080,
      frameRateN: 25000,
      frameRateD: 1000,
      timecode: BigInt(0),
    };
    adapter.sendFrame(dummyPixels, frameInfo);
    adapter.sendFrame(dummyPixels, frameInfo);
    expect(adapter.frameCount).toBe(2);
  });
});
