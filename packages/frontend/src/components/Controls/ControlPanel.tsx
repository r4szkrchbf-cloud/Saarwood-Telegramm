import { useCallback } from 'react';
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

  const notifyManualControl = useCallback(() => {
    window.dispatchEvent(new Event('prompter:manual-control'));
  }, []);

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
    stop();
    wsService.send('STOP');
    notifyManualControl();
  }, [stop, notifyManualControl]);

  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const spd = Number(e.target.value);
      setSpeed(spd);
      wsService.send('SET_SPEED', { speed: spd });
      notifyManualControl();
    },
    [setSpeed, notifyManualControl],
  );

  const handleSpeedNudge = useCallback(
    (delta: number) => {
      const newSpeed = speed + delta;
      setSpeed(newSpeed);
      wsService.send('SET_SPEED', { speed: newSpeed });
      notifyManualControl();
    },
    [speed, setSpeed, notifyManualControl],
  );

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
          className="btn btn--stop"
          onClick={handleStop}
          aria-label="Stop and reset"
          title="Stop (reset to beginning)"
        >
          ■
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
        <span className="rotation-value" aria-label={`Current rotation: ${display.rotation ?? 0}°`}>
          {display.rotation ?? 0}°
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
