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
git clone https://github.com/saarnews/saarwood_telepromter.git
cd saarwood_telepromter

# 2. Alle Abhängigkeiten installieren (einmalig oder nach package.json-Änderungen)
npm install

# 3. Entwicklungsserver starten (Frontend + Backend gleichzeitig)
npm run dev
```

Danach sind folgende URLs erreichbar:

| Dienst | URL | Beschreibung |
|--------|-----|--------------|
| **Frontend (App)** | `http://localhost:5173` | Teleprompter-UI im Browser |
| **Backend (API/WS)** | `http://localhost:3000` | REST-API + WebSocket-Control |
| **Health-Check** | `http://localhost:3000/api/health` | Backend-Status prüfen |

> **Tipp:** Einfach `http://localhost:5173` im Browser öffnen — das ist die App.

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

App dann unter `http://localhost:3000` erreichbar.

Umgebungsvariablen für das Backend:

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `PORT` | `3000` | Backend-Port |
| `APP_TIER` | `basic` | Feature-Tier: `basic` / `professional` / `expert` |
| `NODE_ENV` | `development` | `production` für optimierte Ausgabe |
| `ENABLE_MOS` | `false` | MOS-Protocol aktivieren |
| `ENABLE_NDI` | `false` | NDI-Abstraktionsschicht aktivieren |

Beispiel mit allen Features:
```bash
APP_TIER=expert NODE_ENV=production node packages/backend/dist/server.js
```

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
# ✓ packages/frontend — 25 Tests
# ✓ packages/backend  —  9 Tests
# ✓ packages/electron — (kein Test, No-op)
```

---

## Häufige Fragen

**Die App öffnet sich, aber der WebSocket verbindet nicht.**  
Sicherstellen, dass das Backend ebenfalls läuft (`npm run dev` startet beides gleichzeitig).  
Im Browser: DevTools → Console prüfen, ob `ws://localhost:3000/ws` erreichbar ist.

**Port 5173 oder 3000 ist bereits belegt.**  
Vite-Port anpassen: `packages/frontend/vite.config.ts` → `server: { port: 5174 }`.  
Backend-Port: Umgebungsvariable `PORT=3001 npm run dev --workspace=packages/backend`.

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
App dann unter `http://<LAN-IP>:5173` auf allen Geräten im gleichen Netzwerk erreichbar.

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
