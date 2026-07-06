<!-- markdownlint-disable MD060 -->

# Hostinger Go-Live Checkliste mit Ownern

Stand: 2026-07-06  
Zweck: Entscheidungs- und Umsetzungscheckliste fuer das Brainstorming-Meeting zur oeffentlichen MVP-Beta.

## 1. Meeting-Rollen (vor Start festlegen)

- Release Lead: ____________________
- Infra Lead (VPS/Nginx/TLS): ____________________
- Backend Lead (API/WS/Lizenz): ____________________
- Frontend Lead (UI/Output/Support): ____________________
- QA Lead (Tests/Abnahme): ____________________
- Support Lead (Ticketprozess/SLA): ____________________
- Security Owner (Secrets/Key-Handling): ____________________
- Produkt Owner (Freigaben/Scope): ____________________

## 2. Entscheidungscheckliste (Brainstorming)

| Schritt | Entscheidung | Owner Rolle | Owner Name | Deadline | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Public URL-Modell festlegen (Subpath oder Subdomain) | Infra Lead + Produkt Owner |  | Meeting-Ende | Offen |
| 2 | Finaler Lizenzmodus zum Start festlegen (monitor oder enforce) | Backend Lead + Produkt Owner |  | Meeting-Ende | Offen |
| 3 | Basic-Tier-Modell finalisieren (Upgrade-Hinweis/Sponsorflaeche) | Produkt Owner + Support Lead |  | Meeting-Ende | Offen |
| 4 | Support-SLA und Servicezeiten beschliessen | Support Lead |  | Meeting-Ende | Offen |
| 5 | Rollback-Kriterien und Abbruchregeln freigeben | Release Lead + QA Lead |  | Meeting-Ende | Offen |
| 6 | Go-Live Datum/Uhrzeit beschliessen | Release Lead |  | Meeting-Ende | Offen |

## 3. Day-0 Umsetzungscheckliste (technisch)

| Schritt | Konkrete Aktion | Owner Rolle | Owner Name | Nachweis | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | VPS Basis-Setup abgeschlossen (Node, Nginx, Firewall) | Infra Lead |  | Shell-Output/Log | Offen |
| 2 | Repo auf Server aktuell (main) + Build erfolgreich | Release Lead |  | Build-Output | Offen |
| 3 | Production Env vollstaendig gesetzt | Security Owner + Backend Lead |  | Freigegebene Env-Checkliste | Offen |
| 4 | CORS auf finale Domain begrenzt | Backend Lead |  | Env-Wert + Health-Test | Offen |
| 5 | Nginx Reverse Proxy aktiv und getestet | Infra Lead |  | nginx -t + Reload | Offen |
| 6 | TLS Zertifikat aktiv und Redirect auf HTTPS | Infra Lead |  | Browser + certbot Output | Offen |
| 7 | Backend-Service stabil (systemd/pm2) | Infra Lead |  | systemctl/pm2 Status | Offen |
| 8 | Smoke-Test erfolgreich (health, support, admin optional) | QA Lead |  | smoke-test.sh Output | Offen |
| 9 | Output-only View geprueft | Frontend Lead + QA Lead |  | Manueller Testnachweis | Offen |
| 10 | Ticket-Flow End-to-End geprueft | Support Lead + QA Lead |  | Ticket-ID + Logeintrag | Offen |
| 11 | Lizenzstatus aktiv getestet (inkl. revocation test) | Backend Lead + QA Lead |  | API-Antworten | Offen |
| 12 | Monitoring fuer erste 24h aktiv | Release Lead + Infra Lead |  | Watch/Alert Screenshot | Offen |

## 4. Go-Live Freigabe (Sign-off)

| Freigabepunkt | Owner | Entscheidung |
| --- | --- | --- |
| Technik freigegeben | Release Lead | JA / NEIN |
| Sicherheit freigegeben | Security Owner | JA / NEIN |
| Produktfreigabe erteilt | Produkt Owner | JA / NEIN |
| Supportbetrieb freigegeben | Support Lead | JA / NEIN |

Wenn mindestens ein Punkt auf NEIN steht, Go-Live nicht starten.

## 5. Kommunikationscheckliste

| Schritt | Owner Rolle | Owner Name | Status |
| --- | --- | --- | --- |
| Interne Go-Live Nachricht an Team | Release Lead |  | Offen |
| Tester-Info mit URL und Zeitfenster | Support Lead |  | Offen |
| Eskalationskanal fuer Incidents aktiv | Support Lead + Infra Lead |  | Offen |
| Kurzanleitung fuer First-Level Support bereit | Support Lead |  | Offen |

## 6. Go/No-Go Kurzprotokoll (im Meeting ausfuellen)

- Datum/Uhrzeit: ____________________
- Entscheidung: GO / NO-GO
- Begruendung: ____________________
- Bedingungen fuer GO: ____________________
- Naechster Review-Zeitpunkt: ____________________

## 7. Verknuepfte Dokumente

- docs/HOSTINGER_DAY0_RUNLIST_DE.md
- docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md
- docs/HOSTINGER_PUBLIC_BETA_SUPPORT_CONCEPT_DE.md
- docs/SUPPORT_LICENSE_RUNBOOK_DE.md
- docs/BASIC_TIER_ADS_CONCEPT_DE.md
