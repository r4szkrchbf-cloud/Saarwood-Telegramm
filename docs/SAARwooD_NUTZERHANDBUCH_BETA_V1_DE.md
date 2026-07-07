# <span style="color:#ff3b30;font-weight:800;">SAAR</span><span style="color:#ffffff;font-weight:700;">woo</span><span style="color:#ff3b30;font-weight:800;">D</span> Teleprompter Beta V1 - Nutzerhandbuch

## 1. Start

1. Anwendung im Browser oeffnen.
2. Ansicht waehlen: Editor, Split oder Prompter.
3. Bei Bedarf Settings ueber das Zahnrad oeffnen.
4. Optional: `Prompter Fenster` fuer getrennte Ausgabe oeffnen (`?view=prompter&output=1`).
5. In der Electron-App: `Monitor 2 Vollbild` nutzen, um den Prompter direkt auf den zweiten Bildschirm zu legen.

Auf Smartphones gilt aktuell:

- nur `editor` und `prompter`
- keine Titelanzeige und keine Titel-Steuerung
- kein `Prompter Fenster`-Button
- Vorlagenkarte und Editor-Steuerkarte sind einklappbar
- im Header nur `SAARwooD Teleprompter`, ohne Icon und ohne Room-Hinweis
- Vorlagenkarte sichtbar/einklappbar im Editor, Editor-Steuerkarte unten angedockt
- Settings-Button direkt neben den Umschaltern `Editor`/`Prompter`
- im Prompter-Modus keine numerische Speed-Eingabe, nur `+`/`-`
- im Prompter-Modus nur `V-Mirror`
- im Prompter-Modus groesserer Play/Pause-Button
- die Prompter-Ansicht entspricht dem Output-Modus `?view=prompter&output=1`

## 1.1 Als Web-App auf Tablet/Smartphone speichern (PWA)

Die Seite kann auf mobilen Geraeten wie eine App gespeichert werden.

iPhone/iPad (Safari):

1. `https://teleprompter.saarwood.ch` aufrufen.
2. Teilen-Symbol tippen.
3. `Zum Home-Bildschirm` waehlen.
4. Namen bestaetigen und `Hinzufuegen`.

Android (Chrome):

1. `https://teleprompter.saarwood.ch` aufrufen.
2. Browser-Menue oeffnen.
3. `App installieren` oder `Zum Startbildschirm hinzufuegen` waehlen.

Wichtig:

- Fuer stabilen Offline-Betrieb die App mindestens einmal vollstaendig online laden.
- Danach App einmal schliessen und neu oeffnen, damit Cache/Service Worker sicher aktiv sind.

## 1.2 Offline-Nutzung und Lizenzlogik

Aktueller Betriebsmodus:

1. Erstaktivierung braucht einmal Internet, damit Lizenzstatus + Public Key geladen werden.
2. Danach kann die App offline laufen, wenn der Token kryptografisch gueltig ist.
3. Offline wird die Signatur des Tokens lokal geprueft (Ed25519), nicht nur der Payload.

Wenn offline Aktivierung nicht klappt:

1. Kurz online gehen.
2. Lizenz einmal erfolgreich aktivieren.
3. App neu starten.
4. Danach erneut offline testen.

Hinweis fuer Support/Admin:

- Entzuege (Revocations) sind auf bereits offline getrennten Geraeten erst wirksam, sobald diese wieder online sind.
- Fuer mehr Kontrolle kurze Laufzeiten und kurze Offline-Gnadenfrist vergeben.

## 1.3 Gleicher Prompter auf mehreren Tablets/Smartphones synchron

Damit mehrere Geraete denselben Prompter synchron sehen, muessen sie dieselbe Room-ID verwenden.

Beispiel:

- Controller: `https://teleprompter.saarwood.ch/?room=room-abc123`
- Ausgabe-Geraete: `https://teleprompter.saarwood.ch/?view=prompter&output=1&room=room-abc123`

Vorgehen:

1. Room-ID im Header des Controller-Fensters ablesen.
2. `Room kopieren` tippen.
3. Den Link mit derselben Room-ID auf weitere Geraete oeffnen.

Brauchen alle Geraete dasselbe WLAN?

- Nein, nicht zwingend.
- Entscheidend ist: alle Geraete muessen `teleprompter.saarwood.ch` erreichen und exakt dieselbe `room`-ID nutzen.
- Im echten Offline-LAN-Betrieb ohne Internet brauchen alle Geraete natuerlich dasselbe lokale Netz und einen lokal erreichbaren Server.

## 2. Script bearbeiten

1. Titel oben im Editor setzen.
2. Der Titel dient zugleich als Projektname oder Sendungsname und wird in Import-/Exportvorlagen mitgefuehrt.
3. Segmente bearbeiten oder neue Segmente mit Add segment hinzufuegen.
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
- Bei TXT kann optional eine erste Titelzeile wie `Titel: Abendnachrichten` verwendet werden.
- Bei CSV kann der Projekttitel ueber die Spalte `title` mitgegeben werden.
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
Titel: Abendnachrichten

[Sprecherin 1]: Guten Abend und herzlich willkommen.

[Sprecher 2]: Hier ist der zweite Abschnitt.
```

CSV-Beispiel fuer reine Projekt-/Sendungsnamen-Liste (Expert):

```csv
title
Morgenmagazin
Abendnachrichten
Wahlstudio Spezial
```

## 2.4 Projekt- oder Sendungsname

Ab Professional kann der Script-Titel als Projekt- oder Sendungsname zusaetzlich eingeblendet werden.

- im Editor und Split-Modus als eigene, abgesetzte Titelbox
- im Prompter als graue, transparente Einblendung
- per Button ein- und ausblendbar
- Groesse und Schriftfarbe sind in `Einstellungen` sowie direkt im Editor-/Split-Modus anpassbar
- die graue Titelbox passt sich automatisch an die Textlaenge und die eingestellte Titelgroesse an
- die Titelbox besitzt einen kleinen, aber sichtbar abgesetzten Rand
- in Telepromptervorlagen mitgespeichert, damit der Titel nicht jedes Mal neu eingegeben werden muss

Ab Expert gibt es zusaetzlich eine eigene Projekt-/Sendungsnamen-Bibliothek.

- Projekt- oder Sendungsnamen koennen gespeichert, umbenannt, geloescht und angewendet werden
- die Liste wird alphabetisch sortiert angezeigt
- CSV- oder TXT-Listen koennen importiert werden
- CSV kann z. B. die Spalte `title`, `name`, `projekt` oder `sendung` verwenden

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

## 5.1 Tablet-/Smartphone-Layout (automatische Anpassung)

Ab dem aktuellen Stand passt sich die Oberflaeche auf kleinen Displays besser an:

1. Header und Statuschips umbrechen sauber statt zu ueberlaufen.
2. Control-Bar ist auf Tablet/Mobile kompakter und besser touchbar.
3. Prompter-Schrift wird auf kleinen Viewports automatisch begrenzt, damit Text nicht uebergross startet.

Wichtig zur Browser-Leiste:

- Die echte Browser-UI (Tabs/Adressleiste) kann die Web-App selbst nicht hart abschalten.
- Fuer ein moeglichst cleanes Bild auf Tablet/Desktop: PWA installieren oder Vollbildmodus nutzen (`f`/`F`).
- Auf Smartphones bleibt das bisherige Verhalten unveraendert.
- Der Wunsch nach mehr Platz auf Tablets durch Browserleisten-Strategie ist als Backlog-Punkt fuer spaetere Versionen erfasst.

Empfehlung fuer den Live-Betrieb auf Mobilgeraeten:

1. Ausgabe-Geraete immer mit `output=1` starten.
2. Auf dem Controller nur noetige Panels offen lassen.
3. Vor Show-Beginn je Geraet einmal Schriftgroesse und Zeilenhoehe pruefen.

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

## 10. Hinweis zur kostenlosen Basic-Version

Vor der oeffentlichen Hostinger-Freigabe der kostenlosen Basic-Version wird das Werbe- und Upgrade-Modell separat festgelegt.
Aktuelle Produktempfehlung fuer die Diskussion:

- Professional und Expert bleiben werbefrei.
- Basic kann spaeter interne Upgrade-Hinweise enthalten.
- Fuer Prompterbild und Output ist eine kleine, deutliche, aber nicht dominante Werbe-/Upgrade-Einblendung als moegliche Option vorgemerkt.
- Vor technischer Umsetzung wird diese Platzierung gesondert diskutiert und freigegeben.
