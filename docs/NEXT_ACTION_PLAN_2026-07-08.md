# Next Action Plan

Stand: 2026-07-08

## 1) SMTP dringend

Aktueller Stand:
- SMTP-Login ist auf `support@saarwood.saarwood.ch` umgestellt.
- Produktives SMTP-Secret wurde rotiert.
- Support-Flow ist live verifiziert:
  - `SWD-2026-000016`: `confirmationEmailSent=true`, `supportNotificationEmailSent=true`
  - `SWD-2026-000017`: `confirmationEmailSent=true`, `supportNotificationEmailSent=true`

Konsequenz:
- Der SMTP-Blocker ist im aktuellen Produktionsstand abgeschlossen.

Abnahme:
- Erfuellt.

## 2) Backlog-Haupttickets

Priorisierte Reihenfolge fuer die naechste Umsetzungswelle:
1. Strategischen GAP-Arbeitsblock weiter in Entscheidungen ueberfuehren (Interviews/Preise/Lizenz/DSGVO)

Heute abgeschlossen:
- Support-Ressourcen finaler E2E-Kurztest in `docs/TEST_MVP.md` nachgezogen.
- Frontend-Performance-Warnung >500 kB auf konkrete, verifizierte Massnahme reduziert (Vite-Chunk-Splitting + Build/Test-Retest).
- Go-Live-Haertung (Runbook + Abnahmecheckliste) auf aktuellen Security-/SMTP-Produktionsstand synchronisiert.
- Strategischer GAP-Arbeitsblock datiert gestartet: `docs/STATUSBERICHT_GAP_ARBEITSBLOCK_DE_2026-07-09.md`.

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
