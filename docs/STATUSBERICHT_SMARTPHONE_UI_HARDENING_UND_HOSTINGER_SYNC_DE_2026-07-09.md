# Statusbericht Smartphone-UI-Hardening und Hostinger-Sync

Stand: 2026-07-09

## 1. Anlass

Die Smartphone-Ansicht sollte nicht nur im Querformat gesperrt sein, sondern auf Phones auch ohne Titel, Mirror-Controls und Rotation arbeiten. Zusaetzlich sollte der produktive Stand sauber commit- und pushbar sein und anschliessend auf Hostinger synchronisiert werden.

## 2. Umsetzung im Frontend

Dateien:
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/Controls/ControlPanel.tsx`
- `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx`

Aenderungen:
- Neue Smartphone-Layout-Kennung auf Basis der bestehenden Smartphone-Erkennung.
- Smartphone-spezifischer Reset fuer Display-Zustand:
  - `mirrorHorizontal = false`
  - `mirrorVertical = false`
  - `rotation = 0`
  - `showProjectTitle = false`
- Editor-Titelbereich auf Smartphones ausgeblendet.
- ControlPanel auf Smartphones bereinigt:
  - kein Output-Fenster-Button
  - keine Mirror-Controls
  - keine Rotation-Controls
  - kein Prompter-Overlay mit Mirror-Bedienung
- PrompterDisplay auf Smartphones ohne Mirror-/Rotate-Transform und ohne Projekttitel-Overlay.

## 3. Verifikation

Lokaler Build:
- `npm run build` erfolgreich.

Browser-Pruefung:
- Smartphone-View rendert keinen Projekttitel.
- Smartphone-View rendert keine Mirror-Controls.
- Smartphone-View rendert keine Rotation-Controls.
- Orientation-Lock bleibt fuer Smartphone-Landscape aktiv.

## 4. Hostinger-Sync-Pfad

Produktiver Updatepfad:
- Git-Checkout auf Hostinger in `/srv/saarwood_telepromter`
- Update-Skript: `deploy/hostinger/update-app.sh`
- Service: `saarwood-teleprompter.service`

Erwarteter Ablauf:
1. Commit lokal erstellen.
2. Push nach `origin/main`.
3. Auf Hostinger `deploy/hostinger/update-app.sh` ausfuehren.
4. Dienst neu starten und Health-Check pruefen.

## 5. Ergebnis

Die Smartphone-UX ist jetzt hart auf den reduzierten Betrieb festgelegt. Der Code ist build-validiert und der Deployment-Pfad auf Hostinger ist fuer die naechste Synchronisation bereit.