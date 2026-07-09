# Pfadindex: Aenderbare Inhalte

Stand: 2026-07-09
Zweck: Zentrale Uebersicht, wo Formulare, Dokumente, Support-Links und Landingpages geaendert werden koennen.

Hinweis: Diese Datei ist automatisch generiert via npm run docs:pathindex:sync.

## 1) Haupt-Landingpage saarwood.ch

- Live URL: https://teleprompter.saarwood.ch/
- Quellseite: packages/frontend/index.html

## 2) Landingpages / Einstiegspunkte

- packages/frontend/index.html
- packages/frontend/tester-form.html

## 3) Interaktive Formulare (Code + Styling)

- packages/frontend/src/pages/TesterFormPage.css
- packages/frontend/src/pages/TesterFormPage.tsx

## 4) Support-Buttons, URL-Logik und Ticket-API

- packages/frontend/src/components/Settings/SettingsPanel.tsx
- packages/backend/src/support/SupportService.ts
- packages/backend/src/routes/api.ts
- packages/frontend/src/tester-form.tsx
- packages/frontend/vite.config.ts

## 5) Oeffentliche Support-Dokumente (PDF-Dateien)

- packages/frontend/public/support/beta-tester-guide-de.pdf
- packages/frontend/public/support/saarwood-nutzerhandbuch-beta-v1-de.pdf
- packages/frontend/public/support/testerformular-beta-v1-de.pdf

## 6) Bearbeitbare Quell-Dokumente (Markdown)

- docs/BETA_TESTER_GUIDE.md
- docs/CHECKLIST_AENDERUNGEN_FORMULARE_PFADE_DE.md
- docs/NATIVE_APP_GUIDE.md
- docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md
- docs/TESTERFORMULAR_BETA_V1_DE.md

## 7) Produktionskonfiguration (Server, nicht im Repo)

- /srv/saarwood_telepromter/.env.production

Relevante Variablen:
- SUPPORT_HANDBOOK_URL
- SUPPORT_TESTER_GUIDE_URL
- SUPPORT_TESTER_FORM_URL
- SUPPORT_TICKET_FILE
- SUPPORT_TICKET_SEQUENCE_FILE
- SUPPORT_CLIENT_LOG_FILE

## 8) Schnellantwort: Wo aendere ich was?

- Formularfelder, Pflichtregeln, Tickettext: packages/frontend/src/pages/TesterFormPage.tsx
- Formular-Layout und Druckansicht: packages/frontend/src/pages/TesterFormPage.css
- Support-Linkziele in Einstellungen: packages/frontend/src/components/Settings/SettingsPanel.tsx
- Standard-Linkziele serverseitig: packages/backend/src/support/SupportService.ts
- Statische Dokumente fuer /support/...: packages/frontend/public/support/
