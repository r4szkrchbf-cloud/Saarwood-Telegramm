# Brainstorming-Meeting: Smartphone-Design Teleprompter

Stand: 2026-07-07
Owner: Produkt + Frontend

## Ziel des Meetings

Ein belastbares Smartphone-Layoutkonzept fuer den Teleprompter definieren, das bewusst von Tablet/Desktop-Regeln getrennt ist und den Live-Test vorbereitet.

## Warum jetzt

- Im Backlog ist Smartphone-Design als eigener P0-Punkt verankert (TICKET-031).
- Die Doku fordert explizit: Smartphone zuerst, nicht 1:1 von Tablet ableiten.
- Fuer den Live-Test brauchen wir klare mobile Bedienlogik (Einhand, Priorisierung, Touch-Sicherheit).

## Bereits bekannte Grundlagen aus Code und Doku

### Produkt-/Doku-Basis

- Smartphone-spezifische Strategie ist bereits als Muss formuliert.
  Quelle: docs/BACKLOG.md (TICKET-031)
- Tablet-/Smartphone-Anpassungen sind bereits teilweise umgesetzt (Header-Umbruch, kompaktere Controls, Font-Cap).
  Quelle: docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md (Abschnitt 5.1)
- Testfaelle fuer Mobile/Responsive sind vorhanden (M-01 bis M-06).
  Quelle: docs/BETA_TESTER_GUIDE.md (Checkliste 7)
- Strategische Vorgabe: Smartphone-Design zuerst, dann Tablet/Desktop-Polish.
  Quelle: docs/SAARWOOD_UNIFIED_ADMIN_SEO_ROADMAP_DE.md (Phase 0)

### Technische Basis im Frontend

- Es gibt responsive Regeln fuer <= 768px und <= 1024px.
  Quelle: packages/frontend/src/App.css
- In Split-View wird auf kleinen Screens standardmaessig der Editor ausgeblendet.
  Quelle: packages/frontend/src/App.css
- Fontsize im Prompter wird adaptiv nach Viewport-Hoehe/Breite begrenzt.
  Quelle: packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx
- Project-Title-Font hat unter 1024px einen zusaetzlichen Cap.
  Quelle: packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx

## Aktuelle Beobachtungen / Problemraum

1. Smartphone ist aktuell nur teilweise dediziert designt, eher responsive heruntergebrochen.
2. Priorisierung der Controls fuer Einhand-Bedienung ist noch nicht final entschieden.
3. Header/Status-Information kann auf kleinen Screens noch zu dicht wirken.
4. Es fehlt eine verbindliche mobile Informationshierarchie pro View (editor/split/prompter).
5. Orientierung/Oberflaechenzustand (Portrait/Landscape) braucht klare Regeln fuer Live-Betrieb.

## Neue Leitplanken aus Team-Feedback (verbindlich zu diskutieren)

1. Auf Smartphones gibt es nur zwei Ansichten:
- `editor`
- `prompter` (inkl. Output-Nutzung)

2. Rotationssteuerung faellt fuer Smartphone und Tablet weg:
- 90/270 Grad Rotation wird nicht mehr in der App angeboten.
- Geraeterotation erfolgt ueber das Smartphone/Tablet selbst.

3. Settings auf Smartphone/Tablet entschlacken:
- Titel-Einblendung und Titel-Steuerung entfallen wegen Platzmangel.
- Prompter-Neustart bleibt vorhanden, aber kompakter dargestellt.

4. Pflicht-Controls im Prompter-Output:
- Start
- Pause
- Text auf Anfang
- Geschwindigkeit `+` und `-`
- Geschwindigkeits-Zahleneingabe

5. Editor-Modus vereinfachen:
- Prompter-Steuerungstasten sind im Editor-Modus nicht sichtbar.
- Titel-Steuerung ist im Editor-Modus auf Smartphone nicht sichtbar.

## Meeting-Outputs (Definition of Done)

Nach dem Meeting muessen folgende Entscheidungen feststehen:

1. Smartphone-Informationshierarchie pro View (was ist sichtbar, was ist sekundar).
2. Einhand-Control-Set fuer Live-Betrieb (minimaler Kernsatz).
3. Layout-Regeln fuer <= 480px, <= 768px und Landscape-Smartphone.
4. Touch-Targets, Spacing und Typografie-Regeln fuer kleine Screens.
5. Umsetzungsplan fuer naechsten UI-Release (max. 2 Iterationen).
6. Testplan-Update mit messbaren Mobile-Kriterien fuer Live-Test.
7. Verbindlicher Entscheid, ob Tablet dieselbe reduzierte Steuerlogik wie Smartphone nutzt.

## Vorschlag: 60-Minuten-Agenda

1. 0-10 min: Kontext und harte Anforderungen
- TICKET-031 + mobile Testfaelle + Live-Test-Zielbild

2. 10-25 min: UX-Problem-Mapping Smartphone
- Wo verlieren wir Platz?
- Welche Controls sind wirklich kritisch waehrend Live-Betrieb?

3. 25-40 min: Konzeptentscheidungen
- Informationshierarchie
- Navigation/Panel-Strategie
- Einhand-Control-Zonen

4. 40-50 min: Technische Machbarkeit und Risiko
- Bestehende CSS/Prompter-Logik vs. notwendige Umbauten
- Regression-Risiken in split/prompter/output-only

5. 50-60 min: Entscheidungen final + Action Items
- Ticket-Schnitt
- Verantwortliche
- Termin fuer Design-Review + Implementierungsstart

## Rollen im Meeting

- Moderator: Produkt/Projektleitung
- UX Lead: priorisiert mobile Bedienlogik
- Frontend Lead: technische Machbarkeit und Aufwand
- QA Lead: Testkriterien M-01 bis M-06 + Live-Test-Abdeckung
- Ops/Support: reale Nutzungsszenarien (Stress, Dauerbetrieb, Fehlerfall)

## Vorbereitungsaufgaben (vor Meeting)

1. 3 reale Smartphone-Screenshots pro View sammeln (editor/split/prompter).
2. Aktuelle Pain Points aus Testerfeedback als kurze Liste vorbereiten.
3. Mobile Testfaelle M-01 bis M-06 mit aktueller Ampel markieren.
4. 1 Vorschlag fuer "Minimal Control Set" im Live-Betrieb mitbringen.

## Leitfragen fuer Brainstorming

1. Welche 3 Aktionen muessen auf Smartphone immer in <= 1 Tap erreichbar sein?
2. Welche UI-Elemente duerfen auf Smartphone nur sekundar/ausklappbar sein?
3. Wie verhindern wir Fehlbedienung bei schnellen Live-Korrekturen?
4. Welche Unterschiede brauchen wir zwischen Operator-Smartphone und Output-Smartphone?
5. Wann erzwingen wir proaktiv prompter-first statt split-view?
6. Soll fuer Tablet exakt dieselbe Entschlackung wie Smartphone gelten oder eine leichte Mittelstufe?

## Konkrete Arbeits-Hypothesen (zur Diskussion)

1. Smartphone-Default ist prompter-first, nicht split-first.
2. Live-Control-Bar bekommt ein reduziertes Kernset (Play/Pause, Speed +/- , Stop, Reset).
3. Sekundaere Einstellungen wandern in einen klaren Full-Width Drawer.
4. Header wird auf Smartphone stark entschlackt (Status kondensiert, weniger Chips).
5. Landscape-Smartphone nutzt angepasste Schrift-/Padding-Regeln, nicht nur Skalierung.
6. Die App-Rotation wird auf Mobile komplett entfernt, da Hardware-Rotation ausreichend ist.
7. Titelfunktionen entfallen auf Smartphone vollstaendig zugunsten Bedienflaeche.
8. Prompter-Bedienkern bleibt im Output-View immer sichtbar.

## Risiko-Liste

1. Zu viel Kompression macht wichtige Statusinfos unsichtbar.
2. Touch-Targets zu klein -> Fehlbedienung in Live-Situationen.
3. Unterschiedliche Browser-UI auf iOS/Android sorgt fuer inkonsistente nutzbare Hoehe.
4. Regression in Output-only oder Desktop durch mobile Refactors.

## Entscheidungsvorlage (am Ende ausfuellen)

- Beschlossene Smartphone-Layout-Richtung:
- Beschlossene View-Reduktion (nur editor + prompter):
- Beschlossenes Minimal-Control-Set:
- Beschlossene Regel fuer Output-View Pflicht-Controls:
- Beschlossene Regel zu Rotation (App entfernt / geraeteseitig):
- Beschlossene Regel zu Titel-Funktionen auf Smartphone:
- Beschlossene Breakpoint-Regeln:
- Nicht-Ziele fuer v1:
- Tickets fuer Iteration 1:
- Tickets fuer Iteration 2:
- Owner + Deadline je Ticket:

## Anschluss an bestehende Tickets

- TICKET-031 (Smartphone-Design zuerst)
- TICKET-019 (Screen-Presets + Bildschirmanpassung)

## Referenzen

- docs/BACKLOG.md
- docs/BETA_TESTER_GUIDE.md
- docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md
- docs/SAARWOOD_UNIFIED_ADMIN_SEO_ROADMAP_DE.md
- packages/frontend/src/App.css
- packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx
