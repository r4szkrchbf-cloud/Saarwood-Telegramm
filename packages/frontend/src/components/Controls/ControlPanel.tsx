import { useCallback, useEffect, useState } from 'react';
import { usePrompterStore } from '../../store/prompterStore';
import { speechService } from '../../services/SpeechRecognitionService';
import { wsService } from '../../services/WebSocketService';
import './ControlPanel.css';

type ViewMode = 'editor' | 'prompter' | 'split';

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
interface ControlPanelProps {
  viewMode: ViewMode;
}

export function ControlPanel({ viewMode }: ControlPanelProps) {
  const isPlaying = usePrompterStore((s) => s.scroll.isPlaying);
  const speed = usePrompterStore((s) => s.scroll.speed);
  const direction = usePrompterStore((s) => s.scroll.direction);
  const rotation = usePrompterStore((s) => s.display.rotation);
  const mirrorHorizontal = usePrompterStore((s) => s.display.mirrorHorizontal);
  const mirrorVertical = usePrompterStore((s) => s.display.mirrorVertical);
  const play = usePrompterStore((s) => s.play);
  const pause = usePrompterStore((s) => s.pause);
  const stop = usePrompterStore((s) => s.stop);
  const setSpeed = usePrompterStore((s) => s.setSpeed);
  const setDirection = usePrompterStore((s) => s.setDirection);
  const tier = usePrompterStore((s) => s.tier);
  const speechEnabled = usePrompterStore((s) => s.speechEnabled);
  const setSpeechEnabled = usePrompterStore((s) => s.setSpeechEnabled);
  const setDisplay = usePrompterStore((s) => s.setDisplay);
  const [speedInput, setSpeedInput] = useState(String(Math.round(speed)));
  useEffect(() => {
    setSpeedInput(String(Math.round(speed)));
  }, [speed]);

  const notifyManualControl = useCallback(() => {
    window.dispatchEvent(new Event('prompter:manual-control'));
  }, []);

  const applySpeed = useCallback((nextSpeed: number) => {
    const clamped = Math.max(0, Math.min(400, nextSpeed));
    setSpeed(clamped);
    setSpeedInput(String(Math.round(clamped)));
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
    const currentPosition = usePrompterStore.getState().scroll.position;
    wsService.send('SET_POSITION', { position: currentPosition });
    pause();
    wsService.send('PAUSE');
    notifyManualControl();
  }, [pause, notifyManualControl]);

  const handleStop = useCallback(() => {
    wsService.send('SET_POSITION', { position: 0 });
    stop();
    wsService.send('STOP');
    notifyManualControl();
  }, [stop, notifyManualControl]);

  const handleRestart = useCallback(() => {
    usePrompterStore.getState().setPosition(0);
    wsService.send('SET_POSITION', { position: 0 });
    stop();
    wsService.send('STOP');
    if (typeof window !== 'undefined') {
      window.location.reload();
      return;
    }
    notifyManualControl();
  }, [stop, notifyManualControl]);

  const handleSpeedNudge = useCallback(
    (delta: number) => {
      const currentSpeed = usePrompterStore.getState().scroll.speed;
      applySpeed(currentSpeed + delta);
    },
    [applySpeed],
  );

  const handleSpeedInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setSpeedInput(raw);
  }, []);

  const handleSpeedInputBlur = useCallback(() => {
    if (speedInput.trim() === '') {
      setSpeedInput(String(Math.round(usePrompterStore.getState().scroll.speed)));
      return;
    }
    const parsed = Number(speedInput);
    if (!Number.isFinite(parsed)) {
      setSpeedInput(String(Math.round(usePrompterStore.getState().scroll.speed)));
      return;
    }
    applySpeed(parsed);
  }, [speedInput, applySpeed]);

  const handleDirectionToggle = useCallback(() => {
    const dir = direction === 'down' ? 'up' : 'down';
    setDirection(dir);
    wsService.send('SET_DIRECTION', { direction: dir });
    notifyManualControl();
  }, [direction, setDirection, notifyManualControl]);

  const handleSpeedInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const parsed = Number(speedInput);
    if (!Number.isFinite(parsed)) {
      setSpeedInput(String(Math.round(usePrompterStore.getState().scroll.speed)));
      return;
    }
    applySpeed(parsed);
  }, [speedInput, applySpeed]);

  return (
    <div className="control-panel" role="region" aria-label="Teleprompter controls">

      {/* ─── Transport ────────────────────────────────────────────────── */}
      <div className="transport-buttons">
        <button
          type="button"
          className="btn btn--stop"
          onClick={handleStop}
          aria-label="Text auf Anfang"
          title="Text auf Anfang"
        >
          Text auf Anfang
        </button>

        {viewMode !== 'prompter' && (
          <button
            type="button"
            className="btn btn--restart"
            onClick={handleRestart}
            aria-label="Prompter NeuStart"
            title="Prompter NeuStart"
          >
            Prompter NeuStart
          </button>
        )}

        {viewMode !== 'prompter' && tier === 'expert' && (
          <div className="voice-quick-controls" role="group" aria-label="Voice tracking">
            <button
              type="button"
              className={['btn', 'btn--voice-on', speechEnabled ? 'active' : ''].join(' ')}
              onClick={() => setSpeechEnabled(true)}
              aria-label="Voice tracking an"
              title={speechService.isSupported ? 'Voice tracking an (Hotkey: V)' : 'Web Speech API wird in diesem Browser nicht unterstuetzt'}
              disabled={!speechService.isSupported}
            >
              Voice ON
            </button>
            <button
              type="button"
              className={['btn', 'btn--voice-off', !speechEnabled ? 'active' : ''].join(' ')}
              onClick={() => setSpeechEnabled(false)}
              aria-label="Voice tracking aus"
              title="Voice tracking aus (Hotkey: M)"
            >
              Voice OFF
            </button>
          </div>
        )}

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

        <label className="speed-label" htmlFor="speed-input">
          Speed
          <span className="speed-value">{Math.round(speed)}</span>
          <span className="speed-unit">px/s</span>
        </label>

        <input
          id="speed-input"
          type="number"
          min={0}
          max={400}
          step={1}
          inputMode="numeric"
          value={speedInput}
          onChange={handleSpeedInputChange}
          onBlur={handleSpeedInputBlur}
          onKeyDown={handleSpeedInputKeyDown}
          className="speed-input"
          aria-label="Speed input"
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
