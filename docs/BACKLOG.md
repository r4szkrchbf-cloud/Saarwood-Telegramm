# Saarwood Teleprompter — Backlog

_Stand: 2026-07-04 · Phase 2 (MVP Welle 1) · **Welle 1 vollständig ✅**_

Dieses Dokument enthält alle offenen Aufgaben als priorisierte Backlog-Tickets.
Jedes Ticket enthält Akzeptanzkriterien (AK), die den „Definition of Done" definieren.

---

## HOTFIX-Block 2026-07-05 (P0 fuer MVP-Langzeittest)

### TICKET-013 · Frontend-Testharness fuer Persist-Store stabilisieren

**Prioritaet:** P0  
**Beschreibung:**  
`prompterStore.test.ts` scheitert aktuell im Vitest-Lauf wegen Storage/Persist-Verhalten (`setItem` auf `undefined`).

**Akzeptanzkriterien:**
- [ ] `npm run test --workspace=packages/frontend` ist komplett gruen
- [ ] `prompterStore.test.ts` laeuft stabil lokal und in CI
- [ ] Persist-Middleware wird im Testkontext korrekt gemockt oder isoliert

### TICKET-014 · MVP-LAN-Testcheckliste produktionsnah machen

**Prioritaet:** P0  
**Beschreibung:**  
Feste Durchfuehrungsanleitung fuer echten Langzeittest mit Usern erstellen und anwenden.

**Akzeptanzkriterien:**
- [ ] Testcheckliste dokumentiert (Startsequenz, Browser, Netzwerk, Rollback)
- [ ] Erfolgskriterien definiert (Stabilitaet, Latenz, Bedienbarkeit, Fehlerquote)
- [ ] Logging-Schema fuer Nutzerfeedback und technische Vorfaelle festgelegt

### TICKET-015 · Doku-Code-Drift kontinuierlich verhindern

**Prioritaet:** Hoch  
**Beschreibung:**  
Bestehende Doku wich vom aktuellen Teststatus ab. Es braucht einen kleinen Governance-Mechanismus.

**Akzeptanzkriterien:**
- [ ] `PROJECT_STATUS_DE.md`, `TEST_MVP.md`, `FEHLERBEHEBUNGEN.md` werden nach jedem Gate-Lauf aktualisiert
- [ ] Neue Statusberichte werden datiert unter `docs/` abgelegt
- [ ] Jeder Build-/Testlauf wird mit Datum/Uhrzeit und Ergebnis dokumentiert

### TICKET-016 · Frontend-Bundlegroesse optimieren (Vite Warning > 500 kB)

**Prioritaet:** P1  
**Beschreibung:**  
Der Frontend-Build ist erfolgreich, meldet aber eine bekannte Performance-Warnung: ein Haupt-Chunk liegt ueber dem Vite-Standardgrenzwert von 500 kB (minifiziert).  
Wichtig: Das ist **kein Laufzeitfehler** und **kein MVP-Blocker**. Die App ist betriebsbereit.  
Trotzdem ist das Thema relevant fuer Ladezeit und Reaktionsverhalten auf schwaecheren Clients, besonders bei laengeren Feldtests mit echten Nutzern.

**Warum P1 (und nicht P0):**
- Funktionale Stabilitaet und Test-Gates sind bereits gruen.
- Kein Einfluss auf Go/No-Go des MVP-LAN-Tests.
- Performance-Verbesserung hat hohen Nutzen, aber nicht die gleiche Dringlichkeit wie Betriebsfaehigkeit.

**Technische Zielrichtung:**
- Code-Splitting fuer nicht-kritische UI-Bereiche einführen (`dynamic import()`),
- optional `manualChunks` in Vite/Rollup definieren,
- grosse Abhaengigkeiten und eager Imports reduzieren,
- Messung je Schritt dokumentieren.

**Akzeptanzkriterien:**
- [ ] Build bleibt gruen (`npm run build --workspace=packages/frontend`)
- [ ] Warnung zur Chunk-Groesse ist entfernt oder nachvollziehbar reduziert
- [ ] Mindestens ein wirksamer Split ist umgesetzt (lazy geladenes Feature oder manueller Chunk)
- [ ] Vorher/Nachher-Messung dokumentiert (Chunk-Groesse minifiziert + gzip)
- [ ] Keine Regression in Frontend-Tests (`npm run test --workspace=packages/frontend`)

### TICKET-017 · Hostinger VPS als oeffentliche MVP-Variante vorbereiten

**Prioritaet:** P0  
**Beschreibung:**  
Wir sind aktuell noch in der Testphase und wollen die MVP-Version danach als oeffentliche Web-App fuer echte Nutzer bereitstellen.  
WordPress oder klassisches Shared Hosting sind fuer unseren Node/Express/WebSocket-Stack nicht passend. Die naechste realistische Public-Hosting-Variante ist ein eigener VPS, konkret Hostinger VPS, weil dort ein dauerhafter Node-Server mit WebSocket-Unterstuetzung betrieben werden kann.

**Warum diese Aufgabe wichtig ist:**
- Die App ist bereits lokal testbar und die naechsten Schritte sollen von Test zu realem Pilotbetrieb fuehren.
- Ein VPS erlaubt uns Frontend, Backend und WebSocket-Sync unter einer kontrollierten Infrastruktur zu betreiben.
- Damit koennen wir die MVP-Version fuer externe Nutzer oeffentlich erreichbar machen.

**Technische Zielrichtung:**
- Node/Express-Backend dauerhaft auf einem VPS betreiben
- WebSocket-Verbindung stabil unter einer oeffentlichen Domain bereitstellen
- Frontend und Backend mit Reverse Proxy oder aehnlicher Infrastruktur verbinden
- Deployment-Dokumentation fuer den öffentlichen Pilotbetrieb erstellen

**Akzeptanzkriterien:**
- [ ] Hostinger VPS-Plan ausgewaehlt und dokumentiert
- [ ] Public MVP-Architektur festgelegt (Domain, Frontend, Backend, WebSocket)
- [ ] `VITE_WS_URL` oder vergleichbare Konfiguration fuer externe Backend-URL umgesetzt
- [ ] Test-Deployment auf VPS erfolgreich
- [ ] Betriebsdoku fuer oeffentliche Nutzung erstellt
- [ ] Pilotbetrieb fuer echte Nutzer moeglich

### TICKET-018 · Restproblem Speed-Slider-Sprung (nach Langzeittest beheben)

**Prioritaet:** P0 (direkt nach Abschluss des Langzeittests)  
**Beschreibung:**  
Trotz der letzten Stabilisierung gibt es vereinzelt weiterhin beobachtete Spruenge am Speed-Slider bei Tastaturbedienung in bestimmten Laufzustaenden. Das Thema ist als bekanntes Restproblem aufgenommen und wird bewusst **nach** dem aktuellen Langzeittest gezielt abgeschlossen.

**Akzeptanzkriterien:**
- [ ] Reproduktion sauber dokumentiert (inkl. exakter Fokus-/View-/Play-Zustaende)
- [ ] Slider reagiert in allen Fokuszustaenden linear ohne Spruenge
- [ ] Keyboard-Steuerung konsistent (Left/Right) in Editor-, Split- und Prompter-View
- [ ] Kein Nebeneffekt auf Play/Pause/Stop-Hotkeys
- [ ] Regression-Tests erweitert (manuell + automatisiert, soweit sinnvoll)

---

## Phase 1 — CI & Qualitätsgates (abgeschlossen)

### TICKET-001 · CI-Workflow einrichten ✅

**Status:** Erledigt  
**Beschreibung:** GitHub Actions Workflow `ci.yml` für alle PRs und Pushes auf `main`.

**Akzeptanzkriterien:**
- [x] Workflow läuft bei jedem Push und PR auf `main`/`master`
- [x] Schritte: install → type-check → lint → test → build (frontend + backend)
- [x] CI schlägt fehl, wenn TypeScript-Fehler, Lint-Fehler, Tests fehlschlagen oder Build scheitert

---

### TICKET-002 · ESLint einrichten (Frontend + Backend) ✅

**Status:** Erledigt  
**Beschreibung:** ESLint v10 mit typescript-eslint v8 und react-hooks-Plugin konfigurieren.

**Akzeptanzkriterien:**
- [x] ESLint v10 + typescript-eslint v8 in beiden Paketen als devDependency
- [x] Flat-Config (`eslint.config.js` / `eslint.config.mjs`) in beiden Paketen
- [x] `--max-warnings 0` – keine Warnungen toleriert
- [x] `npm run lint` läuft fehlerfrei in beiden Paketen
- [x] 0 bekannte Security-Schwachstellen in ESLint-Dependencies

---

## Phase 2 — Produktionsreife Kernsystem

### TICKET-003 · ASR-Steuerung im UI aktivieren ✅

**Status:** Erledigt  
**Priorität:** Hoch  
**Tier:** Basic → Professional  
**Beschreibung:**  
`useSpeechTracking` ist implementiert und vollständig im UI aktivierbar.
`speechEnabled` wird aus dem Store gelesen und an `useSpeechTracking` übergeben.

**Akzeptanzkriterien:**
- [x] Neues Toggle „Voice tracking" im SettingsPanel (nur sichtbar wenn `speechService.isSupported`)
- [x] State in Zustand-Store: `speechEnabled: boolean` (persistiert in localStorage)
- [x] `charsPerPixel` wird korrekt berechnet (per Canvas-Font-Metrics: `ctx.measureText`)
- [x] Bei aktiviertem ASR: Prompter scrollt automatisch mit der gesprochenen Position
- [x] "Last-device-in-control"-Konvention bleibt aktiv (kein Überschreiben für 2 s nach manueller Eingabe)
- [x] Browser-Hinweis, wenn Web Speech API nicht verfügbar (z. B. Firefox)

---

### TICKET-004 · MOS-Integration vertiefen

**Priorität:** Mittel  
**Tier:** Professional  
**Beschreibung:**  
MOS-Handshake und Running-Order-Empfang sind implementiert. Die empfangenen Stories werden
jedoch noch nicht ins Segment-Modell überführt und im Editor/Prompter angezeigt.

**Akzeptanzkriterien:**
- [ ] `MOS_UPDATE`-WebSocket-Nachricht wird im Frontend zu konkreten `ScriptSegment`-Einträgen gemappt
- [ ] Empfangene MOS-Stories erscheinen als Segmente im Editor
- [ ] Hot-Update während des Scrollens: neue Segmente erscheinen ohne Scroll-Unterbrechung
- [ ] `mosItemId` in `ScriptSegment` wird beim MOS-Import korrekt gesetzt
- [ ] MOS-Verbindungsstatus wird im ControlPanel oder SettingsPanel angezeigt (verbunden / getrennt)
- [ ] Integrationstest: MOS-Simulator schickt `mosROCreate` → Segmente erscheinen im Editor

---

### TICKET-005 · Presenter-Profile UI vervollständigen

**Priorität:** Mittel  
**Tier:** Professional  
**Beschreibung:**  
Presenter-Profile sind im Store implementiert und im SettingsPanel abrufbar. Die Aktualisierung
eines bestehenden Profils (Überschreiben ohne Duplikat) ist noch nicht direkt im UI möglich.

**Akzeptanzkriterien:**
- [ ] Bestehendes Profil kann überschrieben werden (per Name oder Auswahl)
- [ ] Profil-Auswahl im SettingsPanel ist alphabetisch sortiert
- [ ] Löschen eines aktiven Profils setzt `activeProfileId` korrekt zurück
- [ ] Unit-Tests für saveProfile (neues Profil, Überschreiben, Löschen) vorhanden

---

## Phase 2 — MVP Welle 1 (Basic Tier, auslieferbar)

### TICKET-006 · MVP-Scope Welle 1 finalisieren ✅

**Status:** Erledigt (dokumentiert in `docs/BRAINSTORMING_2026-07-04.md`)  
**Priorität:** P0  
**Tier:** Basic  
**Beschreibung:**  
Definition des MVP-Scopes für Welle 1: welche Features kommen rein, welche werden zurückgestellt.

**Akzeptanzkriterien:**
- [x] Brainstorming-Protokoll erstellt (`docs/BRAINSTORMING_2026-07-04.md`)
- [x] MVP-Feature-Tabelle mit Tier-Zuordnung dokumentiert
- [x] Rotation als P0-Feature explizit im MVP verankert
- [x] Hotkey-Manager als P0-Feature definiert
- [x] Ingest-API als P1-Feature definiert
- [x] Nicht-MVP-Features (MOS tief, NDI produktiv, Redundanz, ST 2110) klar abgegrenzt

---

### TICKET-007 · Text-Rotation (0°/90°/180°/270°) implementieren

**Priorität:** P0 — MVP-Pflichtfeature  
**Tier:** Basic  
**Beschreibung:**  
Physische Teleprompter-Gläser werden in verschiedenen Winkeln montiert. Der Text muss auf
GPU-Ebene drehbar sein — zusammen mit dem bestehenden H/V-Mirror. Alle vier Transformationen
(Mirror H, Mirror V, Rotation) werden kombiniert als ein einziger CSS-`transform`-Aufruf auf
dem Viewport ausgeführt, damit kein Reflow entsteht.

**Akzeptanzkriterien:**
- [x] `DisplaySettings.rotation: 0 | 90 | 180 | 270` im Typen-System
- [x] Standard-Wert: `rotation: 0`
- [x] Store persistiert `rotation` in localStorage
- [x] `PrompterDisplay`: kombinierter GPU-Transform `rotate(Xdeg) scale(sx, sy)`
- [x] Rotation-Buttons im ControlPanel (◀ Rotate −90°, ▶ Rotate +90°)
- [x] Hotkeys `[` (−90°) und `]` (+90°) über HotkeyManager
- [x] Mirror und Rotation gleichzeitig nutzbar (korrekte Transform-Reihenfolge)

---

### TICKET-008 · Hotkey-Manager implementieren

**Priorität:** P0 — MVP-Pflichtfeature  
**Tier:** Basic  
**Beschreibung:**  
Broadcast-Regie arbeitet primär ohne Maus. Ein zentraler Hotkey-Manager als Singleton-Service
löst den bestehenden ad-hoc `keydown`-Handler in `App.tsx` ab und bietet Context-Awareness
(kein Feuern wenn Tiptap-Editor Fokus hat), erweiterbare Bindings und Last-device-in-control.

**Akzeptanzkriterien:**
- [x] `HotkeyManager`-Service (`packages/frontend/src/services/HotkeyManager.ts`)
- [x] `useHotkeyManager`-Hook für React-Integration
- [x] Bestehender `keydown`-Handler in `App.tsx` durch Hook ersetzt
- [x] Default-Bindings: Space (Play/Pause), ↑/↓ (Speed), R (Reset), M (Mirror H), F (Fullscreen), Esc (Stop), `[`/`]` (Rotation)
- [x] Context-Check: keine Hotkeys wenn `isContentEditable`, `INPUT`, `TEXTAREA` aktiv
- [x] Jede Aktion feuert `prompter:manual-control`-Event (Last-device-in-control)
- [x] `enable()` / `disable()` für externen Kontext-Switch

---

### TICKET-009 · Ingest-API `/api/v1/ingest` bauen

**Priorität:** P1  
**Tier:** Basic  
**Beschreibung:**  
Das Backend öffnet einen REST-Endpunkt für automatisierten Content-Ingest via n8n/ClickUp-Webhooks.
Eingehende Payloads werden per Zod-Schema validiert und als WebSocket-`SCRIPT_UPDATE`-Message
an alle verbundenen Clients gebroadcastet (Hot-Update ohne Scroll-Unterbrechung).

**Akzeptanzkriterien:**
- [x] `POST /api/v1/ingest` implementiert
- [x] Zod-Validierung: `targetProfileId`, `slotKey`, `rawText` (required); `source`, `priority` (optional)
- [x] API-Key-Auth via `Authorization: ****** (Key aus `INGEST_API_KEY` env-Variable)
- [x] Erfolg: `{ ok: true, segmentId: "uuid" }` mit HTTP 201
- [x] Fehler: strukturierter JSON-Error mit HTTP 400/401/422
- [x] `priority: "breaking"` löst sofortigen WebSocket-Broadcast aus
- [x] Integrationstest: POST → WebSocket-Clients empfangen `SCRIPT_UPDATE`

---

## Phase 3 — Broadcast-Integration

### TICKET-010 · NDI Native Addon anbinden

**Priorität:** Niedrig  
**Tier:** Expert  
**Beschreibung:**  
`NativeNdiAdapter` versucht `require('ndi-sdk-node')`, fällt auf Stub zurück.
Dieser Ticket beschreibt den Weg zur echten NDI-Ausgabe.

**Akzeptanzkriterien:**
- [ ] Pflichtenheft für NDI-Addon erstellt (welche NDI SDK API-Funktionen werden benötigt)
- [ ] `ndi-sdk-node` (node-gyp Wrapper) evaluiert oder eigenes Addon geskaffoldet
- [ ] `NativeNdiAdapter.init()` startet einen echten NDI Sender (verifiziert mit NDI Tools Monitor)
- [ ] `NativeNdiAdapter.sendFrame()` sendet BGRA-Frames mit korrektem PTS
- [ ] Graceful Fallback zu Stub wenn Addon nicht geladen werden kann (bleibt bestehen)
- [ ] `/api/ndi/status` liefert `available: true` wenn Addon aktiv

---

### TICKET-011 · Redundanz-Sync implementieren

**Priorität:** Niedrig  
**Tier:** Expert  
**Phase:** 3 (Broadcast-Integration) — **bewusst aus MVP Welle 1 herausgenommen**

> **Scope-Entscheidung (@saarnews, 2026-07-04):**  
> Redundanz ist ein Expert-Feature für mehrstufigen Broadcast-Betrieb (Hauptregie + Backup-Maschine).  
> Welle 1 = eine einzelne Teleprompter-Instanz. Failover wird für MVP nicht benötigt.  
> Typen (`RedundancyState`) bleiben als Vorarbeit erhalten, werden aber in Welle 1 nicht produktiv genutzt.

**Beschreibung:**  
`RedundancyState` (primary/backup/standalone) ist im Store modelliert.
Die Synchronisierungslogik zwischen zwei Instanzen via WebSocket ist noch nicht implementiert.

**Akzeptanzkriterien:**
- [ ] Backend: neuer Endpunkt `POST /api/peer` zum Verbinden mit einer Peer-Instanz
- [ ] `SYNC_STATE` wird vom Primary regelmäßig (alle 100 ms) an den Backup gesendet
- [ ] Backup-Instanz übernimmt Scroll-Position und Skript-Stand vom Primary
- [ ] Failover: wenn Primary unerreichbar, Backup übernimmt Steuerung ohne manuellen Eingriff
- [ ] Heartbeat-Timeout konfigurierbar via `REDUNDANCY_TIMEOUT_MS` Environment-Variable
- [ ] Redundanz-Status im ControlPanel sichtbar (Rolle + Sync-Zustand)

---

### TICKET-012 · Betriebsdokumentation ergänzen

**Priorität:** Niedrig  
**Tier:** Alle  
**Beschreibung:**  
Für den On-Premise-Betrieb in Redaktionen fehlt eine Betriebsdokumentation.

**Akzeptanzkriterien:**
- [ ] `docs/OPERATIONS.md`: Systemanforderungen, Installationsschritte, Umgebungsvariablen
- [ ] Docker-Compose-Beispiel für lokalen Broadcast-Betrieb (Backend + statisches Frontend)
- [ ] Monitoring-Hinweise: Health-Endpunkt `/api/health`, Log-Ausgaben, Neustart-Strategie
- [ ] Bekannte Limitierungen (NDI, ST 2110, Browser-ASR) klar benannt

---

### TICKET-013 · CEA-708 Caption Export implementieren

**Priorität:** Niedrig  
**Tier:** Expert  
**Phase:** 3 (Broadcast-Integration) — **bewusst aus MVP Welle 1 herausgenommen**

> **Scope-Entscheidung (@saarnews, 2026-07-04):**  
> Welle 1 = Teleprompter als eigenständiges Display (kein direkter Sendeketten-Anschluss).  
> CEA-708 ist ein Broadcast-Untertitel-Standard — für das MVP-Szenario nicht erforderlich.  
> Ein vollständiger Encoder (Bit-Packing, Window-Management, SCC/MCC-Format) kostet ~1–2 Tage → sprengt Welle-1-MVP.  
> Typ-Interfaces `Cea708Packet` / `Cea708PenStyle` bleiben als Vorarbeit in `packages/frontend/src/types/index.ts`.

**Beschreibung:**  
Aktuell sind nur Typ-Interfaces vorhanden. Für den Einsatz in der Sendekette
wird ein vollständiger CEA-708-Encoder mit API-Endpunkt und Frontend-Download benötigt.

**Akzeptanzkriterien:**
- [ ] `POST /api/v1/export/cea708` im Backend (Encoder: Bit-Packing, Window-Management)
- [ ] Ausgabeformat: SCC oder MCC (konfigurierbar)
- [ ] Frontend-UI: „Export Captions"-Button im Editor oder ControlPanel (nur Expert-Tier sichtbar)
- [ ] Datei-Download im Browser (`.scc` / `.mcc`)
- [ ] Zeitsynchronisation mit Scroll-Position (PTS-Berechnung auf Basis Scroll-Speed)
- [ ] Integrationstest: Script → Export → valides SCC-Dateiformat

---

## Backlog-Verwaltung

| ID          | Titel                                    | Phase | Priorität | Tier         | Status       |
|-------------|------------------------------------------|-------|-----------|--------------|--------------|
| TICKET-001  | CI-Workflow einrichten                   | 1     | ✅ Fertig  | Alle         | ✅ Erledigt  |
| TICKET-002  | ESLint einrichten                        | 1     | ✅ Fertig  | Alle         | ✅ Erledigt  |
| TICKET-003  | ASR-Steuerung im UI aktivieren           | 2     | ✅ Fertig  | Basic+Prof   | ✅ Erledigt  |
| TICKET-004  | MOS-Integration vertiefen                | 2     | Mittel    | Professional | 🔲 Offen     |
| TICKET-005  | Presenter-Profile UI vervollständigen    | 2     | Mittel    | Professional | 🔲 Offen     |
| TICKET-006  | MVP-Scope Welle 1 finalisieren           | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-007  | Text-Rotation (0°/90°/180°/270°)         | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-008  | Hotkey-Manager implementieren            | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-009  | Ingest-API `/api/v1/ingest`              | 2     | P1        | Basic        | ✅ Erledigt  |
| TICKET-010  | NDI Native Addon anbinden                | 3     | Niedrig   | Expert       | 🔲 Offen     |
| TICKET-011  | Redundanz-Sync implementieren            | 3     | Niedrig   | Expert       | 🔲 Offen (Phase 3) |
| TICKET-012  | Betriebsdokumentation ergänzen           | 3     | Niedrig   | Alle         | 🔲 Offen     |
| TICKET-013  | CEA-708 Caption Export                   | 3     | Niedrig   | Expert       | 🔲 Offen (Phase 3) |
| TICKET-016  | Frontend-Bundlegroesse optimieren        | 2     | P1        | Alle         | 🔲 Offen     |
| TICKET-017  | Hostinger VPS public MVP vorbereiten     | 3     | P0        | Alle         | 🔲 Offen     |
