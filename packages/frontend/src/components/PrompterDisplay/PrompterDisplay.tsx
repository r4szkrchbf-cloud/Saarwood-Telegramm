import { useRef, useEffect, useMemo, CSSProperties } from 'react';
import DOMPurify from 'dompurify';
import { usePrompterStore } from '../../store/prompterStore';
import { useScrollEngine } from '../../hooks/useScrollEngine';
import { useSpeechTracking } from '../../hooks/useSpeechTracking';
import './PrompterDisplay.css';

const DEFAULT_CHARS_PER_PIXEL = 0.1;

/**
 * PrompterDisplay
 *
 * The full-screen teleprompter output view.
 *
 * Rendering strategy (broadcast-quality, judder-free):
 *  - The outer #prompter-viewport clips the view.
 *  - #prompter-content holds all text and is translated via
 *    CSS `transform: translateY()` — never via scrollTop — to keep
 *    updates on the GPU compositor thread.
 *  - `will-change: transform` forces a dedicated compositing layer.
 *  - The cue marker is a fixed overlay line at the configurable
 *    viewport-height percentage (default 30 % from top).
 *  - Mirroring is applied as CSS transforms on the viewport so no
 *    pixel-manipulation is required.
 */
export function PrompterDisplay() {
  const speed = usePrompterStore((s) => s.scroll.speed);
  const isPlaying = usePrompterStore((s) => s.scroll.isPlaying);
  const direction = usePrompterStore((s) => s.scroll.direction);
  const position = usePrompterStore((s) => s.scroll.position);
  const fontSize = usePrompterStore((s) => s.display.fontSize);
  const fontFamily = usePrompterStore((s) => s.display.fontFamily);
  const textColor = usePrompterStore((s) => s.display.textColor);
  const backgroundColor = usePrompterStore((s) => s.display.backgroundColor);
  const lineHeight = usePrompterStore((s) => s.display.lineHeight);
  const textAlign = usePrompterStore((s) => s.display.textAlign);
  const mirrorHorizontal = usePrompterStore((s) => s.display.mirrorHorizontal);
  const mirrorVertical = usePrompterStore((s) => s.display.mirrorVertical);
  const rotation = usePrompterStore((s) => s.display.rotation);
  const cueMarkerEnabled = usePrompterStore((s) => s.display.cueMarkerEnabled);
  const cueMarkerPosition = usePrompterStore((s) => s.display.cueMarkerPosition);
  const scriptSegments = usePrompterStore((s) => s.script.segments);
  const speechEnabled = usePrompterStore((s) => s.speechEnabled);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { setPosition } = useScrollEngine({
    speed,
    isPlaying,
    direction,
    containerRef,
    contentRef,
    onPositionChange: usePrompterStore.getState().setPosition,
  });

  // Sync store position changes (from remote control / WS) to DOM
  useEffect(() => {
    if (!isPlaying) {
      setPosition(position);
    }
  }, [position, isPlaying, setPosition]);

  // ─── Voice tracking ──────────────────────────────────────────────────────

  const plainText = useMemo(() => {
    const el = document.createElement('div');
    return scriptSegments
      .filter((s) => !s.isCloaked)
      .filter((s) => !s.isDirectorsNote)
      .map((s) => {
        el.innerHTML = DOMPurify.sanitize(s.html);
        return el.textContent ?? '';
      })
      .join(' ');
  }, [scriptSegments]);

  const charsPerPixel = useMemo(() => {
    const sample = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return DEFAULT_CHARS_PER_PIXEL;
    ctx.font = `${fontSize}px ${fontFamily}`;
    const width = ctx.measureText(sample).width;
    if (width <= 0) return DEFAULT_CHARS_PER_PIXEL;
    return sample.length / width;
  }, [fontFamily, fontSize]);

  useSpeechTracking({
    enabled: speechEnabled,
    scriptText: plainText,
    charsPerPixel,
    onScrollPositionEstimate: setPosition,
  });

  // ─── Mirror + Rotation transform ────────────────────────────────────────

  const mirrorTransform = useMemo<string>(() => {
    const sx = mirrorHorizontal ? -1 : 1;
    const sy = mirrorVertical ? -1 : 1;
    const parts: string[] = [];
    // Rotation first, then scale — order matters for correct GPU compositing
    if (rotation !== 0) parts.push(`rotate(${rotation}deg)`);
    if (sx !== 1 || sy !== 1) parts.push(`scale(${sx}, ${sy})`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [mirrorHorizontal, mirrorVertical, rotation]);

  // ─── Viewport styles ──────────────────────────────────────────────────────

  const viewportStyle: CSSProperties = {
    backgroundColor,
    transform: mirrorTransform,
  };

  const contentStyle: CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color: textColor,
    lineHeight,
    textAlign,
    willChange: 'transform',
  };

  // ─── Cue marker position ──────────────────────────────────────────────────

  const cueMarkerStyle: CSSProperties = cueMarkerEnabled
    ? {
        top: `${cueMarkerPosition}%`,
        display: 'block',
      }
    : { display: 'none' };

  return (
    <div
      id="prompter-viewport"
      className="prompter-viewport"
      ref={containerRef}
      style={viewportStyle}
      aria-label="Teleprompter output"
      aria-live="polite"
    >
      {/* Cue marker overlay */}
      <div
        className="cue-marker"
        style={cueMarkerStyle}
        aria-hidden="true"
      />

      {/* Scrollable content — translated via CSS transform */}
      <div
        id="prompter-content"
        className="prompter-content"
        ref={contentRef}
        style={contentStyle}
      >
        {scriptSegments.map((segment, idx) => {
          if (segment.isCloaked) return null;

          return (
            <div
              key={`${segment.id}-${idx}`}
              className="prompter-segment"
              dir={segment.direction}
              data-segment-id={segment.id}
              data-directors-note={segment.isDirectorsNote || undefined}
            >
              {/* Render HTML from Tiptap editor — sanitized via DOMPurify */}
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(segment.html) }}
              />
            </div>
          );
        })}

        {/* Bottom padding so last line can reach the cue marker */}
        <div className="prompter-end-pad" aria-hidden="true" />
      </div>

      {/* Speed / position overlay (shown when paused) */}
      {!isPlaying && (
        <div className="prompter-status-overlay" aria-live="polite">
          {position === 0
            ? 'READY'
            : `PAUSED — ${Math.round(speed)} px/s`}
        </div>
      )}
    </div>
  );
}
