// ─── Shared types (mirrored from frontend) ──────────────────────────────────
// Keep in sync with packages/frontend/src/types/index.ts

export type WsMessageType =
  | 'PLAY'
  | 'PAUSE'
  | 'STOP'
  | 'SET_SPEED'
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

export type RedundancyRole = 'primary' | 'backup' | 'standalone';

export interface ServerConfig {
  httpPort: number;
  mosPort: number;       // MOS TCP port (default 10540 per MOS spec)
  ndiEnabled: boolean;
  redundancyRole: RedundancyRole;
  peerAddress?: string;  // Expert: IP address of the redundant peer
}
