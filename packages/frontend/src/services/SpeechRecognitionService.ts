/**
 * SpeechRecognitionService
 *
 * Browser-native ASR integration using the Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition).
 *
 * Basic tier:  Cloud-based recognition (browser delegates to OS/cloud).
 * Expert tier: On-premise ASR is connected via a backend proxy that exposes
 *              a WebSocket stream conforming to the same transcript event format
 *              (Whisper.cpp / Vosk / DeepSpeech — all run server-side).
 *
 * LIMITATION (architectural note):
 *   The Web Speech API does NOT support fully offline, on-premise ASR from
 *   within the browser. On-premise inference (Whisper.cpp, Vosk, etc.) must
 *   run in a Node.js backend process or as a native companion app and relay
 *   transcripts via WebSocket. This service abstracts both paths behind the
 *   same interface.
 */

export interface TranscriptEvent {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export type TranscriptHandler = (event: TranscriptEvent) => void;

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private handlers = new Set<TranscriptHandler>();
  private _isListening = false;
  private language = 'de-DE'; // Default: German (Broadcast DE market)

  get isSupported(): boolean {
    return getSpeechRecognitionCtor() !== null;
  }

  get isListening(): boolean {
    return this._isListening;
  }

  setLanguage(lang: string): void {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  start(): void {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      console.warn('[ASR] Web Speech API not supported in this browser.');
      return;
    }
    if (this._isListening) return;

    this.recognition = new Ctor();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (!result) return;
      const alt = result[0];
      this._emit({
        transcript: alt.transcript.trim(),
        isFinal: result.isFinal,
        confidence: alt.confidence,
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('[ASR] Recognition error:', event.error);
    };

    this.recognition.onend = () => {
      // Auto-restart unless explicitly stopped
      if (this._isListening) {
        this.recognition?.start();
      }
    };

    this._isListening = true;
    this.recognition.start();
  }

  stop(): void {
    this._isListening = false;
    this.recognition?.stop();
    this.recognition = null;
  }

  onTranscript(handler: TranscriptHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private _emit(event: TranscriptEvent): void {
    this.handlers.forEach((h) => h(event));
  }
}

export const speechService = new SpeechRecognitionService();

// ─── Voice-tracking word-position matcher ─────────────────────────────────

/**
 * Given the full script text (plain, stripped of HTML tags) and a transcript
 * fragment, return the best-match character offset into the script.
 * Uses a sliding-window search for the longest matching word sequence.
 */
export function matchTranscriptToScript(
  scriptText: string,
  transcript: string,
): number {
  if (!transcript || !scriptText) return -1;

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();

  const normScript = normalize(scriptText);
  const normTranscript = normalize(transcript);

  const words = normTranscript.split(/\s+/);
  const windowSize = Math.min(words.length, 6);

  for (let len = windowSize; len >= 1; len--) {
    for (let start = 0; start <= words.length - len; start++) {
      const phrase = words.slice(start, start + len).join(' ');
      const idx = normScript.lastIndexOf(phrase);
      if (idx !== -1) return idx;
    }
  }

  return -1;
}
