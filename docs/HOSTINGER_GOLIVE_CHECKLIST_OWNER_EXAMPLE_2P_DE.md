<!-- markdownlint-disable MD060 -->

# Hostinger Go-Live Checkliste (Beispiel) - Team mit 2 Personen

Stand: 2026-07-06  
Team: manuelangel + GitHub Copilot (GPT-5.3-Codex)  
Zweck: Sofort nutzbare Beispielbelegung fuer Brainstorming und Day-0.

## 0. Konkreter Terminvorschlag (fix und sofort nutzbar)

- Meeting-Termin (Vorschlag): 2026-07-07, 10:00-11:30
- Format: 90 Minuten, Live-Call mit paralleler Doku-Pflege
- Ziel am Ende: Verbindliche GO/NO-GO Entscheidung und Day-0 Termin

### Timebox-Plan

1. 10:00-10:15: Entscheide URL-Modell, Lizenzmodus, Basic-Modell.
2. 10:15-10:45: Belege Day-0 Umsetzungscheckliste mit festen Deadlines.
3. 10:45-11:10: Finalisiere Rollback- und Incident-Regeln.
4. 11:10-11:30: Sign-off, GO/NO-GO und Kommunikation.

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

## 7. Meeting-Ablauf (fuer den vorgeschlagenen Termin)

1. 10:00-10:15: Entscheidungen in Abschnitt 2 finalisieren.
2. 10:15-10:45: Day-0 Umsetzungsschritte mit festen Deadlines belegen.
3. 10:45-11:10: Rollback und Incident-Regeln final beschliessen.
4. 11:10-11:30: Go/No-Go Protokoll ausfuellen und Day-0 Startfenster fixieren.

## 8. Verknuepfte Dokumente

- docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_DE.md
- docs/HOSTINGER_DAY0_RUNLIST_DE.md
- docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md
- docs/SUPPORT_LICENSE_RUNBOOK_DE.md
