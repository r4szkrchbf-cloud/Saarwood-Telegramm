# Projektstand Saarwood Teleprompter

Stand: 2026-07-06 UTC (Code-/Doku-Abgleich, Tier-Regeln, Support- und Import/Export-Stand)

## 1. Kurzfazit

Das Projekt ist als Monorepo vollstaendig lauffaehig wiederhergestellt (Frontend, Backend, Electron, Docs).
Build und Tests sind fuer Frontend und Backend gruen.
Der MVP ist fuer den LAN-Einsatz brauchbar, aber wir befinden uns weiterhin in der aktiven Testphase.
Der erste Live-Smoke-Test im Browser wurde erfolgreich durchgefuehrt, die Vorfuehrung von A bis Z ebenfalls.
ASR / Voice Tracking wurde in den Kernablaeufen stabilisiert (Play/Pause-Kopplung, sichtbare Laufzeitdiagnose, Sensitivity, Kalibrierung).
Die Testphase bleibt aktiv, aber der Voice-Pfad ist deutlich robuster und besser bedienbar.
Aktuell ist zusaetzlich der Dokumentationsabgleich aktualisiert: Vorlagen, Support-Logs, TXT-Import und tierabhängige UI-Regeln sind im Code und in der Doku abgebildet.

## 1.1 Delta-Update (neu)

- Build-Stabilitaet wiederhergestellt:
  - `TS5103` durch ungueltigen `ignoreDeprecations`-Wert in den Workspace-`tsconfig`-Dateien beseitigt.
  - Frontend-, Backend- und Root-Build laufen wieder konsistent gruen.
- Testausgabe beruhigt:
  - Vitest im Frontend nutzt jetzt eine lokale Storage-Datei, wodurch der bisherige Node-`localStorage`-Warnhinweis im Standardlauf entfaellt.

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
- Erweiterte Hostinger-Anforderung dokumentiert: zentrale Hauptseite fuer mehrere Apps plus App-Unterseiten (`/apps/<name>/...`) und Teleprompter-Dokumente/Formular direkt verlinkbar aus App und Website.
- Mehrserver-/Baukasten-Prinzip dokumentiert: Hauptwebsite kann getrennt vom Teleprompter-App-Server laufen; App-uebergreifender Datenaustausch erfolgt API-/Event-basiert statt direkter DB-Kopplung.
- Telepromptervorlagen wurden im UI und in der Doku umbenannt; Support-Log-Zugriff und Import/Export-Regeln sind tierabhängig dokumentiert.
- Projekt-/Sendungsname ist jetzt als eigener Titelpfad im Script vorhanden, in Vorlagenformaten enthalten und im Professional-Tier ein-/ausblendbar.
- Projekt-/Sendungsname ist im Professional-Tier jetzt auch in Groesse und Schriftfarbe konfigurierbar.
- Im Expert-Tier gibt es eine eigene, persistierte Projekt-/Sendungsnamen-Bibliothek mit CSV/TXT-Import fuer haeufig wechselnde Sendungen.
- Werbekonzept fuer die kostenlose Basic-Version vor Hostinger-Go-Live als separates Konzept dokumentiert (`docs/BASIC_TIER_ADS_CONCEPT_DE.md`).

## 1.2 Code-/Doku-Abgleich (aktuell)

Folgende Codebereiche sind derzeit in der Dokumentation abgedeckt und sollen bei Aenderungen zuerst nachgezogen werden:

- `packages/frontend/src/App.tsx`: App-Shell, License-Gate, View-Modi, Output-only View.
- `packages/frontend/src/components/Settings/SettingsPanel.tsx`: Support, Vorlagenverwaltung, Import/Export, Voice-Kalibrierung.
- `packages/frontend/src/store/prompterStore.ts`: Tier, Profile, Script, Display, duplicate/rename support.
- `packages/backend/src/support/SupportService.ts`: Ticketpersistenz, Bestaetigungs-E-Mails, 78h Logs.
- `packages/backend/src/routes/api.ts`: Support- und Lizenz-Endpoints.

Bekannte kommende Aenderungen, die in der Doku frueh sichtbar sein muessen:

- VPS/Public-MVP-Rollout
- Basic-Tier Werbe-/Upgrade-Modell fuer Hostinger-Go-Live
- Lizenz-Kill-Switch / Revocation-Runbook
- Tally / On-Air-Preview-Schnittstelle
- Screen-Presets und weitere Layout-Automation
- Weiterer ASR-/Voice-Tracking-Feinschliff

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
| ---- | ------ | ------- |
| Frontend Build | PASS | Vite Build inkl. PWA-Dateien erfolgreich |
| Backend Build | PASS | TypeScript Build erfolgreich |
| Frontend Tests | PASS | 30/30 Tests bestanden |
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

- Bundle-Groesse

- Risiko: langsameres Initial-Load auf schwachen Clients.
- Status: beobachtet, aber kein Blocker fuer MVP-LAN-Test.

- NDI produktiv noch nicht verifiziert

- Risiko nur fuer Broadcast-Integrationsphase; fuer MVP-LAN nicht blockierend.

- UI-Editor Warnung (Tiptap Duplicate Extension)

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
