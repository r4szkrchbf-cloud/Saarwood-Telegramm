import { useRef, useEffect, useMemo, useCallback, useState, CSSProperties } from 'react';
import DOMPurify from 'dompurify';
import { usePrompterStore } from '../../store/prompterStore';
import { useScrollEngine } from '../../hooks/useScrollEngine';
import { useSpeechTracking } from '../../hooks/useSpeechTracking';
import { wsService } from '../../services/WebSocketService';
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
  const showProjectTitle = usePrompterStore((s) => s.display.showProjectTitle);
  const projectTitleFontSize = usePrompterStore((s) => s.display.projectTitleFontSize);
  const projectTitleTextColor = usePrompterStore((s) => s.display.projectTitleTextColor);
  const scriptTitle = usePrompterStore((s) => s.script.title);
  const scriptSegments = usePrompterStore((s) => s.script.segments);
  const tier = usePrompterStore((s) => s.tier);
  const speechEnabled = usePrompterStore((s) => s.speechEnabled);
  const speechInputDeviceId = usePrompterStore((s) => s.speechInputDeviceId);
  const speechSensitivity = usePrompterStore((s) => s.speechSensitivity);
  const wsConnected = usePrompterStore((s) => s.wsConnected);
  const pause = usePrompterStore((s) => s.pause);
  const storeSetPosition = usePrompterStore((s) => s.setPosition);

  const boundaryPauseGuardRef = useRef(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformLayerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const { setPosition } = useScrollEngine({
    speed,
    isPlaying,
    direction,
    containerRef: transformLayerRef,
    contentRef,
    onPositionChange: usePrompterStore.getState().setPosition,
    onBoundaryReached: (_boundary, boundaryPosition) => {
      if (!usePrompterStore.getState().scroll.isPlaying) return;
      if (boundaryPauseGuardRef.current) return;

      boundaryPauseGuardRef.current = true;
      usePrompterStore.getState().setPosition(boundaryPosition);
      pause();
      wsService.send('SET_POSITION', { position: boundaryPosition });
      wsService.send('PAUSE');
    },
  });

  useEffect(() => {
    if (!isPlaying) {
      boundaryPauseGuardRef.current = false;
    }
  }, [isPlaying]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateSize = () => {
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };

    updateSize();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

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

  const applySpeechPosition = useCallback((nextPosition: number) => {
    const bounded = Math.max(0, nextPosition);
    setPosition(bounded);
    storeSetPosition(bounded);
    wsService.send('SET_POSITION', { position: bounded });
  }, [setPosition, storeSetPosition]);

  const {
    status: voiceStatus,
    statusDetail: voiceStatusDetail,
  } = useSpeechTracking({
    enabled: tier === 'expert' && speechEnabled && isPlaying,
    scriptText: plainText,
    charsPerPixel,
    onScrollPositionEstimate: applySpeechPosition,
    inputDeviceId: speechInputDeviceId,
    sensitivityPercent: speechSensitivity,
  });

  const voiceStatusLabel = useMemo(() => {
    if (!speechEnabled) return 'Voice: AUS';
    if (tier !== 'expert') return 'Voice: nur Expert';
    if (!isPlaying) return 'Voice: Gemutet (Pause)';

    switch (voiceStatus) {
      case 'starting':
        return 'Voice: Startet';
      case 'listening':
        return 'Voice: Hoert zu';
      case 'waiting':
        return 'Voice: Wartet';
      case 'no-speech':
        return voiceStatusDetail
          ? `Voice: Keine Sprache (${voiceStatusDetail})`
          : 'Voice: Keine Sprache';
      case 'error':
        return voiceStatusDetail
          ? `Voice: Fehler (${voiceStatusDetail})`
          : 'Voice: Fehler';
      default:
        return 'Voice: Bereit';
    }
  }, [speechEnabled, tier, isPlaying, voiceStatus, voiceStatusDetail]);

  const voiceStatusTitle = voiceStatusDetail
    ? `${voiceStatusLabel} - ${voiceStatusDetail}`
    : voiceStatusLabel;

  // ─── Mirror + Rotation transform ────────────────────────────────────────

  const mirrorTransform = useMemo<string>(() => {
    const sx = mirrorHorizontal ? -1 : 1;
    const sy = mirrorVertical ? -1 : 1;
    const scaleX = sx;
    const scaleY = sy;
    const parts: string[] = [];
    // Rotation first, then scale — order matters for correct GPU compositing.
    if (rotation !== 0) parts.push(`rotate(${rotation}deg)`);
    if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX}, ${scaleY})`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [mirrorHorizontal, mirrorVertical, rotation]);

  const isQuarterTurn = rotation === 90 || rotation === 270;

  const portraitEdgeGap = useMemo(() => {
    if (!isQuarterTurn) return 0;
    const shortestSide = Math.min(viewportSize.width, viewportSize.height);
    return Math.max(12, Math.round(shortestSide * 0.025));
  }, [isQuarterTurn, viewportSize.height, viewportSize.width]);

  const viewportFrameStyle = useMemo<CSSProperties>(() => {
    return { width: '100%', height: '100%' };
  }, []);

  // ─── Viewport styles ──────────────────────────────────────────────────────

  const viewportStyle: CSSProperties = {
    backgroundColor,
    ...viewportFrameStyle,
  };

  const transformLayerStyle: CSSProperties = {
    inset: isQuarterTurn ? 'auto' : 0,
    width: isQuarterTurn
      ? `${Math.max(0, viewportSize.height - portraitEdgeGap * 2)}px`
      : '100%',
    height: isQuarterTurn
      ? `${Math.max(0, viewportSize.width - portraitEdgeGap * 2)}px`
      : '100%',
    left: isQuarterTurn ? '50%' : 0,
    top: isQuarterTurn ? '50%' : 0,
    transform: isQuarterTurn
      ? `translate(-50%, -50%) ${mirrorTransform === 'none' ? '' : mirrorTransform}`.trim()
      : mirrorTransform,
  };

  const initialTopOffset = useMemo(() => {
    if (viewportSize.height <= 0) return 0;

    if (cueMarkerEnabled) {
      const cueY = viewportSize.height * (cueMarkerPosition / 100);
      const threeLines = fontSize * lineHeight * 3;
      return Math.max(0, cueY + threeLines);
    }

    return viewportSize.height * 0.5;
  }, [viewportSize.height, cueMarkerEnabled, cueMarkerPosition, fontSize, lineHeight]);

  const contentInlinePadding = useMemo(() => {
    if (isQuarterTurn) {
      return `${Math.max(18, portraitEdgeGap + 10)}px`;
    }
    return '8%';
  }, [isQuarterTurn, portraitEdgeGap]);

  const projectTitleOverlayStyle = useMemo<CSSProperties>(() => ({
    color: projectTitleTextColor,
    padding: `${Math.max(7, Math.round(projectTitleFontSize * 0.34))}px ${Math.max(14, Math.round(projectTitleFontSize * 0.72))}px`,
    borderColor: 'rgba(255, 255, 255, 0.34)',
  }), [projectTitleFontSize, projectTitleTextColor]);

  const contentStyle: CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color: textColor,
    lineHeight,
    textAlign,
    paddingTop: `${Math.round(initialTopOffset)}px`,
    paddingInline: contentInlinePadding,
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
    <div className="prompter-stage" ref={stageRef}>
      <div
        id="prompter-viewport"
        className="prompter-viewport"
        ref={viewportRef}
        style={viewportStyle}
        aria-label="Teleprompter output"
        aria-live="polite"
      >
        <div className="prompter-transform-layer" ref={transformLayerRef} style={transformLayerStyle}>
          <div
            className={[
              'prompter-link-indicator',
              wsConnected ? 'connected' : 'disconnected',
            ].join(' ')}
            aria-label={`Remote control ${wsConnected ? 'connected' : 'disconnected'}`}
            title={wsConnected ? 'Remote connected' : 'Remote disconnected'}
          />

          {speechEnabled && (
            <div
              className="prompter-voice-indicator"
              aria-label="Voice tracking aktiv"
              title="Voice tracking aktiv"
            >
              🎤
            </div>
          )}

          <div
            className={[
              'prompter-voice-status',
              `status-${speechEnabled ? voiceStatus : 'idle'}`,
            ].join(' ')}
            aria-live="polite"
            title={voiceStatusTitle}
          >
            {voiceStatusLabel}
          </div>

          {tier !== 'basic' && showProjectTitle && scriptTitle.trim() && (
            <div className="prompter-project-title" aria-label="Projekt- oder Sendungsname" style={projectTitleOverlayStyle}>
              <span className="prompter-project-title-label">Projekt / Sendung</span>
              <strong style={{ fontSize: `${projectTitleFontSize}px` }}>{scriptTitle}</strong>
            </div>
          )}

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
      </div>
    </div>
  );
}
