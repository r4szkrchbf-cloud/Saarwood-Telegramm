import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  ScrollState,
  DisplaySettings,
  Script,
  ScriptSegment,
  PresenterProfile,
  RedundancyState,
  NdiAdapterStatus,
  AppTier,
} from '../types';

// ─── Default values ──────────────────────────────────────────────────────────

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  mirrorHorizontal: false,
  mirrorVertical: false,
  rotation: 0,
  fontSize: 48,
  fontFamily: 'sans-serif',
  textColor: '#ffffff',
  backgroundColor: '#000000',
  lineHeight: 1.6,
  textAlign: 'center',
  darkMode: true,
  cueMarkerEnabled: true,
  cueMarkerPosition: 30,
};

const DEFAULT_SCROLL_STATE: ScrollState = {
  isPlaying: false,
  speed: 80,
  position: 0,
  direction: 'down',
};

const DEFAULT_SCRIPT: Script = {
  id: 'default',
  title: 'Untitled Script',
  segments: [],
  lastModified: Date.now(),
};

function createMemoryStorage(): Storage {
  const storage = new Map<string, string>();
  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.has(key) ? storage.get(key)! : null;
    },
    key(index: number) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  };
}

const fallbackStorage = createMemoryStorage();

function getPersistStorage(): Storage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Fall through to in-memory storage for non-browser/test environments.
  }
  return fallbackStorage;
}

function normalizeUniqueSegmentIds(script: Script): Script {
  const seen = new Set<string>();
  let changed = false;

  const segments = script.segments.map((segment) => {
    let id = segment.id;
    if (seen.has(id)) {
      changed = true;
      let suffix = 2;
      while (seen.has(`${id}-${suffix}`)) suffix += 1;
      id = `${id}-${suffix}`;
    }
    seen.add(id);
    return id === segment.id ? segment : { ...segment, id };
  });

  if (!changed) return script;
  return { ...script, segments, lastModified: Date.now() };
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface PrompterStore {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;

  // Tier
  tier: AppTier;
  setTier: (tier: AppTier) => void;

  // Scroll
  scroll: ScrollState;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setPosition: (position: number) => void;
  setDirection: (direction: ScrollState['direction']) => void;

  // Display
  display: DisplaySettings;
  setDisplay: (partial: Partial<DisplaySettings>) => void;
  resetDisplay: () => void;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  speechInputDeviceId: string | null;
  setSpeechInputDeviceId: (deviceId: string | null) => void;
  speechSensitivity: number;
  setSpeechSensitivity: (value: number) => void;

  // Script
  script: Script;
  setScript: (script: Script) => void;
  setScriptTitle: (title: string) => void;
  updateSegment: (id: string, partial: Partial<ScriptSegment>) => void;
  addSegment: (segment: ScriptSegment) => void;
  removeSegment: (id: string) => void;
  reorderSegment: (id: string, direction: 'up' | 'down') => void;

  // Presenter profiles
  profiles: PresenterProfile[];
  activeProfileId: string | null;
  saveProfile: (profile: PresenterProfile) => void;
  renameProfile: (id: string, name: string) => void;
  deleteProfile: (id: string) => void;
  applyProfile: (id: string) => void;

  // NDI status (read-only, set by adapter)
  ndiStatus: NdiAdapterStatus;
  setNdiStatus: (status: NdiAdapterStatus) => void;

  // Redundancy (Expert)
  redundancy: RedundancyState;
  setRedundancy: (partial: Partial<RedundancyState>) => void;

  // WebSocket connection status
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;

  // License token (Phase A)
  licenseToken: string | null;
  setLicenseToken: (token: string | null) => void;
}

// ─── Store implementation ─────────────────────────────────────────────────────

export const usePrompterStore = create<PrompterStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      // Tier
      // Beta V1: all features unlocked — default tier is 'expert'
      tier: 'expert',
      setTier: (tier) => set({ tier }),

      // Scroll
      scroll: DEFAULT_SCROLL_STATE,
      play: () => set((s) => ({ scroll: { ...s.scroll, isPlaying: true } })),
      pause: () => set((s) => ({ scroll: { ...s.scroll, isPlaying: false } })),
      stop: () =>
        set((s) => ({
          scroll: { ...s.scroll, isPlaying: false, position: 0 },
        })),
      setSpeed: (speed) =>
        set((s) => ({
          scroll: { ...s.scroll, speed: Math.max(0, Math.min(400, speed)) },
        })),
      setPosition: (position) =>
        set((s) => ({ scroll: { ...s.scroll, position } })),
      setDirection: (direction) =>
        set((s) => ({ scroll: { ...s.scroll, direction } })),

      // Display
      display: DEFAULT_DISPLAY_SETTINGS,
      setDisplay: (partial) =>
        set((s) => ({ display: { ...s.display, ...partial } })),
      resetDisplay: () => set({ display: DEFAULT_DISPLAY_SETTINGS }),
      speechEnabled: false,
      setSpeechEnabled: (speechEnabled) => set({ speechEnabled }),
      speechInputDeviceId: null,
      setSpeechInputDeviceId: (speechInputDeviceId) => set({ speechInputDeviceId }),
      speechSensitivity: 55,
      setSpeechSensitivity: (speechSensitivity) =>
        set({ speechSensitivity: Math.max(0, Math.min(100, Math.round(speechSensitivity))) }),

      // Script
      script: DEFAULT_SCRIPT,
      setScript: (script) => set({ script: normalizeUniqueSegmentIds(script) }),
      setScriptTitle: (title) =>
        set((s) => ({
          script: { ...s.script, title, lastModified: Date.now() },
        })),
      updateSegment: (id, partial) =>
        set((s) => ({
          script: {
            ...s.script,
            lastModified: Date.now(),
            segments: s.script.segments.map((seg) =>
              seg.id === id ? { ...seg, ...partial } : seg,
            ),
          },
        })),
      addSegment: (segment) =>
        set((s) => ({
          script: {
            ...s.script,
            lastModified: Date.now(),
            segments: normalizeUniqueSegmentIds({
              ...s.script,
              segments: [...s.script.segments, segment],
            }).segments,
          },
        })),
      removeSegment: (id) =>
        set((s) => ({
          script: {
            ...s.script,
            lastModified: Date.now(),
            segments: s.script.segments.filter((seg) => seg.id !== id),
          },
        })),
      reorderSegment: (id, direction) =>
        set((s) => {
          const segments = [...s.script.segments];
          const idx = segments.findIndex((seg) => seg.id === id);
          if (idx < 0) return s;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= segments.length) return s;
          [segments[idx], segments[targetIdx]] = [segments[targetIdx], segments[idx]];
          return {
            script: { ...s.script, lastModified: Date.now(), segments },
          };
        }),

      // Presenter profiles
      profiles: [],
      activeProfileId: null,
      saveProfile: (profile) =>
        set((s) => ({
          profiles: [
            ...s.profiles.filter((p) => p.id !== profile.id),
            profile,
          ],
        })),
      renameProfile: (id, name) =>
        set((s) => ({
          profiles: s.profiles.map((profile) =>
            profile.id === id ? { ...profile, name: name.trim() || profile.name } : profile,
          ),
        })),
      deleteProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
          activeProfileId:
            s.activeProfileId === id ? null : s.activeProfileId,
        })),
      applyProfile: (id) => {
        const profile = get().profiles.find((p) => p.id === id);
        if (profile) {
          if (profile.scriptTemplate) {
            set({
              display: profile.displaySettings,
              activeProfileId: id,
              script: normalizeUniqueSegmentIds(profile.scriptTemplate),
            });
            return;
          }
          set({
            display: profile.displaySettings,
            activeProfileId: id,
          });
        }
      },

      // NDI
      ndiStatus: {
        available: false,
        sourceName: 'Saarwood Teleprompter',
        isStreaming: false,
        frameRate: 25,
        resolution: { width: 1920, height: 1080 },
      },
      setNdiStatus: (status) => set({ ndiStatus: status }),

      // Redundancy
      redundancy: {
        role: 'standalone',
        peerAddress: null,
        isSynced: false,
        lastHeartbeat: null,
      },
      setRedundancy: (partial) =>
        set((s) => ({ redundancy: { ...s.redundancy, ...partial } })),

      // WebSocket
      wsConnected: false,
      setWsConnected: (wsConnected) => set({ wsConnected }),

      // License
      licenseToken: null,
      setLicenseToken: (licenseToken) => set({ licenseToken }),
    }),
    {
      name: 'saarwood-teleprompter-state-v3',
      storage: createJSONStorage(getPersistStorage),
      // Persist user preferences and profiles, but not live scroll state
      partialize: (state) => ({
        tier: state.tier,
        display: state.display,
        speechEnabled: state.speechEnabled,
        speechInputDeviceId: state.speechInputDeviceId,
        speechSensitivity: state.speechSensitivity,
        licenseToken: state.licenseToken,
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        script: state.script,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHydrated(true);
      },
    },
  ),
);
