# Statusbericht Hostinger Git-Checkout Setup

Stand: 2026-07-09
Scope: Produktions-VPS von rsync-only Zustand auf echten Git-Checkout mit Deploy-Key umstellen, damit `deploy/hostinger/update-app.sh` wieder lauffaehig ist.

## 1) Ausgangslage

Vor Setup:
- In `/srv/saarwood_telepromter` existierte kein `.git` (`HAS_GIT=0`).
- `ssh -T git@github.com` auf VPS schlug fehl (`Permission denied (publickey)`).
- Folge: `deploy/hostinger/update-app.sh` brach beim `git fetch/pull` ab.

## 2) Durchgefuehrte Umsetzung

1. Deploy-Key auf VPS erzeugt:
- Key-Datei: `/root/.ssh/saarwood_deploy_ed25519`
- Fingerprint: `SHA256:JxZkABnq+6bUDqyqwWkvHD3oCd2NuYNj5O7uwzySlR4`

2. Deploy-Key in GitHub-Repo hinterlegt:
- Repo: `r4szkrchbf-cloud/Saarwood-Telegramm`
- Typ: `read-only` Deploy Key
- Titel: `hostinger-vps-deploy-2026-07-09`

3. SSH auf VPS konfiguriert:
- `/root/.ssh/config` fuer `github.com` auf dedizierten Deploy-Key.
- Handshake erfolgreich:
  - `Hi r4szkrchbf-cloud/Saarwood-Telegramm! You've successfully authenticated...`

4. Sicherer Umstieg auf echten Checkout:
- Bestehendes Verzeichnis wurde als Vollbackup verschoben nach:
  - `/srv/backups/hostinger_pre_git_checkout_20260709_072543`
- Frischer Clone nach `/srv/saarwood_telepromter`.
- `.env.production` und Support-Daten aus Backup wiederhergestellt.

5. Update-Skript-Endtest:
- `bash deploy/hostinger/update-app.sh` erfolgreich durchgelaufen.
- Meldung: `Update complete via systemd restart.`

## 3) Verifikation nach Setup

Git:
- `git status -sb` -> `## main...origin/main`
- `HEAD` auf VPS: `9adfa6b006b9c30aac079a370160cfff823ade34`

Runtime:
- `systemctl status saarwood-teleprompter` -> `active (running)`
- `curl http://127.0.0.1:4000/api/health` -> `status=ok`
- `curl https://teleprompter.saarwood.ch/api/health` -> `status=ok`

Produktive Env-Pfade bestaetigt:
- `FRONTEND_DIST=/srv/saarwood_telepromter/packages/frontend/dist`
- `LICENSE_REVOCATION_FILE=/srv/saarwood_telepromter/packages/backend/config/license-revocations.json`
- `SUPPORT_DOCS_DIR=/srv/saarwood_telepromter/packages/backend/data/support`
- `ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS=true`

## 4) Ergebnis

Ziel erreicht:
- Hostinger ist jetzt ein echter Git-Checkout.
- GitHub-Zugriff per Deploy-Key funktioniert.
- `update-app.sh` ist wieder als Standard-Updatepfad nutzbar.
- Produktion ist nach Umstellung stabil und erreichbar.
