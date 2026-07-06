# Statusbericht Live Setup (VPS + Domain + TLS)

Stand: 2026-07-06
Kontext: Umsetzung der produktiven Public-MVP-Basis fuer Live-Tester auf `teleprompter.saarwood.ch`.

## 1. Ziel

Nachvollziehbare Dokumentation aller heute umgesetzten Live-Setup-Schritte inkl. technischer Ergebnisse.

## 2. Durchgefuehrte Schritte

1. MCP-Basis fuer WordPress + Hostinger lokal aktiviert.
2. Hostinger-Module verifiziert (Hosting, Domains, DNS, VPS).
3. Domain-Status geprueft:
- `saarwood.ch` aktiv.
- Name-Server aktiv auf Hostinger.
4. VPS-Zielentscheidung finalisiert:
- vorhandener VPS wurde als Projektziel verwendet und auf Linux-Basis zurueckgesetzt.
5. DNS gesetzt:
- `teleprompter.saarwood.ch` als `A`-Record auf `46.202.188.101`.
6. VPS-Basis eingerichtet:
- Node.js 22
- Nginx
- Certbot
- systemd-Service fuer Backend
7. Deployment auf VPS ausgefuehrt:
- Frontend Build erfolgreich
- Backend Build erfolgreich
- Environment gesetzt (`.env.production`, redacted)
8. TLS aktiviert:
- Let's Encrypt Zertifikat fuer `teleprompter.saarwood.ch` ausgestellt und aktiv.
9. Live Smoke-Test abgeschlossen:
- UI erreichbar
- `/api/health` lokal und oeffentlich `ok`
- WebSocket-Verbindung stabil (UI zeigte `Remote control connected`).

## 3. Technischer Ist-Zustand

- Domain: `https://teleprompter.saarwood.ch`
- DNS: aktiv auf VPS-IP `46.202.188.101`
- TLS: aktiv, automatische Erneuerung per certbot timer
- Backend-Service: `saarwood-teleprompter.service` aktiv (systemd)
- Reverse Proxy: Nginx aktiv, API/WS auf Backend weitergeleitet

## 4. Validierte Health-Checks

1. `http://127.0.0.1:4000/api/health` -> `status: ok`
2. `https://teleprompter.saarwood.ch/api/health` -> `status: ok`

Erwartungswert bei Health:
- `status: ok`
- `wsClients` >= 0
- `mosClients` >= 0

## 5. Wichtige Hinweise

- Betriebsgeheimnisse (Root-Passwort, API-Schluessel, SMTP-Secret) sind absichtlich nicht in dieser Datei enthalten.
- Fuer Live-Tester ist der aktuelle Stand funktionsfaehig.
- Lizenz- und Login-Produktlogik bleibt als naechster separater Ausbauschritt.

## 6. Offene Punkte (naechste Ausbaustufe)

1. Support-/Ticket-Fallmanagement an ClickUp verbindlich koppeln.
2. Hostinger Rollenmodell fuer Entwickler/Admins formalisieren.
3. Lizenz-/Registrierungsfluss fuer Professional/Expert produktiv schalten.
4. Optional: Infrastructure as Code / Deployment Script-Hardening fuer reproduzierbare Re-Deploys.
