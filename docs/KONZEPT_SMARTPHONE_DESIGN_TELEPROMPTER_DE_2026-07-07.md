# Konzept: Smartphone-Design Teleprompter

Stand: 2026-07-07
Status: Entwurf fuer Umsetzung nach Brainstorming

## 1. Zielbild

Das Smartphone-Design wird als eigene Produktoberflaeche behandelt, nicht als verkleinerte Tablet/Desktop-Variante.
Fokus: maximale Bedienklarheit im Live-Betrieb mit Einhand-Logik und minimaler visueller Dichte.

## 2. Verbindliche Produktentscheidungen

1. Smartphone-Views werden auf zwei Modi reduziert:
- `editor`
- `prompter` (inkl. Output-Nutzung)

2. Rotationssteuerung in der App entfällt auf Smartphone und Tablet:
- Keine UI fuer 90/270 Grad in Mobile-Kontext.
- Drehung erfolgt ueber Geraeteausrichtung.

2.1 Smartphone-Ausrichtung ist verbindlich Hochkant:
- Smartphone-Ansicht wird nur im Hochkantmodus dargestellt.
- Bei Querformat auf Smartphones wird eine Sperransicht mit Drehhinweis angezeigt.
- Tablet/Desktop bleiben von dieser Sperre ausgenommen.

3. Smartphone-Layout bleibt streng reduziert:
- Auf dem Smartphone gibt es nur `editor` und `prompter`.
- Der Button `Prompter Fenster` faellt auf Smartphone komplett weg.
- Die Vorlagenkarte im Editor und die Control-Karte mit `Text auf Anfang` / `Voice ON/OFF` sind einklappbar.
- Die Vorlagenkarte liegt auf Smartphone unterhalb des Editor-Inhalts.
- Die Control-Karte liegt auf Smartphone am unteren Bildschirmrand.
- Die Smartphone-Prompter-Ansicht entspricht funktional dem Output-Modus `?view=prompter&output=1`.

3.1 Prompter-Modus-Bedienung (Smartphone):
- Keine numerische Speed-Eingabe
- Speed-Steuerung nur ueber `+` / `-`
- Spiegelung nur ueber `V-Mirror`
- Play/Pause wird als groesserer Hauptbutton dargestellt
- `Text auf Anfang`, Play/Pause, Mirror und Speed liegen in einer gemeinsamen horizontalen Bedienzeile
- Speed `+` / `-` sind in dieser Zeile vertikal gestapelt

4. Titel-Funktionen entfallen auf Smartphones:
- Keine Titel-Einblendung
- Keine Titel-Steuerung
- Kein Room-Hinweis im Smartphone-Header
- Kein Header-Icon auf Smartphone; sichtbar bleibt nur `SAARwooD Teleprompter`
- Settings-Button steht direkt neben den Umschaltbuttons `Editor`/`Prompter`
- Grund: Platzprioritaet fuer Kernsteuerung

4.1 Vorlagenkarte im Editor (Smartphone):
- Einklappbar ueber eigenen Toggle
- Collapse-Zustand bleibt beim Viewport-Resize erhalten (kein erzwungenes Wiederaufklappen)

5. Prompter-Neustart bleibt auf Smartphone erhalten:
- Sichtbar, aber visuell kompakter
- Klar vom Stop/Reset unterscheidbar

6. Geschwindigkeit bleibt voll bedienbar auf Smartphone:
- Zahleneingabe
- `+` / `-`

7. Pflicht-Controls im Prompter-/Output-View immer sichtbar:
- Start
- Pause
- Text auf Anfang
- Geschwindigkeit `+` / `-`
- Geschwindigkeits-Zahleneingabe (auf <360px optional einklappbar)

8. Editor-Modus wird entlastet:
- Keine Prompter-Steuerungstasten im Editor-Modus
- Keine Titel-Steuerung im Editor-Modus

## 3. Informationsarchitektur Smartphone

### 3.1 Editor-View (Smartphone)

Sichtbar:
- Script-Editor
- Kern-Editorfunktionen
- einklappbare Vorlagenkarte
- Wechsel zum Prompter-View

Nicht sichtbar:
- Play/Pause/Start/Reset Controls
- Prompter-Fenster-Button
- Titel-Steuerung
- Rotationssteuerung

### 3.2 Prompter-View (Smartphone)

Sichtbar:
- Prompter-Text
- Pflicht-Controls (Start, Pause, Text auf Anfang, Speed +/-, Speed-Wert)
- Prompter-Neustart (kompakt)
- entspricht dem Output-Modus `?view=prompter&output=1`

Nicht sichtbar:
- Titel-Steuerung
- Rotationssteuerung
- Sekundaere Panels mit niedriger Live-Relevanz

## 4. UI/UX-Richtlinien fuer Mobile

1. Touch-Targets mindestens 44px Hoehe.
2. Primare Live-Controls in Daumenreichweite (untere Zone).
3. Header auf Smartphone stark reduziert.
4. Keine parallelen Steuerbloecke mit gleicher Bedeutung.
5. Hohe Kontraste fuer Outdoor-/Studio-Licht.

## 5. Tablet-Regel (vorlaeufig)

Tablet-Design bleibt im aktuellen Zyklus unveraendert.
Anpassungen am Tablet erfolgen erst nach Auswertung realer User-Bewertungen aus dem Live-Test.

## 5.1 Output-Strategie (kurzfristig)

Variante A ist beschlossen:

1. `output=1` bleibt bestehen (keine brechende Umstellung im Live-Test).
2. Auf Smartphone wird `output=1` funktional an den neuen Prompter-View angeglichen.
3. Pflicht-Controls bleiben auch dort sichtbar, um Bedienkonsistenz sicherzustellen.

## 6. Technische Auswirkungen (Frontend)

Betroffene Bereiche:
- `packages/frontend/src/App.css`
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/Controls/ControlPanel.tsx`
- `packages/frontend/src/components/Settings/SettingsPanel.tsx`
- `packages/frontend/src/store/prompterStore.ts`

Umsetzungsrichtung:
1. View-Reducer fuer Smartphone aktivieren (editor/prompter).
2. Rotation-Settings fuer Mobile ausblenden/deaktivieren.
3. Titel-UI fuer Smartphone ausblenden.
4. Pflicht-Controls im Prompter-/Output-View fix sichtbar halten.
5. Editor-View von Prompter-Steuerungen befreien.

## 7. Risiken und Gegenmassnahmen

1. Risiko: Zu starke Reduktion reduziert Flexibilitaet.
- Gegenmassnahme: Tablet-Feinschnitt als separaten Entscheidpunkt belassen.

2. Risiko: Output-View mit Controls widerspricht bisheriger Erwartung.
- Gegenmassnahme: Klarer Modusname und QA-Abnahme fuer Live-Betrieb.

3. Risiko: Regression auf Desktop durch gemeinsame Komponenten.
- Gegenmassnahme: Mobile-Regeln strikt breakpoint-basiert kapseln.

## 8. Abnahmekriterien

1. Smartphone zeigt nur editor/prompter Views.
2. Rotationssteuerung ist auf Smartphone/Tablet nicht mehr sichtbar.
3. Titel-Steuerung ist auf Smartphone nicht sichtbar.
4. Pflicht-Controls sind im Prompter-/Output-View permanent vorhanden.
5. Speed-Zahleneingabe ist auf <360px erreichbar und optional einklappbar.
6. `output=1` bleibt kompatibel und entspricht auf Smartphone der neuen Prompter-Logik.
7. Editor-View zeigt keine Prompter-Steuerung.
8. M-01 bis M-06 aus Tester-Guide laufen ohne neue kritische Fehler.

## 9. Offene Fragen fuer Meeting

1. Welche Trigger aus User-Bewertungen fuehren spaeter zu einer Tablet-Anpassung?
2. Wie wird die Einklapp-Interaktion der Speed-Zahleneingabe auf <360px konkret visualisiert?
