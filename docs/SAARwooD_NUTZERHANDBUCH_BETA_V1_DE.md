# <span style="color:#ff3b30;font-weight:800;">SAAR</span><span style="color:#ffffff;font-weight:700;">woo</span><span style="color:#ff3b30;font-weight:800;">D</span> Teleprompter Beta V1 - Nutzerhandbuch

## 1. Start

1. Anwendung im Browser oeffnen.
2. Ansicht waehlen: Editor, Split oder Prompter.
3. Bei Bedarf Settings ueber das Zahnrad oeffnen.
4. Optional: `Prompter Fenster` fuer getrennte Ausgabe oeffnen (`?view=prompter&output=1`).
5. In der Electron-App: `Monitor 2 Vollbild` nutzen, um den Prompter direkt auf den zweiten Bildschirm zu legen.

## 2. Script bearbeiten

1. Titel oben im Editor setzen.
2. Segmente bearbeiten oder neue Segmente mit Add segment hinzufuegen.
3. Fuer Testbetrieb kann in Settings der deutsche 4-Segment-Testtext geladen werden.

## 3. Prompter steuern

Wichtige Buttons:
- Text auf Anfang: stoppt und setzt Position auf 0
- Prompter NeuStart: kompletter App-Neustart mit Reset
- Play/Pause: startet oder pausiert den Lauf
- Richtung: Pfeil runter/hoch fuer Laufrichtung

## 4. Wichtige Tastaturbefehle

- Leertaste: Play/Pause
- r oder R: Text auf Anfang (Reset/Stop)
- n oder N: Prompter NeuStart (mit Bestaetigung)
- Escape: Stop
- + oder = oder NumpadAdd: Geschwindigkeit +5
- - oder _ oder NumpadSubtract: Geschwindigkeit -5
- Pfeil hoch / runter: Richtung
- h / H: Spiegelung horizontal
- [ / ]: Rotation
- f / F: Vollbild umschalten
- v / V: Voice ON
- m / M: Voice OFF

## 5. Anzeigeeinstellungen

Im Settings-Bereich:
- Schriftgroesse
- Schriftart
- Zeilenhoehe
- Text-/Hintergrundfarbe
- Cue-Marker und Cue-Position
- Spiegelung/Rotation ueber Controls

## 6. Voice-Hinweis fuer Beta V1

Voice Tracking ist in dieser Beta-Version nicht als produktionsreifes Feature enthalten.
Bitte den Teleprompter-Betrieb ueber manuelle Steuerung durchfuehren.

## 7. Betriebsempfehlung fuer Live-Einsatz

1. Vor Sendungsstart Verbindungsstatus pruefen.
2. Script-Fassung einfrieren, bevor die Liveschalte beginnt.
3. Geschwindigkeit einmal mit Sprecherprobe kalibrieren.
4. Fuer kritische Sendungen nur getestete Hardware und Browser-Versionen verwenden.

## 8. Fehlerbehebung (Kurz)

- Keine Verbindung: Backend/WS pruefen, Seite neu laden.
- Ruckeln: Browser-Last reduzieren, nicht benoetigte Tabs schliessen.
- Falscher Startpunkt: Cue-Marker-Pruefung in Settings und Position resetten.

## 9. Support-Notiz

Fuer Pilotbetrieb alle Auffaelligkeiten mit Zeitstempel dokumentieren und in die Projektdoku uebernehmen.
