import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrompterStore } from '../../store/prompterStore';
import { wsService } from '../../services/WebSocketService';
import './ControlPanel.css';

const ROTATION_STEPS = [0, 90, 180, 270] as const;
type RotationDeg = (typeof ROTATION_STEPS)[number];

/**
 * ControlPanel
 *
 * Transport controls for the teleprompter: play/pause, stop, speed dial,
 * direction toggle, and mirror toggles.
 *
 * All control actions:
 *  1. Update the local Zustand store immediately (no latency for the operator).
 *  2. Broadcast the action via WebSocket so remote devices (smartphone,
 *     Bluetooth pedal relay) stay in sync.
 *  3. Fire a `prompter:manual-control` DOM event so the voice-tracking engine
 *     honours the "last-device-in-control" convention (Expert tier).
 */
export function ControlPanel() {
  const isPlaying = usePrompterStore((s) => s.scroll.isPlaying);
  const speed = usePrompterStore((s) => s.scroll.speed);
  const direction = usePrompterStore((s) => s.scroll.direction);
  const rotation = usePrompterStore((s) => s.display.rotation);
  const mirrorHorizontal = usePrompterStore((s) => s.display.mirrorHorizontal);
  const mirrorVertical = usePrompterStore((s) => s.display.mirrorVertical);
  const wsConnected = usePrompterStore((s) => s.wsConnected);
  const play = usePrompterStore((s) => s.play);
  const pause = usePrompterStore((s) => s.pause);
  const stop = usePrompterStore((s) => s.stop);
  const setSpeed = usePrompterStore((s) => s.setSpeed);
  const setDirection = usePrompterStore((s) => s.setDirection);
  const setDisplay = usePrompterStore((s) => s.setDisplay);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetConfirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetConfirmTimerRef.current) {
        clearTimeout(resetConfirmTimerRef.current);
        resetConfirmTimerRef.current = null;
      }
    };
  }, []);

  const notifyManualControl = useCallback(() => {
    window.dispatchEvent(new Event('prompter:manual-control'));
  }, []);

  const applySpeed = useCallback((nextSpeed: number) => {
    const clamped = Math.max(0, Math.min(400, nextSpeed));
    setSpeed(clamped);
    wsService.send('SET_SPEED', { speed: clamped });
    notifyManualControl();
  }, [setSpeed, notifyManualControl]);

  const handleRotate = useCallback(
    (delta: -90 | 90) => {
      const current = rotation ?? 0;
      const idx = ROTATION_STEPS.indexOf(current as RotationDeg);
      const next = ROTATION_STEPS[((idx + (delta === 90 ? 1 : 3)) % 4)] as RotationDeg;
      setDisplay({ rotation: next });
      notifyManualControl();
    },
    [rotation, setDisplay, notifyManualControl],
  );

  const handlePlay = useCallback(() => {
    play();
    wsService.send('PLAY');
    notifyManualControl();
  }, [play, notifyManualControl]);

  const handlePause = useCallback(() => {
    pause();
    wsService.send('PAUSE');
    notifyManualControl();
  }, [pause, notifyManualControl]);

  const handleStop = useCallback(() => {
    if (!confirmingReset) {
      // First press always behaves like an immediate stop (no reset), so
      // operators can halt motion instantly. A second press confirms reset.
      if (isPlaying) {
        pause();
        wsService.send('PAUSE');
        notifyManualControl();
      }

      setConfirmingReset(true);
      if (resetConfirmTimerRef.current) clearTimeout(resetConfirmTimerRef.current);
      resetConfirmTimerRef.current = setTimeout(() => {
        setConfirmingReset(false);
        resetConfirmTimerRef.current = null;
      }, 2000);
      return;
    }

    if (resetConfirmTimerRef.current) {
      clearTimeout(resetConfirmTimerRef.current);
      resetConfirmTimerRef.current = null;
    }
    setConfirmingReset(false);
    stop();
    wsService.send('STOP');
    notifyManualControl();
  }, [confirmingReset, isPlaying, pause, stop, notifyManualControl]);

  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      applySpeed(Number(e.target.value));
    },
    [applySpeed],
  );

  const handleSpeedNudge = useCallback(
    (delta: number) => {
      const currentSpeed = usePrompterStore.getState().scroll.speed;
      applySpeed(currentSpeed + delta);
    },
    [applySpeed],
  );

  const handleSpeedSliderKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentSpeed = usePrompterStore.getState().scroll.speed;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applySpeed(currentSpeed - 1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      applySpeed(currentSpeed + 1);
      return;
    }

    // Prevent vertical arrow keys from changing speed to avoid accidental
    // jumps during keyboard-based testing.
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }, [applySpeed]);

  const handleDirectionToggle = useCallback(() => {
    const dir = direction === 'down' ? 'up' : 'down';
    setDirection(dir);
    notifyManualControl();
  }, [direction, setDirection, notifyManualControl]);

  return (
    <div className="control-panel" role="region" aria-label="Teleprompter controls">

      {/* ─── Connection indicator ─────────────────────────────────────── */}
      <div
        className={['ws-indicator', wsConnected ? 'connected' : 'disconnected'].join(' ')}
        title={wsConnected ? 'Remote control connected' : 'Remote control disconnected'}
        aria-label={`Remote control ${wsConnected ? 'connected' : 'disconnected'}`}
      />

      {/* ─── Transport ────────────────────────────────────────────────── */}
      <div className="transport-buttons">
        <button
          type="button"
          className={['btn', 'btn--stop', confirmingReset ? 'active' : ''].join(' ')}
          onClick={handleStop}
          aria-label={confirmingReset ? 'Confirm reset to beginning' : 'Stop and arm reset'}
          title={confirmingReset ? 'Click again to confirm reset' : 'Stop now, click again within 2s to reset'}
        >
          {confirmingReset ? 'Confirm reset' : 'Stop'}
        </button>

        {isPlaying ? (
          <button
            type="button"
            className="btn btn--pause"
            onClick={handlePause}
            aria-label="Pause"
            title="Pause"
          >
            ❙❙
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--play"
            onClick={handlePlay}
            aria-label="Play"
            title="Play"
          >
            ▶
          </button>
        )}

        <button
          type="button"
          className="btn btn--direction"
          onClick={handleDirectionToggle}
          aria-label={`Scroll direction: ${direction}`}
          title="Toggle scroll direction"
        >
          {direction === 'down' ? '↓' : '↑'}
        </button>
      </div>

      {/* ─── Speed dial ───────────────────────────────────────────────── */}
      <div className="speed-control" role="group" aria-label="Scroll speed">
        <button
          type="button"
          className="btn btn--nudge"
          onClick={() => handleSpeedNudge(-5)}
          aria-label="Decrease speed by 5"
        >
          −
        </button>

        <label className="speed-label" htmlFor="speed-slider">
          Speed
          <span className="speed-value">{Math.round(speed)}</span>
          <span className="speed-unit">px/s</span>
        </label>

        <input
          id="speed-slider"
          type="range"
          min={0}
          max={400}
          step={1}
          value={speed}
          onChange={handleSpeedChange}
          onKeyDown={handleSpeedSliderKeyDown}
          className="speed-slider"
          aria-valuenow={speed}
          aria-valuemin={0}
          aria-valuemax={400}
        />

        <button
          type="button"
          className="btn btn--nudge"
          onClick={() => handleSpeedNudge(5)}
          aria-label="Increase speed by 5"
        >
          +
        </button>
      </div>

      {/* ─── Mirror controls ──────────────────────────────────────────── */}
      <div className="mirror-controls" role="group" aria-label="Mirror controls">
        <button
          type="button"
          className={['btn', 'btn--mirror', mirrorHorizontal ? 'active' : ''].join(' ')}
          onClick={() => setDisplay({ mirrorHorizontal: !mirrorHorizontal })}
          aria-pressed={mirrorHorizontal}
          title="Flip horizontal (teleprompter glass)"
        >
          ↔ H-Mirror
        </button>
        <button
          type="button"
          className={['btn', 'btn--mirror', mirrorVertical ? 'active' : ''].join(' ')}
          onClick={() => setDisplay({ mirrorVertical: !mirrorVertical })}
          aria-pressed={mirrorVertical}
          title="Flip vertical"
        >
          ↕ V-Mirror
        </button>
      </div>

      {/* ─── Rotation controls ────────────────────────────────────────── */}
      <div className="rotation-controls" role="group" aria-label="Rotation controls">
        <button
          type="button"
          className="btn btn--rotate"
          onClick={() => handleRotate(-90)}
          title="Rotate −90° (hotkey: [)"
          aria-label="Rotate counter-clockwise 90°"
        >
          ↺ −90°
        </button>
        <span className="rotation-value" aria-label={`Current rotation: ${rotation ?? 0}°`}>
          {rotation ?? 0}°
        </span>
        <button
          type="button"
          className="btn btn--rotate"
          onClick={() => handleRotate(90)}
          title="Rotate +90° (hotkey: ])"
          aria-label="Rotate clockwise 90°"
        >
          ↻ +90°
        </button>
      </div>
    </div>
  );
}
