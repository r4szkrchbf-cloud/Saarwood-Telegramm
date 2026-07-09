# Repository Agent Rules

Diese Regeln gelten fuer KI- und Coding-Assistenten in diesem Repo.

## Zaehlstand (aktuell)

- Automatik-Bereiche: 3
- Verbindliche Regeln: 11 klar verpflichtend + 1 bedingt verpflichtend
- Trigger-Pfade fuer Pfadindex-Automatik: 10

## Pfadindex-Automatik

Wenn eine Datei in einem der folgenden Bereiche erstellt, geloescht oder umbenannt wird, MUSS danach der Pfadindex aktualisiert werden:

- packages/frontend/*.html
- packages/frontend/src/pages/*Form*.tsx
- packages/frontend/src/pages/*Form*.css
- packages/frontend/public/support/*.pdf
- packages/frontend/src/components/Settings/SettingsPanel.tsx
- packages/backend/src/support/SupportService.ts
- packages/backend/src/routes/api.ts
- docs/*GUIDE*.md
- docs/*HANDBUCH*.md
- docs/*FORMULAR*.md

Pflichtkommando:
- npm run docs:pathindex:sync

Danach:
- Pruefen, dass docs/PFADINDEX_AENDERBARE_INHALTE_DE.md aktualisiert wurde.
- Wenn noetig, docs/CHECKLIST_AENDERUNGEN_FORMULARE_PFADE_DE.md inhaltlich anpassen.

## Automatische Projektstatus- und TODO-Pflege

Wenn Code, Dokumentation, Build-/Deploy-Status oder Projektplanung geaendert wird, MUESSEN die zentralen Auto-Dateien aktualisiert werden:

- docs/PROJEKTSTATUS_AUTOMATISCH_DE.md
- docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md

Pflichtkommando:
- npm run docs:governance:sync

Empfehlung (beide Automatiken zusammen):
- npm run docs:sync-all

Pflichtinhalt der Pflege:
- Fortlaufende Historie mit Datum/Uhrzeit und Autor aus Git-Metadaten.
- Zentraler offener Aufgabenstand fuer das Gesamtprojekt in der Dev-Roadmap.
- Keine Tester-/User-Empfehlungen als direkte Featurequelle in der Dev-Roadmap aufnehmen.

## Agenten-/KI-Regelbook-Automatik

Die zentrale Uebersicht aller Regeldateien und Agentensteuerungsdateien wird automatisch gepflegt:

- docs/AGENTEN_KI_REGELBOOK_DE.md

Pflichtkommando:
- npm run docs:governance:sync

Empfehlung (alle Automatiken):
- npm run docs:sync-all

Pflichtinhalt der Pflege:
- Neue Regel-/Governance-Dateien werden mit Pfad und Kurzbeschreibung im Regelbook erfasst.
- Bestehende Eintraege bleiben aktuell und konsistent mit den realen Repo-Dateien.

## Meldungen-Automatik

Die zentrale Meldungsdatei fuer Nutzer-Rueckmeldungen wird automatisch gepflegt:

- docs/MELDUNGEN.md

Pflichtkommando:
- npm run docs:governance:sync

Empfehlung (alle Automatiken):
- npm run docs:sync-all

Pflichtinhalt der Pflege:
- Alle erkannten Nutzer-Rueckmeldungen (Status/Fehler/Erfolg) werden mit Fundstelle und Dateipfad dokumentiert.
- Bei Aenderung von Meldungstexten bleibt docs/MELDUNGEN.md ohne manuelle Nacharbeit aktuell.
