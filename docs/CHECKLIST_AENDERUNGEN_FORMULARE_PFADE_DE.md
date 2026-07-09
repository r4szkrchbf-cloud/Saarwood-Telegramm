# Checkliste: Aenderungen an Formularen und Pfaden

Stand: 2026-07-09
Zweck: Einfache Schrittfolge, damit bei Aenderungen nichts vergessen wird.

## A) Wenn du Formularfelder aenderst

1. Datei anpassen: packages/frontend/src/pages/TesterFormPage.tsx
2. Falls noetig CSS anpassen: packages/frontend/src/pages/TesterFormPage.css
3. Pruefen, ob Tickettext weiterhin vollstaendig ist.
4. Build ausfuehren: npm run build
5. Formular kurz live testen (Pflichtfelder, Erfolgsmeldung, Ticket-ID).

## B) Wenn du Support-Links oder Dokumentziele aenderst

1. Frontend-Linklogik pruefen: packages/frontend/src/components/Settings/SettingsPanel.tsx
2. Backend-Defaults/ENV-Logik pruefen: packages/backend/src/support/SupportService.ts
3. Bei API-Aenderungen Route pruefen: packages/backend/src/routes/api.ts
4. Falls PDFs ersetzt werden: Dateien in packages/frontend/public/support/ aktualisieren.
5. Danach Build und Live-Check auf den 3 Support-Buttons.

## C) Wenn neue Landingpages/Formulare/Support-Dateien dazukommen

1. Neue Datei erstellen.
2. Index automatisch aktualisieren: npm run docs:pathindex:sync
3. Checkliste gegenpruefen.
4. Danach Commit, Push und Deploy.

## D) Pflicht-Schritte vor Go-Live

1. npm run build
2. Optional: npm run test
3. Ticket-E2E-Test: Browserformular absenden
4. API-Rueckgabe pruefen: stored=true, confirmationEmailSent=true, supportNotificationEmailSent=true
5. Dokumentation aktualisieren (falls neue Pfade/Verhalten dazu kamen)
