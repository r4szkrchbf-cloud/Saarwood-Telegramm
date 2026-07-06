# Hostinger Day-0 Runlist (Public Beta)

Stand: 2026-07-06  
Ziel: Einmalige, saubere Inbetriebnahme auf Hostinger VPS mit reproduzierbaren Copy-Paste-Kommandos.

## 0) Annahmen

- OS: Ubuntu 24.04 LTS (oder 22.04 LTS)
- Domain: `beta.example.com`
- App-Pfad: `/srv/saarwood_telepromter`
- Git-Remote: `git@github.com:r4szkrchbf-cloud/Saarwood-Telegramm.git`
- Backend-Port intern: `4000`

## 1) Basis-Setup (Server)

Als `root` oder mit `sudo` ausfuehren:

```bash
apt update && apt upgrade -y
apt install -y curl git nginx ufw ca-certificates gnupg
```

Node.js 22 + npm installieren:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

Firewall freigeben:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

## 2) Deploy-User + Verzeichnisse

```bash
id -u deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
mkdir -p /srv/saarwood_telepromter
chown -R deploy:deploy /srv/saarwood_telepromter
mkdir -p /var/log/saarwood-teleprompter
chown -R www-data:www-data /var/log/saarwood-teleprompter
```

## 3) Repository holen + Build

Als `deploy` Benutzer:

```bash
sudo -u deploy -H bash -lc '
  cd /srv && \
  if [ ! -d saarwood_telepromter/.git ]; then
    git clone git@github.com:r4szkrchbf-cloud/Saarwood-Telegramm.git saarwood_telepromter
  fi && \
  cd /srv/saarwood_telepromter && \
  git fetch --all --prune && \
  git checkout main && \
  git pull --ff-only origin main && \
  npm ci && \
  npm run build --workspace=packages/frontend && \
  npm run build --workspace=packages/backend
'
```

## 4) Produktions-Env setzen

Template kopieren:

```bash
sudo -u deploy -H bash -lc '
  cd /srv/saarwood_telepromter && \
  cp -n deploy/hostinger/.env.production.template .env.production
'
```

`.env.production` editieren:

```bash
sudo -u deploy -H nano /srv/saarwood_telepromter/.env.production
```

Mindestens diese Werte korrekt setzen:

- `CORS_ORIGIN=https://beta.example.com`
- `PORT=4000`
- `FRONTEND_DIST=/srv/saarwood_telepromter/packages/frontend/dist`
- `LICENSE_MODE=enforce` oder `monitor`
- `ADMIN_API_KEY=<langer-zufallswert>`
- SMTP + Support-URLs produktiv

Schneller Secret-Generator fuer API-Key:

```bash
openssl rand -base64 48
```

## 5) Prozessmanager (systemd)

Service-Datei installieren:

```bash
cp /srv/saarwood_telepromter/deploy/hostinger/saarwood-teleprompter.service /etc/systemd/system/saarwood-teleprompter.service
systemctl daemon-reload
systemctl enable saarwood-teleprompter
systemctl restart saarwood-teleprompter
systemctl status saarwood-teleprompter --no-pager
```

Logs pruefen:

```bash
tail -n 120 /var/log/saarwood-teleprompter/out.log
tail -n 120 /var/log/saarwood-teleprompter/error.log
```

## 6) Nginx Reverse Proxy

Config kopieren und Domain ersetzen:

```bash
cp /srv/saarwood_telepromter/deploy/hostinger/nginx.teleprompter.conf /etc/nginx/sites-available/saarwood-teleprompter
sed -i 's/beta.example.com/beta.example.com/g' /etc/nginx/sites-available/saarwood-teleprompter
ln -sf /etc/nginx/sites-available/saarwood-teleprompter /etc/nginx/sites-enabled/saarwood-teleprompter
nginx -t
systemctl reload nginx
```

Hinweis: Wenn du eine echte Domain statt `beta.example.com` nutzt, ersetze sie in der Datei vor `nginx -t`.

## 7) TLS (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d beta.example.com --redirect -m admin@example.com --agree-tos -n
systemctl reload nginx
```

## 8) Day-0 Smoke-Test

Health direkt am Backend-Port:

```bash
curl -fsS http://127.0.0.1:4000/api/health | jq .
```

Hinweis: Wenn `jq` fehlt:

```bash
apt install -y jq
```

Oeffentliche Endpunkte testen:

```bash
curl -fsS https://beta.example.com/apps/teleprompter/api/health | jq .
curl -fsS https://beta.example.com/apps/teleprompter/api/support/info | jq .
```

Projekt-Script nutzen:

```bash
cd /srv/saarwood_telepromter
ADMIN_API_KEY='<dein-admin-key>' bash deploy/hostinger/smoke-test.sh https://beta.example.com/apps/teleprompter
```

## 9) Go-Live-Checks (manuell im Browser)

1. App laden: `https://beta.example.com/apps/teleprompter/`
2. Output-only testen: `?view=prompter&output=1`
3. Ticket-Flow testen (Settings > Support)
4. Lizenzstatus testen (`/api/license/status`)
5. WebSocket-Verbindung in DevTools kontrollieren (`wss://.../ws`)

## 10) Update-Run (ab Day-1)

```bash
cd /srv/saarwood_telepromter
bash deploy/hostinger/update-app.sh
```

## 11) Rollback-Schnellablauf

Vorherigen Commit deployen:

```bash
sudo -u deploy -H bash -lc '
  cd /srv/saarwood_telepromter && \
  git log --oneline -n 5 && \
  git checkout <PREVIOUS_COMMIT_SHA> && \
  npm ci && \
  npm run build --workspace=packages/frontend && \
  npm run build --workspace=packages/backend
'
systemctl restart saarwood-teleprompter
```

## 12) Post-Go-Live Monitoring (erste 24h)

```bash
watch -n 5 "curl -fsS https://beta.example.com/apps/teleprompter/api/health || echo HEALTH_FAIL"
```

```bash
tail -f /var/log/saarwood-teleprompter/error.log
```

Wenn Fehler auftreten:

1. `systemctl status saarwood-teleprompter --no-pager`
2. `journalctl -u saarwood-teleprompter -n 200 --no-pager`
3. Nginx logs: `/var/log/nginx/access.log` und `/var/log/nginx/error.log`
