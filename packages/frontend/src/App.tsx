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

const GERMAN_TEST_SEGMENTS: ScriptSegment[] = [
  {
    id: 'seg-1',
    html: '<p>Guten Abend und herzlich willkommen zu unserer Sendung. In den naechsten Minuten fassen wir die wichtigsten Meldungen des Tages kompakt und verstaendlich zusammen.</p>',
    direction: 'ltr',
    isCloaked: false,
    isDirectorsNote: false,
  },
  {
    id: 'seg-2',
    html: '<p>Im ersten Themenblock geht es um die Verkehrslage im Saarland. Der Berufsverkehr bleibt auf den Hauptachsen dicht, auf der A sechs kommt es weiterhin zu zoegerlichem Vorankommen.</p>',
    direction: 'ltr',
    isCloaked: false,
    isDirectorsNote: false,
  },
  {
    id: 'seg-3',
    html: '<p>Danach schauen wir auf das Wetter: In der Nacht bleibt es weitgehend trocken, lokal kann sich Nebel bilden. Morgen starten wir freundlich, spaeter ziehen Wolken auf.</p>',
    direction: 'ltr',
    isCloaked: false,
    isDirectorsNote: false,
  },
  {
    id: 'seg-4',
    html: '<p>Zum Abschluss noch der Sport: Die Saarwood Falcons gewinnen ihr Heimspiel mit zwei zu eins. Das Team zeigt eine stabile Defensive und bleibt damit auf Playoff-Kurs.</p>',
    direction: 'ltr',
    isCloaked: false,
    isDirectorsNote: false,
  },
];

function isLegacyEnglishDemoScript(script: Script): boolean {
  if (script.segments.length !== 2) return false;
  const first = script.segments[0]?.html ?? '';
  const second = script.segments[1]?.html ?? '';
  return first.includes('Welcome to <strong>Saarwood Teleprompter</strong>')
    && second.includes('Edit this text in the script editor on the left');
}

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
  const scrollPosition = usePrompterStore((s) => s.scroll.position);
  const isPlaying = usePrompterStore((s) => s.scroll.isPlaying);
  const script = useMemo<Script>(() => ({
    id: scriptId,
    title: scriptTitle,
    segments: scriptSegments,
    lastModified: scriptLastModified,
  }), [scriptId, scriptTitle, scriptSegments, scriptLastModified]);
  const hydrated = usePrompterStore((s) => s.hydrated);
  const setScript = usePrompterStore((s) => s.setScript);
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
  // Tracks last position pushed to backend to avoid flooding SET_POSITION.
  const lastSyncedPosition = useRef(scrollPosition);
  const positionSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // React StrictMode mounts effects twice in dev; guard demo seeding.
  const demoSeededRef = useRef(false);

  // ─── WebSocket lifecycle ───────────────────────────────────────────────

  useEffect(() => {
    wsService.connect();

    const unsubPlay = wsService.on('PLAY', () => usePrompterStore.getState().play());
    const unsubPause = wsService.on('PAUSE', () => usePrompterStore.getState().pause());
    const unsubStop = wsService.on('STOP', () => usePrompterStore.getState().stop());
    const unsubSpeed = wsService.on('SET_SPEED', (msg) => {
      const p = msg.payload as { speed?: number } | undefined;
      if (typeof p?.speed === 'number') usePrompterStore.getState().setSpeed(p.speed);
    });
    const unsubPosition = wsService.on(
      'SET_POSITION',
      (msg) => {
        const p = msg.payload as { position?: number } | undefined;
        if (typeof p?.position === 'number') usePrompterStore.getState().setPosition(p.position);
      },
    );
    const unsubDirection = wsService.on(
      'SET_DIRECTION',
      (msg) => {
        const p = msg.payload as { direction?: 'down' | 'up' } | undefined;
        if (p?.direction === 'down' || p?.direction === 'up') {
          usePrompterStore.getState().setDirection(p.direction);
        }
      },
    );
    const unsubSync = wsService.on(
      'SYNC_STATE',
      (msg) => {
        const p = msg.payload as Partial<ScrollState> | undefined;
        if (typeof p?.speed === 'number') usePrompterStore.getState().setSpeed(p.speed);
        if (typeof p?.position === 'number') {
          const state = usePrompterStore.getState().scroll;
          // Position is now synchronized via SET_POSITION events. Avoid
          // heartbeat SYNC_STATE clobbering a valid local paused position.
          if (!state.isPlaying && state.position === 0) {
            usePrompterStore.getState().setPosition(p.position);
          }
        }
        if (p?.direction === 'down' || p?.direction === 'up') {
          usePrompterStore.getState().setDirection(p.direction);
        }
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
      usePrompterStore.getState().setScript(nextScript);
    });

    const unsubScriptUpdate = wsService.on('SCRIPT_UPDATE', (msg) => {
      const payload = msg.payload as { script?: Script } | undefined;
      if (!payload?.script) return;
      // Record the remote lastModified to prevent echo-back
      lastSyncedScriptModified.current = payload.script.lastModified;
      usePrompterStore.getState().setScript(payload.script);
    });

    const unsubSettingsUpdate = wsService.on('SETTINGS_UPDATE', (msg) => {
      const payload = msg.payload as { display?: DisplaySettings } | undefined;
      if (!payload?.display) return;
      // Record the remote display JSON to prevent echo-back
      lastSyncedDisplayJson.current = JSON.stringify(payload.display);
      usePrompterStore.getState().setDisplay(payload.display);
    });

    // Poll connection state
    const pollTimer = setInterval(() => {
      usePrompterStore.getState().setWsConnected(wsService.connected);
    }, 1000);

    return () => {
      unsubPlay();
      unsubPause();
      unsubStop();
      unsubSpeed();
      unsubPosition();
      unsubDirection();
      unsubSync();
      unsubMos();
      unsubScriptUpdate();
      unsubSettingsUpdate();
      clearInterval(pollTimer);
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('restart')) return;
    params.delete('restart');
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, []);

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

  // ─── Broadcast position changes to backend (throttled while playing) ─────

  useEffect(() => {
    return () => {
      if (positionSyncTimer.current) {
        clearTimeout(positionSyncTimer.current);
        positionSyncTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (Math.abs(scrollPosition - lastSyncedPosition.current) < 1) return;
    if (positionSyncTimer.current) return;

    positionSyncTimer.current = setTimeout(() => {
      positionSyncTimer.current = null;
      const latest = usePrompterStore.getState().scroll.position;
      wsService.send('SET_POSITION', { position: latest });
      lastSyncedPosition.current = latest;
    }, 120);
  }, [scrollPosition, isPlaying]);

  useEffect(() => {
    if (isPlaying) return;
    if (Math.abs(scrollPosition - lastSyncedPosition.current) < 1) return;
    wsService.send('SET_POSITION', { position: scrollPosition });
    lastSyncedPosition.current = scrollPosition;
  }, [scrollPosition, isPlaying]);

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
    if (current.segments.length === 0 || isLegacyEnglishDemoScript(current)) {
      setScript({
        ...current,
        lastModified: Date.now(),
        segments: GERMAN_TEST_SEGMENTS,
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
      <ControlPanel viewMode={viewMode} />

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
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </aside>
      )}
    </div>
  );
}
