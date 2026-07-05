# LAN Test Checkliste (MVP)

Stand: 2026-07-05
Zweck: Gemeinsame, transparente Testdurchfuehrung mit klaren Schritten und einheitlichem Logging.

## 1. Vor dem Testfenster

1. Git-Stand pruefen
- Branch: main
- Status: sauber oder bewusst dokumentierte Aenderungen

2. Qualitaets-Gates
- npm test
- npm run lint
- npm run build
- Erwartung: PASS, bekannte Chunk-Warnung toleriert

3. Runtime starten
- npm run dev
- Erwartung:
  - Frontend unter http://localhost:3000/
  - Backend auf Port 4000
  - WebSocket-Endpunkt /ws aktiv

## 2. Gemeinsamer Funktionstest (manuell)

1. Start und Verbindung
- Seite laden, keine blockierenden Console-Errors
- Verbindungshinweis im UI vorhanden

2. Kernsteuerung
- Play / Pause / Stop
- Speed up / down
- Reset
- Mirror H/V
- Rotation (0 / 90 / 180 / 270)

3. Editor und Anzeige
- Titel setzen
- Segment anlegen und bearbeiten
- Umschalten zwischen Editor / Split / Prompter
- Hot-Update im Prompter ohne Unterbrechung

4. Profile und Settings
- Anzeigeeinstellungen aendern (Font, Line Height, Farben)
- Profil speichern, anwenden, loeschen

5. ASR / Voice Tracking (aktueller Fokus)
- Voice Tracking aktivieren
- Verhalten beobachten (Scroll-Folge, Fehler, Wiederanlauf)
- Speziell auf bekannte Muster achten:
  - network-Warnungen
  - recognition has already started

## 3. Incident Logging waehrend des Tests

Pro Beobachtung bitte ein Eintrag mit:
1. Zeit (lokal + UTC)
2. Aktion (was wurde getan)
3. Erwartetes Verhalten
4. Tatsächliches Verhalten
5. Severity (Blocker, Hoch, Mittel, Niedrig)
6. Reproduzierbarkeit (immer, haeufig, selten)
7. Screenshot/Log-Hinweis (falls vorhanden)

## 4. Abschluss je Testrunde

1. Kurzfazit erstellen
- GO / NO-GO fuer naechsten Schritt

2. Doku aktualisieren
- docs/TEST_MVP.md (neue Runde)
- docs/FEHLERBEHEBUNGEN.md (relevante Fehler/Behebungen)
- docs/PROJECT_STATUS_DE.md (bei geaendertem Gesamtstatus)

3. Backlog nachziehen
- Ticket-Status aktualisieren
- Neue Findings als Tickets aufnehmen
