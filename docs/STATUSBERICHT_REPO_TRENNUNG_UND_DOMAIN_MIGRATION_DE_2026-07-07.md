# Statusbericht Repo-Trennung und Domain-Migration (2026-07-07)

## Geltungsbereich

Dieser Bericht dokumentiert den Stand aus Sicht des Teleprompter-Repositories.

## Ergebnis

- Projekttrennung in drei eigene Repositories ist umgesetzt.
- Teleprompter bleibt als eigenstaendiges Produkt- und Betriebsrepo bestehen.
- `saarwood.ch` wurde als Hauptseite auf den VPS umgezogen.
- `teleprompter.saarwood.ch` bleibt produktiv und funktionsfaehig.

## Repositories

- Teleprompter: `git@github.com:r4szkrchbf-cloud/Saarwood-Telegramm.git`
- Main-Site: `git@github.com:r4szkrchbf-cloud/saarwood-ch-main-site.git`
- Adminpanel: `git@github.com:r4szkrchbf-cloud/saarwood-app-technik-adminpanel.git`

## Teleprompter-relevante Punkte

- Teleprompter-Codebasis bleibt in `packages/frontend`, `packages/backend`, `packages/electron`.
- Dokumentationsgrenze ist aktualisiert: Main-Site und Adminpanel werden ausserhalb dieses Repos gepflegt.
- Querverweise auf die beiden Schwester-Repositories sind im Root-README hinterlegt.
- Arbeitsartefakt `repo-exports/` wurde aus diesem Repository entfernt.

## Betriebsstatus

- Healthcheck: `https://teleprompter.saarwood.ch/api/health` liefert `200 OK`.
- DNS/Domain-Migration der Hauptdomain hat den Teleprompter-Endpunkt nicht beeintraechtigt.

## Nächste Teleprompter-Schritte

- Teleprompter-Feature- und Stabilitaetsarbeit laeuft weiterhin in diesem Repository.
- Plattformuebergreifende Themen werden nur als Referenz dokumentiert, aber in den jeweiligen Ziel-Repositories umgesetzt.
