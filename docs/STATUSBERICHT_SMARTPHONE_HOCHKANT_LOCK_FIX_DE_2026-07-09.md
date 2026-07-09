# Statusbericht Smartphone-Hochkant-Lock Fix

Stand: 2026-07-09

## 1. Anlass

Anforderung: Smartphone darf in der Teleprompter-App nur im Hochkantmodus laufen. Querformat muss gesperrt bleiben.

## 2. Root Cause (warum es trotz "umgesetzt" weiter auftrat)

Der bisherige Code koppelte die Sperre an `isMobileLayout` mit `viewportWidth <= 768`.

- Bei typischen Smartphone-Landscape-Groessen wie `844x390` war `isMobileLayout=false`.
- Dadurch griff `isSmartphoneLandscapeLocked` nicht.
- Ergebnis: Auf Smartphones konnte Querformat weiter angezeigt werden.

## 3. Code-Fix

Datei: `packages/frontend/src/App.tsx`

Aenderung:
- Sperrlogik von reiner Layoutbreite entkoppelt.
- Neue Smartphone-Erkennung:
  - `navigator.userAgentData.mobile`
  - Phone-User-Agent-Muster
  - Fallback fuer phone-typische Touch-Viewports
- Querformat-Sperre jetzt:
  - `isSmartphoneDevice && viewportWidth > viewportHeight`

## 4. Verifikation

Build:
- `npm run build --workspace=packages/frontend` erfolgreich.

Live (Hostinger) nach Deployment:
- API Health `ok`.
- Mit Touch-Simulation im Browsertest:
  - `390x844` -> keine Sperre (erwartet)
  - `844x390` -> Sperransicht sichtbar
  - `915x412` -> Sperransicht sichtbar
- Lock-Text bestaetigt: "Nur Hochkantmodus auf Smartphones".

## 5. Doku-Abgleich

Gefundene Doku-Lage vor Fix:
- Viele Smartphone-Layoutregeln waren dokumentiert.
- Eine explizite, harte Hochkant-Only-Regel war nicht ueberall klar ausformuliert.
- Gleichzeitig war im Code die Sperrbedingung zu eng (<=768), was den Widerspruch ausloeste.

Nachgezogen:
- `docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md`: Smartphone nur Hochkant explizit.
- `docs/KONZEPT_SMARTPHONE_DESIGN_TELEPROMPTER_DE_2026-07-07.md`: verbindliche Hochkant-Sperre fuer Smartphones ergaenzt.
- `docs/BETA_TESTER_GUIDE.md`: Testfall `M-20` fuer Querformat-Sperre ergaenzt.

## 6. Commit

- `9adfa6b006b9c30aac079a370160cfff823ade34`
- Message: `fix(frontend): enforce smartphone portrait-only orientation`
