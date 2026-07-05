/**
 * HotkeyManager
 *
 * Singleton service for keyboard shortcuts in the teleprompter UI.
 *
 * Design principles:
 *  - Context-aware: shortcuts are suppressed when a text-input element
 *    (input, textarea, or contentEditable) has focus, so they never
 *    interfere with the Tiptap script editor.
 *  - Last-device-in-control: every action fires the `prompter:manual-control`
 *    DOM event, which the voice-tracking engine listens to (SRS-REQ-5.4).
 *  - Extensible: bindings are registered at runtime, so future features
 *    (Bluetooth pedal relay, WebHID controllers) can reuse the same service.
 *  - Enabled/disabled flag lets external code suppress hotkeys during e.g.
 *    modal dialogs.
 */

export type HotkeyAction = () => void;

interface HotkeyBinding {
  key: string;
  /** Human-readable description shown in Settings (future). */
  description: string;
  action: HotkeyAction;
}

class HotkeyManager {
  private bindings = new Map<string, HotkeyBinding>();
  private active = false;

  /**
   * Attach the global keydown listener. Call once during app bootstrap.
   */
  enable(): void {
    if (this.active) return;
    this.active = true;
    window.addEventListener('keydown', this._onKeyDown, { capture: true });
  }

  /**
   * Remove the global keydown listener.
   */
  disable(): void {
    this.active = false;
    window.removeEventListener('keydown', this._onKeyDown, { capture: true });
  }

  /**
   * Register a hotkey binding. A second call with the same key overwrites.
   */
  register(key: string, description: string, action: HotkeyAction): void {
    this.bindings.set(key, { key, description, action });
  }

  /**
   * Remove a previously registered binding.
   */
  unregister(key: string): void {
    this.bindings.delete(key);
  }

  /**
   * Return all registered bindings (e.g. for a Settings UI).
   */
  getBindings(): ReadonlyMap<string, HotkeyBinding> {
    return this.bindings;
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private _onKeyDown = (e: KeyboardEvent): void => {
    // Skip when focus is inside a text-entry element
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    ) {
      return;
    }

    const binding = this.bindings.get(e.key);
    if (!binding) return;

    e.preventDefault();
    e.stopPropagation();
    binding.action();

    // Notify voice-tracking / last-device-in-control convention
    window.dispatchEvent(new Event('prompter:manual-control'));
  };
}

/** Application-wide singleton. */
export const hotkeyManager = new HotkeyManager();
