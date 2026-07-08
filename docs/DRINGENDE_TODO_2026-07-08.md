# DRINGENDE TO DO — 2026-07-08

## Prioritaet P0

### SMTP-Absenderfreigabe fuer Support-Tickets finalisieren

**Kontext:**
Support-Tickets werden gespeichert (`stored: true`), aber Mailversand bleibt `false`, weil der SMTP-Provider den gesetzten Absender `support@saarwood.saarwood.ch` mit Fehler `553 5.7.1` ablehnt, solange Authentifizierung ueber `office@saarwood.ch` laeuft.

**Akzeptanzkriterien:**
- [ ] Mailversand fuer Ticket-Bestaetigung ist `confirmationEmailSent: true`
- [ ] Mailversand fuer Support-Notification ist `supportNotificationEmailSent: true`
- [ ] Support-Zieladresse `support@saarwood.saarwood.ch` erhaelt Ticket-Kopie
- [ ] Live-Testticket in Produktion dokumentiert (Ticket-ID + API-Response + kurzer Log-Auszug)

**Umsetzungsoptionen (eine davon zwingend):**
1. SMTP-Authentifizierung auf `support@saarwood.saarwood.ch` umstellen (empfohlen).
2. Alternativ beim Provider `support@saarwood.saarwood.ch` als erlaubte Sender-Identitaet fuer `office@saarwood.ch` freischalten.

**Betriebsnotiz:**
Deployment- und Git-Recovery sind abgeschlossen (Commit `423a965` auf `main`). Offener Restpunkt ist damit ausschliesslich die Mailprovider-Freigabe.
