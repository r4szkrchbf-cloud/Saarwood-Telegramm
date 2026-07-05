import { useEffect } from 'react';
import { hotkeyManager } from '../services/HotkeyManager';
import { wsService } from '../services/WebSocketService';
import { usePrompterStore } from '../store/prompterStore';

const ROTATION_STEPS = [0, 90, 180, 270] as const;
type RotationDeg = (typeof ROTATION_STEPS)[number];

/**
 * useHotkeyManager
 *
 * Registers all default teleprompter hotkey bindings and enables the
 * HotkeyManager singleton for the lifetime of the component.
 *
 * Must be called once near the top of the component tree (e.g. in App).
 *
 * Default bindings:
 *  Space        → Play / Pause toggle
 *  +            → Speed +5 px/s
 *  -            → Speed −5 px/s
 *  v / V        → Voice tracking ON
 *  m / M        → Voice tracking OFF
 *  r / R        → Reset (stop + position = 0)
 *  h / H        → Mirror horizontal toggle
 *  f / F        → Fullscreen toggle
 *  Escape       → Stop
 *  [            → Rotate −90°
 *  ]            → Rotate +90°
 */
export function useHotkeyManager(): void {
  const play = usePrompterStore((s) => s.play);
  const pause = usePrompterStore((s) => s.pause);
  const stop = usePrompterStore((s) => s.stop);
  const setSpeed = usePrompterStore((s) => s.setSpeed);
  const setDirection = usePrompterStore((s) => s.setDirection);
  const setSpeechEnabled = usePrompterStore((s) => s.setSpeechEnabled);
  const setDisplay = usePrompterStore((s) => s.setDisplay);

  useEffect(() => {
    // ── Transport ──────────────────────────────────────────────────────────
    hotkeyManager.register(' ', 'Play / Pause', () => {
      const { scroll } = usePrompterStore.getState();
      if (scroll.isPlaying) {
        wsService.send('SET_POSITION', { position: scroll.position });
        pause();
        wsService.send('PAUSE');
      } else {
        play();
        wsService.send('PLAY');
      }
    });

    hotkeyManager.register('+', 'Speed +5', () => {
      const nextSpeed = Math.min(400, usePrompterStore.getState().scroll.speed + 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });
    hotkeyManager.register('=', 'Speed +5', () => {
      const nextSpeed = Math.min(400, usePrompterStore.getState().scroll.speed + 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });
    hotkeyManager.register('NumpadAdd', 'Speed +5', () => {
      const nextSpeed = Math.min(400, usePrompterStore.getState().scroll.speed + 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });

    hotkeyManager.register('-', 'Speed −5', () => {
      const nextSpeed = Math.max(0, usePrompterStore.getState().scroll.speed - 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });
    hotkeyManager.register('_', 'Speed −5', () => {
      const nextSpeed = Math.max(0, usePrompterStore.getState().scroll.speed - 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });
    hotkeyManager.register('NumpadSubtract', 'Speed −5', () => {
      const nextSpeed = Math.max(0, usePrompterStore.getState().scroll.speed - 5);
      setSpeed(nextSpeed);
      wsService.send('SET_SPEED', { speed: nextSpeed });
    });

    hotkeyManager.register('ArrowUp', 'Set direction up', () => {
      setDirection('up');
      wsService.send('SET_DIRECTION', { direction: 'up' });
    });
    hotkeyManager.register('ArrowDown', 'Set direction down', () => {
      setDirection('down');
      wsService.send('SET_DIRECTION', { direction: 'down' });
    });

    hotkeyManager.register('v', 'Voice tracking ON', () => {
      setSpeechEnabled(true);
    });
    hotkeyManager.register('V', 'Voice tracking ON', () => {
      setSpeechEnabled(true);
    });
    hotkeyManager.register('m', 'Voice tracking OFF', () => {
      setSpeechEnabled(false);
    });
    hotkeyManager.register('M', 'Voice tracking OFF', () => {
      setSpeechEnabled(false);
    });

    hotkeyManager.register('r', 'Reset (Stop)', () => {
      stop();
      wsService.send('STOP');
    });
    hotkeyManager.register('R', 'Reset (Stop)', () => {
      stop();
      wsService.send('STOP');
    });

    hotkeyManager.register('Escape', 'Stop', () => {
      stop();
      wsService.send('STOP');
    });

    // ── Mirror ─────────────────────────────────────────────────────────────
    hotkeyManager.register('h', 'Mirror horizontal', () => {
      const { display } = usePrompterStore.getState();
      setDisplay({ mirrorHorizontal: !display.mirrorHorizontal });
    });
    hotkeyManager.register('H', 'Mirror horizontal', () => {
      const { display } = usePrompterStore.getState();
      setDisplay({ mirrorHorizontal: !display.mirrorHorizontal });
    });

    // ── Rotation ───────────────────────────────────────────────────────────
    const rotate = (delta: -1 | 1): void => {
      const { display } = usePrompterStore.getState();
      const current = (display.rotation ?? 0) as RotationDeg;
      const idx = ROTATION_STEPS.indexOf(current);
      const next = ROTATION_STEPS[((idx + delta + 4) % 4)] as RotationDeg;
      setDisplay({ rotation: next });
    };

    hotkeyManager.register('[', 'Rotate −90°', () => rotate(-1));
    hotkeyManager.register(']', 'Rotate +90°', () => rotate(1));

    // ── Fullscreen ─────────────────────────────────────────────────────────
    hotkeyManager.register('f', 'Fullscreen toggle', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => undefined);
      } else {
        document.exitFullscreen().catch(() => undefined);
      }
    });
    hotkeyManager.register('F', 'Fullscreen toggle', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => undefined);
      } else {
        document.exitFullscreen().catch(() => undefined);
      }
    });

    hotkeyManager.enable();

    return () => {
      hotkeyManager.disable();
    };
  }, [play, pause, stop, setSpeed, setDirection, setSpeechEnabled, setDisplay]);
}
