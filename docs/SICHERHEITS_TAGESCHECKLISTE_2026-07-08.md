# Sicherheits-Tagescheckliste

Stand: 2026-07-08
Scope: Nur Aufgaben aus Chat und docs/CHAT_SICHERHEITSBERICHT_2026-07-08.md

## 1. Bereits verifiziert erledigt (heute)

- [x] Produktion bricht ohne ADMIN_AUTH_JWT_SECRET ab.
- [x] Produktion nutzt keine FALLBACK_USERS (ADMIN_AUTH_USERS_JSON Pflicht).
- [x] Optionaler Produktions-Startblocker gegen Klartextpasswoerter aktiv (ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS).
- [x] Admin-Login prueft Passwort via bcrypt.
- [x] Predeploy-Check blockiert verbotene Secret-Placeholder.
- [x] Hash-Migrationsskript vorhanden und lauffaehig (auth:hash-users).
- [x] Env-Render-Helfer vorhanden und lauffaehig (auth:render-users-env).
- [x] README und Sicherheitsbericht wurden auf die Migration erweitert.
- [x] Backend Build/Test erfolgreich (12/12 Tests).

## 2. Offene Pflichtaufgaben fuer heute (priorisiert)

### P0-1 Dokumentation haerten (erledigt)

- [x] README enthaelt keinen produktionsfaehigen Default fuer `ADMIN_AUTH_JWT_SECRET` mehr.

### P0-2 Secret-Scanning als Gate aktivieren

- [x] CI-Workflow mit gitleaks als vorgeschaltetem Pflicht-Gate eingebaut.
- [x] Minimale `.gitleaks.toml`-Allowlist fuer bekannte Platzhalter angelegt.
- [x] Lokaler Nachweistest: sauberer Repo-Scan und blockierender Test-Fund dokumentiert.

### P0-3 Operative Secret-Rotation nachweisen

- [x] `ADMIN_AUTH_JWT_SECRET` rotiert.
- [x] `ADMIN_API_KEY` rotiert.
- [x] `SUPPORT_SMTP_PASS` rotiert.
- [x] `SUPPORT_SMTP_USER` auf Support-Mailbox umgestellt.
- [x] Service/Health/Admin-Endpunkt nach Rotation verifiziert.
- [x] Live-Support-Ticket erfolgreich: `SWD-2026-000016` mit beiden Mailflags auf `true`.
- [x] Rotationsprotokoll abgeschlossen: `docs/ROTATIONSPROTOKOLL_2026-07-08.md`.

## 3. Danach (erst nach Abschluss der Pflichtaufgaben)

- Erst nach P0-1 bis P0-3 mit anderen Aufgaben weitermachen.

## 4. Sync-Nachtrag (heute)

- [x] Vollabgleich lokal <-> GitHub <-> Hostinger VPS <-> Hostinger hPanel durchgefuehrt.
- [x] Lokale Secret-Uebersicht mit aktivem Status erstellt: `secrets/ACTIVE_ACCESS_AND_SECRETS_2026-07-08.txt`.
