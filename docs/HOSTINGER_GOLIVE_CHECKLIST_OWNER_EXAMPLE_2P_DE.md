<!-- markdownlint-disable MD060 -->

# Hostinger Go-Live Checkliste (Beispiel) - Team mit 2 Personen

Stand: 2026-07-06  
Team: manuelangel + GitHub Copilot (GPT-5.3-Codex)  
Zweck: Sofort nutzbare Beispielbelegung fuer Brainstorming und Day-0.

## 1. Rollenbelegung fuer 2 Personen

| Rolle | Owner |
| --- | --- |
| Release Lead | manuelangel |
| Infra Lead (VPS/Nginx/TLS) | manuelangel |
| Backend Lead (API/WS/Lizenz) | GitHub Copilot |
| Frontend Lead (UI/Output/Support) | GitHub Copilot |
| QA Lead (Tests/Abnahme) | manuelangel |
| Support Lead (Ticketprozess/SLA) | manuelangel |
| Security Owner (Secrets/Key-Handling) | manuelangel |
| Produkt Owner (Freigaben/Scope) | manuelangel |

Hinweis: Bei 2 Personen liegt die finale Freigabe und Secret-Verantwortung bewusst bei manuelangel.

## 2. Entscheidungscheckliste (ausgefuellte Beispielverteilung)

| Schritt | Entscheidung | Owner | Deadline | Status |
| --- | --- | --- | --- | --- |
| 1 | Public URL-Modell festlegen (Subpath oder Subdomain) | manuelangel | Meeting-Ende | Offen |
| 2 | Finalen Lizenzmodus festlegen (monitor oder enforce) | manuelangel + GitHub Copilot | Meeting-Ende | Offen |
| 3 | Basic-Tier-Modell finalisieren | manuelangel | Meeting-Ende | Offen |
| 4 | Support-SLA und Servicezeiten festlegen | manuelangel | Meeting-Ende | Offen |
| 5 | Rollback-Kriterien und Abbruchregeln freigeben | manuelangel + GitHub Copilot | Meeting-Ende | Offen |
| 6 | Go-Live Datum/Uhrzeit beschliessen | manuelangel | Meeting-Ende | Offen |

## 3. Day-0 Umsetzung (Owner pro Schritt)

| Schritt | Aktion | Owner | Nachweis | Status |
| --- | --- | --- | --- | --- |
| 1 | VPS Basis-Setup (Node, Nginx, Firewall) | manuelangel | Shell-Output | Offen |
| 2 | Repo aktuell + Build erfolgreich | manuelangel + GitHub Copilot | Build-Output | Offen |
| 3 | Production Env setzen | manuelangel | Env-Checkliste | Offen |
| 4 | CORS auf finale Domain begrenzen | GitHub Copilot | Env-Diff + Health-Test | Offen |
| 5 | Nginx konfigurieren und reloaden | manuelangel | nginx -t + reload | Offen |
| 6 | TLS aktivieren (certbot) | manuelangel | certbot Output | Offen |
| 7 | Backend-Service stabil (systemd/pm2) | manuelangel | systemctl/pm2 Status | Offen |
| 8 | Smoke-Test ausfuehren | manuelangel + GitHub Copilot | smoke-test.sh Output | Offen |
| 9 | Output-only View pruefen | manuelangel + GitHub Copilot | Manuelle Abnahme | Offen |
| 10 | Ticket-Flow End-to-End pruefen | manuelangel + GitHub Copilot | Ticket-ID + Logeintrag | Offen |
| 11 | Lizenzstatus inkl. Revocation pruefen | GitHub Copilot | API-Antworten | Offen |
| 12 | 24h Monitoring aktivieren | manuelangel | Monitoring-Nachweis | Offen |

## 4. Go/No-Go Sign-off fuer 2-Personen-Team

| Freigabepunkt | Owner | Entscheidung |
| --- | --- | --- |
| Technik freigegeben | manuelangel | JA / NEIN |
| Sicherheit freigegeben | manuelangel | JA / NEIN |
| Produktfreigabe erteilt | manuelangel | JA / NEIN |
| QA-Freigabe erteilt | manuelangel | JA / NEIN |

Regel: Wenn ein Punkt auf NEIN steht, kein Public Go-Live.

## 5. Kommunikationsplan (kompakt)

| Schritt | Owner | Status |
| --- | --- | --- |
| Interne Go-Live Nachricht senden | manuelangel | Offen |
| Tester informieren (URL + Zeitfenster) | manuelangel | Offen |
| Incident-Kanal aktivieren | manuelangel | Offen |
| Erste Rueckmeldungen erfassen und priorisieren | manuelangel + GitHub Copilot | Offen |

## 6. Meeting-Protokoll Vorlage (direkt nutzbar)

- Datum/Uhrzeit: ____________________
- Domain-Entscheidung: ____________________
- Lizenzmodus Start: ____________________
- Basic-Tier-Modell: ____________________
- Go-Live Termin: ____________________
- Entscheidung: GO / NO-GO
- Offene Restpunkte: ____________________

## 7. Empfohlener Ablauf fuer euch beide (90 Minuten)

1. 0-15 min: Entscheidungen in Abschnitt 2 finalisieren.
2. 15-45 min: Day-0 Umsetzungsschritte mit Terminen belegen.
3. 45-70 min: Rollback und Incident-Regeln final beschliessen.
4. 70-90 min: Go/No-Go Protokoll ausfuellen und naechsten Termin fixieren.

## 8. Verknuepfte Dokumente

- docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_DE.md
- docs/HOSTINGER_DAY0_RUNLIST_DE.md
- docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md
- docs/SUPPORT_LICENSE_RUNBOOK_DE.md
