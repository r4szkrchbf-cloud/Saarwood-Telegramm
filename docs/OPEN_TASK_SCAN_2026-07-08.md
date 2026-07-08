# Open Task Scan

Stand: 2026-07-08

## Zusammenfassung

- Offene Markdown-Checklistenpunkte gesamt: 164
- Verteilung:
  - `docs/BACKLOG.md`: 155
  - `docs/STATUSBERICHT_GAP_ANALYSE_DE_2026-07-04.md`: 5
  - `docs/DRINGENDE_TODO_2026-07-08.md`: 4

## Marker-Scan (TODO/FIXME/WIP)

- Es gibt keine offenen TODO/FIXME-Marker im Produktiv-Code (Frontend/Backend), die als technische Restarbeiten direkt im Code verankert sind.
- Gefundene Marker-Treffer stammen aus Dokumentation oder Platzhalter-Strings (z. B. `SWD-YYYY-XXXXXX`, `WebSocket.OPEN`) und sind keine offenen Code-Tasks.

## Wichtigste offene Aufgabenblöcke

1. SMTP-Sender-Autorisierung fuer Support-Mails abschliessen
   - Ticket wird gespeichert, Mailversand bleibt ohne Senderfreigabe auf `false`.
   - Quelle: `docs/DRINGENDE_TODO_2026-07-08.md`

2. Backlog-Hauptblock mit offenen P0/P1 Tickets
   - Schwerpunkt: Support-Ressourcen, Build/Performance, Deployment-/Go-Live-Haertung, Mobile/UI, MOS/Tally, Lizenzbetrieb.
   - Quelle: `docs/BACKLOG.md`

3. Strategische Luecken aus GAP-Analyse
   - Markt-/Pricing-/Lizenzmodell-/Datenschutz-Validierung offen.
   - Quelle: `docs/STATUSBERICHT_GAP_ANALYSE_DE_2026-07-04.md`

## Empfehlung fuer naechsten Arbeitsschritt

- Zuerst den DRINGEND-Block (SMTP) erledigen.
- Danach Backlog-Punkte in operative Sprints schneiden (P0 vor P1).
- Diesen Scan bei groesseren Merge-Wellen erneut erstellen.
