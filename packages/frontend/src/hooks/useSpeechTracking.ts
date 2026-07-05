import { useEffect, useRef, useState } from 'react';
import {
  speechService,
  matchTranscriptToScript,
} from '../services/SpeechRecognitionService';

interface UseSpeechTrackingOptions {
  enabled: boolean;
  /** Plain-text (HTML-stripped) content of the full script. */
  scriptText: string;
  /** Average character width in the current font, used to convert char
   *  offsets to pixel positions. Provide 0 to disable auto-scrolling. */
  charsPerPixel: number;
  /** Callback that receives the estimated scroll offset in pixels. */
  onScrollPositionEstimate: (px: number) => void;
  language?: string;
}

/**
 * useSpeechTracking
 *
 * Connects to the SpeechRecognitionService and translates speech transcripts
 * into scroll-position estimates.  The "last-device-in-control" convention
 * (Expert tier) is honoured: if a manual controller has set the position
 * within the last 2 seconds, voice-tracking does NOT override it.
 */
export function useSpeechTracking({
  enabled,
  scriptText,
  charsPerPixel,
  onScrollPositionEstimate,
  language = 'de-DE',
}: UseSpeechTrackingOptions): { isListening: boolean; lastTranscript: string } {
  const [lastTranscript, setLastTranscript] = useState('');
  const lastManualControlRef = useRef(0);

  // Expose a setter so the control panel can record manual interactions
  useEffect(() => {
    // Attach to global window event so ControlPanel can fire it
    const handleManualControl = () => {
      lastManualControlRef.current = Date.now();
    };
    window.addEventListener('prompter:manual-control', handleManualControl);
    return () =>
      window.removeEventListener('prompter:manual-control', handleManualControl);
  }, []);

  useEffect(() => {
    speechService.setLanguage(language);
  }, [language]);

  useEffect(() => {
    if (!enabled) {
      speechService.stop();
      return;
    }

    speechService.start();

    const unsub = speechService.onTranscript(({ transcript, isFinal }) => {
      if (!isFinal) return; // Only act on stable, confirmed transcripts

      setLastTranscript(transcript);

      // "Last-device-in-control" convention: suppress for 2 s after manual input
      const msSinceManual = Date.now() - lastManualControlRef.current;
      if (msSinceManual < 2000) return;

      if (charsPerPixel <= 0) return;

      const charOffset = matchTranscriptToScript(scriptText, transcript);
      if (charOffset < 0) return;

      // Rough conversion: character offset → pixel offset
      const pixelOffset = charOffset / charsPerPixel;
      onScrollPositionEstimate(pixelOffset);
    });

    return () => {
      unsub();
      speechService.stop();
    };
  }, [enabled, scriptText, charsPerPixel, onScrollPositionEstimate]);

  // isListening directly mirrors the `enabled` prop: the hook starts/stops the
  // speech service in sync with it, so no separate state is needed.
  return { isListening: enabled, lastTranscript };
}
