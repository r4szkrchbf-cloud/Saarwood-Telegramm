# Code- und Doku-Abgleich Saarwood Teleprompter

_Stand: 2026-07-07_

Dieses Dokument ist die zentrale Referenz dafuer, welche Funktionen im aktuellen Code bereits vorhanden sind und welche bekannten Erweiterungen in der Doku bereits mitgedacht werden muessen.

## 1. Aktueller Code-Stand

### Frontend
- App-Shell in `packages/frontend/src/App.tsx` mit Editor, Split-View, Prompter-View und Settings-Drawer.
- Teleprompter-Output als Output-only-Ansicht via `?view=prompter&output=1`.
- Normale Prompter-Ansicht und Output-only Ansicht nutzen beide die unten angedockte Prompter-Control-Bar.
- Display-Steuerung: Scroll-Speed, Play/Pause, Reset, Richtungswechsel, Horizontal- und Vertikalspiegelung, Rotation.
- Desktop-/Tablet-Hotkeys: `Space`, `+/-`, `V`, `Q/E`, `[`/`]`, `/`, `P`, `N`, `Esc`, `F`.
- Prompter-Output zeigt oben einen Laufzeitstatus (`PLAY` / `PAUSE` / `READY`) sowie die aktuelle Geschwindigkeit.
- Projekt-/Sendungsname als eigener Titelpfad mit Einblendung in Editor, Split und Prompter.
- Smartphone-Layout: nur `editor` und `prompter`, keine Titelanzeige, kein `Prompter Fenster` auf Mobile, Vorlagenkarte und Editor-Control-Karte einklappbar.
- Smartphone-Prompter-Ansicht folgt funktional dem Output-Modus `?view=prompter&output=1`.
- Room-ID ist im Controller sichtbar und kopierbar, aber nur auf Desktop/Tablet; auf Smartphone bleibt der Room-Hinweis ausgeblendet.
- Professional: Groesse und Schriftfarbe der Titelanzeige konfigurierbar.
- Expert: persistierte Projekt-/Sendungsnamen-Bibliothek mit CSV/TXT-Import.
- Tiptap-Editor mit Segmentstruktur und synchroner Prompter-Vorschau.
- Voice Tracking mit Web Speech API im Expert-Tier, inklusive Mikrofonwahl, Empfindlichkeit und Kalibrierungs-Assistent.
- Settings-Panel mit Support-Tickets, Support-Links, Support-Logs und lokaler Client-Log-Erfassung.
- Kontakt/Support-Links werden aktuell aus `/api/support/info` geladen; PDF-basierte Aktivierung ist als eigener Folgeblock geplant.
- Import/Export fuer Segmente als JSON, CSV, TXT und PDF; Drucken nur ausserhalb Basic.
- Template-Verwaltung unter dem aktuellen Begriff Telepromptervorlagen.
- Desktop-spezifische Funktion fuer Prompter auf zweitem Monitor im Vollbild.

### Electron
- Desktop-App startet Backend mit und stellt `Monitor 2 Vollbild` fuer die separate Prompter-Ausgabe bereit.
- Electron laeuft standardmaessig im Expert-Tier.

### Tier-Regeln im UI
- Basic: kein Cue-Marker, kein Voice Tracking, kein Drucken, kein JSON-Export, kein TXT-Export, kein Vorlagen-Import, keine Vorlagenverwaltung.
- Basic: Segment-Import nur aus TXT-Dateien.
- Professional: Cue-Marker, Vorlagen speichern/anlegen/umbenennen/anwenden.
- Expert: zusaetzlich Vorlagen duplizieren, exportieren und importieren sowie Voice Tracking/Kalibrierung.

### Backend
- REST-API und WebSocket-Sync fuer Steuerung und Editor-State.
- WebSocket-Sync ist room-basiert; Output-only Clients senden keine Script-/Settings-/Positionsupdates zurueck.
- Support-Service mit Ticket-Persistenz und automatischer Bestätigungs-E-Mail an den Absender.
- Support-Log-Pipeline fuer die letzten 78 Stunden mit geschuetztem Zugriff.
- MOS- und NDI-Abstraktion im Backend vorhanden.
- Lizenz-/Zugriffsplanung ist dokumentiert, aber die operative produktive Rolle wird separat ueber Lizenzdokumente gesteuert.

### Datenmodell / Store
- Zustand-Store in `packages/frontend/src/store/prompterStore.ts` fuer Display, Script, Profile und Tier.
- Telepromptervorlagen koennen gespeichert, umbenannt, dupliziert und angewendet werden.
- `duplicateProfile()` und `renameProfile()` sind Teil des aktuellen Stores.
- Projekt-/Sendungsnamen werden als eigene Bibliothek persistiert und sind getrennt von Telepromptervorlagen verwaltbar.

## 2. Was in den Benutzer-Dokumenten jetzt explizit mit abgedeckt sein muss

- Der Terminus **Telepromptervorlagen** statt Presenter Profiles.
- Der Support-Tab mit Ticket, Support-Logs und Support-Links.
- TXT-Import als Basis-Format.
- Tierabhängige Sichtbarkeit und Rechte.
- Output-only-Ansicht fuer Ausgabe-Clients.
- Voice Tracking als Expert-Funktion mit Kalibrierung.
- Desktop-/Tablet-Hotkeys fuer Mirror, Rotation und separates Prompter-Fenster.
- Laufzeitstatus im Prompter mit klarer Zustandszuordnung `PLAY` / `PAUSE` / `READY`.
- Desktop-only Room-Kopie im Controller-Header.

## 3. Bekannte Erweiterungen und Aenderungen, die dokumentiert werden muessen

Diese Punkte sind bereits als naechste Schritte bekannt und sollen bei Codeaenderungen frueh in den Dokus gespiegelt werden:

- Bundle-Splitting / Performance-Optimierung im Frontend.
- PDF-Aktivierung der Kontakt/Support-Ressourcen in separatem Fenster mit Download.
- Vollabgleich aller drei Projekte vor dem Support-Link-Block.
- Hostinger-VPS / Public-MVP-Rollout mit oeffentlicher WebSocket-Topologie.
- Lizenz-Kill-Switch und Support-Runbook fuer Sperrung / Ausgabe / Revocation.
- Plattform-Baukasten fuer mehrere Apps mit API- und Event-Vertraegen.
- Tally-Schnittstelle fuer On-Air / Preview.
- Screen-Presets und automatische Bildschirmanpassung.
- Expert-Tier Fernsteuerung via USB/LAN/WLAN sowie Stream Deck / Mikrocontroller-Keyboards.
- Weitere Verfeinerung von Voice Tracking und ASR-Stabilitaet.

## 4. Doku-Disziplin fuer kuenftige Aenderungen

Wenn sich Code aendert, sollten diese Dokumente zuerst oder zeitgleich aktualisiert werden:

- `docs/PROJECT_STATUS_DE.md`
- `docs/TEST_MVP.md`
- `docs/SAARwooD_BESCHREIBUNG_BETA_V1_DE.md`
- `docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md`
- `docs/BETA_V1_RELEASE_NOTES.md`
- `docs/BACKLOG.md`

Damit bleiben Produktstand, Tester-Fuehrung und technische Roadmap synchron.
