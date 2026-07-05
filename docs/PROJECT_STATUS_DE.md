# Projektstand Saarwood Teleprompter

_Stand: 2026-07-05 05:10 UTC (Voice-Tracking Stabilisierung, Kalibrierungs-Assistent und Testtext-Update)_

## 1. Kurzfazit

Das Projekt ist als Monorepo vollstaendig lauffaehig wiederhergestellt (Frontend, Backend, Electron, Docs).
Build und Tests sind fuer Frontend und Backend gruen.
Der MVP ist fuer den LAN-Einsatz brauchbar, aber wir befinden uns weiterhin in der aktiven Testphase.
Der erste Live-Smoke-Test im Browser wurde erfolgreich durchgefuehrt, die Vorfuehrung von A bis Z ebenfalls.
ASR / Voice Tracking wurde in den Kernablaeufen stabilisiert (Play/Pause-Kopplung, sichtbare Laufzeitdiagnose, Sensitivity, Kalibrierung).
Die Testphase bleibt aktiv, aber der Voice-Pfad ist deutlich robuster und besser bedienbar.

## 1.1 Delta-Update (neu)

- Voice Tracking ist jetzt strikt an den Transport gekoppelt:
	- `Play` aktiviert die Erkennung (wenn Voice aktiv ist)
	- `Pause` muted die Erkennung hart, damit Sprechen keine Pause unterbricht
- Deutscher Laufzeit-Status im Prompter-Output ergaenzt (`Voice: ...`) inklusive konkreter Fehlerursachen.
- Mikrofonquelle waehlbar und persistiert.
- Voice-Empfindlichkeit (`0-100%`) ergaenzt und als Reaktionsschwelle angebunden.
- Kalibrierungs-Assistent in Settings ergaenzt (Testsatz, Erkennungsauswertung, automatische Empfehlung).
- Deutscher 4-Segment-Testsprechertext als Default/Loader verfuegbar, inkl. Legacy-Englisch-Migration.
- Getrennte Prompter-Ausgabe als Output-Ansicht eingefuehrt (`?view=prompter&output=1`) ohne Header/Controls/Settings/Hotkeys.
- Electron-Operatorfunktion `Monitor 2 Vollbild` ergaenzt: Prompter-Ausgabe laesst sich direkt auf den zweiten Bildschirm im Vollbild starten.
- Browser-Neustart entkoppelt: kein `STOP`/`PAUSE`-Broadcast waehrend lokalem Reload, damit laufende Prompter-Ausgaben nicht unterbrochen werden.
- Lizenz-/Rollout-Plan vorbereitet (`docs/LICENSING_AND_RELEASE_PLAN_DE.md`): signierte Lizenzschluessel, Revocation/Kill-Switch, Support-Runbook und Public+Offline-Rolloutphasen.
- Projektanweisung protokolliert: rechtliche Hinweise zu Saarwood und Softwareentwicklungsfirma werden erst am Schluss eingepflegt; priorisiert werden aktuell MVP- und Public-Beta-Funktionalitaet.
- Hostinger-Konzept fuer Public Beta + Support erstellt (`docs/HOSTINGER_PUBLIC_BETA_SUPPORT_CONCEPT_DE.md`), inkl. Trennung Support-UI vs. Prompter-Output.

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
- `docs/STATUSBERICHT_REPO_SYNC_DE_2026-07-05.md` (Konsolidierung, Verzeichnis-Aufraeumen, Commit-/Push-Transparenz)
