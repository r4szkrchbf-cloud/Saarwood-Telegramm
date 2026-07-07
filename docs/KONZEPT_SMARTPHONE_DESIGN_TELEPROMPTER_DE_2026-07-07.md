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

3. Titel-Funktionen entfallen auf Smartphones:
- Keine Titel-Einblendung
- Keine Titel-Steuerung
- Grund: Platzprioritaet fuer Kernsteuerung

4. Prompter-Neustart bleibt auf Smartphone erhalten:
- Sichtbar, aber visuell kompakter
- Klar vom Stop/Reset unterscheidbar

5. Geschwindigkeit bleibt voll bedienbar auf Smartphone:
- Zahleneingabe
- `+` / `-`

6. Pflicht-Controls im Prompter-/Output-View immer sichtbar:
- Start
- Pause
- Text auf Anfang
- Geschwindigkeit `+` / `-`
- Geschwindigkeits-Zahleneingabe

7. Editor-Modus wird entlastet:
- Keine Prompter-Steuerungstasten im Editor-Modus
- Keine Titel-Steuerung im Editor-Modus

## 3. Informationsarchitektur Smartphone

### 3.1 Editor-View (Smartphone)

Sichtbar:
- Script-Editor
- Kern-Editorfunktionen
- Wechsel zum Prompter-View

Nicht sichtbar:
- Play/Pause/Start/Reset Controls
- Titel-Steuerung
- Rotationssteuerung

### 3.2 Prompter-View (Smartphone)

Sichtbar:
- Prompter-Text
- Pflicht-Controls (Start, Pause, Text auf Anfang, Speed +/-, Speed-Wert)
- Prompter-Neustart (kompakt)

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

Da aus Team-Feedback gewuenscht: gleiche Entfernung der Rotationssteuerung und Titelsteuerung fuer Smartphone und Tablet.
Finale Tablet-Abgrenzung wird im Brainstorming final beschlossen.

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
5. Editor-View zeigt keine Prompter-Steuerung.
6. M-01 bis M-06 aus Tester-Guide laufen ohne neue kritische Fehler.

## 9. Offene Fragen fuer Meeting

1. Soll Output-View auf Smartphone weiterhin denselben URL-Parameter (`output=1`) nutzen oder in den normalen prompter-View aufgehen?
2. Sollen Tablet-Geraete langfristig eine Zwischenstufe bekommen (mehr als Smartphone, weniger als Desktop)?
3. Welche Mindestbreite erhaelt die Geschwindigkeits-Zahleneingabe auf sehr kleinen Displays?
