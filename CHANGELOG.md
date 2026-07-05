# Changelog — Saarwood Teleprompter

All notable changes are documented here.  
Format: [Version] — Date (UTC) — Description

---

## [1.0.0-beta.1] — 2026-07-04

### 🚀 First Public Beta Release — Beta V1

This is the first externally testable release of the Saarwood Teleprompter.  
All MVP features are fully unlocked for Beta testing.

### Added
- **Beta V1 badge** in the application header (visible in UI at all times)
- **All tiers unlocked by default** — new installs start with `expert` tier so every feature is immediately accessible to beta testers
- **Electron desktop app** (`packages/electron`) — native macOS (.dmg Universal), Windows (NSIS .exe), and Linux (AppImage/.deb) wrappers. Build with `npm run electron:dist:mac` / `electron:dist:win` / `electron:dist:linux`
- **Capacitor Android** — `capacitor.config.ts` in `packages/frontend`; generates an Android Studio project for APK/AAB builds (`npx cap add android && npx cap sync android`)
- **Configurable `FRONTEND_DIST`** env var in backend — allows Electron (and any other host) to pass the frontend dist path at runtime
- `docs/NATIVE_APP_GUIDE.md` — comprehensive guide for building macOS, Windows, Linux and Android native apps

### Changed
- App title updated to `Saarwood Teleprompter — Beta V1`
- PWA manifest name: `Saarwood Teleprompter Beta` / short name: `Teleprompter β`
- Version bumped from `1.0.0` to `1.0.0-beta.1` in all packages
- Root `package.json` now includes `packages/electron` workspace and `electron:dist:*` scripts

### Features included in Beta V1

#### Basic
- Cross-platform PWA (Windows, macOS, iOS, Android) — offline-capable
- Hardware-accelerated GPU scrolling (CSS compositor + requestAnimationFrame)
- Rich text editor (bold, italic, underline, colour)
- Mirror horizontal/vertical (CSS transform)
- Hardware-accelerated rotation 0°/90°/180°/270°
- Dark mode (Director UI)
- WebSocket remote control
- Voice tracking (Web Speech API)
- Adjustable cue marker
- Keyboard shortcuts (Space, Esc, ↑/↓)
- Presenter preferences with localStorage persistence

#### Professional
- MOS Protocol v2.8.5 (TCP/XML, Profile 0 + Profile 2)
- Hot-update while scrolling (zero scroll interruption)
- Cloak Text (hide segment from presenter)
- Director's Notes (ASR skips segment)
- Presenter Profiles (save/apply/delete named presets)

#### Expert
- A/B Redundancy architecture (primary/backup/standalone)
- NDI abstraction layer (Stub + optional native addon)
- SMPTE ST 2110 readiness hooks
- CEA-708 caption type definitions
- Last-device-in-control convention (manual override suppresses ASR for 2 s)
- On-premise ASR adapter interface (Whisper.cpp, Vosk, DeepSpeech compatible)

### Known Issues / Limitations
- NDI output: stub only — real NDI requires the NDI SDK native addon
- SMPTE ST 2110: requires dedicated hardware/middleware layer
- JS bundle is 619 kB (minified) / 199 kB (gzip) — code-splitting planned for next release
- Beta software: expect rough edges; please report all issues

### Test Results (Runde 1)
- ✅ 34/34 unit tests passing
- ✅ TypeScript: 0 errors
- ✅ Lint: 0 warnings
- ✅ Build: clean (1 non-blocking Vite chunk size warning)

---

## [Unreleased]

### Added
- Voice diagnostics badge in prompter output with German runtime states (`AUS`, `Gemutet (Pause)`, `Startet`, `Hoert zu`, `Wartet`, `Keine Sprache`, `Fehler`).
- Voice settings enhancements in `Settings`: microphone source selection, sensitivity slider + numeric value (`0-100%`), German status legend.
- Voice calibration assistant in `Settings` with spoken test phrase, auto-analysis and automatic sensitivity recommendation.
- Explicit `Deutschen 4-Segment-Testtext laden` action in `Settings` for immediate speaker-script setup.
- New docs: `docs/SAARwooD_BESCHREIBUNG_BETA_V1_DE.md` and `docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md`.

### Changed
- Voice tracking execution is now transport-bound: ASR runs only while playback is active and is hard-muted during pause.
- Prompter restart (`Prompter NeuStart`) now resets/reloads without forced autoplay.
- Default demo content migrated to a German 4-segment speaker test script, including legacy English default-script detection.
- Prompter start anchor behavior refined: starts at viewport center, or exactly three lines below cue marker when cue marker is enabled.
- App header now shows a Beta warning that Voice Tracking is not included for current Beta operation.

### Fixed
- `packages/electron`: added no-op `"test"` script so `npm test --workspaces` no longer fails with *"Missing script: test"*

_Changes staged for the next release will appear here._
