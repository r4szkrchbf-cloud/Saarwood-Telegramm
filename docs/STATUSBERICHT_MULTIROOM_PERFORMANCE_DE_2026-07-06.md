# Statusbericht Multiroom-Isolation und Performance-Entlastung

Stand: 2026-07-06
Kontext: Akute Betriebsprobleme im Live-Test (globale Kopplung aller Nutzer und sichtbares Scroll-Stottern) wurden priorisiert behoben.

## 1. Ziel

1. Teleprompter-Sessions technisch voneinander trennen.
2. Sync-Last reduzieren, um Stottern und unnötigen Broadcast-Traffic zu senken.
3. Bestehende Produktionsfunktionalitaet erhalten (keine regressiven Ausfaelle).

## 2. Umgesetzte Aenderungen

### Backend WebSocket-Isolation

- `packages/backend/src/websocket/ControlServer.ts` auf room-scoped Routing erweitert.
- Room wird beim Verbindungsaufbau aus der Query gelesen (`?room=...`).
- Server-Zustand wird pro Room getrennt gehalten (`isPlaying`, `speed`, `position`, `direction`).
- Broadcasts laufen nur noch innerhalb desselben Rooms.
- `SYNC_STATE` liefert room-lokalen Zustand statt globalem Shared State.

### Frontend WebSocket-Channeling

- `packages/frontend/src/services/WebSocketService.ts` um Channel/Room-Unterstuetzung erweitert.
- Socket-URL wird mit `room`-Parameter aufgebaut.
- Channel-Wechsel triggert kontrollierten Reconnect.

### App-Verhalten und Lastreduktion

- `packages/frontend/src/App.tsx` erzeugt bei Bedarf eine room-ID und schreibt sie in die URL.
- Output-Fenster uebernimmt explizit denselben room wie das Controller-Fenster.
- Output-only Clients senden keine `SCRIPT_UPDATE`, `SETTINGS_UPDATE`, `SET_POSITION` mehr.
- Positions-Sync bei laufendem Scroll wurde staerker gedrosselt.

### Backlog-Transparenz

- `docs/BACKLOG.md` erweitert um:
  - `TICKET-028`: Session-Isolation (kein globaler Shared State).
  - `TICKET-029`: Scroll-Stottern und Sync-Last reduzieren.

## 3. Verifikation

Durchgefuehrte technische Pruefungen:

1. `npm run build`
- Ergebnis: PASS (Frontend + Backend)

2. `npm run test --workspace=packages/frontend -- --run`
- Ergebnis: PASS (30/30)

3. `npm run test --workspace=packages/backend -- --run`
- Ergebnis: PASS (9/9)

## 4. Erwarteter Betriebsnutzen

- Getrennte Testgruppen/Fenster beeinflussen sich nicht mehr gegenseitig.
- Weniger Echo-Traffic und niedrigere Sync-Frequenz reduzieren Jitter-Risiko.
- Output-Clients bleiben passiv und belasten den Steuerkanal nicht.

## 5. Offene Folgeaufgaben

1. Live-Mehrclient-Smoke-Test mit 2 getrennten Rooms auf produktiver Domain dokumentieren (`docs/TEST_MVP.md`).
2. Optionaler Controller-Only-Modus fuer `SET_POSITION` (harte Ein-Quellen-Regel).
3. Room in der UI sichtbar/kopierbar machen (Beta-Tester-Workflow).
