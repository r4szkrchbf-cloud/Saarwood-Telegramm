# Rotationsprotokoll Produktion

Stand: 2026-07-08
Status: Abgeschlossen
Scope: Operative Rotation produktiver Secrets auf dem VPS `teleprompter.saarwood.ch`

## 1. Durchgefuehrte Rotation

Heute auf dem produktiven VPS rotiert:

- `ADMIN_AUTH_JWT_SECRET`
- `ADMIN_API_KEY`
- `SUPPORT_SMTP_PASS`

Heute angepasst:

- `SUPPORT_SMTP_USER` -> auf `support@saarwood.saarwood.ch` umgestellt

## 2. Ausfuehrungsdetails

- Zielsystem: `root@46.202.188.101`
- Produktivpfad: `/srv/saarwood_telepromter/.env.production`
- Backup angelegt: `/srv/saarwood_telepromter/.env.production.pre-rotation-2026-07-08`
- Rotationszeitpunkt (Unix UTC): `1783540569`

## 3. Redigierte Nachweise

Neue Fingerprints der rotierten Werte:

- `ADMIN_AUTH_JWT_SECRET` -> `sha256:29ff389237ff`
- `ADMIN_API_KEY` -> `sha256:da387fd197fe`
- `SUPPORT_SMTP_PASS` -> `sha256:ba4c3a332edb`

Aktueller produktiver Zustand (redigiert) nach Rotation:

- `ADMIN_AUTH_JWT_SECRET` gesetzt, Laenge 64
- `ADMIN_API_KEY` gesetzt, Laenge 48
- `SUPPORT_SMTP_USER=support@saarwood.saarwood.ch`
- `SUPPORT_SMTP_PASS` gesetzt, Laenge 24

## 4. Technische Verifikation

Erfolgreich nachgewiesen:

- `systemctl is-active saarwood-teleprompter` -> `active`
- Lokaler Backend-Healthcheck auf VPS -> `{"status":"ok", ...}`
- Admin-Endpunkt mit neuem `ADMIN_API_KEY` funktioniert:
  - `GET /api/admin/license/revocations` -> erfolgreich serverseitig mit neuem Key
- Live-Support-Ticket nach SMTP-Korrektur erfolgreich:
  - `ticketId=SWD-2026-000016`
  - `stored=true`
  - `confirmationEmailSent=true`
  - `supportNotificationEmailSent=true`

## 5. Bewertung

- App-seitige Admin-Secrets wurden erfolgreich rotiert und verifiziert.
- SMTP-/Mailbox-Secrets wurden erfolgreich angepasst und verifiziert.
- P0-3 ist damit vollstaendig abgeschlossen.
