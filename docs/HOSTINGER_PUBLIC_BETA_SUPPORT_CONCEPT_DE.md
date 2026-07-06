# Hostinger Public Beta Konzept (MVP + Support)

_Stand: 2026-07-05_

## 1. Ziel

Die App soll oeffentlich ueber Internet testbar sein, inklusive:

1. stabiler Teleprompter-Betrieb,
2. Lizenzsteuerung (Phase A-C),
3. Supportkontakt, Direkt-Chat und Ticket-Erstellung.
4. Zentrale Hauptwebsite fuer mehrere Apps mit eigenen Unterseiten je App.

Wichtig: Support-Features duerfen den Prompter-Output nicht beeinflussen.

## 2. Architektur fuer Hostinger VPS

### 2.1 Laufzeit

- Node/Express/WebSocket Backend als Hauptprozess (Port intern, z. B. 4000)
- Reverse Proxy (Nginx oder Caddy) auf 443/TLS
- Eine oeffentliche Domain, gleiches Origin fuer Frontend, API und WS

### 2.1a Mehrserver-Topologie (zentrale Website getrennt)

Beruecksichtigt ist auch ein Setup mit getrennten Servern:

1. Hauptwebsite-Server (Marketing/Produktseite):
- `www.example.com`
- App-Portfolio, Downloads, Formulare, Dokumentation

2. App-Server Teleprompter:
- `apps.example.com` oder `teleprompter.example.com`
- Teleprompter-Frontend, API, WebSocket

3. Weitere App-Server:
- z. B. `newsdesk.example.com`, `automation.example.com`
- Jede App kann unabhaengig skaliert und aktualisiert werden

Die Hauptwebsite verlinkt zentral auf alle App-Unterseiten. Damit bleibt die Plattform zentral sichtbar, aber technisch entkoppelt.

### 2.2 Routing

- `/` -> Hauptseite (App-Portfolio, Produktseiten)
- `/apps/teleprompter/` -> Teleprompter-Frontend
- `/apps/teleprompter/api/*` -> Teleprompter-API
- `/apps/teleprompter/ws` -> Teleprompter-WebSocket
- Weitere Apps analog unter `/apps/<app-name>/...`

Alternative mit Subdomains (empfohlen bei wachsendem Verkehr):

- `www.example.com` -> zentrale Hauptseite
- `teleprompter.example.com` -> Teleprompter-App
- `app2.example.com` -> weitere App

### 2.3 Dokumente und Tester-Formular auf Website

- Handbuch und Tester-Guide als Download auf der Teleprompter-Unterseite bereitstellen.
- Interaktives Tester-Formular unter fester URL bereitstellen (z. B. `/apps/teleprompter/test-form`).
- Diese URLs in der App (Settings -> Support) als separate Fenster oeffnen.

### 2.4 Prozessbetrieb

- PM2 oder systemd fuer Neustart bei Crash
- getrennte `.env` fuer Production
- taegliches Log-Rotation- und Backup-Konzept

## 3. Support-Funktionen (Public Beta)

### 3.1 In der App

- Direkt-Chat-Button (konfigurierbare URL)
- Ticketformular in Settings
- Buttons fuer Handbuch, Tester-Guide und Tester-Formular (jeweils neues Fenster)

### 3.2 Strikte Trennung vom Prompter-Output

- Support-UI nur im Settings-Bereich (Operator-Seite)
- Output-Only-Ansicht (`?view=prompter&output=1`) zeigt keine Support-Elemente
- Ticket-Requests laufen nur on-demand und triggern keinen Renderpfad im Prompter
- Oeffentliche Support-E-Mail wird nicht in der App angezeigt

## 4. Backend-Konfiguration (neue Variablen)

- `SUPPORT_CHAT_URL`
- `SUPPORT_CHAT_LABEL`
- `SUPPORT_TICKET_FILE`
- `SUPPORT_TICKET_SEQUENCE_FILE`
- `SUPPORT_TICKET_WEBHOOK_URL`
- `SUPPORT_HANDBOOK_URL`
- `SUPPORT_TESTER_GUIDE_URL`
- `SUPPORT_TESTER_FORM_URL`

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

## 5a. Baukasten-Architektur fuer mehrere Apps (wichtig)

Zielbild: Apps sind einzeln deploybar, aber untereinander erweiterbar und datenfaehig.

Technische Leitlinien:

1. API-first je App:
- Jede App bietet klar versionierte Endpunkte (`/api/v1/...`).

2. Gemeinsame Vertrauensschicht:
- Service-zu-Service Auth mit API-Key oder JWT (spaeter OAuth2).

3. Event-getriebene Erweiterbarkeit:
- Kernereignisse als Webhooks/Event-Feeds (z. B. `ticket.created`, `script.updated`).

4. Gemeinsame IDs:
- Ticket-/Objekt-IDs eindeutig und serviceuebergreifend nutzbar.

5. Vertrag statt Direktkopplung:
- Austausch nur ueber dokumentierte API-/Event-Vertraege, keine direkten DB-Zugriffe zwischen Apps.

Ergebnis: Jede App bleibt autonom, aber das Gesamtsystem funktioniert wie ein Baukastensystem.

## 6. Go-Live-Checkliste Hostinger (MVP)

1. VPS, Domain und TLS aktiv.
2. Backend online: `/api/health` liefert `ok`.
3. WebSocket unter `/ws` ueber 443 pruefen.
4. Lizenzmodus `enforce` erfolgreich getestet (aktiv/revoked/expired).
5. Support-Flow getestet:
   - Chat-Link oeffnet
   - Handbuch/Tester-Guide/Formular oeffnen jeweils in neuem Fenster
   - Chat-Link oeffnet
   - Ticket wird erstellt und gespeichert/weitergeleitet
   - Ticket-ID ist zentral fortlaufend (Format `SWD-YYYY-XXXXXX`)
6. Output-Only-Ansicht getestet: keine Support-/Settings-UI sichtbar.

## 7. Update-Funktion fuer die Public-Beta-Variante

- Standard-Update ueber VPS-Script `deploy/hostinger/update-app.sh`:
  1. `git pull`
  2. Build Frontend + Backend
  3. Prozess-Neustart per pm2 oder systemd
- Optional spaeter: automatisierter Deploy-Job ueber CI.

Fuer Mehrserver-Betrieb:

- Update pro App-Server separat (kein globaler Full-Stop notwendig).
- Hauptwebsite kann unveraendert online bleiben, waehrend einzelne Apps aktualisiert werden.

## 8. Prioritaetsprotokoll

Anweisung umgesetzt:

- Fokus bleibt auf MVP- und Public-Beta-Funktionalitaet.
- Rechtliche Hinweise zu Saarwood und der Softwareentwicklungsfirma werden erst am Schluss eingepflegt.

## 9. Werbekonzept fuer Basic vor Hostinger-Go-Live

Vor der oeffentlichen Basic-Freigabe ueber Hostinger muss das Werbe- und Upgrade-Modell verbindlich geklaert sein.

Referenzdokument:

- `docs/BASIC_TIER_ADS_CONCEPT_DE.md`

Mindestregeln fuer die Public-Basic-Version:

- finale Werbeplatzierung im Prompter-/Output-Bild erst nach gesonderter Produktdiskussion
- falls Werbung im Prompter-/Output-Bild freigegeben wird, dann nur als kleine Overlay-Ebene und nie im eigentlichen Scrolltext
- bevorzugt nur interne Upgrade-Hinweise statt externer Werbenetzwerke
- Professional und Expert bleiben werbefrei
