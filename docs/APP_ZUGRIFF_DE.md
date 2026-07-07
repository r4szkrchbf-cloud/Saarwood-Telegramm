<!-- markdownlint-disable MD031 MD032 MD036 MD060 -->

# Saarwood Teleprompter — App starten & aufrufen

_Stand: 2026-07-04 · Version: 1.0.0-beta.1_

Diese Anleitung beschreibt, wie die Teleprompter-App gestartet und im Browser oder als Desktop-App geöffnet wird.

---

## Voraussetzungen

| Tool | Mindestversion |
|------|---------------|
| Node.js | ≥ 20 (empfohlen: 22) |
| npm | ≥ 10 |
| Git | beliebige aktuelle Version |

```bash
# Versionen prüfen
node -v
npm -v
```

---

## Schnellstart (Development — empfohlen für Entwicklung & Test)

```bash
# 1. Repository klonen (einmalig)
git clone git@github.com:r4szkrchbf-cloud/Saarwood-Telegramm.git
cd saarwood_telepromter

# 2. Alle Abhängigkeiten installieren (einmalig oder nach package.json-Änderungen)
npm install

# 3. Entwicklungsserver starten (Frontend + Backend gleichzeitig)
npm run dev
```

Danach sind folgende URLs erreichbar:

| Dienst | URL | Beschreibung |
|--------|-----|--------------|
| **Frontend (App)** | `http://localhost:3000` | Teleprompter-UI im Browser |
| **Backend (API/WS)** | `http://localhost:4000` | REST-API + WebSocket-Control |
| **Health-Check** | `http://localhost:4000/api/health` | Backend-Status prüfen |

> **Tipp:** Einfach `http://localhost:3000` im Browser öffnen — das ist die App.

---

## Einzeln starten

Falls nur ein Teil der App benötigt wird:

```bash
# Nur Backend starten
npm run dev --workspace=packages/backend

# Nur Frontend starten
npm run dev --workspace=packages/frontend
```

---

## Produktions-Build (Deployment / Staging)

```bash
# 1. Frontend + Backend bauen
npm run build --workspaces

# 2. Backend starten (serviert auch das Frontend-Bundle)
node packages/backend/dist/server.js
```

App dann unter `http://localhost:4000` erreichbar.

Umgebungsvariablen für das Backend:

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `PORT` | `4000` | Backend-Port |
| `APP_TIER` | `basic` | Feature-Tier: `basic` / `professional` / `expert` |
| `NODE_ENV` | `development` | `production` für optimierte Ausgabe |
| `ENABLE_MOS` | `false` | MOS-Protocol aktivieren |
| `ENABLE_NDI` | `false` | NDI-Abstraktionsschicht aktivieren |
| `LICENSE_MODE` | `disabled` | Lizenzmodus: `disabled` / `monitor` / `enforce` |
| `LICENSE_PUBLIC_KEY_PEM` | _(leer)_ | Ed25519 Public Key (PEM) zur Token-Pruefung |
| `LICENSE_PRIVATE_KEY_PEM` | _(leer)_ | Ed25519 Private Key (PKCS8 PEM) fuer serverseitiges Admin-Token-Minting |
| `LICENSE_REVOCATION_FILE` | `packages/backend/config/license-revocations.json` | Revocation-Liste fuer gesperrte Lizenzen/Generationen |
| `ADMIN_API_KEY` | _(leer)_ | Aktiviert geschuetzte Admin-Lizenz-Endpunkte unter `/api/admin/license/*` |
| `SUPPORT_CONTACT_EMAIL` | `support@saarwood.local` | Sichtbarer Kontakt im Settings-Supportbereich |
| `SUPPORT_CHAT_URL` | _(leer)_ | Externer Direkt-Chat-Link (z. B. Crisp, Tawk, Slack-Bridge) |
| `SUPPORT_CHAT_LABEL` | `Support Chat` | Label des Chat-Buttons im UI |
| `SUPPORT_TICKET_FILE` | `packages/backend/data/support-tickets.ndjson` | Lokale Ablage fuer Supporttickets |
| `SUPPORT_TICKET_SEQUENCE_FILE` | `packages/backend/data/support-ticket-sequence.json` | Zentraler Ticket-Counter fuer fortlaufende Ticket-ID |
| `SUPPORT_TICKET_WEBHOOK_URL` | _(leer)_ | Optionaler Webhook fuer Ticket-Weiterleitung (z. B. Helpdesk) |
| `SUPPORT_HANDBOOK_URL` | _(leer)_ | Link zum Handbuch-Download (oeffnet in neuem Fenster) |
| `SUPPORT_TESTER_GUIDE_URL` | _(leer)_ | Link zum Tester-Guide-Download (oeffnet in neuem Fenster) |
| `SUPPORT_TESTER_FORM_URL` | _(leer)_ | Link zum interaktiven Tester-Formular (oeffnet in neuem Fenster) |

Beispiel mit allen Features:
```bash
APP_TIER=expert NODE_ENV=production node packages/backend/dist/server.js
```

Beispiel mit aktivierter Lizenzpruefung (Public Beta):
```bash
LICENSE_MODE=enforce LICENSE_PUBLIC_KEY_PEM="-----BEGIN PUBLIC KEY-----..." NODE_ENV=production node packages/backend/dist/server.js
```

Lizenz-Endpunkte (Phase A):
- `GET /api/license/status` (Header optional: `x-license-token` oder `Authorization: Bearer ...`)
- `POST /api/license/activate` mit JSON-Body `{ "token": "..." }`

Interne Support-Kommandos (Phase B) sind dokumentiert in:
- `docs/SUPPORT_LICENSE_RUNBOOK_DE.md`

Phase-C Admin-API (nur mit `ADMIN_API_KEY`):
- `GET /api/admin/license/revocations`
- `POST /api/admin/license/revoke-license` mit `{ "licenseId": "..." }`
- `POST /api/admin/license/unrevoke-license` mit `{ "licenseId": "..." }`
- `POST /api/admin/license/revoke-generation` mit `{ "generation": "beta-v1" }`
- `POST /api/admin/license/unrevoke-generation` mit `{ "generation": "beta-v1" }`
- `POST /api/admin/license/create` (mintet signierte Lizenz serverseitig)

Hinweis Adminpanel:
- Zielbild fuer das Saarwood-Adminpanel sind zwei freigegebene Zugriffsvarianten: `/admin` und `admin.saarwood.ch`.
- Der aktuelle Admin-Zugriff erfolgt bereits ueber die geschuetzten Admin-API-Endpunkte unter `/api/admin/license/*` mit `x-admin-api-key`.
- Praxiszugriff fuer Produktion ist in `docs/ADMIN_LICENSE_CHEATSHEET_DE.md` dokumentiert.

Marke:
- Die Marke wird intern und in der Plattformkommunikation als `SAARwooD` gefuehrt.
- Schreibweise: `SAAR` rot, `woo` weiss, `D` rot.

Support-API:
- `GET /api/support/info`
- `POST /api/support/tickets`

Domain-Rollen:
- `teleprompter.saarwood.ch` bleibt die operative Teleprompter-App.
- `saarwood.ch` und `www.saarwood.ch` sind die Marken-/SEO-Hauptseite in einem separaten Repository.

Hinweis zum Live-Betrieb:
- Der Live-Umzug der Hauptdomain wird im separaten Saarwood-Hauptseiten-Repository umgesetzt und hier nur dokumentiert.

Deploy-Set fuer Hostinger:
- `deploy/hostinger/nginx.teleprompter.conf`
- `deploy/hostinger/ecosystem.config.cjs`
- `deploy/hostinger/saarwood-teleprompter.service`
- `deploy/hostinger/.env.production.template`
- `deploy/hostinger/smoke-test.sh`
- `deploy/hostinger/update-app.sh`

---

## Desktop-App (Electron)

> Ausführliche Anleitung: [`docs/NATIVE_APP_GUIDE.md`](./NATIVE_APP_GUIDE.md)

```bash
# macOS (.dmg Universal Binary)
npm run electron:dist:mac

# Windows (NSIS-Installer .exe)
npm run electron:dist:win

# Linux (AppImage + .deb)
npm run electron:dist:linux
```

Die fertige Installationsdatei liegt unter `packages/electron/dist-app/`.

Die Desktop-App startet Backend und Frontend automatisch im Hintergrund — kein separater Serverstart nötig.

---

## Als PWA installieren (kein App-Store nötig)

Die App ist eine Progressive Web App und kann direkt aus dem Browser heraus installiert werden:

| Plattform | Browser | Aktion |
|-----------|---------|--------|
| macOS / Windows / Linux | Chrome / Edge | Installations-Icon in der Adressleiste klicken |
| Android | Chrome | Menü (⋮) → „App installieren" |
| iOS / iPadOS | Safari | Teilen → „Zum Home-Bildschirm" |

Nach der Installation startet die App im Standalone-Modus ohne Browser-Rahmen.

---

## Tests ausführen

```bash
# Alle Unit-Tests (Frontend + Backend + Electron)
npm test --workspaces

# Erwartetes Ergebnis:
# ✓ packages/frontend — 30 Tests
# ✓ packages/backend  —  9 Tests
# ✓ packages/electron — (kein Test, No-op)
```

---

## Häufige Fragen

**Die App öffnet sich, aber der WebSocket verbindet nicht.**  
Sicherstellen, dass das Backend ebenfalls läuft (`npm run dev` startet beides gleichzeitig).  
Im Browser: DevTools → Console prüfen, ob `ws://localhost:4000/ws` erreichbar ist.

**Port 3000 oder 4000 ist bereits belegt.**  
Vite-Port anpassen: `packages/frontend/vite.config.ts` → `server: { port: 3001 }`.  
Backend-Port: Umgebungsvariable `PORT=4001 npm run dev --workspace=packages/backend`.

**`npm run dev` gibt Fehler aus, obwohl `npm install` durchgelaufen ist.**  
Node.js-Version prüfen: `node -v` (muss ≥ 20 sein). Ggf. via [nvm](https://github.com/nvm-sh/nvm) aktualisieren.

**Ich möchte die App im Netzwerk zugänglich machen (z. B. für Prompter-Bildschirm im Studio).**  
Backend `HOST=0.0.0.0` setzen und Vite mit `--host` starten:
```bash
# Backend:
HOST=0.0.0.0 npm run dev --workspace=packages/backend

# Frontend:
npm run dev --workspace=packages/frontend -- --host
```
App dann unter `http://<LAN-IP>:3000` auf allen Geräten im gleichen Netzwerk erreichbar.

---

## Verwandte Dokumente

| Dokument | Inhalt |
|----------|--------|
| [`README.md`](../README.md) | Architekturübersicht, vollständige Feature-Liste |
| [`docs/NATIVE_APP_GUIDE.md`](./NATIVE_APP_GUIDE.md) | Electron (macOS/Win/Linux) und Android-Build-Anleitung |
| [`docs/BETA_TESTER_GUIDE.md`](./BETA_TESTER_GUIDE.md) | Anleitung für Beta-Tester |
| [`docs/PROJECT_STATUS_DE.md`](./PROJECT_STATUS_DE.md) | Aktueller Projektstand |
| [`docs/TEST_MVP.md`](./TEST_MVP.md) | MVP-Stresstest-Protokoll |

---

_Erstellt: 2026-07-04 · Saarwood Teleprompter Beta V1_
