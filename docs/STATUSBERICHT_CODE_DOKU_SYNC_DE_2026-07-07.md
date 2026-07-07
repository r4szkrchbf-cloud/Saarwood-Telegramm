# Statusbericht Code-Doku-Abgleich 2026-07-07

## Ziel

Vor dem Block `Kontakt/Support-PDF-Links aktiv schalten` wurde ein kompletter Soll-Ist-Abgleich zwischen den drei Projekten

- Frontend
- Backend
- Electron

und der zentralen Produktdokumentation durchgefuehrt.

## Ergebnis

Der aktuelle Produktstand ist jetzt in den Fuehrungsdokumenten nachgezogen.

Abgeglichen wurden insbesondere:

1. View-Modi `editor`, `split`, `prompter` und `output=1`
2. Smartphone-/Tablet-/Desktop-Layoutregeln
3. Hotkeys fuer Desktop/Tablet (`V`, `Q/E`, `[ ]`, `/`, `P`, `N`, `Space`, `Esc`)
4. Room-basierte Synchronisation und Desktop-Only Room-Kopie
5. Runtime-Status im Prompter (`PLAY` / `PAUSE` / `READY` + Speed)
6. Split-Titelanzeige und Projekt-/Sendungsnamen-Logik
7. Tier-Gating fuer Basic / Professional / Expert
8. Expert-Roadmap fuer Uhr, Fernsteuerung und externe Steuerhardware
9. Status des Basic-Werbekonzepts (dokumentiert, noch nicht im Code aktiv)
10. Reihenfolge der naechsten Arbeitsbloecke vor Aktivierung der Support-PDF-Links

## Aktualisierte Dokumente

- `docs/PROJECT_STATUS_DE.md`
- `docs/CODE_DOC_SYNC_DE.md`
- `docs/BETA_TESTER_GUIDE.md`
- `docs/TEST_MVP.md`
- bereits zuvor nachgezogen und weiterhin gueltig:
  - `docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md`
  - `docs/BETA_V1_RELEASE_NOTES.md`
  - `docs/SAARwooD_BESCHREIBUNG_BETA_V1_DE.md`
  - `docs/BACKLOG.md`

## Festgehaltene offene Folgearbeiten

1. Kontakt/Support-Ressourcen als PDF bereitstellen
2. PDFs in getrenntem Fenster oeffnen und Download anbieten
3. Expert-Uhr im Prompter und Output-Fenster konfigurierbar machen
4. Expert-Fernsteuerung ueber USB / LAN / WLAN / Stream Deck / Mikrocontroller konzipieren

## Bewertung

Code- und Doku-Stand sind fuer den aktuellen Beta-Zustand wieder auf demselben Arbeitsstand.
Der naechste Funktionsblock soll erst nach diesem Abgleich mit den PDF-basierten Kontakt/Support-Links beginnen.