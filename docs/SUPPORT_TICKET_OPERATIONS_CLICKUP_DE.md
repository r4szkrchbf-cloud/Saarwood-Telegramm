# Support- und Ticket-Operations (Dev/Admin/Support)

Stand: 2026-07-06
Ziel: Sauberer, nachvollziehbarer Betrieb fuer Live-Tester und interne Teams (Entwicklung, Admin, Support).

## 1. Rollenmodell

1. Developer
- analysiert technische Tickets
- nutzt Support-Logs und Backend-Logs
- liefert Fixes und Rollout-Updates

2. Admin
- verwaltet Betriebszugriffe (Hostinger, DNS, VPS, TLS)
- verwaltet API-Keys/Secrets
- steuert Rollback und Incident-Entscheidungen

3. Support
- nimmt Tickets entgegen
- kategorisiert und priorisiert Tickets
- kommuniziert mit Testern und verfolgt Ticketstatus

## 2. Aktuelle Ticket-Pipeline im System

Bestehende Pipeline (heute aktiv):
1. Ticket wird im Frontend erstellt (`Settings -> Kontakt & Support`).
2. Backend persistiert Ticket als NDJSON (`SUPPORT_TICKET_FILE`).
3. Ticket-ID wird fortlaufend erzeugt (`SWD-YYYY-XXXXXX`).
4. Optionaler Webhook-Forward (`SUPPORT_TICKET_WEBHOOK_URL`).
5. Optional E-Mail-Bestaetigung bei SMTP-Konfiguration.

Relevante Codepfade:
- `packages/backend/src/support/SupportService.ts`
- `packages/backend/src/routes/api.ts`
- `packages/frontend/src/components/Settings/SettingsPanel.tsx`

## 3. ClickUp-Anbindung (verbindliche Empfehlung)

## 3.1 Zielbild

Jedes Support-Ticket soll in ClickUp als Task landen und durch einen klaren Workflow laufen.

## 3.2 Mindest-Workflow in ClickUp

- `Backlog`
- `Ready`
- `In Progress`
- `Blocked`
- `Review`
- `Done`

## 3.3 Pflichtfelder pro Ticket

- `Owner Role`
- `Severity` (P0/P1/P2/P3)
- `System` (Teleprompter/Hostinger/ClickUp/DNS)
- `Environment` (Production/Staging)
- `Ticket ID` (z. B. SWD-2026-000123)
- `Reporter Email`
- `Runbook Ref`

## 3.4 Technische Anbindung

Variante A (sofort):
1. `SUPPORT_TICKET_WEBHOOK_URL` auf eigenen Ingest-Endpunkt setzen.
2. Ingest-Endpunkt erstellt ClickUp-Task ueber ClickUp API.
3. Antwortstatus und ClickUp Task-ID in Server-Log schreiben.

Variante B (skalierbar):
1. Message Queue dazwischen (z. B. Redis Stream).
2. Worker uebernimmt ClickUp-Erstellung robust mit Retry/Dead-Letter.

## 4. Hostinger Developer/Admin-Panel (Betriebsregeln)

## 4.1 Developer-Panel Umfang (operativ)

- Read-only fuer DNS/Domain-Status
- Read-only fuer VPS-Metriken/Service-Status
- Zugriff auf Application Logs
- Kein Zugriff auf Billing/Domain-Transfer/WHOIS-Ownership

## 4.2 Admin-Panel Umfang (voll)

- DNS aendern
- Domain- und Nameserver-Verwaltung
- VPS Recreate/Restart/Recovery
- Firewall/SSH/Snapshots
- TLS/Certbot und Infrastruktur-Sperrfaelle

## 4.3 Sicherheitsregeln

1. Least-Privilege pro Rolle
2. Keine Shared-Root-Accounts fuer Teams
3. API-Keys und Tokens nie im Repo
4. Auditierbare Aktionen bei DNS, VPS-Recreate, Password-Reset

## 5. Betriebs-SLAs fuer Live-Tester

- P0 (Service down): Reaktion <= 15 min
- P1 (kritisch eingeschraenkt): Reaktion <= 60 min
- P2 (funktional, Workaround moeglich): Reaktion <= 24 h
- P3 (kosmetisch / Wunsch): naechster Sprint

## 6. Daily Operations Checkliste

1. Healthcheck `GET /api/health`
2. TLS-Laufzeit pruefen
3. Support-Ticket-Datei auf neue Eintraege pruefen
4. ClickUp Sync pruefen (neue Tickets -> Tasks)
5. Error-Log-Auswertung (Backend + Nginx)

## 7. Entscheidung fuer aktuellen Betrieb

Fuer die aktuelle Live-Tester-Phase ist der Stand ausreichend:
- App ist live
- Ticketpfad funktioniert
- Support-Logik ist implementiert

Verbindliche naechste Ausbaustufe:
1. ClickUp-Webhook produktiv aktivieren
2. Rollenbasierte Hostinger-Zugriffe (Developer/Admin) formalisieren
3. Support-Prozess als Team-Runbook taeglich anwenden
