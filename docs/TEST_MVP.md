<!-- markdownlint-disable MD007 MD010 MD022 MD024 MD029 MD031 MD032 MD036 MD040 MD060 -->

# Saarwood Teleprompter — MVP Test Log

> **Zweck:** Lückenlose, nachvollziehbare Dokumentation aller MVP-Testrunden.  
> Jeder Eintrag enthält Datum, Uhrzeit (UTC), Testergebnis, Fehler und Hinweise.  
> Dieses Dokument wird nach jeder Testrunde aktualisiert, bis die MVP **fehlerfrei** läuft.

---

## Testmethodik

| Kategorie | Befehl | Scope |
|-----------|--------|-------|
| Unit-Tests Frontend | `npm run test --workspace=packages/frontend` | Vitest — prompterStore, webSocketService, speechRecognition |
| Unit-Tests Backend | `npm run test --workspace=packages/backend` | Vitest — mosHandler, ndiAdapter |
| TypeScript Frontend | `cd packages/frontend && npx tsc --noEmit` | Vollständige Typenprüfung |
| TypeScript Backend | `cd packages/backend && npx tsc --noEmit` | Vollständige Typenprüfung |
| Lint Frontend | `npm run lint --workspace=packages/frontend` | ESLint, max-warnings 0 |
| Lint Backend | `npm run lint --workspace=packages/backend` | ESLint, max-warnings 0 |
| Build gesamt | `npm run build` | Vite (Frontend) + tsc (Backend) |

---

## Runde 1 — 2026-07-04 02:12 UTC

### Übersicht

| Kategorie | Ergebnis | Fehler | Warnungen |
|-----------|----------|--------|-----------|
| Unit-Tests Frontend | ✅ PASS | 0 | 0 |
| Unit-Tests Backend | ✅ PASS | 0 | 0 |
| TypeScript Frontend | ✅ PASS | 0 | 0 |
| TypeScript Backend | ✅ PASS | 0 | 0 |
| Lint Frontend | ✅ PASS | 0 | 0 |
| Lint Backend | ✅ PASS | 0 | 0 |
| Build Frontend (Vite) | ✅ PASS | 0 | 1 ⚠️ |
| Build Backend (tsc) | ✅ PASS | 0 | 0 |

**Gesamtergebnis:** ✅ **ALLE CHECKS BESTANDEN** — 1 Build-Warning (kein Fehler)

---

### Detailergebnisse

#### 1.1 Unit-Tests Frontend — ✅ PASS
**Startzeit:** 02:11:59 UTC  
**Dauer:** 2.85 s

| Testdatei | Tests | Status |
|-----------|-------|--------|
| `src/test/prompterStore.test.ts` | 14 | ✅ |
| `src/test/webSocketService.test.ts` | 5 | ✅ |
| `src/test/speechRecognition.test.ts` | 6 | ✅ |

**Gesamt: 25/25 Tests bestanden**

---

#### 1.2 Unit-Tests Backend — ✅ PASS
**Startzeit:** 02:11:59 UTC  
**Dauer:** 971 ms

| Testdatei | Tests | Status |
|-----------|-------|--------|
| `src/test/mosHandler.test.ts` | 5 | ✅ |
| `src/test/ndiAdapter.test.ts` | 4 | ✅ |

**Gesamt: 9/9 Tests bestanden**

> MOS-Tests zeigen erwartete `[MOS]`-Konsolenausgaben (TCP-Verbindungslog) — kein Fehler.  
> NDI-Tests zeigen `[NDI-STUB]`-Ausgaben — kein Fehler (Stub-Verhalten korrekt).

---

#### 1.3 TypeScript — ✅ PASS (beide Pakete)

| Paket | Fehler | Exit-Code |
|-------|--------|-----------|
| Frontend (`packages/frontend`) | 0 | 0 |
| Backend (`packages/backend`) | 0 | 0 |

---

#### 1.4 Lint — ✅ PASS (beide Pakete)

| Paket | Warnungen | Exit-Code |
|-------|-----------|-----------|
| Frontend (`packages/frontend`) | 0 | 0 |
| Backend (`packages/backend`) | 0 | 0 |

---

#### 1.5 Build — ✅ PASS (mit 1 Warning)

**Frontend (Vite 6):**

```
vite v6.4.3 building for production...
✓ 107 modules transformed.
dist/registerSW.js                0.13 kB
dist/manifest.webmanifest         0.48 kB
dist/index.html                   0.79 kB │ gzip:   0.42 kB
dist/assets/index-d-dT0Nyd.css    9.92 kB │ gzip:   2.59 kB
dist/assets/index-CViwy9Ar.js   619.57 kB │ gzip: 199.13 kB
✓ built in 4.00 s
PWA v0.21.2 — precache 5 entries (615.63 KiB)
```

⚠️ **Warning: Chunk-Größe > 500 kB**  
`dist/assets/index-CViwy9Ar.js` ist 619.57 kB (minifiziert) / 199.13 kB (gzip).  
Vite empfiehlt Code-Splitting via dynamic `import()` oder `manualChunks`.  
→ **Kein Blocker für MVP**, aber Backlog-Kandidat für Performance-Optimierung.

**Backend (tsc):**
```
tsc — Exit 0, keine Ausgabe (sauber)
```

---

### Bewertung Runde 1

- **Keine Fehler** in Tests, TypeScript oder Lint.
- **1 Build-Warning** (Chunk-Größe) — kein Funktionsfehler, kein MVP-Blocker.
- MVP-Codebasis ist in einem **sauberen, produktionsreifen Zustand**.

### Offene Punkte nach Runde 1

| # | Kategorie | Beschreibung | Priorität |
|---|-----------|-------------|-----------|
| W-01 | Build-Warning | JS-Bundle > 500 kB (619 kB min / 199 kB gzip). Code-Splitting via Vite `manualChunks` prüfen. | Niedrig (Performance) |

---

## Runden-Übersicht (Gesamtstatus)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Lint | TypeScript | Ergebnis |
|-------|----------------------|-------|-------|------|------------|---------|
| 1 | 2026-07-04 02:12 | ✅ 34/34 | ✅ (1⚠️) | ✅ | ✅ | **GRÜN** |

---

_Dieses Dokument wird nach jeder weiteren Testrunde mit neuen Eintraegen ergaenzt._

---

## Runde 2 — 2026-07-05 02:34 UTC

### Uebersicht

| Kategorie | Ergebnis | Fehler | Warnungen |
|-----------|----------|--------|-----------|
| Unit-Tests Frontend | FAIL | 14 | 0 |
| Unit-Tests Backend | PASS | 0 | 0 |
| TypeScript Frontend | PASS | 0 | 0 |
| TypeScript Backend | PASS | 0 | 0 |
| Build Frontend (Vite) | PASS | 0 | 1 |
| Build Backend (tsc) | PASS | 0 | 0 |

Gesamtergebnis: Build gruen, Tests teilweise rot.

### Detailergebnisse

1. Frontend Tests
- Datei: `src/test/prompterStore.test.ts`
- Ergebnis: 14/14 fehlgeschlagen
- Leitfehler: `TypeError: Cannot read properties of undefined (reading 'setItem')`
- Befund: Persist/Storage-Verhalten im Testkontext ist nicht stabil.

2. Backend Tests
- Ergebnis: 9/9 bestanden (`mosHandler`, `ndiAdapter`).

3. Build
- Frontend Build erfolgreich inkl. PWA-Artefakte.
- Backend Build erfolgreich.

### Bewertung Runde 2

- Runtime-Basis fuer MVP-LAN-Test ist gegeben (Builds gruen).
- Testharness im Frontend ist aktuell inkonsistent und muss als P0 korrigiert werden.

### Offene Punkte nach Runde 2

| ID | Thema | Beschreibung | Prioritaet |
|----|-------|--------------|------------|
| T-01 | Frontend-Testharness | Persist/Storage im Vitest-Setup fuer `prompterStore.test.ts` stabilisieren | Hoch |
| W-01 | Bundle-Groesse | Chunk-Warnung > 500 kB, spaeteres Code-Splitting | Niedrig |

---

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |

---

## Runde 3 — 2026-07-05 02:44 UTC

### Uebersicht

| Kategorie | Ergebnis | Fehler | Warnungen |
|-----------|----------|--------|-----------|
| Unit-Tests Frontend | PASS | 0 | 0 |
| Unit-Tests Backend | PASS | 0 | 0 |
| Build Frontend (Vite) | PASS | 0 | 1 |
| Build Backend (tsc) | PASS | 0 | 0 |

Gesamtergebnis: Alle Gates gruen, nur bekannte Build-Warnung zur Bundle-Groesse.

### Detailergebnisse

1. Frontend Tests
- Ergebnis: 25/25 bestanden.
- P0-Fix wirksam: Persist/Storage-Kontext fuer `prompterStore` ist stabil.

2. Backend Tests
- Ergebnis: 9/9 bestanden.

3. Build
- Frontend Build erfolgreich inkl. PWA-Artefakte.
- Backend Build erfolgreich.

### Finaler Go/No-Go Eintrag (MVP-Langzeittest)

- Entscheidung: GO
- Begruendung: Vollstaendiger Gate-Lauf (Frontend/Backend Build + Tests) ist gruen.
- Restrisiko: Performance-Warnung (Bundle > 500 kB), fuer MVP-LAN nicht blockierend.

## Runden-Uebersicht (neu)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |

---

## Runde 4 — 2026-07-05 00:57 UTC (Erster Live-Smoke-Test im Browser)

### Ziel

Ersten realen Bedien-Test direkt in der laufenden Browser-Instanz durchfuehren und gleichzeitig technische Stabilitaet verifizieren.

### Beobachteter Startzustand

- Frontend startete, aber Runtime blockierte durch React-Fehler:
	- `Maximum update depth exceeded`
	- Hinweis: `The result of getSnapshot should be cached...`
- Zusaetzlich war bei erstem Start eine defekte Source-Map in `@tiptap/core` sichtbar (`Unterminated string literal` in `index.js.map`).

### Durchgefuehrte Behebungen waehrend des Tests

1. Abhaengigkeit repariert:
- `@tiptap/core` neu installiert/ersetzt, damit Vite wieder stabil startet.

2. Runtime-Loop behoben:
- `SettingsPanel` von Ganz-Store-Subscription auf stabile Einzel-Selectoren umgestellt.
- `useHotkeyManager` von Objekt-Selector auf stabile Einzel-Selectoren umgestellt.

### Live-Bedientest (im Browser sichtbar durchgefuehrt)

- Verbindung: Status wechselte auf `Remote control connected`.
- Steuerung:
	- Play/Stop ausgefuehrt
	- Speed von 80 auf 85 erhoeht
	- Rotation auf 90° gesetzt
	- H-Mirror aktiviert
- Editor:
	- Titel gesetzt: `LAN Pilot Test Runde 1`
	- Neues Segment hinzugefuegt

### Validierung nach Fix

- Frontend-Tests erneut ausgefuehrt: PASS (25/25)

### Ergebnis Runde 4

- Ergebnis: PASS (mit bekannten nicht-blockierenden Warnungen)
- Bewertung: Erster Live-Smoke-Test erfolgreich durchgefuehrt.
- Offene Warnungen:
	- Tiptap meldet weiterhin `Duplicate extension names: ['underline']` (kein Blocker, aber bereinigen).

## Runden-Uebersicht (aktuell)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |

---

## Runde 5 — 2026-07-05 01:03 UTC (Live-Vorfuehrung A bis Z)

### Ziel

Den Prompter von der Bedienung her einmal komplett live vorfuehren, um den realen Workflow sicht- und nachvollziehbar zu pruefen.

### Durchgefuehrte Schritte

1. App im Browser gestartet und Zustand geprueft.
2. Settings-Panel geschlossen, damit die Demo frei bedienbar bleibt.
3. Zwischen `Editor`, `Split` und `Prompter` gewechselt.
4. Script-Titel auf `A bis Z Live Demo` gesetzt.
5. Neues Segment angelegt und Text eingefuegt.
6. Im Prompter `Play`, Speed +5, Rotation +90° und H-Mirror getestet.
7. Danach `Stop and reset` ausgefuehrt.

### Beobachtungen

- Der Kern-Workflow funktioniert sichtbar und interaktiv.
- Editor-Inhalt erscheint im Prompter live.
- Steuerung, Rotation und Spiegelung reagieren korrekt.
- Voice Tracking / ASR erzeugt weiterhin Laufzeitwarnungen und Fehler (`network`, `recognition has already started`).

### Bewertung Runde 5

- Ergebnis: Teilweise erfolgreich, funktionaler Kernlauf ok.
- Status: Vorfuehrung erfolgreich, aber Testphase noch nicht abgeschlossen.
- Offene Punkte: ASR-Stabilitaet und Sprachsteuerung muessen weiter untersucht werden.

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |

---

## Runde 6 — 2026-07-05 13:20 UTC (Baseline-Reparatur und Testvorbereitung)

### Ziel

Vor dem naechsten gemeinsamen Testfenster den lokalen Zustand sauber herstellen und alle Gates erneut validieren.

### Ausgangsproblem

- Test/Lint liefen initial nicht stabil, weil lokale Node-Module unvollstaendig waren.
- Typische Fehlerbilder:
	- `Cannot find module 'xml-name-validator'` (Vitest/jsdom)
	- `Cannot find module 'yocto-queue'` (ESLint)

### Durchgefuehrte Schritte

1. Abhaengigkeiten deterministisch neu aufgebaut (`rm -rf node_modules && npm ci`).
2. Voller Gate-Lauf erneut ausgefuehrt:
	 - `npm test`
	 - `npm run lint`
	 - `npm run build`
3. Dev-Umgebung fuer gemeinsamen Live-Test gestartet (`npm run dev`).

### Ergebnis

- Frontend Tests: PASS (25/25)
- Backend Tests: PASS (9/9)
- Lint Frontend/Backend: PASS
- Build Frontend/Backend: PASS
- Bekannte Restwarnung bleibt: Frontend-Chunk > 500 kB (kein MVP-Blocker)
- Live-Setup laeuft:
	- Frontend: `http://localhost:3000/`
	- Backend: Port `4000`, WebSocket unter `/ws`

### Bewertung Runde 6

- Ergebnis: PASS (GRUEN)
- Testbetrieb kann direkt fortgesetzt werden.
- Fokus fuer naechste gemeinsame Runde bleibt ASR/Voice-Tracking-Stabilitaet.

## Runden-Uebersicht (neu)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |

---

## Runde 7 - 2026-07-05 11:50 UTC (Zwischenstand nach 3 Testpunkten)

### Ziel

Zwischenstand waehrend des laufenden manuellen Testzyklus dokumentieren und verbindlich speichern.

### Durchgefuehrte Testpunkte seit letztem Speicherstand

1. Testpunkt 3.1 Kernsteuerung (Play/Stop): PASS
2. UX-Sicherheitspruefung Reset:
	- Hover auf Reset loest nichts aus: PASS
	- Zweistufige Bestaetigung aktiv (Confirm reset): PASS
3. UX-Pruefung Settings-Panel:
	- Panel ueber expliziten Close-Button einklappbar: PASS

### Ergebnis Runde 7

- Ergebnis: PASS (GRUEN)
- Blocker: keine neuen Blocker bis hierhin
- Offene fachliche Folgepruefung: Testpunkt 3.2 (Speed + Direction) als naechster Schritt

### Verbindliche Testregel (ab jetzt)

Nach spaetestens 3 abgearbeiteten Testpunkten wird ein Zwischenstand in der Doku festgehalten und gespeichert.

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |

---

## Runde 8 - 2026-07-05 11:53 UTC (Bedingung 3.2 - Checkpoint 1)

### Ziel

Bedingung 3.2 (Speed + Direction) mit den ersten drei Testpunkten verifizieren und den Zwischenstand gemaess 3-Punkte-Regel speichern.

### Durchgefuehrte Testpunkte

1. Speed minus (Button "-"):
	- Startwert 80 px/s
	- Nach Klick 75 px/s
	- Ergebnis: PASS

2. Speed plus (Button "+"):
	- Ausgang nach Punkt 1: 75 px/s
	- Nach Klick 80 px/s
	- Ergebnis: PASS

3. Direction Toggle:
	- Umschaltung von "down" auf "up" sichtbar im UI (Pfeil nach oben)
	- Ergebnis: PASS

### Ergebnis Runde 8

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Offener naechster Schritt in 3.2: Slider-Verhalten und Rueck-Umschaltung Richtung (up -> down)

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |

---

## Runde 9 - 2026-07-05 11:55 UTC (Bedingung 3.2 - Checkpoint 2)

### Ziel

Restliche Kernpunkte von Bedingung 3.2 validieren (Slider-Verhalten und Richtungs-Rueckwechsel) und erneut als 3-Punkte-Zwischenstand speichern.

### Durchgefuehrte Testpunkte

1. Slider Schritt hoch (Keyboard auf Slider):
	- Von 80 auf 81 px/s
	- Ergebnis: PASS

2. Slider Schritt runter (Keyboard auf Slider):
	- Von 81 auf 80 px/s
	- Ergebnis: PASS

3. Direction Rueckwechsel:
	- Richtung von up wieder auf down geschaltet
	- Ergebnis: PASS

### Ergebnis Runde 9

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Bedingung 3.2 ist damit im aktuellen Umfang erfolgreich verifiziert

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |

---

## Runde 10 - 2026-07-05 11:55:52 UTC (Anzeige-Kontrollen - Checkpoint)

### Ziel

Naechsten 3-Punkte-Block in den Anzeige-Kontrollen pruefen (Mirror und Rotation) und unmittelbar dokumentieren.

---

## Runde 11 - 2026-07-06 06:56 UTC (Build-Regressionsfix + Gate-Recheck)

### Ziel

Build-Regression nach Vollscan beheben, Frontend-Gates erneut durchlaufen lassen und die Testausgabe bereinigen.

### Ausgangsproblem

- Frontend-Build schlug fehl mit:
	- `TS5103: Invalid value for '--ignoreDeprecations'`
- Frontend-Tests waren gruen, aber mit wiederkehrender Node-Warnung zu `localStorage`.

### Durchgefuehrte Schritte

1. `ignoreDeprecations` aus Workspace-`tsconfig`-Dateien entfernt (Frontend/Backend/Electron).
2. Frontend-Testskripte mit lokalem Storage-File konfiguriert (`NODE_OPTIONS=--localstorage-file=./.vitest-localstorage`).
3. Frontend-Gates erneut ausgefuehrt:
	 - `npm run lint --workspace=packages/frontend`
	 - `npm run test --workspace=packages/frontend`
	 - `npm run build --workspace=packages/frontend`

### Ergebnis Runde 11

- Frontend Lint: PASS
- Frontend Tests: PASS (30/30)
- Frontend Build: PASS
- Warnhinweisbereinigung fuer `localStorage` ist im Standard-Testpfad umgesetzt.

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 11 | 2026-07-06 06:56 | Frontend 30/30, Lint PASS | PASS | GRUEN |

### Durchgefuehrte Testpunkte

1. H-Mirror Toggle:
	- Button schaltet auf pressed
	- Ergebnis: PASS

2. V-Mirror Toggle:
	- Button schaltet auf pressed
	- Ergebnis: PASS

3. Rotation +90:
	- Anzeige wechselt von 0 auf 90 Grad
	- Ergebnis: PASS

### Ergebnis Runde 10

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Testlauf kann mit den naechsten 3 Punkten fortgesetzt werden

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |

---

## Runde 11 - 2026-07-05 12:13:16 UTC (Fehlerbehebung Eingabe + Rotation-Fit)

### Gemeldete Probleme

1. Speed-Slider springt bei Tastatursteuerung.
2. Falsche Pfeiltastenbelegung fuer Speed-Hotkeys (war hoch/runter statt links/rechts).
3. Space-Verhalten im Pausebetrieb nicht sauber (unerwuenschte Nebenaktion/Reset-Eindruck).
4. Bei 90-Grad-Rotation passt sich der Text nicht sauber an den Ausgabebildschirm an.

### Umgesetzte technische Fixes

1. Hotkeys korrigiert:
	- Speed +5 auf ArrowRight
	- Speed -5 auf ArrowLeft

2. Slider-Tastatur stabilisiert:
	- ArrowLeft/ArrowRight am Slider erzwingen gezielte +/-1 Schritte
	- ArrowUp/ArrowDown am Slider werden blockiert, um Spruenge zu vermeiden
	- Speed-Updates zentral geklammert (0..400) und konsistent gesendet

3. Space-Handling robust gemacht:
	- Space-Repeat blockiert (nur ein Toggle pro physischem Tastendruck)
	- keyup fuer registrierte Hotkeys ebenfalls abgefangen, damit keine zweite Default-Aktion aus Fokus-Elementen ausgeloest wird

4. Rotation-Fit verbessert:
	- Bei 90/270 Grad wird ein Fit-Scale auf Basis der Viewport-Geometrie berechnet
	- Rotation + Spiegelung werden kombiniert, ohne den Content aus dem Viewport laufen zu lassen

### Validierung

1. Frontend Tests: PASS (25/25)
2. Frontend Build: PASS (bekannte Chunk-Warnung bleibt)
3. Manuelle Checks im Browser:
	- ArrowUp auf Slider: keine Aenderung
	- ArrowRight/ArrowLeft auf Slider: sauberer 1er-Schritt
	- Space im Pausebetrieb: toggelt Play/Pause ohne Reset-Ausloesung
	- 90-Grad-Ansicht: Transform mit Fit-Scale aktiv

### Ergebnis Runde 11

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Offener Beobachtungspunkt bleibt separat: Tiptap-Warnung zu Duplicate underline extension (nicht blockierend)

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |

---

## Runde 12 - 2026-07-05 12:14:54 UTC (Rotation-Block Folgepruefung)

### Ziel

Naechsten 3-Punkte-Block fuer Rotation und Bildschirmanpassung pruefen.

### Durchgefuehrte Testpunkte

1. Rotation 90 -> 180:
	- Anzeige wechselt auf 180 Grad
	- Ergebnis: PASS

2. Rotation 180 -> 270:
	- Anzeige wechselt auf 270 Grad
	- Ergebnis: PASS

3. Fit-Verhalten bei Quarter-Turn validiert:
	- Technischer Nachweis ueber Computed Transform vorhanden
	- 270-Transform: matrix(0, -0.697387, 0.697387, 0, 0, 0)
	- Ergebnis: PASS

### Ergebnis Runde 12

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Naechster 3er-Block: Space-Toggle in verschiedenen View-Modi/Fokuszustaenden

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |

---

## Runde 13 - 2026-07-05 12:15:48 UTC (Space-Verhalten Fokuskontexte)

### Ziel

Space-Hotkey in unterschiedlichen Fokuskontexten verifizieren.

### Durchgefuehrte Testpunkte

1. Space im normalen Fokus (Split View):
	- Teleprompter von Play auf Pause gewechselt
	- Ergebnis: PASS

2. Space erneut im normalen Fokus:
	- Teleprompter von Pause auf Play gewechselt
	- Ergebnis: PASS

3. Space bei aktivem Titel-Input:
	- Eingabefeld bleibt im Fokus
	- Space wird als Zeichen in den Titel geschrieben
	- Kein Hotkey-Toggle ausgeloest (UI bleibt im Play-Zustand)
	- Ergebnis: PASS

### Ergebnis Runde 13

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Naechster 3er-Block: Richtungswechsel waehrend laufendem Scroll + Slider-Aenderungen

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |

---

## Runde 14 - 2026-07-05 12:16:39 UTC (Direction + Slider unter Last)

### Ziel

Verhalten von Direction- und Slider-Steuerung im laufenden Scroll (Play-Betrieb) pruefen.

### Durchgefuehrte Testpunkte

1. Direction Toggle waehrend Play:
	- Richtung von down auf up gewechselt
	- Ergebnis: PASS

2. Slider ArrowRight waehrend Play:
	- Speed von 200 auf 201
	- Ergebnis: PASS

3. Slider ArrowLeft waehrend Play:
	- Speed von 201 auf 200
	- Ergebnis: PASS

### Ergebnis Runde 14

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine
- Testlauf kann mit weiterem 3er-Block fortgesetzt werden

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |
| 14 | 2026-07-05 12:16:39 | Direction- und Slider-Test unter Play-Betrieb | n/a | GRUEN |

---

## Runde 15 - 2026-07-05 12:23:48 UTC (Start/Stop + Hochkantmodus)

### Ziel

Gemeldete Regression bei Start/Stop beheben und 90-Grad-Hochkantmodus fuer A4-nahe Nutzung validieren.

### Durchgefuehrte Testpunkte

1. Stop-Interaktion (neues Verhalten):
	- Erster Klick auf Stop stoppt sofort (Play -> Pause/Ready)
	- Reset wird nur noch als zweiter Schritt bestaetigt
	- Ergebnis: PASS

2. Start-Interaktion:
	- Play startet danach wieder normal
	- Ergebnis: PASS

3. Hochkantmodus bei 90 Grad:
	- Prompter-Viewport wird im A4-nahen Hochkantverhaeltnis gerahmt
	- Messung: viewportRatio 0.707 (entspricht DIN-A-Reihe)
	- Ergebnis: PASS

### Zusatzhinweis Slider-Sprung

- Das verbleibende Restproblem "Speed-Slider springt" ist als priorisiertes Ticket fuer nach dem Langzeittest aufgenommen: `TICKET-018` in `docs/BACKLOG.md`.

### Ergebnis Runde 15

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |
| 14 | 2026-07-05 12:16:39 | Direction- und Slider-Test unter Play-Betrieb | n/a | GRUEN |
| 15 | 2026-07-05 12:23:48 | Start/Stop-Regressionsfix + 90-Grad-Hochkantmodus | PASS | GRUEN |

---

## Runde 16 - 2026-07-05 12:30:37 UTC (Vollflaeche Hochkant + Runtime-Stabilisierung)

### Ziel

Neu gemeldete Punkte finalisieren: Vollflaechen-Hochkant bei 90 Grad, Reset-Button-Benennung, Start/Pause-Stabilitaet inkl. Port-4000-Konflikt.

### Durchgefuehrte Testpunkte

1. Runtime-Konflikt behoben (Port 4000):
	- Ursache: parallele Dev-Prozesse fuehrten zu `EADDRINUSE`.
	- Ergebnis nach Neustart einer sauberen Instanz: Backend stabil auf 4000, WS verbunden.
	- Ergebnis: PASS

2. Reset-Benennung und Start/Pause-Verhalten:
	- Button-Titel wieder `Reset` (kein dauerhaftes `Stop`-Label).
	- Start/Pause im UI wieder normal bedienbar.
	- Ergebnis: PASS

3. 90-Grad-Vollflaeche:
	- Hochkantmodus fuellt jetzt den kompletten verfuegbaren Prompter-Bildschirm.
	- Technischer Nachweis: Stage und Viewport gleiche Abmessung (`fillsStage: true`).
	- Ergebnis: PASS

### Zusatz zu Backlog (spaetere Updates)

- Automatische Anpassung an unterschiedliche Bildschirmformate und auswaehlbare feste Screen-Groessen wurden als Folgepunkt aufgenommen (`TICKET-019` in `docs/BACKLOG.md`).

### Ergebnis Runde 16

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |
| 14 | 2026-07-05 12:16:39 | Direction- und Slider-Test unter Play-Betrieb | n/a | GRUEN |
| 15 | 2026-07-05 12:23:48 | Start/Stop-Regressionsfix + 90-Grad-Hochkantmodus | PASS | GRUEN |
| 16 | 2026-07-05 12:30:37 | Vollflaeche Hochkant + Runtime-Stabilisierung | PASS | GRUEN |

---

## Runde 17 - 2026-07-05 12:40:24 UTC (Speed-Bedienung umgestellt + Dev-Session stabilisiert)

### Ziel

Gewuenschte Bedienlogik fuer Geschwindigkeit final umsetzen und das beobachtete Terminal-Springen technisch stabilisieren.

### Durchgefuehrte Testpunkte

1. Speed-Slider entfernt, neue Eingabe eingefuehrt:
	- Slider ist entfernt.
	- Speed wird jetzt ueber `+`/`-` Buttons und numerisches Eingabefeld gesteuert.
	- Wertebereich bleibt 0..400 px/s.
	- Ergebnis: PASS

2. Hotkeys fuer Speed auf `+` / `-` gelegt:
	- `+` erhoeht um 5
	- `-` reduziert um 5
	- (inkl. gaengiger Keyboard-Varianten)
	- Ergebnis: PASS

3. Dev-Terminal-Stabilisierung:
	- Das vorherige Springen/Neustarten war nicht normal.
	- Ursache: Watcher reagierte auf `node_modules`-Aenderungen plus parallele Altprozesse/Port-Konflikte.
	- Fix: `tsx watch` schliesst `node_modules` aus und Ports wurden bereinigt; saubere Einzelinstanz laeuft.
	- Ergebnis: PASS

### Ergebnis Runde 17

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |
| 14 | 2026-07-05 12:16:39 | Direction- und Slider-Test unter Play-Betrieb | n/a | GRUEN |
| 15 | 2026-07-05 12:23:48 | Start/Stop-Regressionsfix + 90-Grad-Hochkantmodus | PASS | GRUEN |
| 16 | 2026-07-05 12:30:37 | Vollflaeche Hochkant + Runtime-Stabilisierung | PASS | GRUEN |
| 17 | 2026-07-05 12:40:24 | Speed-UI umgestellt und Dev-Watcher stabilisiert | PASS | GRUEN |

---

## Runde 18 - 2026-07-05 12:51:34 UTC (Richtungs-Hotkeys + Tier-Gating finalisiert)

### Ziel

Offene Funktionswunsche final abdecken: Richtung per Pfeiltasten, Basic-Tier ohne Cue/Voice sowie Vollflaechen-Hochkant ohne Rest-Downscale.

### Durchgefuehrte Testpunkte

1. Richtungs-Hotkeys:
	- `ArrowUp` setzt Scrollrichtung auf `up`
	- `ArrowDown` setzt Scrollrichtung auf `down`
	- Ergebnis: PASS

2. Tier-Gating umgesetzt und validiert:
	- Basic: kein Cue-Marker-Checkbox, kein Voice-Tracking-Checkbox
	- Basic zeigt stattdessen Hinweistexte zu Professional/Expert
	- Ergebnis: PASS

3. Hochkant-Vollflaeche:
	- 90/270 laufen ohne zusaetzliches Downscale
	- Viewport fuellt verfuegbaren Bereich (`fillsStage: true`)
	- Ergebnis: PASS

### Ergebnis Runde 18

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

## Runden-Uebersicht (aktualisiert)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 1 | 2026-07-04 02:12 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 2 | 2026-07-05 02:34 | Frontend 11/25, Backend 9/9 | PASS | GELB |
| 3 | 2026-07-05 02:44 | Frontend 25/25, Backend 9/9 | PASS | GRUEN |
| 4 | 2026-07-05 00:57 | Frontend 25/25, Live-Smoke ok | PASS | GRUEN |
| 5 | 2026-07-05 01:03 | Live-Demo ok, ASR offen | PASS | GELB |
| 6 | 2026-07-05 13:20 | Frontend 25/25, Backend 9/9, Lint PASS | PASS | GRUEN |
| 7 | 2026-07-05 11:50 | Manueller Zwischenstand: 3 Testpunkte dokumentiert | n/a | GRUEN |
| 8 | 2026-07-05 11:53 | Bedingung 3.2 Checkpoint 1: Speed-/Direction-Basics | n/a | GRUEN |
| 9 | 2026-07-05 11:55 | Bedingung 3.2 Checkpoint 2: Slider + Richtung Rueckwechsel | n/a | GRUEN |
| 10 | 2026-07-05 11:55:52 | Anzeige-Kontrollen: Mirror + Rotation +90 | n/a | GRUEN |
| 11 | 2026-07-05 12:13:16 | Bugfix-Checkpoint: Slider/Hotkeys/Space/Rotation-Fit | PASS | GRUEN |
| 12 | 2026-07-05 12:14:54 | Rotation 180/270 plus Fit-Nachweis | n/a | GRUEN |
| 13 | 2026-07-05 12:15:48 | Space-Hotkey in Normal-/Input-Fokus geprueft | n/a | GRUEN |
| 14 | 2026-07-05 12:16:39 | Direction- und Slider-Test unter Play-Betrieb | n/a | GRUEN |
| 15 | 2026-07-05 12:23:48 | Start/Stop-Regressionsfix + 90-Grad-Hochkantmodus | PASS | GRUEN |
| 16 | 2026-07-05 12:30:37 | Vollflaeche Hochkant + Runtime-Stabilisierung | PASS | GRUEN |
| 17 | 2026-07-05 12:40:24 | Speed-UI umgestellt und Dev-Watcher stabilisiert | PASS | GRUEN |
| 18 | 2026-07-05 12:51:34 | Direction-Hotkeys + Tier-Gating + Fullscreen-Hochkant | PASS | GRUEN |
| 19 | 2026-07-05 12:56:00 | Professional-Tier + Start/Pause Live-Retest | PASS | GRUEN |
| 20 | 2026-07-05 13:24:00 | Richtung/Speed-Sync-Fix + Watcher-Stabilisierung | PASS | GRUEN |

---

## Runde 20 - 2026-07-05 13:24:00 UTC (Richtung/Speed-Kollision behoben)

### Ziel

Gemeldete Instabilitaeten beheben:
- Richtung hoch/runter nicht sauber synchron
- Speed springt nach Tastatur-Aenderung auf alten Wert zurueck
- Backend-Dev-Prozess reagiert auf `node_modules`-Aenderungen mit Restart-Sturm

### Durchgefuehrte Testpunkte

1. WS-Protokoll fuer Richtung erweitert (`SET_DIRECTION` End-to-End):
	- Hotkeys und Richtungstaste senden Richtung jetzt an den Server
	- `SYNC_STATE` uebernimmt Richtung ebenfalls wieder korrekt in den Client
	- Ergebnis: PASS

2. Speed-Kollision beseitigt:
	- `+/-` Hotkeys senden `SET_SPEED` jetzt immer an den Server
	- Heartbeat/SYNC kann damit keinen alten Speed mehr zurueckdruecken
	- Livecheck: nach 7s kein Ruecksprung beobachtet
	- Ergebnis: PASS

3. Dev-Stabilisierung:
	- Backend-Watcher auf globale Excludes umgestellt (`**/node_modules/**`, `**/dist/**`, `**/.git/**`)
	- Doppelte Alt-Prozesse beendet, saubere Session gestartet
	- Ergebnis: PASS

### Ergebnis Runde 20

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

## Runde 19 - 2026-07-05 12:56:00 UTC (Professional + Transport-Retest)

### Ziel

Nach Runde 18 die noch offenen Live-Nachweise fuer Professional-Tier und Start/Pause-Verhalten unter laufender Session abschliessen.

### Durchgefuehrte Testpunkte

1. Tier-Umschaltung auf Professional:
	- Cue Marker sichtbar und bedienbar
	- Voice Tracking nicht als Checkbox sichtbar
	- Stattdessen Infohinweis "Voice tracking is available in Expert tier."
	- Ergebnis: PASS

2. Transport-Retest Start/Pause:
	- Play gestartet (Button wechselt auf Pause)
	- Pause geklickt (Button zurueck auf Play, Status zeigt "PAUSED")
	- Kein Haengen beobachtet
	- Ergebnis: PASS

### Ergebnis Runde 19

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

---

## Runde 21 - 2026-07-05 13:38:00 UTC (10-Minuten-Dauerlauf unter Last)

### Ziel

Praxisfall unter Last pruefen: aktives Tippen im Editor plus gleichzeitige Hotkeys (Speed/Direction), dabei parallel Terminal-Output beobachten.

### Testdurchfuehrung

- Gesamtdauer: 10 Minuten in 5 x 2-Minuten-Bloecken.
- Lastprofil je Block:
  - Titel und Segmenttext laufend erweitert (Editor-Last)
  - Richtungswechsel per ArrowUp/ArrowDown
  - Speed-Aenderung per Tastatur (`=`/`-`) und Zahleneingabe
  - Zwischenmesspunkte fuer Speed/Direction/WS-Verbindung
- Terminal-Monitoring parallel in jedem Block durchgefuehrt.

### Beobachtungen

1. Runtime/Watcher:
	- Keine neuen `tsx change in ../../node_modules ... Process hasn't exited`-Sturmfolgen.
	- Backend blieb erreichbar (`/ws` aktiv), WS-Clients verbunden.

2. Direction unter Last:
	- Richtung wechselte stabil zwischen up/down, keine festhaengende Richtung.

3. Speed unter Last:
	- Nach den Sync-Fixes kein Heartbeat-Ruecksprung auf alten Wert mehr im Normalfall.
	- Zusaetzlicher UI-Konsistenzfix eingebaut: Zahleneingabe wird auf den geklammerten Wert normalisiert, damit Feld und State nicht auseinanderlaufen.

### Ergebnis Runde 21

- Ergebnis: PASS (GRUEN)
- Neue Blocker: keine

---

## Runde Live Tester V1.1 - Vorlage (leer)

### Meta

| Feld | Eintrag |
|------|---------|
| Datum / Uhrzeit (UTC) | |
| Testleiter | |
| Tester-Team | |
| App-Version | 1.0.0-beta.1 |
| Testumgebung | Browser / PWA / Electron |
| Backend-Tier | basic / professional / expert |
| Build-Stand (Commit) | |

### Ziel

Live-Tester-Runde fuer neue Features gemaess aktueller Beta-Tester-Checkliste dokumentieren.

### Durchgefuehrte Kernpruefungen (Pflichtlauf)

| Block | Referenz aus BETA_TESTER_GUIDE | Status | Notiz |
|-------|--------------------------------|--------|-------|
| Installation | I-01 bis I-04 | | |
| Editor/Script | E-01, E-03, E-08, E-10 | | |
| Teleprompter | S-01, S-02, S-04, S-16, S-17 | | |
| WebSocket/Output-only | W-01, W-04, W-06 | | |
| Support-Ticket | T-01, T-02, T-03 oder T-04 | | |
| Lizenz | L-01, L-02 | | |
| Desktop (optional) | D-01 bis D-04 | | |

### Support-Ticket Nachweis

| Feld | Wert |
|------|------|
| Ticket-ID (aus App) | |
| App-Bestaetigungstext korrekt | ja / nein |
| Auto-E-Mail erhalten | ja / nein / n.a. |
| Ticket-Kopie in E-Mail enthalten | ja / nein / n.a. |
| SMTP aktiv in Testumgebung | ja / nein |

### Lizenz-Nachweis

| Pruefung | Erwartet | Ergebnis |
|----------|----------|----------|
| Ungueltiges Token (L-01) | Gate/Hinweis aktiv | |
| Gueltiges Token (L-02) | Aktivierung erfolgreich | |
| Persistenz nach Reload | Status bleibt konsistent | |

### Output/Restart-Nachweis

| Pruefung | Erwartet | Ergebnis |
|----------|----------|----------|
| Output-only View (`?view=prompter&output=1`) | Keine Header/Controls/Settings | |
| Restart zweistufig | Erst bestaetigen, dann Reload | |
| Restart beeinflusst externe Ausgabe nicht | Kein unerwuenschter STOP auf Output-Client | |

### Build/Test Gates waehrend der Runde

| Gate | Befehl | Ergebnis | Fehler/Warnungen |
|------|--------|----------|------------------|
| Frontend Tests | `npm run test --workspace=packages/frontend` | | |
| Backend Tests | `npm run test --workspace=packages/backend` | | |
| Frontend Lint | `npm run lint --workspace=packages/frontend` | | |
| Backend Lint | `npm run lint --workspace=packages/backend` | | |
| Gesamt-Build | `npm run build` | | |

### Gefundene Bugs

| ID | Schweregrad | Kurzbeschreibung | Reproduzierbar | Ticket/Link |
|----|-------------|------------------|----------------|-------------|
| BUG- | Kritisch / Hoch / Mittel / Niedrig | | ja / nein / manchmal | |

### UX-Verbesserungen

| ID | Prioritaet | Vorschlag | Kontext |
|----|------------|-----------|---------|
| UX- | Hoch / Mittel / Niedrig | | |

### Abschlussbewertung Runde Live Tester V1.1

| Frage | Antwort |
|-------|---------|
| Gesamtstatus | GRUEN / GELB / ROT |
| Go/No-Go fuer naechste Beta-Welle | GO / NO-GO |
| Wichtigster Blocker | |
| Wichtigste positive Erkenntnis | |
| Naechste 3 Aktionen | 1) 2) 3) |

---

## Kurzprotokoll 5-Minuten-Live-Check - Vorlage (leer)

### Meta

| Feld | Eintrag |
|------|---------|
| Datum / Uhrzeit (UTC) | |
| Tester | |
| Umgebung | Browser / PWA / Electron |
| Tier | basic / professional / expert |
| Commit / Build | |

### Quick-Checks (max. 5 Minuten)

| # | Pruefung | Erwartet | Status | Notiz |
|---|----------|----------|--------|-------|
| Q-01 | App startet | UI laedt ohne Blocker | PASS / FAIL | |
| Q-02 | WS-Verbindung | Status zeigt verbunden | PASS / FAIL | |
| Q-03 | Play/Pause | Startet und pausiert sofort | PASS / FAIL | |
| Q-04 | Speed +/- oder Eingabe | Wert aendert sich stabil | PASS / FAIL | |
| Q-05 | Direction (up/down) | Richtung wechselt sichtbar | PASS / FAIL | |
| Q-06 | Output-only URL (`?view=prompter&output=1`) | Nur Ausgabe, keine Controls | PASS / FAIL | |
| Q-07 | Support-Ticket absenden | Ticket-ID wird angezeigt | PASS / FAIL | |
| Q-08 | Lizenzstatus (falls enforce) | Gate/aktiv korrekt | PASS / FAIL | |

### Ergebnis in 30 Sekunden

| Feld | Eintrag |
|------|---------|
| Gesamtstatus | GRUEN / GELB / ROT |
| Go/No-Go | GO / NO-GO |
| Kritischster Befund | |
| Sofortmassnahme | |

### Mini-Bugliste (optional)

| ID | Schweregrad | Kurztext |
|----|-------------|----------|
| BUG- | Kritisch / Hoch / Mittel / Niedrig | |

---

## Kurzprotokoll 5-Minuten-Live-Check - Beispielrunde (ausgefuellt)

### Meta

| Feld | Eintrag |
|------|---------|
| Datum / Uhrzeit (UTC) | 2026-07-06 09:15 |
| Tester | LT-Team A / Operator 01 |
| Umgebung | Browser (Chrome 127) |
| Tier | expert |
| Commit / Build | main / lokaler Build gruen |

### Quick-Checks (max. 5 Minuten)

| # | Pruefung | Erwartet | Status | Notiz |
|---|----------|----------|--------|-------|
| Q-01 | App startet | UI laedt ohne Blocker | PASS | Startzeit 2.1 s, keine Blocker sichtbar |
| Q-02 | WS-Verbindung | Status zeigt verbunden | PASS | Nach 1-2 s auf connected |
| Q-03 | Play/Pause | Startet und pausiert sofort | PASS | Umschaltung ohne Verzogerung |
| Q-04 | Speed +/- oder Eingabe | Wert aendert sich stabil | PASS | 80 -> 85 -> 80, kein Ruecksprung |
| Q-05 | Direction (up/down) | Richtung wechselt sichtbar | PASS | down -> up -> down korrekt |
| Q-06 | Output-only URL (`?view=prompter&output=1`) | Nur Ausgabe, keine Controls | PASS | Header/Settings/Controls ausgeblendet |
| Q-07 | Support-Ticket absenden | Ticket-ID wird angezeigt | PASS | Ticket-ID angezeigt: SWD-2026-000123 |
| Q-08 | Lizenzstatus (falls enforce) | Gate/aktiv korrekt | PASS | Gueltiges Token aktiv, Status konsistent |

### Ergebnis in 30 Sekunden

| Feld | Eintrag |
|------|---------|
| Gesamtstatus | GRUEN |
| Go/No-Go | GO |
| Kritischster Befund | Kein kritischer Befund |
| Sofortmassnahme | Keine, normaler Testlauf fortsetzen |

### Mini-Bugliste (optional)

| ID | Schweregrad | Kurztext |
|----|-------------|----------|
| BUG-024 | Niedrig | Tiptap Warnung "duplicate underline" in Konsole, ohne Funktionsverlust |

---

## Runde 15 - 2026-07-06 20:59 UTC (Room-Isolation + Sync-Entlastung)

### Ziel

Akuten Live-Befund beheben und verifizieren:

1. Keine globale Kopplung aller Nutzer mehr.
2. Weniger Sync-Last zur Reduktion von Stottern/Jitter.

### Durchgefuehrte technische Checks

1. Build (Monorepo):
	- `npm run build`
	- Ergebnis: PASS

2. Frontend-Tests:
	- `npm run test --workspace=packages/frontend -- --run`
	- Ergebnis: PASS (30/30)

3. Backend-Tests:
	- `npm run test --workspace=packages/backend -- --run`
	- Ergebnis: PASS (9/9)

### Umgesetzte Runtime-Fixes

1. WebSocket-Routing ist jetzt room-scoped (`?room=...`).
2. Backend-Zustand wird pro room gehalten (`SYNC_STATE` room-lokal).
3. Output-only Clients senden keine Script-/Settings-/Positionsupdates.
4. Positions-Sync bei laufendem Scroll wurde staerker gedrosselt.

### Ergebnis Runde 15

- Ergebnis: PASS (GRUEN)
- Technischer Zielzustand fuer Isolation/Entlastung erreicht.
- Naechster Pflichtschritt: Live-Mehrclient-Smoke-Test mit zwei getrennten rooms auf der Produktivdomain und Kurzprotokoll.

## Runden-Uebersicht (Delta)

| Runde | Datum / Uhrzeit (UTC) | Tests | Build | Ergebnis |
|-------|------------------------|-------|-------|----------|
| 15 | 2026-07-06 20:59 | Frontend 30/30, Backend 9/9 | PASS | GRUEN |
