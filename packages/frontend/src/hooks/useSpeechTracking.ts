import { useEffect, useRef, useState } from 'react';
import {
  speechService,
  matchTranscriptToScript,
  type VoiceStatus,
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
  inputDeviceId?: string | null;
  sensitivityPercent?: number;
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
  inputDeviceId = null,
  sensitivityPercent = 55,
}: UseSpeechTrackingOptions): {
  isListening: boolean;
  lastTranscript: string;
  status: VoiceStatus;
  statusDetail: string;
} {
  const [lastTranscript, setLastTranscript] = useState('');
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [statusDetail, setStatusDetail] = useState('');
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
    speechService.setInputDeviceId(inputDeviceId);
    if (!enabled) return;
    if (!speechService.isListening) return;

    speechService.stop();
    speechService.start();
  }, [inputDeviceId, enabled]);

  useEffect(() => {
    const unsubStatus = speechService.onStatus((event) => {
      setStatus(event.status);
      setStatusDetail(event.detail ?? '');
    });

    if (!enabled) {
      speechService.stop();
      return () => {
        unsubStatus();
      };
    }

    speechService.start();

    const unsub = speechService.onTranscript(({ transcript, isFinal, confidence }) => {
      if (!isFinal) return; // Only act on stable, confirmed transcripts

      const minConfidence = 0.05 + (Math.max(0, Math.min(100, sensitivityPercent)) / 100) * 0.6;
      const effectiveConfidence = confidence > 0 ? confidence : 0.5;
      if (effectiveConfidence < minConfidence) return;

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
      unsubStatus();
      speechService.stop();
    };
  }, [enabled, scriptText, charsPerPixel, onScrollPositionEstimate, sensitivityPercent]);

  // isListening directly mirrors the `enabled` prop: the hook starts/stops the
  // speech service in sync with it, so no separate state is needed.
  return { isListening: enabled, lastTranscript, status, statusDetail };
}
