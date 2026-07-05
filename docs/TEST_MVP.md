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
