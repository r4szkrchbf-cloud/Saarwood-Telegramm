# Statusbericht Tablet-Layout-Fix und Hostinger-Sync

Stand: 2026-07-09
Scope: Live-Pruefung Tablet-Querformat, Code-Fix, Deployment auf Hostinger, Produktions-Verifikation.

## 1) Ausgangsbefund (Live)

Direkt auf `https://teleprompter.saarwood.ch` wurde im Querformat fuer Tablets ein reproduzierbares Clipping festgestellt.

Messwerte vor Fix (stale Frontend-Asset):
- 1024x768: kein horizontaler Overflow.
- 962x601: kein horizontaler Overflow.
- 1280x800: reproduzierbar abgeschnitten (Layout breiter als Viewport).
- 1366x1024: reproduzierbar abgeschnitten.
- Betroffene Modi: `Split` und `Prompter`.

Technischer Befund vor Cache-Bereinigung:
- Der Client lud ein altes CSS-Bundle `/assets/index-BHqL4GQ8.css`.
- Dabei wurde u. a. eine Layoutbreite von ca. `1536px` bei `1280px` Viewport beobachtet.

## 2) Umgesetzter Code-Fix

Datei:
- `packages/frontend/src/App.css`

Wesentliche Aenderungen:
1. Header gegen Mindestbreiten-Overflow gehaertet.
- `min-width: 0` in `.app-header`.
- Referenz: `packages/frontend/src/App.css:57`.

2. Workspace auf Viewportbreite begrenzt.
- `width: 100%`, `max-width: 100%`, `min-width: 0` in `.app-workspace`.
- Referenz: `packages/frontend/src/App.css:298`.

3. Neuer Breakpoint fuer breite Tablets (`1025px` bis `1366px`).
- Header/Logo koennen umbrechen, lange Hints werden ausgeblendet.
- Split/Prompter-Container werden explizit auf `max-width: 100%` begrenzt.
- Referenz: `packages/frontend/src/App.css:799`.

Commit:
- `b1bc96c8055520fe1aa809001f68f48cc8a7a0aa`
- Message: `fix(frontend): prevent tablet landscape clipping above 1024px`

## 3) Build und Deployment

Lokal:
- `npm run build` erfolgreich.

Hostinger:
- Full-Mirror per `rsync` nach `/srv/saarwood_telepromter`.
- Build auf VPS erfolgreich (`npm ci`, `npm run build`).

Wichtiges Betriebsereignis waehrend Sync:
- Beim Spiegeln wurde `.env.production` initial entfernt (durch `--delete`), dadurch Service-Startfehler.
- Danach Wiederherstellung und Security-konforme Nachhaertung:
  - `ADMIN_AUTH_USERS_JSON` auf bcrypt-Hashes migriert.
  - `ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS=true` sichergestellt.

Zusaetzliche Produktiv-Pfadkorrektur in `.env.production`:
- `FRONTEND_DIST=/srv/saarwood_telepromter/packages/frontend/dist`
- `LICENSE_REVOCATION_FILE=/srv/saarwood_telepromter/packages/backend/config/license-revocations.json`
- `SUPPORT_DOCS_DIR=/srv/saarwood_telepromter/packages/backend/data/support`

## 4) Produktionsverifikation (nach Recovery)

API:
- `GET https://teleprompter.saarwood.ch/api/health` -> `{"status":"ok",...}`
- `GET https://teleprompter.saarwood.ch/api/support/info` -> `ok=true`

Frontend-Auslieferung:
- Server-HTML referenziert aktuelle Assets:
  - `/assets/index-KHkhmdWN.js`
  - `/assets/index-j0dw0fzj.css`

Cache-Bereinigung fuer echten Live-Re-Test:
- Service Worker im Test-Client deregistriert und Cache geleert.
- Danach Neuladen mit Cache-Bust-Query.
- Geladene Stylesheets danach: nur aktuelles `/assets/index-j0dw0fzj.css`.

## 5) Re-Test-Ergebnis nach Fix (Live)

Ergebnis: kein horizontales Clipping mehr reproduzierbar.

Gemessene Viewports (jeweils `Split` und `Prompter`):
- 1024x768 -> kein Overflow
- 962x601 -> kein Overflow
- 1280x800 -> kein Overflow
- 1366x1024 -> kein Overflow
- 390x844 -> kein Overflow
- 844x390 -> kein Overflow

Fachliche Bewertung:
- Der urspruengliche Fehler war reproduzierbar und ist nach Code-Fix + korrekter Asset-Auslieferung behoben.
- Ein Teil des fruehen Fehlbilds wurde durch stale Service-Worker-Assets verstaerkt.

## 6) Simulationsfaehigkeit und Grenzen

In dieser Umgebung ist moeglich:
- Viewport-Simulation fuer Tablet/Smartphone.
- DOM/CSS-Messung (z. B. `scrollWidth/clientWidth`, Offscreen-Elemente).
- Live-Validierung gegen Produktions-URL.

Grenzen:
- Kein vollstaendiger Ersatz fuer Realgeraete-Stacks (insb. iPadOS Safari-Eigenheiten, echte Touch-/Keyboard-Overlays, Sensorsignale).