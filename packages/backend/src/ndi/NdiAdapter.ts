/**
 * NdiAdapter
 *
 * Abstraction layer for NDI (Network Device Interface) output.
 *
 * ── ARCHITECTURAL REALITY NOTE ─────────────────────────────────────────────
 * NDI® is a proprietary standard by Vizrt / NewTek. Native NDI output from a
 * web browser is NOT technically possible because:
 *   a) NDI requires a native C/C++ SDK (libndi.so / NDI SDK DLL).
 *   b) WebCodecs/WebRTC cannot send raw NDI transport frames.
 *   c) The NDI SDK has no WebAssembly port as of 2026.
 *
 * Production integration paths (real, non-hallucinated):
 *   1. Node.js native addon (node-gyp) wrapping the NDI SDK C API
 *      → calls NDIlib_send_create(), NDIlib_send_send_video_v2()
 *   2. Separate companion process (Electron main process, native helper)
 *      that receives frames via shared memory / IPC from Node.js
 *   3. Third-party tools: OBS Studio (NDI plugin), vMix, NewTek NDI Tools —
 *      configured to capture the browser window/display output
 *
 * This file provides:
 *   - The interface contract (NdiAdapter)
 *   - A StubNdiAdapter for development/testing (no native dependency)
 *   - A NativeNdiAdapter shell that validates the native module is present
 *     before attempting to load it (graceful degradation)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface NdiFrameInfo {
  width: number;
  height: number;
  frameRateN: number;  // numerator   e.g. 25000 for 25fps
  frameRateD: number;  // denominator e.g. 1000
  timecode: bigint;    // 100ns ticks
}

export interface NdiAdapterStatus {
  available: boolean;
  sourceName: string;
  isStreaming: boolean;
  frameRate: number;
  resolution: { width: number; height: number };
  errorMessage?: string;
}

export interface NdiAdapter {
  /** Initialise the NDI sender. Resolves when ready. */
  init(sourceName: string): Promise<void>;

  /** Send a raw BGRA video frame. */
  sendFrame(pixels: Buffer, info: NdiFrameInfo): void;

  /** Send an audio frame (PCM float32 interleaved). */
  sendAudio?(samples: Float32Array, sampleRate: number, channels: number): void;

  /** Stop streaming and release resources. */
  destroy(): void;

  getStatus(): NdiAdapterStatus;
}

// ─── Stub implementation (no native dependency) ────────────────────────────

export class StubNdiAdapter implements NdiAdapter {
  private _sourceName = 'Saarwood Teleprompter';
  private _streaming = false;
  private _frameCount = 0;

  async init(sourceName: string): Promise<void> {
    this._sourceName = sourceName;
    this._streaming = true;
    console.info(
      `[NDI-STUB] Initialised source "${sourceName}". ` +
      'Real NDI output requires the NDI SDK native addon.',
    );
  }

  sendFrame(_pixels: Buffer, _info: NdiFrameInfo): void {
    this._frameCount++;
    // Stub: no-op. Replace with native addon call in production.
  }

  destroy(): void {
    this._streaming = false;
    console.info('[NDI-STUB] Destroyed.');
  }

  getStatus(): NdiAdapterStatus {
    return {
      available: false, // explicitly false: no real NDI output
      sourceName: this._sourceName,
      isStreaming: this._streaming,
      frameRate: 25,
      resolution: { width: 1920, height: 1080 },
      errorMessage:
        'NDI native addon not loaded. Install ndi-sdk-node or configure OBS NDI capture.',
    };
  }

  get frameCount(): number {
    return this._frameCount;
  }
}

// ─── Native NDI adapter shell ──────────────────────────────────────────────

/**
 * NativeNdiAdapter
 *
 * Attempts to load a native Node.js addon that wraps the NDI SDK.
 * Falls back to StubNdiAdapter if the addon is not available.
 *
 * To provide a real implementation:
 *   npm install ndi-sdk-node  (if available)
 * or build your own addon with node-gyp and the NDI SDK headers.
 */
export class NativeNdiAdapter implements NdiAdapter {
  private delegate: NdiAdapter;

  constructor() {
    // Attempt to load optional native addon
    let nativeModule: NdiAdapter | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      nativeModule = require('ndi-sdk-node') as NdiAdapter;
      console.info('[NDI] Native addon loaded successfully.');
    } catch {
      console.warn(
        '[NDI] Native addon not found. Using stub. ' +
        'For real NDI output, install a compatible ndi-sdk-node addon.',
      );
    }
    this.delegate = nativeModule ?? new StubNdiAdapter();
  }

  async init(sourceName: string): Promise<void> {
    return this.delegate.init(sourceName);
  }

  sendFrame(pixels: Buffer, info: NdiFrameInfo): void {
    this.delegate.sendFrame(pixels, info);
  }

  sendAudio(samples: Float32Array, sampleRate: number, channels: number): void {
    this.delegate.sendAudio?.(samples, sampleRate, channels);
  }

  destroy(): void {
    this.delegate.destroy();
  }

  getStatus(): NdiAdapterStatus {
    return this.delegate.getStatus();
  }
}

// Default export: use NativeNdiAdapter in production (falls back to stub)
export const createNdiAdapter = (): NdiAdapter => new NativeNdiAdapter();
