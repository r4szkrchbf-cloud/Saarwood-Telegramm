# Projektstand Saarwood Teleprompter

_Stand: 2026-07-05 02:40 UTC (Code- und Doku-Abgleich nach Migration auf r4szkrchbf-cloud)_

## 1. Kurzfazit

Das Projekt ist als Monorepo vollstaendig lauffaehig wiederhergestellt (Frontend, Backend, Electron, Docs).
Der Build-Status ist gruen (Frontend + Backend), jedoch ist die Frontend-Test-Suite aktuell rot.
Fuer den MVP-Langzeittest mit echten Nutzern ist die App damit technisch startfaehig, aber die Testharness-Stabilisierung ist P0.

## 2. Aktueller technischer Ist-Stand

### Frontend (`packages/frontend`)
- Build: PASS (`tsc && vite build`)
- PWA-Build erfolgreich (Service Worker und Manifest erzeugt)
- Kernfunktionen vorhanden: Editor, Prompter-Render, Controls, Mirror/Rotation, Settings, Speech-Tracking, WebSocket-Sync
- Warnung beim Build: groesseres Bundle (>500 kB), aktuell kein MVP-Blocker

### Backend (`packages/backend`)
- Build: PASS (`tsc`)
- Tests: PASS (9/9)
- REST, WebSocket, MOS-Handler, NDI-Adapter (Stub/Fallback) vorhanden

## 3. Qualitaetsstatus (heute verifiziert)

| Gate | Status | Details |
|------|--------|---------|
| Frontend Build | PASS | Vite Build inkl. PWA-Dateien erfolgreich |
| Backend Build | PASS | TypeScript Build erfolgreich |
| Frontend Tests | FAIL | 14 Fehler in `prompterStore.test.ts` (Persist/localStorage im Testlauf) |
| Backend Tests | PASS | 9/9 Tests gruen |

## 4. MVP-Readiness fuer realen Langzeittest

### Technisch ausreichend fuer Start
- Frontend + Backend bauen erfolgreich
- Runtime-Kernpfade sind vorhanden
- Repo und Dokumentation sind wieder auf einem konsolidierten Stand

### P0 vor produktiver Testwelle
1. Frontend-Testharness stabilisieren (Vitest + persisted Zustand/localStorage)
2. Smoke-Test-Skript fuer LAN-Lauf dokumentieren (Start, Browser-Checks, WS-Verbindung)
3. Akzeptanzkriterien fuer Langzeittest festziehen (Dauer, Nutzeranzahl, Erfolgsmetriken, Abbruchkriterien)

## 5. Relevante Risiken

1. Test-Rot trotz Build-Gruen
- Risiko: Regressionen werden spaeter erkannt.
- Ursache: Persist-Middleware erwartet Storage im Testkontext.

2. Bundle-Groesse
- Risiko: langsameres Initial-Load auf schwachen Clients.
- Status: beobachtet, aber kein Blocker fuer MVP-LAN-Test.

3. NDI produktiv noch nicht verifiziert
- Risiko nur fuer Broadcast-Integrationsphase; fuer MVP-LAN nicht blockierend.

## 6. Naechste Schritte (Prioritaet)

### P0 (sofort)
1. Frontend-Testfehler beheben (Storage-Mock/Store-Testaufbau)
2. Kurzen LAN-Betriebsplan als Checkliste in Doku aufnehmen
3. Danach Pilot-Langzeittest mit echten Usern starten

### P1 (direkt nach erstem Feldtest)
1. Beobachtete UX-/Stabilitaetsprobleme aus Feldtest in Backlog ueberfuehren
2. Bundle-Splitting evaluieren

## 7. Dokumentationsquellen

- `docs/PROJECT_STATUS_DE.md` (dieser aktuelle Projektstand)
- `docs/TEST_MVP.md` (laufender Teststatus mit Testrunden)
- `docs/BACKLOG.md` (priorisierte Umsetzung)
- `docs/FEHLERBEHEBUNGEN.md` (chronologische Fehlerbehebung)
- `docs/STATUSBERICHT_MVP_LAN_DE_2026-07-05.md` (neuer Delta-Statusbericht mit Code-vs-Doku-Abweichungen)
