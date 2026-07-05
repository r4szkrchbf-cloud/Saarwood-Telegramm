# <span style="color:#ff3b30;font-weight:800;">SAAR</span><span style="color:#ffffff;font-weight:700;">woo</span><span style="color:#ff3b30;font-weight:800;">D</span> Teleprompter Beta V1 - Beschreibung

## Produktueberblick

Der <span style="color:#ff3b30;font-weight:800;">SAAR</span><span style="color:#ffffff;font-weight:700;">woo</span><span style="color:#ff3b30;font-weight:800;">D</span> Teleprompter Beta V1 ist eine browserbasierte Teleprompter-Anwendung fuer Newsroom-, Studio- und Event-Workflows.

Die Anwendung kombiniert:
- Editor und Prompter-Ausgabe in einer Oberfläche
- Getrennte Prompter-Ausgabe als eigenes Output-Fenster (`?view=prompter&output=1`)
- Fernsteuerung via WebSocket
- Laufende Anpassung von Geschwindigkeit, Richtung, Spiegelung und Rotation
- Profile und Anzeigeeinstellungen fuer verschiedene Sprecher
- Electron-Operatorfunktion fuer `Monitor 2 Vollbild` (Studio-Betrieb)

## Ziel der Beta V1

Die Beta V1 dient dem produktionsnahen Feldtest. Fokus ist die Stabilisierung der Kernfunktionen im realen Einsatz.

## Wichtiger Beta-Hinweis

Voice Tracking ist in der aktuellen Beta-Version als nicht enthalten markiert.
Grund ist ein noch nicht stabiler Lauf im realen Betrieb. Bis zur finalen Stabilisierung darf Voice Tracking nicht als verlaessliches Produktionsfeature eingeplant werden.

## Kernfunktionen (Beta V1)

- Script-Editor mit Segmentstruktur
- Prompter-Ausgabe mit Cue-Marker
- Textstart-Logik (Mitte bzw. 3 Zeilen unter Cue-Marker)
- Transportsteuerung (Play, Pause, Text auf Anfang, Prompter NeuStart)
- Geschwindigkeits- und Richtungssteuerung
- Spiegelung und Rotation
- WebSocket-Sync
- PWA-Betrieb auf Desktop und mobilen Geraeten
- Desktop-Operator-Workflow: Prompter-Ausgabe auf zweiten Monitor im Vollbild starten

## Zielgruppe

- Moderation
- Regie
- Redaktions- und Produktions-Teams
- Pilotbetrieb fuer oeffentliche MVP-Tests

## Branding-Konvention

Markenname in Dokumenten und UI:
- SAAR: rot, gross
- woo: weiss, klein
- D: rot, gross

Referenzschreibweise:
<span style="color:#ff3b30;font-weight:800;">SAAR</span><span style="color:#ffffff;font-weight:700;">woo</span><span style="color:#ff3b30;font-weight:800;">D</span>
