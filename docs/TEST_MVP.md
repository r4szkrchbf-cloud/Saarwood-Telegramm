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
