# Projektstand Saarwood Teleprompter

_Stand: 2026-07-04 (aktualisiert: 2026-07-04 02:43 UTC — Bugfix: Electron-Test-Script ✅)_

## 1. Kurzfazit

Das Projekt ist als funktionierendes Monorepo mit Frontend (PWA) und Backend (Control/MOS/NDI-Adapter) aufgebaut.  
Die Kernfunktionen für Teleprompter-Rendering, Editor, Steuerung, WebSocket-Sync und Basis-Tests sind vorhanden.

## 2. Aktueller Scope (nach Code-Scan)

### Frontend (`packages/frontend`)
- React 18 + TypeScript + Vite + PWA-Konfiguration
- Tiptap-basierter Script-Editor mit Segmenten
- GPU-schonendes Scrollen via `requestAnimationFrame` + CSS `transform`
- **Text-Transformation (P0-MVP-Feature): Mirror H/V + Rotation 0°/90°/180°/270°**
  - Horizontal- und Vertikal-Spiegel (`scale(-1,1)` / `scale(1,-1)`)
  - Rotation auf GPU-Ebene (`rotate(Xdeg)`) für alle physischen Teleprompter-Montagewinkel
  - Kombinierter Single-Transform (kein Reflow): `rotate(Xdeg) scale(sx, sy)`
- Anzeigeeinstellungen inkl. Mirror, Rotation (0°/90°/180°/270°), Cue-Marker, Profile
- Zustand-Store mit Persistenz (`localStorage`)
- WebSocket-Client mit Reconnect + Heartbeat
- **Speech-Tracking vollständig aktiv (TICKET-003 ✅):** Toggle im SettingsPanel, `speechEnabled` im Store persistiert, `charsPerPixel` per Canvas-Font-Metrics, Last-device-in-control-Konvention, Browser-Hinweis bei fehlendem Web Speech API-Support

### Backend (`packages/backend`)
- Express-Server mit CORS und globalem Rate-Limit
- WebSocket-Control-Server (`/ws`) inkl. SYNC_STATE-Logik
- MOS-Handler (Profile 0/2, TCP/XML, Event-Weitergabe)
- NDI-Abstraktionsschicht mit Stub + optionalem Native-Adapter
- REST-Endpunkte (`/api/health`, `/api/info`, `/api/ndi/status`)

## 3. Bereits implementierte Stärken

- Saubere Trennung Frontend/Backend über Workspaces
- Gute technische Dokumentation in `README.md`
- Sicherheitsgrundlagen vorhanden:
  - HTML-Sanitizing mit DOMPurify im Prompter-Render
  - Rate-Limiting im Backend
- Tier-Modell (basic/professional/expert) bereits im Design verankert
- Testbasis vorhanden (Vitest in beiden Paketen)

## 4. Test- und Qualitätsstatus (Codebasis)

Vorhandene Testdateien:
- Frontend:
  - `prompterStore.test.ts`
  - `webSocketService.test.ts`
  - `speechRecognition.test.ts`
- Backend:
  - `mosHandler.test.ts`
  - `ndiAdapter.test.ts`

Abdeckungsschwerpunkte:
- Store-Logik, WebSocket-Service, Speech-Matching
- MOS-Basisverhalten und NDI-Stub-Verhalten

## 5. Offene Lücken / Risiken

1. **Echte NDI-Ausgabe**  
   Aktuell nur Stub/fallback; produktive NDI-Senderintegration ist noch offen.

2. **ASR vollständig aktiv (TICKET-003 ✅)**  
   Speech-Tracking-Hook ist implementiert und vollständig eingeschaltet: Toggle im SettingsPanel, persistierter Store-State, Canvas-Font-Metrics für `charsPerPixel`, Last-device-in-control-Konvention.

3. **MOS-Umfang bewusst begrenzt**  
   Wesentliche Profile implementiert; erweiterte Integrationspfade und echtes NRCS-Feintuning bleiben ein weiterer Schritt.

4. **Repository-Statusdokumentation fehlte bislang zentral**  
   Dieser Stand wird mit dieser Datei erstmals zentral gesichert.

## 6. Priorisierter Vorschlag „Wie geht es weiter?“

### Phase 1 (sofort, höchste Priorität)
1. Build/Test/Lint als feste CI-Qualitäts-Gates absichern.
2. Ein kleines „Definition of Done“ pro Feature-Tier ergänzen.
3. Offene Integrationsentscheidungen (NDI/MOS/ASR produktiv) als Tickets mit Akzeptanzkriterien aufteilen.

### Phase 2 (Produktionsreife Kernsystem)
1. ASR-Steuerung im UI vollständig aktivierbar machen (inkl. UX-Controls).
2. MOS-Integration mit realen NRCS-Testdaten erweitern.
3. Redundanz-/Sync-Szenarien praxisnah testen und dokumentieren.

### Phase 3 (Broadcast-Integration)
1. Echte NDI-Ausgabe über native Adapter-Implementierung anbinden.
2. Export-/Schnittstellenpfade (z. B. Captioning/Encoder-Anbindung) produktivisieren.
3. Betriebsdokumentation (Monitoring, Fallback, On-Prem-Betrieb) ergänzen.

## 7. Gesicherte Projektartefakte

Relevante Kern-Dokumente:
- `README.md` (Architektur, Features, Setup)
- `docs/PROJECT_PREPARATION_DE.md` (Vorbereitung/Kickoff)
- `docs/PROJECT_STATUS_DE.md` (dieser aktuelle Projektstand)
- `docs/TEST_MVP.md` (MVP-Stresstest-Log, alle Testrunden mit Datum/Uhrzeit)

Damit ist der aktuelle Projektstand im Repository dokumentiert und versionierbar abgelegt.

## 8. Changelog

### 2026-07-04 02:43 UTC — Bugfix: Electron-Test-Script

**Problem:** `npm test --workspaces` schlug fehl, weil `packages/electron/package.json` kein `test`-Script enthielt.  
**Fix:** No-op-Script `"test": "echo \"No tests for electron package\""` in `packages/electron/package.json` ergänzt.  
**Ergebnis:** `npm test --workspaces` läuft jetzt fehlerfrei durch (alle 9 Unit-Tests bestanden, Electron gibt erwartete Echo-Meldung).

### 2026-07-04 02:07 UTC — README-Korrekturen

**Durchgeführte Änderungen an `README.md`:**

1. **Rotation-Feature ergänzt (Basic-Tier-Liste)**  
   Das Feature `rotation: 0 | 90 | 180 | 270` war in `DisplaySettings` und im Store seit Anfang implementiert und in `PROJECT_STATUS_DE.md` als P0-MVP-Feature gelistet, fehlte aber vollständig im README.  
   → Neuer Eintrag in der Basic-Tier-Liste: *„Hardware-accelerated rotation (0°/90°/180°/270°) for physical teleprompter glass mounting angles"*

2. **TypeScript-Version korrigiert**  
   README nannte `TypeScript 5.9`, beide `package.json` haben `"typescript": "^5.7.2"`.  
   → Korrigiert auf `TypeScript 5.7` in der Tech-Stack-Tabelle.

**Keine Änderungen nötig:**
- `zod` als neue Backend-Dependency: keine user-facing Auswirkung, kein README-Update erforderlich.
- Neue `docs/`-Dateien (Backlog, Brainstorming, Statusberichte): müssen nicht im README verlinkt sein.

### 2026-07-04 02:12 UTC — MVP-Stresstest Runde 1

**Teststatus:** ✅ **VOLLSTÄNDIG GRÜN**

Erste vollständige Testrunde über alle Qualitätsgates:

| Gate | Ergebnis |
|------|---------|
| Unit-Tests Frontend (25 Tests) | ✅ PASS |
| Unit-Tests Backend (9 Tests) | ✅ PASS |
| TypeScript Frontend | ✅ PASS |
| TypeScript Backend | ✅ PASS |
| Lint Frontend | ✅ PASS |
| Lint Backend | ✅ PASS |
| Build Frontend (Vite) | ✅ PASS (1 Warning: Chunk > 500 kB — kein Blocker) |
| Build Backend (tsc) | ✅ PASS |

Detailliertes Test-Log: `docs/TEST_MVP.md`

**Offene Punkte:**
- W-01: JS-Bundle-Größe (619 kB min / 199 kB gzip) — Backlog-Kandidat für Code-Splitting, kein MVP-Blocker.
