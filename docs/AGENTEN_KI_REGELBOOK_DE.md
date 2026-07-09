# Agenten- und KI-Regelbook (Automatisch)

Stand: 2026-07-09T20:10:50.345Z
Pflegemodus: Automatisch ueber npm run docs:governance:sync
Zweck: Zentrales Verzeichnis aller Regeldateien und Agentensteuerungsdateien mit Kurzbeschreibung und Pfad.

## 1) Verbindliche Pflege

- Diese Datei wird automatisch gepflegt und erweitert, sobald neue relevante Regel-/Governance-Dateien erkannt werden.
- Nach Aenderungen an Regeln, Automationen oder Agentensteuerung: npm run docs:sync-all ausfuehren.

## 2) Regel- und Steuerungsdateien

- AGENTS.md
  - Zentrale verpflichtende Regeln fuer KI- und Coding-Assistenten in diesem Repo.
- docs/AGENTEN_KI_REGELBOOK_DE.md
  - Dieses selbstpflegende Verzeichnis aller Regel- und Agentensteuerungsdateien.
- docs/CHECKLIST_AENDERUNGEN_FORMULARE_PFADE_DE.md
  - Operative Checkliste fuer sichere Aenderungen an Formularen, Pfaden und Support-Ressourcen.
- docs/MELDUNGEN.md
  - Auto-generierte zentrale Uebersicht aller Nutzer-Rueckmeldungen inkl. Fundstelle/Dateipfad.
- docs/PFADINDEX_AENDERBARE_INHALTE_DE.md
  - Auto-generierte Uebersicht aller aenderbaren Pfade und Formular-/Landingpage-Dateien.
- docs/PROJEKTSTATUS_AUTOMATISCH_DE.md
  - Auto-generierter IST-Status inklusive Datum/Uhrzeit, Autor und Aenderungshistorie.
- docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md
  - Auto-generierte zentrale Entwickler-Roadmap und Gesamt-TODO mit offenen Aufgaben.
- package.json
  - Definiert die Automations-Kommandos fuer Doku- und Governance-Synchronisierung.
- scripts/sync-governance-docs.mjs
  - Automatische Pflege von Projektstatus, zentraler Dev-Roadmap/TODO und Regelbook.
- scripts/sync-pathindex.mjs
  - Automatisch gepflegter Pfadindex fuer aenderbare Inhalte (Formulare, Dokumente, Landingpages).
