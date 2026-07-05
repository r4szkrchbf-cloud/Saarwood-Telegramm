# FEHLERBEHEBUNGEN

Fortlaufende Fehlerbehebungs-Dokumentation. Bestehende Eintraege werden niemals geloescht, nur erweitert.

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

## Vorlage fuer weitere Eintraege

## Eintrag YYYY-MM-DD HH:MM (lokale Zeit)
Name: <Name/Agent>
Kontext: <kurze Lagebeschreibung>

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
