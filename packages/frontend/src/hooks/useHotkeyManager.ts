import { useEffect } from 'react';
import { hotkeyManager } from '../services/HotkeyManager';
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
 *  r / R        → Reset (stop + position = 0)
 *  m / M        → Mirror horizontal toggle
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
  const setDisplay = usePrompterStore((s) => s.setDisplay);

  useEffect(() => {
    // ── Transport ──────────────────────────────────────────────────────────
    hotkeyManager.register(' ', 'Play / Pause', () => {
      const { scroll } = usePrompterStore.getState();
      if (scroll.isPlaying) {
        pause();
      } else {
        play();
      }
    });

    hotkeyManager.register('+', 'Speed +5', () => {
      setSpeed(usePrompterStore.getState().scroll.speed + 5);
    });
    hotkeyManager.register('=', 'Speed +5', () => {
      setSpeed(usePrompterStore.getState().scroll.speed + 5);
    });
    hotkeyManager.register('NumpadAdd', 'Speed +5', () => {
      setSpeed(usePrompterStore.getState().scroll.speed + 5);
    });

    hotkeyManager.register('-', 'Speed −5', () => {
      setSpeed(Math.max(0, usePrompterStore.getState().scroll.speed - 5));
    });
    hotkeyManager.register('_', 'Speed −5', () => {
      setSpeed(Math.max(0, usePrompterStore.getState().scroll.speed - 5));
    });
    hotkeyManager.register('NumpadSubtract', 'Speed −5', () => {
      setSpeed(Math.max(0, usePrompterStore.getState().scroll.speed - 5));
    });

    hotkeyManager.register('r', 'Reset (Stop)', () => stop());
    hotkeyManager.register('R', 'Reset (Stop)', () => stop());

    hotkeyManager.register('Escape', 'Stop', () => stop());

    // ── Mirror ─────────────────────────────────────────────────────────────
    hotkeyManager.register('m', 'Mirror horizontal', () => {
      const { display } = usePrompterStore.getState();
      setDisplay({ mirrorHorizontal: !display.mirrorHorizontal });
    });
    hotkeyManager.register('M', 'Mirror horizontal', () => {
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
  }, [play, pause, stop, setSpeed, setDisplay]);
}
