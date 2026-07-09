# Statusbericht 3-Wege-Sync

Stand: 2026-07-09
Scope: Abgleich zwischen lokalem Recovery-Workspace, GitHub `origin/main` und Hostinger-VPS Produktion.

## 1. Durchgefuehrte Schritte

1. Lokale Restaenderung in `packages/frontend/src/App.tsx` wurde committed und gepusht.
2. Vollstaendiger Projektstand wurde auf Hostinger gespiegelt (nicht nur 2 Frontend-Dateien).
3. Hostinger wurde von alter Flat-Struktur (`frontend/`, `backend/`) auf aktuelle Monorepo-Struktur (`packages/frontend`, `packages/backend`) umgestellt.
4. Produktive `.env.production` wurde auf neue Pfade migriert.
5. `ADMIN_AUTH_USERS_JSON` wurde fuer den Produktionsstart auf bcrypt-Hashes umgestellt und `ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS=true` gesetzt.
6. Service wurde mit neuer Unit-Definition und neuem Backend-Startpfad gestartet und verifiziert.

## 2. Commit-/Branch-Nachweis

- Lokal `HEAD`: `2158ec1adce9c426d79804eb606028a33833f649`
- GitHub `origin/main`: `2158ec1adce9c426d79804eb606028a33833f649`
- Lokaler Git-Status: sauber (`main...origin/main`, keine offenen Änderungen)

## 3. Hostinger Produktionsnachweis

Servicezustand:

- `systemctl is-active saarwood-teleprompter` -> `active`
- Healthcheck: `http://127.0.0.1:4000/api/health` -> `200`

Aktive Service-Unit:

- `ExecStart=/usr/bin/node /srv/saarwood_telepromter/packages/backend/dist/server.js`

## 4. Dateiabgleich (Hash-Nachweis lokal vs. Hostinger)

Gepruefte Dateien mit identischem SHA256 lokal/Hostinger:

- `packages/frontend/src/App.tsx`
  - `206c7a56f0e6275d467bbb3bb710689a338e40b851611c3e208fee9f033ec0dc`
- `packages/frontend/src/App.css`
  - `1e1cd23587a8a3f787049770cda7cd093635dd368a91f2bea527e71109584d07`
- `docs/HOSTINGER_DAY0_RUNLIST_DE.md`
  - `5916ad7aec37d17eadbebd14bcfce89f994d68fadc30a653f5d6eac50aa9b251`
- `docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_DE.md`
  - `5e19b88aed4c40e0d5af6eeee6545623215051a83a40f814cf21675ed50321f4`
- `docs/SUPPORT_LICENSE_RUNBOOK_DE.md`
  - `9746125ab127d8f7997ae79fa0f9baae8e7b5b1bbd40fc5a325fac4c7750d10f`

## 5. Secrets-Abgleich (aktuelles vs. altes Projekt)

Aktuelles Projekt (`saarwood_telepromter_local_recovered_20260708`):

- `secrets/ACTIVE_ACCESS_AND_SECRETS_2026-07-08.txt`

Altes Projekt (`saarwood_telepromter_local`):

- `secrets/license-private.pem`
- `secrets/license-public.pem`
- `secrets/license-professional-beta.token`

Einordnung:

- Die zusaetzlichen Dateien im alten Projekt sind lokale historische Lizenzartefakte.
- Sie sind durch `.gitignore` aus der Versionsverwaltung ausgeschlossen (`secrets/`, `*.pem`, `*.key`, `*.token`).
- Im aktuellen Recovery-Projekt wurde nur die angeforderte aktive Uebersichtsdatei im `secrets/`-Ordner angelegt.

## 6. Checkliste (Final)

- [x] Lokale Restaenderung committed und gepusht
- [x] Vollstaendiger Projektspiegel nach Hostinger durchgeführt
- [x] Hostinger auf neue Monorepo-Struktur umgestellt
- [x] Produktions-Env auf neue Pfade migriert
- [x] Admin-Auth fuer Produktionsguard auf gehashte Passwoerter umgestellt
- [x] Service aktiv und Healthcheck 200
- [x] 3-Wege-Abgleich lokal/GitHub/Hostinger technisch nachgewiesen
- [x] Secrets-Unterschiede zwischen aktuellem und altem Projekt geprueft und dokumentiert

## 7. Externer Live-Smoke-Check (oeffentliche URL)

Durchgefuehrt gegen `https://teleprompter.saarwood.ch`:

1. Public Health Endpoint
- Request: `GET /api/health`
- Ergebnis: `{"status":"ok","uptime":4739,"wsClients":4,"mosClients":0}`

2. Public Support-Info Endpoint
- Request: `GET /api/support/info`
- Ergebnis: `ok=true` inkl. produktiver `chatUrl`, `handbookUrl`, `testerGuideUrl`, `testerFormUrl`

3. UI-Indikator in Output-Ansicht
- URL: `/?view=prompter&output=1`
- Sichtbarer Indikator im Live-Render: `READY` (Laufzeitstatus) in der Prompter-Ausgabe

Bewertung:
- Externer Smoke-Check ist bestanden (API + UI-Indikator live erreichbar und plausibel).
