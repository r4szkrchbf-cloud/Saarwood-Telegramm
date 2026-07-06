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
4. Import aus TXT ist im Basic-Tier vorgesehen; JSON/CSV/TXT sind in hoehren Tiers verfuegbar.

## 2.1 Import und Export

Im Settings-Bereich koennen Scriptvorlagen und Segmentlisten importiert und exportiert werden.

- TXT eignet sich fuer einfache Manuskripte und Rohfassungen.
- CSV eignet sich fuer strukturierte Segmentlisten aus Tabellen oder Redaktionssystemen.
- JSON eignet sich fuer Vorlagen, Integrationen und vorbereitete Datensaetze.
- PDF eignet sich fuer Lesefassungen, Versand und Druck.

Tier-Regeln:

- Basic: TXT-Import, CSV-Export und PDF-Export
- Professional und Expert: JSON-, CSV- und TXT-Import sowie CSV-, JSON-, TXT- und PDF-Export
- Drucken ist nur ausserhalb des Basic-Tiers verfuegbar

## 2.2 Feldbedeutung bei Importdateien

Je nach Format koennen folgende Felder vorkommen:

| Feld | Bedeutung |
|------|-----------|
| `title` | Titel des gesamten Scripts |
| `segments` | Liste aller Script-Segmente |
| `id` | Technische Kennung eines Segments |
| `speaker` | Optionaler Sprechername; wird als Sprecherzeile dargestellt |
| `text` | Reiner Klartext; die App wandelt ihn beim Import automatisch in HTML um |
| `html` | Bereits formatierter Textinhalt; kann direkt uebernommen werden |
| `isCloaked` | Das Segment wird in der Prompter-Ausgabe fuer den Sprecher ausgeblendet |
| `isDirectorsNote` | Das Segment ist eine Regie-Notiz; Voice Tracking behandelt es nicht als normalen Sprechtext |

Wichtig:

- `html` ist nicht zwingend erforderlich.
- Wenn nur `text` vorhanden ist, erzeugt die App automatisch die benoetigte HTML-Struktur.
- Bei JSON koennen einfache Vorlagen mit `speaker` + `text` verwendet werden.
- Bei TXT koennen Sprecherzeilen direkt als `[Name]: Text` geschrieben werden.

## 2.3 Praktische Beispiele

Einfaches JSON-Beispiel:

```json
{
	"title": "Abendnachrichten",
	"segments": [
		{
			"speaker": "Sprecherin 1",
			"text": "Guten Abend und herzlich willkommen.",
			"isCloaked": false,
			"isDirectorsNote": false
		},
		{
			"speaker": "Regie",
			"text": "Noch nicht freigeben.",
			"isCloaked": true,
			"isDirectorsNote": true
		}
	]
}
```

Einfaches TXT-Beispiel:

```text
[Sprecherin 1]: Guten Abend und herzlich willkommen.

[Sprecher 2]: Hier ist der zweite Abschnitt.
```

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
- Telepromptervorlagen speichern/umbenennen/anwenden je nach Tier
- Support-Bereich mit Ticket, Support-Links und 78h Logzugriff

## 6. Voice-Hinweis fuer Beta V1

Voice Tracking ist im Expert-Tier verfuegbar und kann im passenden Browser aktiviert werden.
Wenn kein Unterstuetzungs-Browser vorhanden ist oder das Feature bewusst klein gehalten werden soll, bleibt die manuelle Steuerung der Default.

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
Support-Tickets und Client-Logs gehoeren in den Support-Prozess, nicht in den Prompter-Workflow.
