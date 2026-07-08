# Next Action Plan

Stand: 2026-07-08

## 1) SMTP dringend

Aktueller Stand:
- Ticket-Speicherung funktioniert.
- Mailversand scheitert wegen Sender-Autorisierung.
- Produktion ist aktuell auf diese Kombination gesetzt:
  - SUPPORT_SMTP_USER = office@saarwood.ch
  - SUPPORT_MAIL_FROM = support@saarwood.saarwood.ch
  - SUPPORT_CONTACT_EMAIL = office@saarwood.ch,support@saarwood.saarwood.ch

Konsequenz:
- Provider lehnt den Absender ab, solange support@ nicht fuer den verwendeten SMTP-Login autorisiert ist.

Naechster operativer Schritt:
- Entweder SMTP-Login auf support@saarwood.saarwood.ch umstellen (inkl. korrektem Passwort),
  oder support@ als erlaubte Sender-Identitaet fuer office@ beim Provider freischalten.

Abnahme:
- Live-Testticket liefert confirmationEmailSent=true und supportNotificationEmailSent=true.

## 2) Backlog-Haupttickets

Priorisierte Reihenfolge fuer die naechste Umsetzungswelle:
1. SMTP-Freigabe (Blocker fuer Supportbetrieb)
2. Support-Ressourcen finaler E2E-Kurztest in TEST_MVP
3. Frontend-Performance-Warnung >500 kB auf klare Massnahme reduzieren
4. Go-Live-Haertung (Deploy-Runbook + Abnahmecheckliste aktuell halten)

Hinweis:
- Tablet-Clipping in Split/Prompter wurde heute behoben und auf main gepusht.

## 3) Strategische GAP-Punkte

Naechster minimaler Arbeitsblock:
1. 5 strukturierte Kunden-/Nutzerinterviews terminieren
2. Preis-/Tiergrenzen als Entwurf v1 dokumentieren
3. Lizenzmodell-Entscheidung fuer Beta festzurren
4. DSGVO/B2B-Vertragsrahmen als Kurzkonzept erfassen

Lieferobjekt fuer diesen Block:
- Ein datierter Statusbericht mit klaren Entscheidungen und offenen Punkten.
