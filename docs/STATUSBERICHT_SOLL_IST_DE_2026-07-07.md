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

## Delta-Update 2026-07-07 (Support-Mail + Hostinger DNS)

### Umgesetzt (live)

- Ticket-Mailfluss erweitert:
  - Bestaetigung an Ticket-Ersteller bleibt aktiv.
  - Zusaetzliche interne Support-Benachrichtigung pro neuem Ticket aktiv (separate Zustellung, nicht nur BCC).
- Produktionsbackend auf VPS neu gebaut und neu gestartet.
- Hostinger Domain-Mail-Eintraege ergaenzt/abgeglichen:
  - `mail.saarwood.ch -> mail.hostinger.com.`
  - zusaetzliche Client-Records: `smtp`, `imap`, `pop`, `webmail`
- Vorhandene Mail-Basisrecords bereits korrekt vorhanden:
  - MX
  - SPF
  - DKIM (`hostingermail-a/b/c._domainkey`)

### VPS Mailbox-Anbindung vorbereitet

- In `/srv/saarwood_telepromter/.env.production` gesetzt:
  - `SUPPORT_SMTP_HOST=smtp.hostinger.com`
  - `SUPPORT_SMTP_PORT=465`
  - `SUPPORT_SMTP_SECURE=true`
  - `SUPPORT_SMTP_USER=support@saarwood.ch`
  - `SUPPORT_MAIL_FROM` und `SUPPORT_CONTACT_EMAIL` gesetzt
- `SUPPORT_SMTP_PASS` bleibt absichtlich leer (Secret nicht im Repo/Chat).

### DNS-Warnung erklaert

- Hostinger-Warnungen zu DKIM/fehlenden Eintraegen koennen waehrend DNS-Propagation temporaer bestehen bleiben.
- Beobachtung: autoritative Nameserver hatten zwischenzeitlich unterschiedliche DMARC-Antworten; das fuehrt zu panelseitigen Uebergangs-Warnungen.
- Als sichere Uebergangsregel wurde DMARC auf `p=none` gesetzt, um unnoetige Mail-Ablehnung waehrend der Synchronisation zu vermeiden.

### VS Code Troubleshoot-Seite (Exit Code 5)

- Bedeutung: ein Terminal-Befehl ist mit Fehlercode `5` beendet worden.
- Das war hier kein Sicherheitsvorfall, sondern ein fehlgeschlagener Service-Restart mit falschem Unit-Namen in einem Zwischenschritt.
- VS Code oeffnet in diesem Fall automatisch die Troubleshoot-Seite.

### Verifikation / aktueller Stand

- Live-Tickettest erfolgreich erstellt (`SWD-2026-000005`), aber Mailversand erwartbar noch `false`:
  - `confirmationEmailSent=false`
  - `supportNotificationEmailSent=false`
- Ursache: SMTP-Passwort (`SUPPORT_SMTP_PASS`) wurde noch nicht gesetzt.

### Letzter manueller Secret-Schritt (Owner)

1. `ssh root@46.202.188.101`
2. `nano /srv/saarwood_telepromter/.env.production`
3. `SUPPORT_SMTP_PASS=<echtes-hostinger-mailpasswort>` setzen
4. `systemctl restart saarwood-teleprompter.service`

Danach E2E erneut testen und beide Mailflags auf `true` validieren.

### Repo-Transparenz (bereits gepusht)

- Teleprompter Commit: `9dd4f19`
- Adminpanel Commit (TODO 401 Auto-Reauth): `086caa8`
