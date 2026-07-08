# Statusabgleich Code <-> Dokumentation

Stand: 2026-07-08 UTC

## Ziel

Dieser Snapshot dokumentiert den verifizierten Ist-Stand nach Git-Recovery, Build/Test-Lauf und Live-Support-Ticket-Pruefung.

## Verifizierte technische Checks

- `npm run build`: erfolgreich (Frontend + Backend)
- `npm run test`: erfolgreich
  - Frontend: 3 Dateien, 30 Tests gruen
  - Backend: 3 Dateien, 12 Tests gruen
- Letzter produktiver Commit auf `main`: `eb5593c`

## Code-zu-Doku-Abgleich (Kernpunkte)

### 1) Output-only Verhalten

Code-Status:
- In `packages/frontend/src/App.tsx` wird `showControlPanel` ueber `!isOutputOnly` gesteuert.
- In `packages/frontend/src/components/Controls/ControlPanel.tsx` gibt es zusaetzlich einen harten Guard (`isOutputOnly` oder `output=1`) mit `return null`.

Doku-Status:
- Muss eindeutig sagen: Output-only zeigt **keine** Controls.

Ergebnis:
- Abgleich passt nach Doku-Update vom 2026-07-08.

### 2) Support-URL/Fallback-Logik

Code-Status:
- `packages/backend/src/support/SupportService.ts` normalisiert Support-Dokumentlinks und faellt bei Platzhalter/ungueltig auf PDF-Pfade zurueck.
- Kontext (`protocol`/`host`) wird fuer public URL-Aufloesung genutzt.

Doku-Status:
- Muss widerspiegeln, dass die PDF-Fallback-Logik aktiv ist (nicht nur "geplant").

Ergebnis:
- Abgleich passt nach Doku-Update vom 2026-07-08.

### 3) Ticket-Status-Transparenz

Code-Status:
- Ticket-API liefert `confirmationEmailSent` und `supportNotificationEmailSent`.
- Frontend zeigt diese Zustaende explizit in der Support-UI.

Doku-Status:
- Muss den Unterschied zwischen Ticket-Speicherung und Mailversand klar halten.

Ergebnis:
- Fachlich korrekt dokumentiert, operativ aber noch offen (siehe Risiken).

## Offene operative Risiken (nicht Code-defekt)

1. SMTP-Sender-Autorisierung
- Live-Log zeigt `553 5.7.1 ... Sender address rejected: not owned by user office@saarwood.ch`.
- Folge: `confirmationEmailSent=false`, `supportNotificationEmailSent=false` trotz `stored=true`.

2. Bundlegroesse Frontend
- Vite meldet weiterhin Chunk-Warnung > 500 kB.
- Kein Blocker, aber Performance-Thema fuer Feldbetrieb.

## Referenzdokumente (aktualisiert)

- `docs/PROJECT_STATUS_DE.md`
- `docs/CODE_DOC_SYNC_DE.md`
- `docs/DRINGENDE_TODO_2026-07-08.md`
- `docs/COMMIT_STATISTIK_SNAPSHOT_2026-07-08.md`
