<!-- markdownlint-disable MD022 MD032 MD024 -->

# FEHLERBEHEBUNGEN

Fortlaufende Fehlerbehebungs-Dokumentation. Bestehende Eintraege werden niemals geloescht, nur erweitert.

---

## Eintrag 2026-07-06 05:40 (lokale Zeit)
Name: GitHub Copilot mit manuelangel
Kontext: Abschliessender Tiefenscan nach Tier-, Import/Export-, Projektname- und Prompter-Anpassungen.

### Ausgangsbild
- Frontend-Lint, Build und Tests waren gruen.
- Trotzdem wurden im Abschlussscan mehrere mittlere und niedrige Restpunkte identifiziert.

### Gefundene Punkte
1. CSV-Import fuer Scriptdaten validiert Spaltenstruktur nicht streng genug.
2. Projekt-/Sendungsnamen-Presets wirken semantisch wie Bibliothekseintraege, aendern aber beim Anwenden direkt den aktiven Script-Titel.
3. `licenseToken` wird im Frontend persistent gespeichert und ist fuer Public-Betrieb zu sensibel fuer `localStorage`.
4. CSV-Import fuer Projekt-/Sendungsnamen erkennt Header zu tolerant.
5. Support-Client-Logs wachsen serverseitig unbegrenzt in einer Datei.
6. Support-Client-Logs akzeptieren beliebige `source`-Strings.
7. Root-Dokumente (`README.md`, `docs/README.md`, `CHANGELOG.md`) haben noch Markdownlint-Verstoesse.

### Arbeitsplan fuer die Behebung
- Zuerst: Doku dieses Tiefenscans festhalten.
- Dann: CSV-Import und Preset-/Lizenzpfade im Frontend korrigieren.
- Danach: Support-Logging im Backend haerten.
- Zum Schluss: Root-Dokumente formal fuer Markdownlint bereinigen.

### Fortschritt
- Eintrag angelegt.
- Punkte 1, 3, 4, 5 und 6 technisch nachgezogen:
  - CSV-Import validiert Struktur jetzt strenger.
  - `licenseToken` wird nicht mehr per Persist-Middleware im Frontend gespeichert.
  - CSV-Header-Erkennung fuer Projekt-/Sendungsnamen ist robuster.
  - Support-Client-Logs rotieren jetzt dateibasiert bei Groessenlimit.
  - Support-Client-Log-`source` ist jetzt formal eingeschraenkt.
- Punkt 2 fachlich geklaert und im UI sprachlich deutlicher gemacht:
  - Projekt-/Sendungsnamen werden bewusst als aktiver Script-Titel angewendet.
- Root-Dokumente (`README.md`, `docs/README.md`, `CHANGELOG.md`) formal fuer Markdownlint nachgezogen.

---

## Eintrag 2026-07-06 06:58 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Build-Regression nach Vollscan beheben, Testausgabe beruhigen, Doku-Stand fuer die aktuellen Aenderungen synchronisieren.

### Ausgangsproblem
- Frontend-Build brach mit `TS5103` ab:
  - `Invalid value for '--ignoreDeprecations'` in `packages/frontend/tsconfig.json`.
- Gleiche `ignoreDeprecations: "6.0"`-Konfiguration war auch in Backend/Electron gesetzt und damit versionsabhaengig fragil.
- Frontend-Testlauf war zwar gruen, zeigte aber wiederkehrend die Node-Warnung:
  - `ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.`

### Durchgefuehrte Schritte
- `ignoreDeprecations` aus folgenden `tsconfig`-Dateien entfernt:
  - `packages/frontend/tsconfig.json`
  - `packages/backend/tsconfig.json`
  - `packages/electron/tsconfig.json`
- Frontend-Testskripte in `packages/frontend/package.json` angepasst:
  - `test` und `test:watch` laufen jetzt mit
    `NODE_OPTIONS=--localstorage-file=./.vitest-localstorage`.
- Runtime-Datei in Root-`.gitignore` aufgenommen:
  - `packages/frontend/.vitest-localstorage`
- Doku-Updates synchronisiert in `CHANGELOG.md`, `docs/PROJECT_STATUS_DE.md` und `docs/TEST_MVP.md`.

### Ergebnis
- Frontend lint/test/build: PASS.
- Root-Build (Frontend + Backend): PASS.
- Node-`localStorage`-Warnhinweis wird im Standard-Frontend-Testlauf nicht mehr ausgegeben.
- Build-Integritaet fuer die aktuelle Toolchain wiederhergestellt.

### Offene Punkte
- Keine blockierenden Build- oder Testprobleme aus diesem Fehlerbild offen.

### Lessons Learned
- Deprecation-Suppressions muessen exakt zur installierten TypeScript-Version passen, sonst werden sie selbst zum Build-Blocker.
- Testumgebungs-Warnungen sollten proaktiv im Script-Setup entschraerft werden, damit echte Fehler im CI-/QA-Output klar sichtbar bleiben.

---

## Eintrag 2026-07-06 07:15 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Grosser Statuscheck angefordert (Code vs. Doku), inklusive Hostinger-Readiness und Brainstorming-Vorbereitung.

### Ausgangsproblem
- Technischer Zustand war gruen, aber es bestand das Risiko von Code-Doku-Drift vor Public-Beta.
- Speziell `docs/APP_ZUGRIFF_DE.md` enthielt veraltete Angaben zu Repo-URL, Ports und WebSocket-Beispielen.

### Durchgefuehrte Schritte
- Voll-Gate-Lauf erneut verifiziert:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- `APP_ZUGRIFF_DE.md` auf aktuelle Laufzeitrealitaet korrigiert (3000/4000, Health/WS, Repo-URL, Testzaehler).
- Neuer Hostinger-Readiness-Bericht mit Entscheidungsboard/Go-Live-Checkliste erstellt:
  - `docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md`
- Doku-Index (`docs/README.md`) um den neuen Bericht erweitert.

### Ergebnis
- Code und Kern-Doku sind fuer den aktuellen Public-Beta-Stand konsistent.
- Hostinger-Go-Live ist als bedingtes GO eingeordnet (technisch bereit, betriebliche Entscheidungen/Secrets/TLS finalisieren).

### Offene Punkte
- Finale Produktionsentscheidungen im Brainstorming treffen (Routing, Lizenzmodus, Werbemodell Basic, Support-SLA).

### Lessons Learned
- Vor Public-Rollout ist ein Port-/URL-Abgleich zwischen Run-Config und Startdoku Pflicht, sonst entstehen reproduzierbare Fehlstarts trotz gruener Builds.

---

## Eintrag 2026-07-05 02:15 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Migration/Recovery von `saarnews/saarwood_telepromter` nach `r4szkrchbf-cloud/Saarwood-Telegramm`, Stabilisierung des Build-Status und Nachvollziehbarkeit der Fehlerbehebung.

### 1) Ausgangsprobleme
- Zugriff auf urspruengliches Repo/Konto war eingeschraenkt (Mail-Verifikation/Account-Zugang).
- Pushes liefen initial gegen falsche Credentials (`saarnews`) und schlugen mit 403 fehl.
- Workspace lag als RemoteHub/ChangeStore vor, nicht als vollwertiges lokales Git-Repo mit `.git`.
- Produktionsproblem im Frontend-Kontext blieb bestehen (React Runtime #185 als Session-Hintergrundthema).
- Spaeter im synchronisierten Projekt: Frontend-Build fehlerhaft wegen Merge-Conflict-Markern in Quellcode.

### 2) Durchgefuehrte Fehlerbehebungen
- Lokale Projektkopie aus dem VS Code RemoteHub-ChangeStore erstellt.
- Neues Ziel-Repository eingerichtet: `https://github.com/r4szkrchbf-cloud/Saarwood-Telegramm`.
- Git-Remote/Authentifizierung auf neues Konto vorbereitet.
- Separater SSH-Key nur fuer neues Konto erzeugt (`id_ed25519_r4szkrchbf_cloud`) und in GitHub hinterlegt.
- Push ueber SSH erfolgreich gemacht (ohne alte Berechtigungen global zu zerstoeren).
- Vollstaendigen Projektstand aus lokalem RemoteHub-Cache-Archiv (gzip/tar) wiederhergestellt.
- Wiederhergestellten Vollstand mit den neuesten lokal verfuegbaren ChangeStore-Edits ueberlagert.
- Konsolidierten Stand in Ziel-Repo synchronisiert und auf `main` gepusht.

### 3) Relevante technische Nachweise
- Cache-Archiv erkannt als gzip: `cbc272409fda917b90d1ba8a96714cd98c52843c`.
- Wiederhergestellter Vollstand: 68+ Dateien inkl. `packages/backend`, `packages/frontend`, `packages/electron`, `docs`, Root-Konfigurationen.
- Konsolidierter/gesyncter Stand erfolgreich nach GitHub gepusht.
- Commit im Ziel-Repo:
  - `ccea38d` - initialer Snapshot-Import
  - `054ec34` - `sync: import full saarnews app snapshot and latest cached edits`

### 4) Integritaetscheck (heute)
Status: BESTANDEN (Kernstruktur vorhanden)
- Vorhanden und geprueft: Root-Dateien, Doku-Dateien, Backend-Kern, Frontend-Kern, Electron-Kern.
- Beispiele gepruefter Kernpfade:
  - `packages/backend/src/server.ts`
  - `packages/backend/src/mos/MosHandler.ts`
  - `packages/frontend/src/App.tsx`
  - `packages/frontend/src/components/Settings/SettingsPanel.tsx`
  - `packages/frontend/src/store/prompterStore.ts`

### 5) Build-Check (heute)
- Backend-Build: ERFOLGREICH (`npm run build --workspace=packages/backend`).
- Frontend-Build: FEHLGESCHLAGEN wegen echter Merge-Conflict-Marker.

Betroffene Dateien mit Konfliktmarkern:
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx`
- `packages/frontend/src/store/prompterStore.ts`

Fehlerbild:
- TypeScript meldet `TS1185: Merge conflict marker encountered` sowie Folgefehler in JSX/TS-Syntax.

### 6) Aktueller Projektstatus nach heutigem Chat
- Repository-Migration: abgeschlossen.
- Vollstaendiger wiederherstellbarer Stand: in neuem Repo vorhanden.
- Dokumentation der Behebung: diese Datei angelegt.
- Offene technische Arbeit:
  - Konfliktmarker in den 3 Frontend-Dateien aufloesen.
  - Danach Frontend-Build erneut ausfuehren und verifizieren.
  - Optional: anschliessend Vercel-Deployment und Live-Check.

### 7) Lessons Learned (fuer naechste Entwicklungen)
- Bei RemoteHub-Workspaces immer pruefen, ob `.git` lokal fehlt; sonst Recovery ueber Cache/Archive planen.
- Fuer Account-Wechsel SSH mit separatem Key nutzen, um alte Zugriffe nicht zu zerstoeren.
- Vor Build/Deploy zwingend auf Merge-Conflict-Marker pruefen (`<<<<<<<`, `=======`, `>>>>>>>`).
- Integritaetscheck vor Build spart Zeit bei grossen Migrationen.

---

## Eintrag 2026-07-05 02:40 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Gewuenschte Reihenfolge umgesetzt: (1) 3 Konfliktdateien aufraeumen, (2) Frontend-Build erneut starten, (3) Ergebnis in FEHLERBEHEBUNGEN dokumentieren.

### Ausgangsproblem
- Frontend-Build schlug wegen Merge-Konfliktmarkern fehl.
- Betroffene Dateien:
  - `packages/frontend/src/App.tsx`
  - `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx`
  - `packages/frontend/src/store/prompterStore.ts`

### Durchgefuehrte Schritte
- Konfliktmarker in allen drei Ziel-Dateien entfernt.
- `App.tsx` in den Konfliktbereichen logisch konsolidiert (Display-Selektoren + Demo-Initialisierung repariert).
- `PrompterDisplay.tsx` Konflikt in Segment-Mapping aufgeloest.
- `prompterStore.ts` Persist-Key-Konflikt konsolidiert.
- Marker-Check ausgefuehrt: kein Treffer mehr auf `<<<<<<<`, `=======`, `>>>>>>>` in den drei Ziel-Dateien.
- Frontend-Build erneut ausgefuehrt: `npm run build --workspace=packages/frontend`.

### Ergebnis
- Schritt 1 erfolgreich: Die drei Konfliktdateien sind konfliktmarkerfrei.
- Schritt 2 teilweise erfolgreich: Build laeuft jetzt weiter als zuvor, stoppt aber an verbleibenden TypeScript-Fehlern (nicht mehr durch Merge-Marker verursacht).
- Aktuelle Build-Fehler:
  - `packages/frontend/src/components/Controls/ControlPanel.tsx` (Name `display` nicht gefunden)
  - `packages/frontend/src/components/Editor/ScriptEditor.tsx` (implizites `any` bei `editor: ed`)

### Offene Punkte
- Obige 3 TypeScript-Fehler beheben.
- Danach Frontend-Build erneut verifizieren.

### Lessons Learned
- Nach Konfliktbereinigung immer sofort Marker-Scan und Rebuild kombinieren.
- Konfliktfreiheit bedeutet nicht automatisch Build-Freiheit; Folgefehler separat adressieren.

---

## Eintrag 2026-07-05 02:52 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Fehler `The terminal process "/bin/zsh '-l'" terminated with exit code: 2` analysiert und verbleibende TypeScript-Fehler im Frontend behoben.

### Ausgangsproblem
- Terminal meldete Exit Code 2.
- Frontend-Build brach mit TypeScript-Fehlern ab (3 verbleibende Fehler nach Konfliktbereinigung).

### Durchgefuehrte Schritte
- Fehlerursache validiert: Exit Code 2 kam vom fehlgeschlagenen Build-Command, nicht von zsh selbst.
- `packages/frontend/src/components/Controls/ControlPanel.tsx` korrigiert:
  - Rotation-Anzeige von nicht existierendem `display.rotation` auf `rotation` umgestellt.
- `packages/frontend/src/components/Editor/ScriptEditor.tsx` korrigiert:
  - `onUpdate`-Callback mit expliziter Typannotation versehen, um `implicit any` zu beseitigen.
- Frontend-Build erneut ausgefuehrt.

### Ergebnis
- Frontend-Build ist erfolgreich (gruen):
  - `npm run build --workspace=packages/frontend`
  - Vite Build + PWA-Generierung abgeschlossen.
- Exit-Code-2-Ursache beseitigt (Command laeuft nun erfolgreich durch).

### Offene Punkte
- Keine blockierenden TypeScript-Fehler im Frontend mehr.

### Lessons Learned
- Exit Code 2 bei zsh ist haeufig ein Folgefehler eines fehlgeschlagenen Build-Tools.
- Nach jeder Konfliktbereinigung sofort typpruefen und Build starten.

---

## Eintrag 2026-07-05 02:55 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Vollstaendiger Doku-Abgleich auf den aktuellen Code- und Teststand, Erstellung eines neuen Statusberichts fuer MVP-LAN-Readiness.

### Ausgangsproblem
- Dokumentationsstand war teilweise historisch korrekt, aber nicht mehr voll synchron zum aktuellen technisch gemessenen Zustand.
- Speziell: Frontend-Teststatus war in Alt-Dokumentation zu positiv dargestellt.

### Durchgefuehrte Schritte
- `PROJECT_STATUS_DE.md` komplett auf aktuellen Stand gebracht (Build/Test/LAN-Prioritaeten).
- `TEST_MVP.md` um Runde 2 erweitert (Frontend-Test FAIL, Backend-Test PASS, Build PASS).
- `BACKLOG.md` um P0-Hotfix-Block fuer MVP-Langzeittest erweitert.
- Neuer Bericht angelegt: `STATUSBERICHT_MVP_LAN_DE_2026-07-05.md`.
- Divergenzen zwischen Code und Doku systematisch beschrieben (inkl. Ursachen).

### Ergebnis
- Dokumentation ist jetzt auf den aktuellen gemessenen Ist-Stand gezogen.
- MVP-Prioritaet klar: App laeuft/buildet, aber Frontend-Testharness ist P0 vor stabilem Feldbetrieb.

### Offene Punkte
- `TICKET-013`: Frontend-Testharness fuer persistierten Zustand stabilisieren.
- Danach erneuter Voll-Gate-Lauf und Go/No-Go fuer Pilot-Langzeittest.

### Lessons Learned
- Nach Migrations-/Recovery-Phasen muss ein expliziter Doku-Refresh Pflichtschritt sein.
- Build-Gruen und Test-Gruen sind getrennte Signale; beide muessen dokumentiert werden.

---

## Eintrag 2026-07-05 02:45 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: P0-Fix fuer Frontend-Testharness und finaler Voll-Gate-Lauf fuer MVP-LAN-Go/No-Go.

### Ausgangsproblem
- Frontend-Testlauf brach in `prompterStore.test.ts` mit
  `TypeError: Cannot read properties of undefined (reading 'setItem')` ab.

### Durchgefuehrte Schritte
- Persist-Storage im Frontend-Store robust fuer Test-/Nicht-Browser-Kontexte gemacht.
- Danach Frontend-Tests separat erneut ausgefuehrt.
- Anschliessend kompletter Gate-Lauf:
  - Frontend Build
  - Backend Build
  - Frontend Tests
  - Backend Tests

### Ergebnis
- Frontend Tests: PASS (25/25)
- Backend Tests: PASS (9/9)
- Frontend Build: PASS
- Backend Build: PASS
- Go/No-Go fuer MVP-Langzeittest: GO

### Offene Punkte
- Build-Warnung zur Bundle-Groesse bleibt als nicht-blockierender Performance-Punkt im Backlog.

### Lessons Learned
- Persistente Stores brauchen explizit testfeste Storage-Strategie.
- Nach jedem P0-Fix sofort Voll-Gate laufen lassen, bevor Go/No-Go entschieden wird.

---

## Eintrag 2026-07-05 00:57 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Erster Live-Test direkt im Browser, inklusive sichtbarer Bedienung und Runtime-Diagnose.

### Ausgangsproblem
- Frontend konnte starten, fiel aber im Browser in einen React-Loop:
  - `Maximum update depth exceeded`
  - `getSnapshot should be cached`
- Parallel trat beim Dev-Start temporaer ein Abhaengigkeitsproblem auf:
  - `@tiptap/core/dist/index.js.map` mit `Unterminated string literal`.

### Durchgefuehrte Schritte
1. Paketintegritaet wiederhergestellt (`@tiptap/core` neu installiert/ersetzt).
2. Store-Subscriptions stabilisiert:
   - `SettingsPanel`: Ganz-Store-Subscription entfernt, auf Einzel-Selectoren umgestellt.
   - `useHotkeyManager`: Objekt-Selector entfernt, auf Einzel-Selectoren umgestellt.
3. Browser neu geladen und Live-Bedientest durchgefuehrt:
   - Verbindung verbunden
   - Speed angepasst
   - Rotation und Mirror getestet
   - Skript-Titel gesetzt und Segment hinzugefuegt
4. Frontend-Testlauf nach Fix erneut ausgefuehrt (PASS).

### Ergebnis
- Runtime-Loop behoben, App wieder bedienbar.
- Erster sichtbarer Live-Smoke-Test erfolgreich.
- Frontend-Tests weiterhin gruen (25/25).

### Offene Punkte
- Nicht-blockierende Tiptap-Warnung bleibt: `Duplicate extension names: ['underline']`.

### Lessons Learned
- In Zustand v5 verursachen Ganz-Store- oder Objekt-Selectoren leicht Re-Render-Loops.
- Fuer stabile Runtime in React 18 besser selektiv und granular subscriben.

---

## Eintrag 2026-07-05 01:03 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Live-Vorfuehrung des Prompters von A bis Z im Browser.

### Durchgefuehrt
- App im Browser gezeigt und von der lokalen Entwicklungsinstanz aus bedient.
- Settings-Panel ausgeblendet, um die Bedienung klar zu halten.
- Zwischen Editor, Split und Prompter gewechselt.
- Titel, Segmentanlage und Text-Eingabe demonstriert.
- Transport und Anzeige im Prompter live getestet (Play, Speed, Rotation, Mirror, Stop).

### Ergebnis
- Kernworkflow funktioniert sichtbar und nachvollziehbar.
- Testphase ist weiterhin offen, da ASR/Voice Tracking noch Fehler erzeugt.

### Offene Punkte
- ASR meldet weiterhin `network`-Warnungen.
- SpeechRecognition erzeugt wiederholt `recognition has already started`.
- Sprachsteuerung muss separat stabilisiert werden, bevor der Testzyklus abgeschlossen ist.

### Lessons Learned
- Die App ist fuer die manuelle Vorfuehrung brauchbar.
- Sprachfeatures sind noch nicht betriebssicher und bleiben Testthema.

---

## Eintrag 2026-07-05 13:20 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Transparente Repo-Konsolidierung auf dem iMac, Verzeichnis-Aufraeumen, finaler Commit und Push nach GitHub.

### Ausgangsproblem
- Es existierten parallel mehrere Projektordner (`saarwood_telepromter_local`, `Saarwood-Telegramm-sync`, `saarwood_telepromter_from_cache`).
- Dadurch bestand Risiko fuer Drift (uneinheitlicher Stand, doppelte Bearbeitung, unklare Quelle des finalen Codes).
- Push war initial blockiert durch SSH-Auth-Fehler (`Permission denied (publickey)`).

### Durchgefuehrte Schritte
- Alle relevanten Desktop-Verzeichnisse gescannt und gegeneinander verglichen (Struktur, Git-Zustand, Dateidiffs).
- Veralteten Cache-Ordner geloescht: `saarwood_telepromter_from_cache`.
- Projektinhalte vereinheitlicht und auf einen Hauptordner festgelegt: `saarwood_telepromter_local`.
- Duplikat-Ordner geloescht: `Saarwood-Telegramm-sync`.
- Offene Doku-Aenderungen committed (`c34109a`).
- SSH-Zugang repariert: korrekten Schluessel identifiziert und GitHub-Auth verifiziert.
- Push nach GitHub erfolgreich durchgefuehrt.
- Remote wieder auf Standardformat `git@github.com:...` zurueckgestellt und final getestet.

### Ergebnis
- Es gibt nur noch einen aktiven Teleprompter-Projektordner auf dem Desktop.
- Lokaler und Remote-Stand sind synchron (`main` == `origin/main`).
- Der Verlauf der Konsolidierung ist dokumentiert in:
  - `docs/STATUSBERICHT_REPO_SYNC_DE_2026-07-05.md`

### Offene Punkte
- Keine offenen Git-Sync- oder Verzeichnis-Konsolidierungsprobleme.
- Fachlich bleibt ASR/Voice-Tracking weiterhin separater Test-/Stabilisierungspunkt.

### Lessons Learned
- Bei mehrfachen Arbeitskopien zuerst immer den kanonischen Git-Stand bestimmen, dann auf einen Hauptordner reduzieren.
- Vor dem Push Auth-Handshake gezielt pruefen (`ssh -T git@github.com`), um Iterationen zu sparen.

---

## Eintrag 2026-07-05 13:20 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Vorbereitung der naechsten gemeinsamen Testsession inkl. frischer Gate-Validierung.

### Ausgangsproblem
- Test/Lint/Build waren initial lokal instabil trotz vorher gruener Historie.
- Fehlende Module in `node_modules` fuehrten zu falschen roten Signalen:
  - `Cannot find module 'xml-name-validator'` (Vitest/jsdom)
  - `Cannot find module 'yocto-queue'` (ESLint)

### Durchgefuehrte Schritte
- Lokale Abhaengigkeiten vollstaendig neu installiert (`rm -rf node_modules && npm ci`).
- Danach kompletter Gate-Lauf erneut:
  - `npm test`
  - `npm run lint`
  - `npm run build`
- Dev-Server fuer Live-Test gestartet (`npm run dev` mit Frontend + Backend).

### Ergebnis
- Frontend Tests: 25/25 PASS
- Backend Tests: 9/9 PASS
- Lint Frontend/Backend: PASS
- Build Frontend/Backend: PASS
- Bekannte nicht-blockierende Warnung bleibt: Frontend-Chunk > 500 kB.

### Offene Punkte
- ASR/Voice-Tracking bleibt das aktive Testthema fuer die naechste gemeinsame Runde.

### Lessons Learned
- Bei ploetzlichen Modulfehlern zuerst Installation deterministisch ueber Lockfile neu aufbauen.
- Erst nach sauberem Baseline-Gate mit funktionierender Dev-Instanz in Live-Tests gehen.

---

## Eintrag 2026-07-06 22:59 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Akutfix fuer Mehrnutzer-Kopplung und Scroll-Stottern im Livebetrieb.

### Ausgangsproblem
- Alle verbundenen Clients teilten dieselbe globale Teleprompter-Instanz (kein Session-Scope).
- Hohe Sync-Frequenz und Echo-Traffic erhoehten Last/Jitter-Risiko.

### Durchgefuehrte Schritte
- Backend-WebSocket auf room-scoped Betrieb umgestellt (`?room=...`).
- Serverzustand pro room isoliert (`SYNC_STATE` nicht mehr global).
- Frontend-WebSocket um room/channel Steuerung erweitert.
- App so angepasst, dass room in URL persistiert und Output-Fenster denselben room uebernimmt.
- Output-only Clients von aktiver Ruecksynchronisierung entkoppelt (`SCRIPT_UPDATE`, `SETTINGS_UPDATE`, `SET_POSITION`).
- Positions-Sync bei laufendem Scroll staerker gedrosselt.
- Verifikation durch Build + Frontend-/Backend-Tests.

### Ergebnis
- Build: PASS
- Frontend Tests: PASS (30/30)
- Backend Tests: PASS (9/9)
- Globales Cross-Session-Mirroring technisch aufgehoben.

### Offene Punkte
- Produktiver Live-Mehrclient-Smoke-Test mit zwei getrennten rooms steht als naechster Nachweis aus.
- Optional: harte Controller-Only-Regel fuer `SET_POSITION` als zusaetzliche Sicherung.

### Lessons Learned
- Sessiongrenzen muessen explizit im Transportprotokoll und nicht nur im UI modelliert werden.
- Output-/Viewer-Clients sollten passiv bleiben, um Steuerkanaele nicht unnötig zu belasten.

---

## Eintrag 2026-07-06 23:58 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Lizenz-Haertung fuer Offline-Betrieb und operative Vollkontrolle (Ausgabe/Ablauf/Sperrung).

### Ausgangsproblem
- Offline-Aktivierung war bislang nur payload-basiert plausibilisiert und nicht kryptografisch verifiziert.
- Nach Offline-Neustart konnte der Lizenzfluss inkonsistent sein, weil relevante Lizenzdaten nicht persistiert waren.

### Durchgefuehrte Schritte
- Frontend: kryptografische Offline-Pruefung implementiert (Ed25519-Signatur via `jose`).
- Frontend: Lizenz-Token und gecachter Public Key in Persist-Store aufgenommen.
- Backend: `publicKeyPem` in `/api/license/status` und `/api/license/activate` auslieferbar gemacht.
- Deploy auf VPS inkl. Rebuild/Restart.
- Live-E2E geprueft (Controller + Output mit identischem room, Titel-Sync sichtbar).

### Ergebnis
- Frontend Tests: PASS (30/30)
- Backend Tests: PASS (9/9)
- Monorepo Build: PASS
- Live Health: PASS (`/api/health`)
- Offline-Modus akzeptiert nur noch kryptografisch verifizierbare Tokens (bei vorhandenem gecachtem Public Key).

### Offene Punkte
- Erstaktivierung im komplett internetlosen Zustand bleibt absichtlich gesperrt, bis einmal online Public-Key-Cache aufgebaut wurde.
- Harte Revocations greifen offline naturgemaess erst bei naechster Online-Verbindung.

### Lessons Learned
- Offline-Lizenznutzung braucht explizite Vertrauenskette (Signatur + Key-Cache), sonst entsteht Schein-Sicherheit.
- Fuer Feldkontrolle von "im Markt" befindlichen Instanzen ist die Kombination aus kurzer Token-Laufzeit und kurzer Offline-Gnadenfrist entscheidend.

---

## Vorlage fuer weitere Eintraege

---

## Eintrag 2026-07-07 00:00 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Produktionshaertung fuer Reverse-Proxy-Betrieb und Support-Logschreiben auf VPS.

### Ausgangsproblem
- Express-Rate-Limit meldete Warnung bei `X-Forwarded-For`, weil `trust proxy` nicht gesetzt war.
- Support-Client-Logs konnten wegen fehlender Dateirechte unter `backend/data` nicht geschrieben werden (`EACCES`).

### Durchgefuehrte Schritte
- Backend angepasst: `trust proxy` konfigurierbar gemacht (`TRUST_PROXY`, Production-Default auf `1`).
- VPS-Betriebsschritt festgelegt und ausgefuehrt: Besitz und Schreibrechte fuer `backend/data` auf Service-User korrigiert.
- Rebuild und Service-Restart auf dem VPS durchgefuehrt.

### Ergebnis
- Backend laeuft hinter nginx ohne die bisherige `X-Forwarded-For`-RateLimit-Fehlwarnung.
- Support-Logpfad ist wieder beschreibbar.
- Health-Endpunkte auf Haupt- und Alias-Domain liefern `200 OK`.

### Offene Punkte
- Optional: `TRUST_PROXY` explizit in `.env.production` dokumentieren, falls Topologie kuenftig geaendert wird.

### Lessons Learned
- Reverse-Proxy-Setups brauchen konsistente Proxy-Vertrauenskonfiguration auf App-Ebene.
- Schreibpfade fuer Laufzeitdaten muessen nach Deployments weiterhin dem Laufzeit-User gehoeren.

---

## Eintrag 2026-07-07 01:05 (lokale Zeit)
Name: GitHub Copilot (GPT-5.3-Codex) mit manuelangel
Kontext: Klarstellung zur angefragten Leistenoptimierung auf Tablet/Desktop.

### Ausgangsproblem
- Die zuvor implementierte einklappbare App-Leiste (Header/Controls) war ein Missverstaendnis.
- Gewuenscht war die Browserleiste (Tabs/Adresszeile), nicht die interne App-Bedienleiste.

### Durchgefuehrte Schritte
- In-App-Einklappfunktion in Frontend-Layoutdateien vollstaendig rueckgaengig gemacht.
- Nutzerdoku entsprechend korrigiert.
- Browserleisten-Optimierung fuer Tablet und separates Smartphone-Layout als Backlog-Themen erfasst.

### Ergebnis
- UI-Verhalten ist wieder wie vor der missverstandenen Aenderung (stabiler letzter gewuenschter Stand).
- Zukuenftige Layoutarbeit ist sauber als Folgeplanung dokumentiert.

### Offene Punkte
- Browser-UI kann in reiner Web-App technisch nicht hart ausgeblendet werden; fuer spaetere Versionen sind PWA-/Fullscreen-/Native-Strategien zu bewerten.

### Lessons Learned
- Bei "Leiste" immer explizit zwischen Browser-Chrome und App-UI unterscheiden, bevor UI-Verhalten geaendert wird.

## Eintrag YYYY-MM-DD HH:MM (lokale Zeit)
Name: <Name/Agent>
Kontext: [kurze Lagebeschreibung]

### Ausgangsproblem
- ...

### Durchgefuehrte Schritte
- ...

### Ergebnis
- ...

### Offene Punkte
- ...

### Lessons Learned
- ...
