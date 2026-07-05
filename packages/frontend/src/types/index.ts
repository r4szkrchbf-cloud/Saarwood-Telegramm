// ─── Teleprompter Tiers ─────────────────────────────────────────────────────

export type AppTier = 'basic' | 'professional' | 'expert';

// ─── Scroll / Playback ───────────────────────────────────────────────────────

export interface ScrollState {
  isPlaying: boolean;
  speed: number;          // pixels per second  (0–400)
  position: number;       // current scroll offset in px
  direction: 'down' | 'up';
}

// ─── Mirror / Display ────────────────────────────────────────────────────────

export interface DisplaySettings {
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  /** Rotation in degrees — applied on GPU compositor via CSS transform.
   *  Use 0 (normal), 90 (portrait right), 180 (upside-down), 270 (portrait left).
   *  Essential for physical teleprompter glass mounted at non-standard angles. */
  rotation: 0 | 90 | 180 | 270;
  fontSize: number;         // pt / rem units handled by CSS
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  lineHeight: number;       // multiplier, e.g. 1.5
  textAlign: 'left' | 'center' | 'right';
  darkMode: boolean;        // director/editor UI
  cueMarkerEnabled: boolean;
  cueMarkerPosition: number; // 0–100 % of viewport height
}

// ─── Script / Content ────────────────────────────────────────────────────────

export type TextDirection = 'ltr';

export interface ScriptSegment {
  id: string;
  html: string;             // Tiptap/HTML rich text
  direction: TextDirection;
  isCloaked: boolean;       // Professional: hidden from presenter
  isDirectorsNote: boolean; // Expert: ASR skips this segment
  mosItemId?: string;       // Professional: MOS object reference
}

export interface Script {
  id: string;
  title: string;
  segments: ScriptSegment[];
  lastModified: number;     // Unix timestamp
}

// ─── Presenter Profile ───────────────────────────────────────────────────────

export interface PresenterProfile {
  id: string;
  name: string;
  displaySettings: DisplaySettings;
}

// ─── WebSocket Messages ───────────────────────────────────────────────────────

export type WsMessageType =
  | 'PLAY'
  | 'PAUSE'
  | 'STOP'
  | 'SET_SPEED'
  | 'SET_DIRECTION'
  | 'SET_POSITION'
  | 'SCRIPT_UPDATE'
  | 'SETTINGS_UPDATE'
  | 'SYNC_STATE'
  | 'HEARTBEAT'
  | 'MOS_UPDATE'
  | 'CONTROLLER_CONNECTED'
  | 'CONTROLLER_DISCONNECTED';

export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload?: T;
  timestamp: number;
  clientId?: string;
}

// ─── MOS Protocol ────────────────────────────────────────────────────────────

export interface MosRunningOrder {
  roId: string;
  roSlug: string;
  stories: MosStory[];
}

export interface MosStory {
  storyId: string;
  storySlug: string;
  items: MosItem[];
}

export interface MosItem {
  itemId: string;
  slug: string;
  objId: string;
  objType?: string;
  mosExternalMetadata?: Record<string, string>;
}

// ─── NDI Adapter ─────────────────────────────────────────────────────────────

export interface NdiAdapterStatus {
  available: boolean;
  sourceName: string;
  isStreaming: boolean;
  frameRate: number;
  resolution: { width: number; height: number };
}

// ─── Redundancy (Expert) ─────────────────────────────────────────────────────

export type RedundancyRole = 'primary' | 'backup' | 'standalone';

export interface RedundancyState {
  role: RedundancyRole;
  peerAddress: string | null;
  isSynced: boolean;
  lastHeartbeat: number | null;
}

// ─── CEA-708 Caption Export (Expert) ─────────────────────────────────────────

export interface Cea708Packet {
  pts: number;              // presentation timestamp in milliseconds
  text: string;
  windowId: number;         // 0–7
  rowPosition: number;      // 0–14
  columnPosition: number;   // 0–31
  penStyle: Cea708PenStyle;
}

export interface Cea708PenStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  foregroundColor: string;  // CSS hex color
  backgroundColor: string;
}
