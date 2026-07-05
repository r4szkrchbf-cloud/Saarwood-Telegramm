# Hostinger Public Beta Konzept (MVP + Support)

_Stand: 2026-07-05_

## 1. Ziel

Die App soll oeffentlich ueber Internet testbar sein, inklusive:

1. stabiler Teleprompter-Betrieb,
2. Lizenzsteuerung (Phase A-C),
3. Supportkontakt, Direkt-Chat und Ticket-Erstellung.

Wichtig: Support-Features duerfen den Prompter-Output nicht beeinflussen.

## 2. Architektur fuer Hostinger VPS

### 2.1 Laufzeit

- Node/Express/WebSocket Backend als Hauptprozess (Port intern, z. B. 4000)
- Reverse Proxy (Nginx oder Caddy) auf 443/TLS
- Eine oeffentliche Domain, gleiches Origin fuer Frontend, API und WS

### 2.2 Routing

- `/` -> Frontend (statisch aus Backend oder Build-Ordner)
- `/api/*` -> Express API
- `/ws` -> WebSocket Upgrade

### 2.3 Prozessbetrieb

- PM2 oder systemd fuer Neustart bei Crash
- getrennte `.env` fuer Production
- taegliches Log-Rotation- und Backup-Konzept

## 3. Support-Funktionen (Public Beta)

### 3.1 In der App

- Support-Kontakt (E-Mail)
- Direkt-Chat-Button (konfigurierbare URL)
- Ticketformular in Settings

### 3.2 Strikte Trennung vom Prompter-Output

- Support-UI nur im Settings-Bereich (Operator-Seite)
- Output-Only-Ansicht (`?view=prompter&output=1`) zeigt keine Support-Elemente
- Ticket-Requests laufen nur on-demand und triggern keinen Renderpfad im Prompter

## 4. Backend-Konfiguration (neue Variablen)

- `SUPPORT_CONTACT_EMAIL`
- `SUPPORT_CHAT_URL`
- `SUPPORT_CHAT_LABEL`
- `SUPPORT_TICKET_FILE`
- `SUPPORT_TICKET_WEBHOOK_URL`

Lizenz-/Admin-Variablen (bereits vorhanden):

- `LICENSE_MODE`
- `LICENSE_PUBLIC_KEY_PEM`
- `LICENSE_PRIVATE_KEY_PEM`
- `LICENSE_REVOCATION_FILE`
- `ADMIN_API_KEY`

## 5. Security und Betriebsregeln

1. `ADMIN_API_KEY` nur serverseitig, nie ins Frontend.
2. Support-Ticket-Webhooks nur ueber HTTPS.
3. Rate-Limit fuer `/api/support/tickets` aktiv lassen (globales API-Limit vorhanden).
4. Log/Audit mindestens fuer Lizenz-Admin-Endpunkte und Ticket-IDs.
5. CORS auf die produktive Domain begrenzen.

## 6. Go-Live-Checkliste Hostinger (MVP)

1. VPS, Domain und TLS aktiv.
2. Backend online: `/api/health` liefert `ok`.
3. WebSocket unter `/ws` ueber 443 pruefen.
4. Lizenzmodus `enforce` erfolgreich getestet (aktiv/revoked/expired).
5. Support-Flow getestet:
   - Kontakt sichtbar
   - Chat-Link oeffnet
   - Ticket wird erstellt und gespeichert/weitergeleitet
6. Output-Only-Ansicht getestet: keine Support-/Settings-UI sichtbar.

## 7. Prioritaetsprotokoll

Anweisung umgesetzt:

- Fokus bleibt auf MVP- und Public-Beta-Funktionalitaet.
- Rechtliche Hinweise zu Saarwood und der Softwareentwicklungsfirma werden erst am Schluss eingepflegt.
