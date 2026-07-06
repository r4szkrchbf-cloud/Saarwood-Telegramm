<!-- markdownlint-disable MD060 -->

# Hostinger Go-Live Onepager (2P Team)

Stand: 2026-07-06  
Team: manuelangel + GitHub Copilot (GPT-5.3-Codex)

## Ziel

In einem 90-Minuten-Meeting alle Go-Live-Entscheidungen fixieren und Day-0 operativ freigeben.

## Meeting-Slot

- Termin: 2026-07-07, 10:00-11:30
- Ergebnis am Ende: GO oder NO-GO mit klaren Restpunkten

## 6 Kernentscheidungen (Meeting)

| Thema | Owner | Deadline | Vorschlag (Startwert) |
| --- | --- | --- | --- |
| URL-Modell (Subpath/Subdomain) | manuelangel | 10:15 | Subdomain `https://teleprompter.saarwood.ch/` |
| Lizenzmodus (monitor/enforce) | manuelangel + GitHub Copilot | 10:15 | `monitor` fuer 7 Tage, danach Wechsel auf `enforce` |
| Basic-Tier-Modell | manuelangel | 10:15 | Nur interne Upgrade-Hinweise, keine externen Ads zum Start |
| Support-SLA/Servicezeiten | manuelangel | 10:15 | Erstreaktion <= 24h, Servicefenster 09:00-18:00 CET |
| Rollback-Kriterien | manuelangel + GitHub Copilot | 11:10 | Rollback bei 2+ kritischen Incidents innerhalb 60 min |
| Go-Live Termin | manuelangel | 11:30 | Day-0 am naechsten Werktag, 10:00 CET |

Hinweis: Alle Vorschlaege sind bewusst als Startwerte gesetzt und werden im Meeting final bestaetigt oder angepasst.

## Day-0 Verantwortlichkeiten (operativ)

| Bereich | Owner |
| --- | --- |
| VPS/Nginx/TLS | manuelangel |
| Backend/API/WS/Lizenz-Checks | GitHub Copilot |
| QA/Smoke-Test/Abnahme | manuelangel + GitHub Copilot |
| Secrets/Prod-Env/Security-Freigabe | manuelangel |
| Kommunikation + Supportsteuerung | manuelangel |

## Day-0 Minimal-Checks (muss gruen sein)

1. Build und Service laufen stabil.
2. HTTPS und Reverse-Proxy funktionieren.
3. `/api/health` und `/api/support/info` sind erreichbar.
4. Output-only View ist sauber.
5. Ticket-Flow funktioniert mit Ticket-ID.
6. Lizenzstatus inkl. Revocation-Test validiert.

## Go/No-Go Matrix

| Punkt | Owner | Ergebnis |
| --- | --- | --- |
| Technik | manuelangel | JA / NEIN |
| Sicherheit | manuelangel | JA / NEIN |
| Produkt | manuelangel | JA / NEIN |
| QA | manuelangel | JA / NEIN |

Regel: Sobald ein Punkt NEIN ist, kein Public-Go-Live.

## Nächste Dateien im Call offen halten

- docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_EXAMPLE_2P_DE.md
- docs/HOSTINGER_DAY0_RUNLIST_DE.md
- docs/STATUSBERICHT_HOSTINGER_READINESS_DE_2026-07-06.md
