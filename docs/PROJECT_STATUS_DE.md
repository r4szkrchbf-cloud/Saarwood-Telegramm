# Projektstand Saarwood Teleprompter

Stand: 2026-07-07 UTC (Code-/Doku-Abgleich, Tier-Regeln, Support-, Layout- und Hotkey-Stand)

## 1. Kurzfazit

Das Projekt ist als Monorepo vollstaendig lauffaehig wiederhergestellt (Frontend, Backend, Electron, Docs).
Build und Tests sind fuer Frontend und Backend gruen.
Der MVP ist fuer den LAN-Einsatz brauchbar, aber wir befinden uns weiterhin in der aktiven Testphase.
Der erste Live-Smoke-Test im Browser wurde erfolgreich durchgefuehrt, die Vorfuehrung von A bis Z ebenfalls.
ASR / Voice Tracking wurde in den Kernablaeufen stabilisiert (Play/Pause-Kopplung, sichtbare Laufzeitdiagnose, Sensitivity, Kalibrierung).
Die Testphase bleibt aktiv, aber der Voice-Pfad ist deutlich robuster und besser bedienbar.
Aktuell ist zusaetzlich der Dokumentationsabgleich aktualisiert: Vorlagen, Support-Logs, TXT-Import und tierabhängige UI-Regeln sind im Code und in der Doku abgebildet.

## 1.1 Delta-Update (neu)

- Bedien- und Layout-Regeln weiter geschaerft:
  - Prompter-Control-Bar sitzt jetzt in allen Layouts unten.
  - Im Split-Modus wird der Projekt-/Sendungsname im Prompter wieder korrekt angezeigt.
  - Im Prompter-Output gibt es oben einen klaren Laufzeitstatus mit `PLAY` / `PAUSE` / `READY` plus aktueller Geschwindigkeit.
  - Im Smartphone-Prompter bleiben nur `V-Mirror`, `Text auf Anfang`, Play/Pause sowie Speed `+`/`-` sichtbar.
  - Room-ID bleibt im Header sichtbar und kopierbar, aber nur auf Desktop/Tablet; auf Smartphone ist der Room-Hinweis ausgeblendet.

- Tastatursteuerung fuer Desktop/Tablet erweitert:
  - `V` schaltet `V-Mirror`.
  - Rotation funktioniert ueber `Q/E`, `[`/`]` sowie `/` fuer `+90°`.
  - `P` oeffnet das getrennte Prompter-Fenster.
  - `N` bleibt Prompter-Neustart mit Bestaetigung.

- Dokumentations- und Roadmap-Block erweitert:
  - Vollabgleich ueber Frontend, Backend und Electron als eigener Pflichtblock vor dem Support-Link-Block definiert.
  - Expert-Roadmap fuer konfigurierbare Uhr im Prompter und erweiterte Fernsteuerung (USB/LAN/WLAN/Stream Deck/Mikrocontroller-Keyboards) als Backlog aufgenommen.
  - Kontakt/Support-Links werden im naechsten Block als PDF-basierte Ressourcen mit separatem Fenster und Download aktiviert.

- Akuter Runtime-Fix umgesetzt (Mehrnutzer + Performance):
  - WebSocket-Sync auf room-scoped Betrieb umgestellt (`?room=...`) statt globalem Shared-State.
  - Zustandssynchronisierung (`SYNC_STATE`) erfolgt jetzt room-lokal.
  - Output-only Clients senden keine Script-/Settings-/Positionsupdates mehr zurueck.
  - Positions-Sync wurde staerker gedrosselt, um Lastspitzen und sichtbares Stottern zu reduzieren.
  - Controller-Only-Absicherung fuer Position aktiviert: pro room wird nur eine Position-Quelle akzeptiert.
  - Room-ID ist in der App sichtbar und per Klick kopierbar (Beta-Tester-Workflow).
  - Dokumentiert in `docs/STATUSBERICHT_MULTIROOM_PERFORMANCE_DE_2026-07-06.md`.

- Lizenz-Haertung fuer Offline-Betrieb umgesetzt:
  - Offline-Freigabe erfolgt nur noch nach kryptografischer Token-Pruefung (Ed25519), nicht mehr rein per Payload-Plausibilitaet.
  - Public Key wird nach erfolgreicher Online-Pruefung im Client gecached und fuer Offline-Verifikation genutzt.
  - Lizenz-Token + Public-Key-Cache werden persistiert, damit Offline-Neustarts stabil funktionieren.
  - Operative Steuerung (Ausgabe/Ablauf/Sperrung) bleibt ueber bestehende Admin-API und `license:admin` CLI zentral verfuegbar.

- Live Public-MVP Basis erfolgreich umgesetzt:
  - VPS auf Linux-Basis neu aufgebaut und als Teleprompter-Ziel konfiguriert.
  - DNS fuer `teleprompter.saarwood.ch` auf produktive VPS-IP gesetzt.
  - Nginx + TLS (Let's Encrypt) aktiv, Domain oeffentlich erreichbar.
  - Systemd-Service fuer Backend aktiv, Health-Checks lokal und oeffentlich gruen.
  - Browser-Smoke-Test positiv (UI, API, WebSocket-Verbindung stabil).
- Vollstaendige Ablaufdokumentation abgelegt in:
  - `docs/STATUSBERICHT_LIVE_SETUP_2026-07-06.md`
  - `docs/SUPPORT_TICKET_OPERATIONS_CLICKUP_DE.md`

- Grosser Statuscheck (Code + Doku + Hostinger) abgeschlossen:
  - Voll-Gates (lint/test/build) fuer Frontend und Backend erneut gruen.
  - Code-Doku-Drift in `APP_ZUGRIFF_DE.md` behoben (Repo-URL, Ports, WS/Health-Beispiele, Testzaehler).
  - Neuer Brainstorming-/Readiness-Bericht angelegt: `docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md`.
- Hostinger Public Beta: **bedingtes GO**
  - Codebasis ist deployfaehig.
  - Vor finalem Go-Live sind Betriebsentscheidungen und Produktionskonfiguration (Domain/TLS/Secrets/CORS) verbindlich abzuschliessen.

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
- Im normalen Prompter-Modus ist die Control-Bar ebenfalls unten angedockt; im Output-only Modus bleibt sie als reine Bedienleiste ohne Header/Settings aktiv.
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
- Smartphone-Layout ist jetzt aktualisiert: nur `editor` und `prompter`, keine Titelanzeige, kein `Prompter Fenster` auf Mobile, Vorlagenkarte sichtbar und einklappbar, die Editor-Control-Karte ist unten angedockt und einklappbar, der Mobile-Header zeigt nur `SAARwooD Teleprompter` ohne Icon und ohne Room-Hinweis, Settings sitzt direkt neben den Umschaltbuttons `Editor`/`Prompter`, die Output-Ansicht entspricht `?view=prompter&output=1`.
- Im Smartphone-Prompter-Modus wurde die Bedienung weiter verdichtet: keine numerische Speed-Eingabe, nur `+`/`-`, nur `V-Mirror`, und ein groesserer Play/Pause-Button fuer sichere Live-Bedienung.
- Im Smartphone-Prompter-Modus liegen `Text auf Anfang`, Play/Pause, Mirror und Speed in einer gemeinsamen Bedienzeile; die Speed-Tasten `+`/`-` sind vertikal angeordnet.
- Die Vorlagenkarte im Editor bleibt im Smartphone-Layout stabil einklappbar (kein automatisches Wiederaufklappen durch Viewport-Resize).
- Werbekonzept fuer die kostenlose Basic-Version vor Hostinger-Go-Live als separates Konzept dokumentiert (`docs/BASIC_TIER_ADS_CONCEPT_DE.md`).
- Das Werbekonzept ist derzeit dokumentiert, aber im Code noch nicht aktiv umgesetzt.

## 1.2 Code-/Doku-Abgleich (aktuell)

Folgende Codebereiche sind derzeit in der Dokumentation abgedeckt und sollen bei Aenderungen zuerst nachgezogen werden:

- `packages/frontend/src/App.tsx`: App-Shell, License-Gate, View-Modi, Output-only View.
- `packages/frontend/src/hooks/useHotkeyManager.ts`: aktuelle Desktop-/Tablet-Hotkeys fuer Mirror, Rotation, Neustart und Prompter-Fenster.
- `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx`: Runtime-Status (`PLAY` / `PAUSE` / `READY`), Titeloverlay und Output-Anzeige.
- `packages/frontend/src/components/Settings/SettingsPanel.tsx`: Support, Vorlagenverwaltung, Import/Export, Voice-Kalibrierung.
- `packages/frontend/src/store/prompterStore.ts`: Tier, Profile, Script, Display, duplicate/rename support.
- `packages/backend/src/support/SupportService.ts`: Ticketpersistenz, Bestaetigungs-E-Mails, 78h Logs.
- `packages/backend/src/routes/api.ts`: Support- und Lizenz-Endpoints.

Bekannte kommende Aenderungen, die in der Doku frueh sichtbar sein muessen:

- VPS/Public-MVP-Rollout
- Basic-Tier Werbe-/Upgrade-Modell fuer Hostinger-Go-Live
- PDF-Aktivierung fuer Kontakt/Support-Ressourcen
- Expert-Tier Fernsteuerung via USB/LAN/WLAN und externe Steuerhardware
- Lizenz-Kill-Switch / Revocation-Runbook
- Tally / On-Air-Preview-Schnittstelle
- Screen-Presets und weitere Layout-Automation
- Weiterer ASR-/Voice-Tracking-Feinschliff

## 2. Aktueller technischer Ist-Stand

### Frontend (`packages/frontend`)

- Build: PASS (`tsc && vite build`)
- PWA-Build erfolgreich (Service Worker und Manifest erzeugt)
- Kernfunktionen vorhanden: Editor, Prompter-Render, Controls, Mirror/Rotation, Settings, Speech-Tracking, WebSocket-Sync
- Split-/Prompter-Titelanzeige, Runtime-Status, Output-only View und Hotkey-Steuerung aktuell im Produktionscode vorhanden
- Warnung beim Build: groesseres Bundle (>500 kB), aktuell kein MVP-Blocker

### Backend (`packages/backend`)

- Build: PASS (`tsc`)
- Tests: PASS (9/9)
- REST, WebSocket, MOS-Handler, NDI-Adapter (Stub/Fallback) vorhanden

### Electron (`packages/electron`)

- Build-Pipeline vorhanden
- Zweitmonitor-Output (`Monitor 2 Vollbild`) vorhanden
- Desktop-App startet Backend mit und laeuft standardmaessig im Expert-Tier

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
- `docs/STATUSBERICHT_SOLL_IST_DE_2026-07-07.md` (inkl. Delta-Update Support-Mailflow, Hostinger-DNS und Exit-Code-5-Einordnung)
