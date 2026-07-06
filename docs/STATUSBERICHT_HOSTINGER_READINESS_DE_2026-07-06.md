<!-- markdownlint-disable MD029 MD032 -->

# Statusbericht Hostinger Readiness (2026-07-06)

Autor: GitHub Copilot (GPT-5.3-Codex) mit manuelangel  
Ziel: Grosser Code-Doku-Abgleich und MVP-Go/No-Go fuer oeffentliche Hostinger-Beta.

## 1. Executive Summary

### Kurzurteil

- Technische MVP-Basis ist stabil und deployfaehig.
- Go/No-Go fuer oeffentliche Hostinger-Beta: **Bedingtes GO**.
- Bedingung: Betriebsentscheidungen und Produktionskonfiguration vor finalem DNS/TLS-Go-Live verbindlich abschliessen.

### Was heute verifiziert wurde

- Git-Zustand: `main` ist synchron zu `origin/main`.
- Qualitaets-Gates: Frontend/Backend lint, test, build = PASS.
- Frontend-Tests: 30/30 PASS.
- Backend-Tests: 9/9 PASS.
- Frontend-Build-Regression (`TS5103`) ist behoben.

## 2. Ergebnis des Code-Doku-Abgleichs

### Abgleich-Status

- Kern-Dokus fuer Public-Beta, Lizenz, Support und Hostinger sind vorhanden und inhaltlich nutzbar.
- Eine relevante Drift wurde gefunden und direkt korrigiert:
  - `docs/APP_ZUGRIFF_DE.md` hatte veraltete Repo-/Port-/WS-Angaben.

### Korrigierte Punkte in `APP_ZUGRIFF_DE.md`

- Repo-Clone-URL auf aktuelles Zielrepo gestellt.
- Dev-Ports auf aktuellen Stand gesetzt:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:4000`
- Health-/WebSocket-Beispiele auf Port 4000 korrigiert.
- Produktions-Port-Default (`PORT`) auf 4000 korrigiert.
- Erwartete Frontend-Testanzahl auf 30 angepasst.

## 3. Hostinger-Reifegrad (Ist)

### Staerken (bereit)

- Deploy-Artefakte vorhanden:
  - `deploy/hostinger/nginx.teleprompter.conf`
  - `deploy/hostinger/.env.production.template`
  - `deploy/hostinger/ecosystem.config.cjs`
  - `deploy/hostinger/saarwood-teleprompter.service`
  - `deploy/hostinger/smoke-test.sh`
  - `deploy/hostinger/update-app.sh`
- Production-Server kann Frontend-Bundle direkt ausliefern.
- WebSocket/REST unter gleichem Origin vorgesehen.
- Lizenz-/Support-Endpoints inkl. Admin-Schutz und Rate-Limit vorhanden.
- Support-Ticket-ID ist fortlaufend implementiert (`SWD-YYYY-XXXXXX`).

### Restpunkte vor finalem Public Go-Live

1. Domain/TLS final festlegen und Zertifikat live pruefen.
2. `CORS_ORIGIN` exakt auf produktive Domain setzen.
3. Produktions-Secrets in `.env.production` setzen (nie ins Repo).
4. Smoke-Test auf Zielsystem mit echter Domain ausfuehren.
5. Monitoring/Alerting und Log-Rotation im Betrieb final verifizieren.
6. Finales Basic-Werbe-/Upgrade-Modell freigeben (Produktentscheidung).

## 4. Brainstorming-Agenda (empfohlen, 60-90 min)

1. Go-Live Scope fixieren
- Welche Features sind in Public Beta Day 1 enthalten?
- Was bleibt intern/deaktiviert bis nach Pilotfeedback?

2. Domain- und Routing-Entscheidung
- Subpath (`/apps/teleprompter`) oder Subdomain (`teleprompter.example.com`)?
- Upgrade-Pfad fuer mehrere Apps festlegen.

3. Security und Secrets
- Verantwortliche Person fuer Secret-Management.
- Schluesselrotation: `ADMIN_API_KEY`, Lizenzschluessel, SMTP.

4. Support-Prozess
- Wer bearbeitet Tickets wann?
- SLA fuer Erstreaktion in der Beta.

5. Lizenzbetrieb
- Enforce-Modus Day 1 oder Monitor-Modus mit spaeterem Umschalten?
- Revocation-Runbook und Notfallprozess einmal trocken testen.

6. Rollback-Strategie
- Klare Kriterien fuer Rollback.
- Verantwortlichkeiten und Kommunikationsablauf.

## 5. Entscheidungsboard fuer das Meeting

### Muss heute entschieden werden

1. Ziel-URL-Strategie: Subpath vs. Subdomain.
2. Lizenzmodus zum Start: `monitor` oder `enforce`.
3. Basic-Tier-Werbe-/Upgrade-Variante.
4. Ticket-Supportfenster (Servicezeiten) und Owner.

### Kann nachgezogen werden

1. Bundle-Optimierung (P1).
2. Erweiterte Telemetrie-Dashboards.
3. Multi-App Event-Vertraege fuer spaetere Plattformstufe.

## 6. Finaler Hostinger-Setup-Plan (operativ)

1. Server vorbereiten
- Node 22 + npm 10 installieren.
- PM2 oder systemd aktivieren.
- Verzeichnis `/srv/saarwood_telepromter` bereitstellen.

2. Deployment
- Repo klonen.
- `npm ci`.
- Build ausfuehren (Frontend + Backend).
- Prozessmanager konfigurieren/starten.

3. Reverse Proxy + TLS
- Nginx-Config aktivieren.
- Let's Encrypt Zertifikat ausrollen.
- Redirect HTTP -> HTTPS aktivieren.

4. Produktions-Env
- `.env.production` aus Template ableiten.
- Alle Secrets setzen.
- `CORS_ORIGIN` und Support-Links auf finale Domain setzen.

5. Verifikation
- `smoke-test.sh` gegen Produktions-URL laufen lassen.
- WS-Handshake, `/api/health`, `/api/support/info`, optional Admin-Endpunkt testen.
- Output-only View pruefen (`?view=prompter&output=1`).

6. Go-Live
- Monitoring starten.
- Backout-Command und Verantwortliche im Team teilen.
- Public-Beta Kommunikation freigeben.

## 7. Risiko-Matrix fuer Public Beta

| Risiko | Auswirkung | Eintritt | Gegenmassnahme |
| --- | --- | --- | --- |
| Falsche CORS/WS-URL | App verbindet nicht stabil | Mittel | Vor Go-Live End-to-End Smoke-Test mit finaler Domain |
| Fehlende Secrets | Lizenz/Support faellt aus | Mittel | Vier-Augen-Check der `.env.production` |
| Unerwartete Lastspitzen | API/WS-Latenz | Niedrig-Mittel | PM2/systemd Restart-Policy + Basis-Monitoring |
| Support-Flut ohne Prozess | Langsame Reaktion | Mittel | Ticket-Triage + feste Servicezeiten definieren |
| Unklare Werberegel Basic | Produktinkonsistenz | Mittel | Entscheidung im Meeting verbindlich protokollieren |

## 8. Fazit

- Die MVP ist technisch bereit fuer eine oeffentliche Hostinger-Beta.
- Fuer den finalen oeffentlichen Start fehlen keine grossen Codearbeiten, sondern vor allem Betriebsentscheidungen und saubere Produktionskonfiguration.
- Mit der Checkliste aus diesem Bericht kann die finale Einrichtung strukturiert und risikoarm abgeschlossen werden.
