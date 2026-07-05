import { useState, useEffect, useMemo, useRef } from 'react';
import { PrompterDisplay } from './components/PrompterDisplay/PrompterDisplay';
import { ControlPanel } from './components/Controls/ControlPanel';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { ScriptEditor } from './components/Editor/ScriptEditor';
import { usePrompterStore } from './store/prompterStore';
import { useHotkeyManager } from './hooks/useHotkeyManager';
import { wsService } from './services/WebSocketService';
import type { DisplaySettings, MosRunningOrder, ScrollState, Script, ScriptSegment } from './types';
import './App.css';

type ViewMode = 'editor' | 'prompter' | 'split';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function mapMosRunningOrderToSegments(runningOrder: MosRunningOrder): ScriptSegment[] {
  const segments: ScriptSegment[] = [];

  runningOrder.stories.forEach((story, storyIndex) => {
    if (story.items.length === 0) {
      const storyText = story.storySlug || `Story ${storyIndex + 1}`;
      segments.push({
        id: `mos-story-${story.storyId || storyIndex}`,
        html: `<p>${escapeHtml(storyText)}</p>`,
        direction: 'ltr',
        isCloaked: false,
        isDirectorsNote: false,
      });
      return;
    }

    story.items.forEach((item, itemIndex) => {
      const itemText = item.slug || item.objId || story.storySlug || `Item ${itemIndex + 1}`;
      const segmentId = `mos-${story.storyId || storyIndex}-${item.itemId || itemIndex}`;
      segments.push({
        id: segmentId,
        html: `<p>${escapeHtml(itemText)}</p>`,
        direction: 'ltr',
        isCloaked: false,
        isDirectorsNote: false,
        mosItemId: item.itemId || undefined,
      });
    });
  });

  return segments;
}

function mergeMosRunningOrderIntoScript(
  currentScript: Script,
  runningOrder: MosRunningOrder,
): Script {
  const mappedSegments = mapMosRunningOrderToSegments(runningOrder);
  if (mappedSegments.length === 0) return currentScript;

  return {
    ...currentScript,
    id: runningOrder.roId ? `mos-${runningOrder.roId}` : currentScript.id,
    title: runningOrder.roSlug || currentScript.title,
    segments: mappedSegments,
    lastModified: Date.now(),
  };
}

function ensureUniqueSegmentIds(input: Script): Script {
  const seen = new Set<string>();
  let changed = false;

  const segments = input.segments.map((seg) => {
    let id = seg.id;
    if (seen.has(id)) {
      changed = true;
      let i = 2;
      while (seen.has(`${id}-${i}`)) i += 1;
      id = `${id}-${i}`;
    }
    seen.add(id);
    return id === seg.id ? seg : { ...seg, id };
  });

  if (!changed) return input;
  return {
    ...input,
    segments,
    lastModified: Date.now(),
  };
}

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showSettings, setShowSettings] = useState(false);

  const mirrorHorizontal = usePrompterStore((s) => s.display.mirrorHorizontal);
  const mirrorVertical = usePrompterStore((s) => s.display.mirrorVertical);
  const rotation = usePrompterStore((s) => s.display.rotation);
  const fontSize = usePrompterStore((s) => s.display.fontSize);
  const fontFamily = usePrompterStore((s) => s.display.fontFamily);
  const textColor = usePrompterStore((s) => s.display.textColor);
  const backgroundColor = usePrompterStore((s) => s.display.backgroundColor);
  const lineHeight = usePrompterStore((s) => s.display.lineHeight);
  const textAlign = usePrompterStore((s) => s.display.textAlign);
  const darkMode = usePrompterStore((s) => s.display.darkMode);
  const cueMarkerEnabled = usePrompterStore((s) => s.display.cueMarkerEnabled);
  const cueMarkerPosition = usePrompterStore((s) => s.display.cueMarkerPosition);
  const display = useMemo<DisplaySettings>(() => ({
    mirrorHorizontal,
    mirrorVertical,
    rotation,
    fontSize,
    fontFamily,
    textColor,
    backgroundColor,
    lineHeight,
    textAlign,
    darkMode,
    cueMarkerEnabled,
    cueMarkerPosition,
  }), [
    mirrorHorizontal,
    mirrorVertical,
    rotation,
    fontSize,
    fontFamily,
    textColor,
    backgroundColor,
    lineHeight,
    textAlign,
    darkMode,
    cueMarkerEnabled,
    cueMarkerPosition,
  ]);

  const scriptId = usePrompterStore((s) => s.script.id);
  const scriptTitle = usePrompterStore((s) => s.script.title);
  const scriptSegments = usePrompterStore((s) => s.script.segments);
  const scriptLastModified = usePrompterStore((s) => s.script.lastModified);
  const script = useMemo<Script>(() => ({
    id: scriptId,
    title: scriptTitle,
    segments: scriptSegments,
    lastModified: scriptLastModified,
  }), [scriptId, scriptTitle, scriptSegments, scriptLastModified]);
  const hydrated = usePrompterStore((s) => s.hydrated);
  const setWsConnected = usePrompterStore((s) => s.setWsConnected);
  const play = usePrompterStore((s) => s.play);
  const pause = usePrompterStore((s) => s.pause);
  const stop = usePrompterStore((s) => s.stop);
  const setSpeed = usePrompterStore((s) => s.setSpeed);
  const setPosition = usePrompterStore((s) => s.setPosition);
  const setScript = usePrompterStore((s) => s.setScript);
  const setDisplay = usePrompterStore((s) => s.setDisplay);
  const setScriptTitle = usePrompterStore((s) => s.setScriptTitle);
  const addSegment = usePrompterStore((s) => s.addSegment);
  const removeSegment = usePrompterStore((s) => s.removeSegment);
  const reorderSegment = usePrompterStore((s) => s.reorderSegment);

  // ─── Hotkey manager ────────────────────────────────────────────────────
  useHotkeyManager();

  // ─── WS sync loop-prevention refs ─────────────────────────────────────
  // Tracks the lastModified of the most-recently applied remote script, so we
  // don't echo the update back to the sender.
  const lastSyncedScriptModified = useRef(script.lastModified);
  // Tracks the JSON of the most-recently applied remote display settings.
  const lastSyncedDisplayJson = useRef(JSON.stringify(display));
  // React StrictMode mounts effects twice in dev; guard demo seeding.
  const demoSeededRef = useRef(false);

  // ─── WebSocket lifecycle ───────────────────────────────────────────────

  useEffect(() => {
    wsService.connect();

    const unsubPlay = wsService.on('PLAY', () => play());
    const unsubPause = wsService.on('PAUSE', () => pause());
    const unsubStop = wsService.on('STOP', () => stop());
    const unsubSpeed = wsService.on('SET_SPEED', (msg) => {
      const p = msg.payload as { speed?: number } | undefined;
      if (typeof p?.speed === 'number') setSpeed(p.speed);
    });
    const unsubPosition = wsService.on(
      'SET_POSITION',
      (msg) => {
        const p = msg.payload as { position?: number } | undefined;
        if (typeof p?.position === 'number') setPosition(p.position);
      },
    );
    const unsubSync = wsService.on(
      'SYNC_STATE',
      (msg) => {
        const p = msg.payload as Partial<ScrollState> | undefined;
        if (typeof p?.speed === 'number') setSpeed(p.speed);
        if (typeof p?.position === 'number') setPosition(p.position);
      },
    );
    const unsubMos = wsService.on('MOS_UPDATE', (msg) => {
      const payload = msg.payload as
        | { runningOrder?: MosRunningOrder }
        | undefined;
      if (!payload?.runningOrder) return;

      const nextScript = mergeMosRunningOrderIntoScript(
        usePrompterStore.getState().script,
        payload.runningOrder,
      );
      setScript(nextScript);
    });

    const unsubScriptUpdate = wsService.on('SCRIPT_UPDATE', (msg) => {
      const payload = msg.payload as { script?: Script } | undefined;
      if (!payload?.script) return;
      // Record the remote lastModified to prevent echo-back
      lastSyncedScriptModified.current = payload.script.lastModified;
      setScript(payload.script);
    });

    const unsubSettingsUpdate = wsService.on('SETTINGS_UPDATE', (msg) => {
      const payload = msg.payload as { display?: DisplaySettings } | undefined;
      if (!payload?.display) return;
      // Record the remote display JSON to prevent echo-back
      lastSyncedDisplayJson.current = JSON.stringify(payload.display);
      setDisplay(payload.display);
    });

    // Poll connection state
    const pollTimer = setInterval(() => {
      setWsConnected(wsService.connected);
    }, 1000);

    return () => {
      unsubPlay();
      unsubPause();
      unsubStop();
      unsubSpeed();
      unsubPosition();
      unsubSync();
      unsubMos();
      unsubScriptUpdate();
      unsubSettingsUpdate();
      clearInterval(pollTimer);
      wsService.disconnect();
    };
  }, [play, pause, stop, setSpeed, setPosition, setScript, setDisplay, setWsConnected]);

  // ─── Broadcast script changes to other WS clients (debounced 500 ms) ──────

  useEffect(() => {
    // Skip if this exact lastModified was applied from a remote update
    if (script.lastModified === lastSyncedScriptModified.current) return;
    const timer = setTimeout(() => {
      wsService.send('SCRIPT_UPDATE', { script });
      lastSyncedScriptModified.current = script.lastModified;
    }, 500);
    return () => clearTimeout(timer);
  }, [script]);

  // ─── Broadcast display-settings changes to other WS clients (debounced) ──

  useEffect(() => {
    const json = JSON.stringify(display);
    if (json === lastSyncedDisplayJson.current) return;
    const timer = setTimeout(() => {
      wsService.send('SETTINGS_UPDATE', { display });
      lastSyncedDisplayJson.current = json;
    }, 500);
    return () => clearTimeout(timer);
  }, [display]);

  // ─── Demo script initialisation ───────────────────────────────────────

  useEffect(() => {
    const normalized = ensureUniqueSegmentIds(script);
    if (normalized !== script) {
      setScript(normalized);
    }
  }, [script, setScript]);

  useEffect(() => {
    if (!hydrated || demoSeededRef.current) return;

    const current = usePrompterStore.getState().script;
    if (current.segments.length === 0) {
      setScript({
        ...current,
        lastModified: Date.now(),
        segments: [
          {
            id: 'seg-1',
            html: '<p>Welcome to <strong>Saarwood Teleprompter</strong> — professional broadcast quality, built for the modern newsroom.</p>',
            direction: 'ltr',
            isCloaked: false,
            isDirectorsNote: false,
          },
          {
            id: 'seg-2',
            html: '<p>Edit this text in the script editor on the left. Your changes appear in the teleprompter view in real time.</p>',
            direction: 'ltr',
            isCloaked: false,
            isDirectorsNote: false,
          },
        ],
      });
    }

    demoSeededRef.current = true;
  }, [hydrated, setScript]);
  // ─── Layout ────────────────────────────────────────────────────────────

  const rootClass = [
    'app',
    display.darkMode ? 'dark-mode' : 'light-mode',
    `view-${viewMode}`,
  ].join(' ');

  return (
    <div className={rootClass}>
      {/* ─── Top bar ────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-logo" aria-label="Saarwood Teleprompter Beta V1">
          <span className="logo-icon" aria-hidden="true">📺</span>
          <span className="logo-text">Saarwood Teleprompter</span>
          <span className="beta-badge" aria-label="Beta Version 1">BETA V1</span>
        </div>

        {/* View mode switcher */}
        <nav className="view-switcher" role="navigation" aria-label="View mode">
          {(['editor', 'split', 'prompter'] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={['view-btn', viewMode === m ? 'active' : ''].join(' ')}
              onClick={() => setViewMode(m)}
              aria-pressed={viewMode === m}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Toggle settings panel"
          aria-expanded={showSettings}
        >
          ⚙
        </button>
      </header>

      {/* ─── Control bar ─────────────────────────────────────────────── */}
      <ControlPanel />

      {/* ─── Main workspace ──────────────────────────────────────────── */}
      <main className="app-workspace">
        {/* Editor pane */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <section className="editor-pane" aria-label="Script editor">
            {/* Script title */}
            <div className="editor-title-bar">
              <input
                type="text"
                className="script-title-input"
                value={script.title}
                onChange={(e) => setScriptTitle(e.target.value)}
                aria-label="Script title"
                placeholder="Untitled Script"
              />
            </div>
            <div className="editor-scroll">
              {script.segments.map((seg, idx) => (
                <ScriptEditor
                  key={`${seg.id}-${idx}`}
                  segment={seg}
                  isFirst={idx === 0}
                  isLast={idx === script.segments.length - 1}
                  onDelete={() => removeSegment(seg.id)}
                  onMoveUp={() => reorderSegment(seg.id, 'up')}
                  onMoveDown={() => reorderSegment(seg.id, 'down')}
                />
              ))}
              <button
                type="button"
                className="add-segment-btn"
                onClick={() =>
                  addSegment({
                    id: `seg-${Date.now()}`,
                    html: '<p></p>',
                    direction: 'ltr',
                    isCloaked: false,
                    isDirectorsNote: false,
                  })
                }
              >
                + Add segment
              </button>
            </div>
          </section>
        )}

        {/* Prompter output pane */}
        {(viewMode === 'prompter' || viewMode === 'split') && (
          <section className="prompter-pane" aria-label="Teleprompter output">
            <PrompterDisplay />
          </section>
        )}
      </main>

      {/* ─── Settings drawer ─────────────────────────────────────────── */}
      {showSettings && (
        <aside className="settings-drawer" aria-label="Settings">
          <SettingsPanel />
        </aside>
      )}
    </div>
  );
}
