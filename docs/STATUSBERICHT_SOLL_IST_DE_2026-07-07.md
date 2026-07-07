# Statusbericht Soll-Ist (Teleprompter)

Stand: 2026-07-07

## Soll-Zustand

- Teleprompter-App und Backend stabil produktiv unter `teleprompter.saarwood.ch`.
- Zentrale Admin-Auth-Endpunkte fuer Adminpanel verfuegbar.
- Keine offen genannten Demo-Passwoerter im versionierten Code.

## Ist-Zustand (geprueft)

- Monorepo-Build (Frontend + Backend) erfolgreich (`npm run build`).
- Live-URL `https://teleprompter.saarwood.ch` liefert HTTP 200.
- Auth-Endpunkte live:
  - `GET /api/admin/auth/providers` -> ok
  - `POST /api/admin/auth/login` -> JWT-Token Rueckgabe
- Service auf VPS aktiv (systemd: `saarwood-teleprompter.service`).

## Sicherheits-/Doku-Check

- CORS-Liste fuer Adminpanel/Main-Site erweitert.
- Backend-Auth-Konfiguration in README-Env-Tabelle dokumentiert.
- Demo-Passwoerter aus Source-Defaults entfernt (`CHANGE_ME_IN_ENV`).

## Offene Punkte

- Echten OIDC-Provider-Handshake fuer SSO implementieren (aktuell API-Methode vorhanden, Provider-Flow noch ausstehend).
- Secrets-Rotation fuer `ADMIN_AUTH_JWT_SECRET` operationalisieren.
