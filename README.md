# Saarwood Teleprompter

Professional broadcast-grade teleprompter web application — PWA, three tiers (Basic / Professional / Expert).

## Related Repositories

- Saarwood Main Site: https://github.com/r4szkrchbf-cloud/saarwood-ch-main-site
- Saarwood Adminpanel: https://github.com/r4szkrchbf-cloud/saarwood-app-technik-adminpanel

This repository is teleprompter-only (frontend, backend, electron, teleprompter operations docs).

## Architecture

```text
saarwood_telepromter/
├── packages/
│   ├── frontend/        # Progressive Web App (Vite + React 18 + TypeScript)
│   └── backend/         # Node.js control server (Express + WebSocket + MOS)
└── package.json         # npm workspace root
```

### Tech Stack

| Layer | Technology | Why |
| ----- | ---------- | --- |
| Frontend build | Vite 6 + `@vitejs/plugin-react` | Sub-second HMR, native ESM |
| PWA | `vite-plugin-pwa` (Workbox) | Offline-first, installable on iOS/Android/Desktop |
| UI framework | React 18 + TypeScript 5.7 | Concurrent rendering, type-safety |
| Rich-text editor | Tiptap v3 | Bold, italic, underline, colour — LTR Latin scripts |
| State management | Zustand 5 + `persist` middleware | Zero-boilerplate, localStorage persistence |
| Scroll engine | CSS `transform: translateY` + `requestAnimationFrame` | GPU compositor thread, no layout/paint |
| Backend | Node.js 22 + Express 5 | Fast, widely deployed |
| WebSocket | `ws` 8 | Lightweight, battle-tested |
| MOS Protocol | Node.js `net` (TCP) + `xml2js` | Real MOS over TCP as per spec §5 |
| Testing | Vitest 4 | Fast, native ESM, compatible with Vite |

## Scroll Engine (Broadcast Quality)

The teleprompter output uses a **GPU-composited CSS transform** strategy:

- All scroll motion is applied via `element.style.transform = "translateY(-Xpx)"` — never `scrollTop`
- `will-change: transform` on the content element forces a dedicated GPU compositing layer
- `requestAnimationFrame` drives every frame at the display refresh rate (60 / 120 fps)
- Delta-time is capped at 50 ms to suppress jumps after tab focus restoration
- Speed range: 0–400 px/s, stored as a floating-point accumulator for sub-pixel precision
- Mirror (H/V flip) is a `CSS transform: scaleX(-1) / scaleY(-1)` on the viewport element

> **WebGL / WebGPU note:** For standard text scrolling, CSS composited transforms are equivalent to or better than a WebGL canvas because they avoid per-frame texture uploads. WebGL would add value for advanced overlays (animated chroma-key, real-time colour grading). The architecture is designed to support a WebGL/WebGPU render layer as a drop-in replacement for the `prompter-content` div.

## Feature Tiers

### Basic (Content Creator / Education)

- ✅ Cross-platform PWA (Windows, macOS, iOS, Android) — installable, offline-capable
- ✅ Hardware-accelerated smooth scrolling (CSS compositor + rAF)
- ✅ Rich text editor (bold, italic, underline, colour) — LTR Latin scripts only
- ✅ Horizontal and vertical mirroring (CSS transform)
- ✅ Hardware-accelerated rotation (0°/90°/180°/270°) for physical teleprompter glass mounting angles (GPU compositor CSS transform)
- ✅ Dark mode (Director UI)
- ✅ WebSocket remote control (smartphone, tablet)
- ✅ Keyboard shortcuts (Space=play/pause, Esc=stop, ↑/↓=speed)
- ✅ Presenter preferences (font size, family, colours, line height) with localStorage persistence

### Professional (Regional Broadcast)

- ✅ **MOS Protocol v2.8.5** (TCP/XML, Profile 0 heartbeat + Profile 2 running order) — backend `MosHandler`
- ✅ **Hot-update while scrolling**: Tiptap editor writes to Zustand store; PrompterDisplay reads on next rAF frame — zero scroll interruption
- ✅ **Cue marker** and cue position controls
- ✅ **Cloak Text**: per-segment toggle hides unconfirmed text from the presenter view
- ✅ **Director's Notes**: segments marked as notes are dimmed and skipped by ASR auto-scroll
- ✅ **Telepromptervorlagen**: named presets (font size/colour/line-height) with save/apply/rename/delete
- ✅ **Support dashboard**: ticket creation, support links, and 78h support log access in Settings
- ✅ **Import/Export**: JSON, CSV, TXT, PDF plus tier-aware import rules

### Expert (Enterprise Broadcast)

- ✅ **Voice tracking** via Web Speech API with microphone selection, sensitivity and calibration
- ✅ **A/B Redundancy architecture**: `RedundancyState` (primary/backup/standalone) in store; WebSocket `SYNC_STATE` messages keep peers in sync. Hitless failover logic connects in the backend control server.
- ✅ **NDI abstraction layer**: `NdiAdapter` interface + `StubNdiAdapter` (development) + `NativeNdiAdapter` shell that loads an optional native addon. **Real NDI output requires the NDI SDK C++ native addon** — see `packages/backend/src/ndi/NdiAdapter.ts` for integration notes.
- ✅ **SMPTE ST 2110 readiness**: architecture cleanly separates the render/control plane from the transport plane. ST 2110 (PTP-synchronised, unkompressed video multicast) must be handled by a hardware/middleware layer (e.g., Mellanox ConnectX NIC + dedicated ST 2110 daemon); the backend provides the hook point.
- ✅ **CEA-708 caption types**: `Cea708Packet` interface defined in `types/index.ts`; export adapter to be connected to a hardware encoder's API.
- ✅ **"Last-device-in-control" convention**: manual control fires `prompter:manual-control` DOM event; voice-tracking ASR suppresses scroll updates for 2 s after any manual input.
- ✅ **On-premise ASR adapter**: `SpeechRecognitionService` is interface-compatible with any backend ASR engine (Whisper.cpp, Vosk, DeepSpeech) that streams transcripts via WebSocket.

## Getting Started

```bash
# Install all workspaces
npm install

# Development (frontend on :3000, backend on :4000)
npm run dev

# Build both packages
npm run build

# Run all tests
npm test
```

## Native Desktop & Mobile Apps

The application ships in two forms:

### 1 · PWA — installable on every platform without any build step

| Platform | How to install |
| -------- | -------------- |
| **macOS / Windows / Linux** | Open in Chrome/Edge → address-bar **Install** icon |
| **iOS / iPadOS** | Open in Safari → Share → **Add to Home Screen** |
| **Android** | Open in Chrome → banner or menu → **Install App** |

### 2 · Electron — native desktop app (.dmg / .exe / AppImage)

```bash
# macOS Universal (Intel + Apple Silicon) — runs on macOS, produces .dmg
npm run electron:dist:mac

# Windows x64 — produces NSIS .exe installer
npm run electron:dist:win

# Linux x64 — produces .AppImage and .deb
npm run electron:dist:linux
```

Output: `packages/electron/dist-app/`

The Electron app bundles both the frontend (PWA) and the backend (Control server) in a single
standalone package. No separate server setup required. Code-signing and notarization for macOS
distribution are supported via `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` / `APPLE_TEAM_ID` env vars.

### 3 · Capacitor — Android APK / AAB

```bash
cd packages/frontend
npm install
npm run build
npx cap add android      # one-time: initialise Android project
npx cap sync android     # copy dist into the Android project
npx cap open android     # open Android Studio → Build → Generate APK
```

See `docs/NATIVE_APP_GUIDE.md` for detailed build instructions and release signing guidance.

## Project Preparation

- Documentation index and structure:
  - `docs/README.md`
- Copilot cloud-agent setup workflow:
  - `.github/workflows/copilot-setup-steps.yml`
- Kickoff preparation document (German):
  - `docs/PROJECT_PREPARATION_DE.md`
- External requirement lists (iCloud Notes):
  - <https://www.icloud.com/notes/045l_lo2kVm7Miml4b4DSZdow>
  - <https://www.icloud.com/notes/0c3iy6aWi5WxgCSuPHr-MzIQQ>
  - <https://www.icloud.com/notes/08e7syc7g3MlplEYAGB3DtmAQ>

### Environment variables (backend)

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `4000` | HTTP / WebSocket port |
| `MOS_PORT` | `10540` | MOS TCP port (upper connection per spec) |
| `APP_TIER` | `basic` | `basic` / `professional` / `expert` |
| `ENABLE_MOS` | `true` | Start MOS TCP listener |
| `ENABLE_NDI` | `true` | Initialise NDI adapter |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

## Design Decisions

The following decisions were made deliberately and must be traceable for future contributors.

### 1 · Script / Language Scope — LTR Latin Only

**Decision:** This application exclusively supports **left-to-right (LTR) Latin scripts** (e.g. German, English, French, Spanish, Italian, …).

**What is explicitly NOT supported in this app:**

- Arabic (right-to-left)
- Hebrew (right-to-left)
- Chinese / CJK (vertical / mixed-direction)
- Cyrillic (left-to-right but non-Latin)
- Any other non-Latin writing system

**Rationale:** A teleprompter designed to handle LTR Latin scripts can be optimised tightly for that use case — layout, font rendering, line-breaking, and speech-tracking all benefit from a focused scope. Mixing RTL and complex-script support into the same codebase would increase complexity and risk without adding value for the primary target audience (European broadcast newsrooms).

**Sub-project — Saarwood Teleprompter (Multi-Script Edition):**
> A dedicated, separate application will be developed as an **official sub-project of this project** to serve Arabic, Hebrew, Chinese, Cyrillic, and all other non-LTR writing systems — including bilingual use alongside English.
> That application will be purpose-built and optimised for those scripts from the ground up (RTL layout, bidirectional text, complex shaping engines, appropriate fonts, right-to-left UI chrome).
> It will share the same backend infrastructure (WebSocket control bus, MOS, NDI abstraction) but use a separate frontend package.

**Code impact of this decision (traceability):**

| File | Change |
| ---- | ------ |
| `packages/frontend/src/types/index.ts` | `TextDirection` type narrowed from `'ltr' \| 'rtl' \| 'auto'` → `'ltr'` |
| `packages/frontend/package.json` | `tiptap-text-direction` dependency removed |
| `packages/frontend/src/components/Editor/ScriptEditor.tsx` | `TextDirection` Tiptap extension removed; LTR/RTL toolbar buttons removed; `setDirection` callback removed |
| `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx` | `dir` attribute always reads `segment.direction` (always `'ltr'`) — no `'auto'`/`'rtl'` branch |

---

### 2 · Rendering Engine — CSS Compositor (WebGL as Future Optional Layer)

**Decision:** The teleprompter output is rendered using **CSS `transform: translateY()`** driven by `requestAnimationFrame`. WebGL / WebGPU is **not** used in the initial version.

**Rationale:**

- CSS compositor transforms run on the GPU compositor thread with zero layout/paint overhead — equivalent to, or better than, a full WebGL canvas for plain text scrolling.
- CSS avoids per-frame texture uploads that a WebGL text renderer would require.
- A CSS-only approach is zero-dependency, maximally compatible (all modern browsers, iOS Safari, Android WebView), and trivially auditable.

**Future WebGL layer (planned):**
> WebGL / WebGPU will be **added later as an optional, additive layer** on top of the existing CSS renderer — not as a replacement.
> Use cases: animated chroma-key overlays, real-time colour grading, custom shader effects on the prompter output.
> The architecture is designed for this: the `prompter-content` div is a clean insertion point for a WebGL canvas that composites on top of, or instead of, the CSS-scrolled content.
> This work is intentionally deferred and will be tracked as a separate feature branch.

---

## Architectural Honesty Notes

The following features require components that are **outside the browser sandbox** and are explicitly documented as such:

| Feature | Limitation | Production Path |
| ------- | ---------- | --------------- |
| **NDI output** | NDI SDK is a proprietary C/C++ library. No WebAssembly port exists. | Node.js native addon wrapping `NDIlib_send_*` API, or OBS NDI plugin capturing the browser window |
| **SMPTE ST 2110** | Requires dedicated NIC with PTP hardware timestamping. Browser/Node.js cannot generate ST 2110 RTP streams natively. | Dedicated hardware encoder (e.g., Matrox, AJA) or software stack (FFmpeg + Mellanox VMA) receiving frames from this app via NDI or REST |
| **On-premise ASR** | Web Speech API delegates to the OS/cloud. True on-premise inference runs server-side. | Whisper.cpp / Vosk / DeepSpeech running in the backend; transcripts relayed to clients via the existing WebSocket bus |
| **Bluetooth pedal** | Web Bluetooth API provides access to generic BLE devices; MIDI over BLE works in Chrome. A companion PWA page using Web Bluetooth / Web MIDI can relay pedal events as WebSocket messages. | Web MIDI API (`requestMIDIAccess`) or Web Bluetooth + GATT profile |
