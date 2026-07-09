# Saarwood Teleprompter - Beta-Tester-Leitfaden (Langzeittest)

**Version:** Beta V1 (1.0.0-beta.1)  
**Aktualisiert:** 2026-07-05  
**Zweck:** Strukturierter Langzeittest mit echten Nutzern unter realen Sendebedingungen.

Neu in dieser Revision:
- Support-Ticket-Bestaetigung in der App mit Ticket-ID
- Automatische Ticket-Kopie per E-Mail (wenn SMTP konfiguriert)
- Output-only Modus (`?view=prompter&output=1`)
- Non-disruptive Restart (kein Stop fuer reine Ausgabe)
- Desktop-Funktion "Monitor 2 Vollbild" fuer Prompter-Ausgabe
- Lizenz-Status/Gate fuer Beta-Zugriff

Alle Testergebnisse, Fehler und Beobachtungen werden **mit Datum und Uhrzeit** in `docs/TEST_MVP.md` dokumentiert.

---

## Wie testest du?

1. App installieren (siehe `docs/BETA_V1_RELEASE_NOTES.md` → Abschnitt Installation)
2. Testszenarien aus diesem Leitfaden durchgehen
3. **Jeden Befund sofort notieren** — mit Zeitstempel, Browser/Gerät, was du getan hast, was passiert ist
4. Befunde an das Entwicklerteam weitergeben (GitHub Issue oder direkt in TEST_MVP.md eintragen)

---

## Testprofil-Angaben (bitte für jeden Tester ausfüllen)

| Feld | Wert |
|------|------|
| Tester-Name / Alias | |
| Teststart (Datum + Uhrzeit UTC) | |
| Gerät | (z. B. MacBook Pro M2, iPhone 15, Windows 11 PC) |
| Browser + Version | (z. B. Chrome 126, Safari 17, Firefox 127) |
| Installationstyp | Browser / PWA installiert |
| Netzwerk | lokal / WLAN / LAN |
| Backend-Tier | basic / professional / expert (Standard: expert) |

---

## Checkliste 1 — Installation & Erster Start

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| I-01 | App im Browser öffnen | Ladezeit < 3 s, UI vollständig sichtbar | | |
| I-02 | `BETA V1`-Badge im Header sichtbar | Orangefarbener Badge neben Logo | | |
| I-03 | PWA-Installationsprompt erscheint (Chrome/Edge) | „Installieren"-Banner oder Icon in Adressleiste | | |
| I-04 | App als PWA installieren | App öffnet im Standalone-Modus ohne Browser-Chrome | | |
| I-05 | App nach Installation offline öffnen (Flugzeugmodus) | App startet offline, Demoscript sichtbar | | |
| I-06 | Reload der installierten App | Keine Ladeunterbrechung, State erhalten | | |

---

## Checkliste 2 — Editor & Script

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| E-01 | Demo-Script beim Start vorhanden | Zwei Segmente, korrekt formatiert | | |
| E-02 | Neues Segment hinzufügen (+ Add segment) | Leeres Segment erscheint sofort | | |
| E-03 | Text eingeben (100+ Zeichen) | Echtzeit-Darstellung im Prompter (Split-View) | | |
| E-04 | Formatierung: Fett (Ctrl+B) | Text wird fett | | |
| E-05 | Formatierung: Kursiv (Ctrl+I) | Text wird kursiv | | |
| E-06 | Formatierung: Unterstrichen (Ctrl+U) | Text wird unterstrichen | | |
| E-07 | Textfarbe ändern (Toolbar) | Farbe ändert sich im Editor und Prompter | | |
| E-08 | Segment nach oben/unten verschieben | Reihenfolge ändert sich korrekt | | |
| E-09 | Segment löschen | Segment verschwindet, kein UI-Fehler | | |
| E-10 | Cloak Text aktivieren (🚫👁) | Segment zeigt „CLOAKED"-Badge, Prompter blendet aus | | |
| E-11 | Director's Note markieren (📝) | Segment visuell markiert | | |
| E-12 | Script-Titel ändern | Titel persistent nach Reload | | |
| E-13 | 10+ Segmente anlegen (Stresstest) | Keine Verlangsamung, korrekte Darstellung | | |

---

## Checkliste 3 - Teleprompter / Scroll-Engine

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| S-01 | Play-Button (oder Space-Taste) | Scrollen startet sofort, flüssig | | |
| S-02 | Pause (Space oder ❙❙-Button) | Scrollen stoppt an genauer Position | | |
| S-03 | Stop (Esc oder ■-Button) | Zurück zu Position 0 | | |
| S-04 | Geschwindigkeit ändern (Slider / ↑↓ Tasten) | Geschwindigkeit ändert sich sofort | | |
| S-05 | Scrollrichtung umkehren (↕-Button) | Scrollen geht rückwärts | | |
| S-06 | Horizontal-Spiegel (↔ H-Mirror) | Text wird horizontal gespiegelt | | |
| S-07 | Vertikal-Spiegel (↕ V-Mirror) | Text wird vertikal gespiegelt | | |
| S-08 | Rotation +90° (↻ +90°-Button oder `E` / `]` / `/`) | Inhalt dreht sich 90° im UZS | | |
| S-09 | Rotation −90° (↺ −90°-Button oder `Q` / `[`) | Inhalt dreht sich 90° gegen UZS | | |
| S-10 | Rotation alle 4 Stufen (0/90/180/270) | Jede Stufe korrekt, kein Reflow | | |
| S-11 | Spiegel + Rotation kombiniert | Kein visueller Fehler, korrekte Transform-Kombination | | |
| S-12 | Scrollen bei 120 fps (wenn Monitor 120 Hz) | Flüssig ohne Ruckeln | | |
| S-13 | Tab in Hintergrund, zurückkehren | Kein Sprung >50 ms nach Tab-Reaktivierung | | |
| S-14 | Scrollen bei sehr langem Script (5.000+ Wörter) | Keine Verlangsamung, kein Ruckeln | | |
| S-15 | Cue-Marker sichtbar | Horizontale Linie an eingestellter Position | | |
| S-16 | Restart in Split/Editor (zweistufig bestaetigen) | Erst Klick setzt "NeuStart bestaetigen", zweiter Klick fuehrt Reload aus | | |
| S-17 | Restart waehrend aktiver Ausgabe auf zweitem Client | Lokale UI kann neu laden, Ausgabe-Client wird nicht per STOP unterbrochen | | |
| S-18 | Status oben im Prompter pruefen | `PLAY` gruen, `PAUSE` gelb, `READY` blau, Speed sichtbar | | |

---

## Checkliste 4 — Einstellungen & Profile

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| P-01 | Schriftgröße vergrößern (Slider) | Prompter-Text ändert sich sofort | | |
| P-02 | Schriftart wechseln | Prompter-Schrift ändert sich | | |
| P-03 | Zeilenhöhe ändern | Zeilenabstand ändert sich | | |
| P-04 | Textfarbe ändern | Korrekte Farbe im Prompter | | |
| P-05 | Hintergrundfarbe ändern | Korrekte Farbe im Prompter | | |
| P-06 | Textausrichtung (Links/Mitte/Rechts) | Korrekte Ausrichtung | | |
| P-07 | Presenter-Profil speichern | Profil erscheint in der Liste | | |
| P-08 | Profil anwenden | Einstellungen werden übernommen | | |
| P-09 | Profil löschen | Profil verschwindet aus der Liste | | |
| P-10 | Einstellungen nach Browser-Reload erhalten | Alle Werte persistent | | |
| P-11 | Dark Mode umschalten | UI wechselt korrekt | | |

---

## Checkliste 5 — Voice Tracking (Web Speech API)

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| V-01 | Voice Tracking aktivieren (Chrome/Edge) | Mikrofon-Berechtigung angefragt | | |
| V-02 | Text vorlesen | Prompter scrollt automatisch zum gesprochenen Wort | | |
| V-03 | Manuell scrollen → ASR pausiert 2 s | Nach manueller Eingabe keine ASR-Übernahme für 2 s | | |
| V-04 | Browser ohne Web Speech API (Firefox) | Hinweismeldung erscheint statt Toggle | | |

---

## Checkliste 6 - WebSocket Remote Control

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| W-01 | Backend läuft, Frontend verbunden | Grüner WS-Indikator in ControlPanel | | |
| W-02 | Backend nicht erreichbar | Roter Indikator, kein Absturz, Auto-Reconnect | | |
| W-03 | Play-Kommando von zweitem Browser-Tab | Scrollen startet in beiden Instanzen | | |
| W-04 | Script-Update von Tab A sichtbar in Tab B | Echtzeit-Sync ohne Scroll-Unterbruch | | |
| W-05 | Einstellungs-Update sync | Display-Einstellungen sync zwischen Clients | | |
| W-06 | Output-only URL in zweitem Tab (`?view=prompter&output=1`) | Ausgabe sichtbar, keine Settings/Controls/Header in Output-only View | | |
| W-07 | Taste `P` im Controller (Desktop/Tablet) | Getrenntes Prompter-Fenster oeffnet sich | | |

---

## Checkliste 7 — Responsive / Mobile

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| M-01 | Öffnen auf Smartphone (Chrome Android) | Layout korrekt, kein Overflow | | |
| M-02 | Öffnen auf iPad (Safari) | Layout korrekt | | |
| M-03 | PWA auf iOS installieren | Standalone-Modus, kein Browser-Chrome | | |
| M-04 | Touchscreen: Play/Stop/Speed | Buttons reagieren auf Touch | | |
| M-05 | Orientation landscape → portrait | Layout passt sich an | | |
| M-06 | Settings-Drawer auf kleinem Bildschirm | Volle Breite, scrollbar | | |
| M-07 | Smartphone-Editor: Vorlagenkarte einklappen | Vorlagenkarte laesst sich per Button ein-/ausklappen | | |
| M-08 | Smartphone-Editor: Control-Karte einklappen | Card mit Text auf Anfang / Voice ON/OFF laesst sich ein-/ausklappen | | |
| M-09 | Smartphone-Editor: Prompter-Fenster fehlt | Kein `Prompter Fenster`-Button auf Smartphone | | |
| M-10 | Smartphone-Prompter/Output-Ansicht | Entspricht funktional `?view=prompter&output=1` mit Pflicht-Controls | | |
| M-11 | Smartphone-Header reduziert | Nur `SAARwooD Teleprompter`, kein Icon, kein Room-Hinweis | | |
| M-12 | Smartphone-Karten unten | Vorlagenkarte unten im Editor, Control-Karte unten angedockt | | |
| M-13 | Smartphone-Prompter: Speed-Eingabe fehlt absichtlich | Kein numerisches Speed-Feld, nur `+`/`-` | | |
| M-14 | Smartphone-Prompter: Mirror reduziert | Nur `V-Mirror` sichtbar | | |
| M-15 | Smartphone-Prompter: Play/Pause prominent | Play/Pause sichtbar groesser als andere Buttons | | |
| M-16 | Smartphone-Header: Settings neben View-Toggle | Settings-Button steht direkt bei `Editor`/`Prompter` | | |
| M-17 | Smartphone-Prompter: Eine Bedienzeile | `Text auf Anfang`, Play/Pause, Mirror und Speed in einer Reihe | | |
| M-18 | Smartphone-Prompter: Speed-Tasten vertikal | `+` und `-` sind uebereinander angeordnet | | |
| M-19 | Smartphone-Editor: Vorlagenkarte bleibt eingeklappt | Kein automatisches Wiederaufklappen nach Resize/Rotate | | |
| M-20 | Smartphone Querformat-Sperre | Bei Querformat erscheint Hinweis auf Hochkantmodus, App-Inhalt bleibt gesperrt | | |

---

## Checkliste 8 - Performance & Stresstest

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| X-01 | 30-Minuten-Dauerscrollen | Kein Absturz, kein Memory-Leak | | |
| X-02 | Script mit 10.000+ Zeichen live bearbeiten | Kein Einfrieren des Editors | | |
| X-03 | Schnelles Wechseln zwischen View-Modi | Kein Layout-Flicker | | |
| X-04 | 10x schnelles Öffnen/Schließen Settings | Kein State-Fehler | | |
| X-05 | Gerät im Ruhezustand → Aufwecken | Scrollen setzt fort, kein Sprung | | |
| X-06 | CPU-intensiver Tab im Hintergrund | Kein FPS-Einbruch im Prompter | | |

---

## Checkliste 9 - Support-Ticket und Kommunikation

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| T-01 | Support-Felder vollstaendig ausfuellen und Ticket absenden | Ticket wird erstellt, Ticket-ID wird angezeigt (`SWD-YYYY-XXXXXX`) | | |
| T-02 | Ticket-Bestaetigungstext in der App pruefen | Text enthaelt: "Ihr Ticket ist beim Support eingegangen... Ticket-ID ..." | | |
| T-03 | Automatische E-Mail bei aktivem SMTP | Absender erhaelt E-Mail mit Ticket-ID und Kopie (Name, Betreff, Nachricht) | | |
| T-04 | Verhalten ohne SMTP | Ticket wird trotzdem gespeichert, App zeigt Hinweis dass Auto-Mail nicht gesendet werden konnte | | |
| T-05 | Ticket-ID im Backend-Log pruefen | ID in Antwort und gespeicherten Tickets konsistent | | |

---

## Checkliste 10 - Lizenz und Zugriff

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| L-01 | App ohne gueltiges Token starten (Lizenzmodus enforce) | Lizenz-Hinweis/Gate erscheint, geschuetzte Nutzung blockiert | | |
| L-02 | Gueltiges Token aktivieren | Status wird aktiv, App nutzbar | | |
| L-03 | Ungueltiges/abgelaufenes Token aktivieren | Klare Fehlermeldung, kein Aktiv-Status | | |
| L-04 | App neu laden nach Aktivierung | Lizenzstatus bleibt konsistent erhalten | | |

---

## Checkliste 11 - Desktop / Monitor 2 Output (Electron)

| # | Test | Erwartet | Ergebnis | Fehler/Notiz |
|---|------|----------|----------|--------------|
| D-01 | Desktop-App starten, Button "Monitor 2 Vollbild" nutzen | Prompter-Ausgabe oeffnet auf zweitem Monitor im Vollbild | | |
| D-02 | Kein zweiter Monitor angeschlossen | Klare Rueckmeldung, kein Absturz | | |
| D-03 | Ausgabe-Fenster waehrend laufendem Scrollen oeffnen | Ausgabe startet stabil und synchron | | |
| D-04 | Editor/Settings nur im Steuerfenster, nicht im Output | Zweitmonitor zeigt reine Prompter-Ausgabe | | |

---

## Mindestumfang fuer Live-Tester (Pflichtlauf)

Bitte pro Tester mindestens diese Faelle durchfuehren:

1. I-01 bis I-04
2. E-01, E-03, E-08, E-10
3. S-01, S-02, S-04, S-16, S-17
4. W-01, W-04, W-06
5. T-01, T-02, T-03 (oder T-04 wenn SMTP fehlt)
6. L-01 und L-02
7. D-01 bis D-04 (nur Desktop/Electron-Tester)

---

## Fehlermeldungs-Vorlage

Für jeden gefundenen Fehler bitte folgendes Template verwenden:

```
### BUG-[Nummer] — [Kurzbeschreibung]
**Datum/Uhrzeit (UTC):** 
**Tester:** 
**Gerät / Browser:** 
**Reproduzierbar:** ja / nein / manchmal
**Schritte zum Reproduzieren:**
1. 
2. 
3. 
**Erwartet:** 
**Tatsächlich:** 
**Screenshots / Logs:** 
**Schweregrad:** Kritisch / Hoch / Mittel / Niedrig
```

---

## Verbesserungsvorschlag-Vorlage

```
### UX-[Nummer] — [Kurzbeschreibung]
**Datum/Uhrzeit (UTC):** 
**Tester:** 
**Kontext / Use Case:** 
**Vorschlag:** 
**Priorität (Einschätzung):** Hoch / Mittel / Niedrig
```

---

## Abschluss-Feedback (nach Langzeittest)

Bitte am Ende des Testzeitraums folgende Gesamtbewertung ausfüllen:

| Frage | Antwort (1=schlecht, 5=sehr gut) |
|-------|----------------------------------|
| Wie stabil war die App insgesamt? | |
| Wie flüssig war das Scrollen? | |
| Wie intuitiv war die Bedienung? | |
| Würdest du die App im echten Sendebetrieb einsetzen? | |
| Was hat dir am besten gefallen? | |
| Was muss dringend verbessert werden? | |

---

_Alle ausgefüllten Checklisten und Fehlerberichte werden in `docs/TEST_MVP.md` gesammelt._
