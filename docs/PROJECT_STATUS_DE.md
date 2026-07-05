# Projektstand Saarwood Teleprompter

_Stand: 2026-07-05 02:45 UTC (Code- und Doku-Abgleich nach P0-Testharness-Fix)_

## 1. Kurzfazit

Das Projekt ist als Monorepo vollstaendig lauffaehig wiederhergestellt (Frontend, Backend, Electron, Docs).
Build und Tests sind fuer Frontend und Backend gruen.
Der MVP ist fuer den LAN-Einsatz brauchbar, aber wir befinden uns weiterhin in der aktiven Testphase.
Der erste Live-Smoke-Test im Browser wurde erfolgreich durchgefuehrt, die Vorfuehrung von A bis Z ebenfalls.
ASR / Voice Tracking bleibt offen und verhindert noch den Abschluss der Testphase.

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
| Frontend Tests | PASS | 25/25 Tests bestanden (P0-Fix aktiv) |
| Backend Tests | PASS | 9/9 Tests gruen |

## 4. MVP-Readiness fuer realen Langzeittest

### Technisch ausreichend fuer Start
Die App ist fuer den echten LAN-Langzeittest geeignet, aber die Testphase ist noch nicht abgeschlossen.
Wir befinden uns weiterhin in der Testphase; der naechste Schritt ist die oeffentliche MVP-Variante auf einem VPS.
Der erste Live-Smoke-Test im Browser wurde erfolgreich durchgefuehrt, die Vorfuehrung von A bis Z ebenfalls.
1. Frontend-Testharness stabilisieren (erledigt)
2. Smoke-Test-Skript fuer LAN-Lauf dokumentieren (Start, Browser-Checks, WS-Verbindung)
3. ASR / Voice Tracking stabilisieren und erneut pruefen
4. Akzeptanzkriterien fuer Langzeittest festziehen (Dauer, Nutzeranzahl, Erfolgsmetriken, Abbruchkriterien)

## 5. Relevante Risiken

### Oeffentlicher MVP-Pfad
1. Hostinger VPS als Public-Hosting-Variante festlegen
2. Frontend/Backend-Deployment fuer oeffentlichen Zugriff vorbereiten
3. WebSocket-URL und Betriebsdoku fuer externe Nutzer anpassen

### Noch offene Testthemen
1. ASR / Voice Tracking stabilisieren
2. `recognition has already started`-Fehler untersuchen
3. Nach Behebung erneut einen echten Langzeittest mit Nutzern laufen lassen

1. Bundle-Groesse
- Risiko: langsameres Initial-Load auf schwachen Clients.
- Status: beobachtet, aber kein Blocker fuer MVP-LAN-Test.

2. NDI produktiv noch nicht verifiziert
- Risiko nur fuer Broadcast-Integrationsphase; fuer MVP-LAN nicht blockierend.

3. UI-Editor Warnung (Tiptap Duplicate Extension)
- Risiko: moegliche Inkonsistenzen in Editor-Funktionen bei spaeteren Erweiterungen.
- Status: aktuell beobachtet, fuer MVP-LAN nicht blockierend.

## 6. Naechste Schritte (Prioritaet)

### P0 (sofort)
1. Kurzen LAN-Betriebsplan als Checkliste in Doku aufnehmen
2. Pilot-Langzeittest mit echten Usern starten
3. Incident-Logging waehrend des Testfensters durchgehend fuehren

### P1 (direkt nach erstem Feldtest)
1. Beobachtete UX-/Stabilitaetsprobleme aus Feldtest in Backlog ueberfuehren
2. Bundle-Splitting evaluieren

## 7. Dokumentationsquellen

- `docs/PROJECT_STATUS_DE.md` (dieser aktuelle Projektstand)
- `docs/TEST_MVP.md` (laufender Teststatus mit Testrunden)
- `docs/BACKLOG.md` (priorisierte Umsetzung)
- `docs/FEHLERBEHEBUNGEN.md` (chronologische Fehlerbehebung)
- `docs/STATUSBERICHT_MVP_LAN_DE_2026-07-05.md` (neuer Delta-Statusbericht mit Code-vs-Doku-Abweichungen)
