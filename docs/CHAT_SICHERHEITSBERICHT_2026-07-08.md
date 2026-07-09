# Chat-Sicherheitsbericht Hardcoded Secrets

Datum: 2026-07-08
Repository: saarwood_telepromter_local_recovered_20260708
Anlass: Nutzeranfrage zur Pruefung auf hardcodierte Passwoerter/Secrets inkl. Einordnung der gemeldeten AuthService-Schwachstelle.

## 1. Kurzfazit

- In der aktuellen Codebasis wurden keine echten produktiven Klartext-Passwoerter gefunden.
- Es gibt jedoch sicherheitsrelevante Defaults/Fallbacks im Code, die bei Fehlkonfiguration ausnutzbar sind.
- Historisch waren im Commit 68b3a33 schwache Demo-Passwoerter hardcodiert; diese wurden im Commit 1c8207c ersetzt.

## 2. Scan-Umfang und Methode

- Volltext-Scan ueber Repository-Dateien (Code, Deploy, Skripte), ausgenommen `node_modules` und `.git`.
- Muster: Passwort/Secret/Token/API-Key-Literale, Env-Fallbacks, Platzhalterwerte.
- Zusaetzlich Git-Historienpruefung auf bekannte schwache Literale (`owner123!`, `operator123!`, `dev-admin-auth-secret`).

## 3. Fundstellenliste mit Risiko-Einstufung

### F-01: Fallback-Admin-Benutzer im Code mit bekanntem Passwortliteral

- Fundstelle: `packages/backend/src/auth/AuthService.ts` (FALLBACK_USERS, `password: 'CHANGE_ME_IN_ENV'`)
- Was ist das: Harte Fallback-Accounts im Quellcode fuer den Fall, dass `ADMIN_AUTH_USERS_JSON` fehlt/ungueltig ist.
- Risiko: Hoch
- Begruendung: Auch wenn es kein echtes Secret ist, ist das Passwortliteral bekannt. Bei produktiver Fehlkonfiguration koennte ein Angreifer sich mit bekannten Credentials anmelden.
- Empfehlung:
	- Fallback-Logins in Produktion komplett deaktivieren.
	- Startup-Fail erzwingen, wenn `ADMIN_AUTH_USERS_JSON` in Produktion fehlt.
	- Optional Hash-basierte Passwoerter statt Klartextvergleich.

### F-02: Hardcoded JWT-Secret-Default im Code

- Fundstelle: `packages/backend/src/auth/AuthService.ts` (`process.env.ADMIN_AUTH_JWT_SECRET ?? 'dev-admin-auth-secret'`)
- Was ist das: Fester Default fuer die JWT-Signatur.
- Risiko: Hoch
- Begruendung: Wenn in Produktion die Env-Variable fehlt, ist das Signatur-Secret vorhersagbar. Dadurch waeren Token-Faelschung oder Session-Übernahme denkbar.
- Empfehlung:
	- In Produktion ohne gesetztes `ADMIN_AUTH_JWT_SECRET` sofort Prozessabbruch.
	- Secret-Rotation und Mindestlaenge (z. B. >= 32 random bytes) erzwingen.

### F-03: Platzhalter-Secrets in Deploy-Template

- Fundstelle: `deploy/hostinger/.env.production.template` (`ADMIN_API_KEY=change-me-very-long-random`, `SUPPORT_SMTP_PASS=change-me`)
- Was ist das: Templatewerte fuer Produktion.
- Risiko: Mittel
- Begruendung: Templatewerte sind an sich korrekt als Platzhalter. Risiko entsteht, wenn sie unveraendert in produktive `.env.production` uebernommen werden.
- Empfehlung:
	- Preflight-Check im Deploy: blockieren, wenn `change-me` erkannt wird.
	- CI/Release-Gate auf Platzhalterwerte erweitern.

### F-04: Dokumentierter Default fuer Admin-Secret

- Fundstelle: `README.md` (Tabelle mit `ADMIN_AUTH_JWT_SECRET` Default `dev-admin-auth-secret`)
- Was ist das: Dokumentierter Entwicklungsdefault.
- Risiko: Mittel
- Begruendung: Erhoeht das Risiko, dass Teams den Default in produktionsnahen Umgebungen uebernehmen.
- Empfehlung:
	- Doku klar trennen: Dev-Only Defaults vs. Production-Must-Set.
	- Fuer Produktion den Default auf „kein Default, Pflichtwert“ aendern.

### F-05: Private-Key-Feld im Template (Platzhalter)

- Fundstelle: `deploy/hostinger/.env.production.template` (`LICENSE_PRIVATE_KEY_PEM=-----BEGIN PRIVATE KEY-----\n...`)
- Was ist das: Platzhalter fuer Lizenzsignatur-Schluessel.
- Risiko: Niedrig (bei korrekt verwendeter Vorlage)
- Begruendung: Kein echter Schluessel im Repo. Risiko besteht nur bei versehentlichem Einchecken realer PEM-Werte.
- Empfehlung:
	- Secret-Scanning (pre-commit/CI) auf PEM-Pattern aktivieren.

## 4. Einordnung der gemeldeten Schwachstelle des Nutzers

Gemeldet wurde: hardcodierte Admin-Passwoerter in `AuthService.ts` (`owner123!`, `operator123!`, `editor123!`, `viewer123!`).

Verifikation:
- Bestaetigt in Historie: Commit `68b3a33` enthielt diese Werte.
- Entfernt in Historie: Commit `1c8207c` ersetzte sie durch `CHANGE_ME_IN_ENV`.
- Aktueller Stand im Working Tree: diese konkreten Klartext-Passwoerter sind nicht mehr vorhanden.

Wichtige Einordnung:
- Das ist eine reale historische Sicherheitsabweichung.
- Falls das Repo oeffentlich war/ist, sollte man von moeglicher Exposition ausgehen.
- Rotations-/Hardening-Massnahmen sind weiterhin erforderlich (siehe Abschnitt 5).

## 5. Priorisierte Massnahmen

1. P0: Produktion ohne `ADMIN_AUTH_JWT_SECRET` abbrechen (kein Default).
2. P0: Produktion ohne gueltiges `ADMIN_AUTH_USERS_JSON` abbrechen (keine FALLBACK_USERS in Prod).
3. P0: Deploy-Check, der `change-me`/`CHANGE_ME_IN_ENV`/`dev-admin-auth-secret` blockiert.
4. P1: Passwoerter nicht im Klartext vergleichen, sondern gehasht speichern/pruefen.
5. P1: Secret-Scanner in CI aktivieren (gitleaks/trufflehog) inkl. PEM-Erkennung.
6. P1: Falls nicht schon erfolgt: Rotation von Admin-Zugaengen, JWT-Secret, SMTP-Auth.

## 6. Chat-Zusammenfassung

- Der Nutzer fragte nach dem Ablageort fuer Support/Admin-Zugangsdaten.
- Ergebnis: Im Repo liegen primär Vorlagen und Doku, produktive Werte gehoeren in serverseitige `.env.production`.
- Danach forderte der Nutzer eine Vollpruefung auf hardcodierte Elemente.
- Es wurde ein Repo-weiter Scan mit Fundstellen, Historienpruefung und Risiko-Einordnung durchgefuehrt.
- Danach wurden die Security-Haertungen schrittweise umgesetzt, dokumentiert und technisch verifiziert.
- Anschliessend erfolgte ein Soll-Ist-Audit gegen Bericht, Chat und aktuellen Code sowie die Ableitung einer Tagescheckliste.

## 7. Status

- Bericht erstellt am 2026-07-08.
- Es wurden Code- und Skript-Aenderungen zur Security-Haertung umgesetzt und technisch verifiziert (Build/Test/Skriptaufrufe).

## 8. Umgesetzte Sofortmassnahmen (nach Freigabe)

Nach Nutzerfreigabe wurden mehrere Hardening-Massnahmen direkt umgesetzt und verifiziert:

1. Produktions-Startup guard fuer JWT-Secret:
- Datei: `packages/backend/src/auth/AuthService.ts`
- Wirkung: In `NODE_ENV=production` wird ohne `ADMIN_AUTH_JWT_SECRET` ein Fehler geworfen.
- Zusatz: Verbotene Placeholder (`dev-admin-auth-secret`, `change-me`, `CHANGE_ME_IN_ENV`) werden in Produktion aktiv blockiert.

2. Produktions-Startup guard fuer Admin-Users:
- Datei: `packages/backend/src/auth/AuthService.ts`
- Wirkung: In `NODE_ENV=production` wird die Nutzung von `FALLBACK_USERS` verhindert; `ADMIN_AUTH_USERS_JSON` muss gueltig gesetzt sein.

3. Predeploy-Blocker fuer Secret-Placeholder:
- Datei: `scripts/release-predeploy-check.mjs`
- Wirkung: Prueft produktive Env-Dateikandidaten (`.env.production`, `deploy/hostinger/.env.production`) auf verbotene Platzhalterwerte und setzt den Gesamtstatus auf FAIL, wenn Treffer vorliegen.

4. Passwort-Hashing fuer Admin-Login (bcrypt):
- Datei: `packages/backend/src/auth/AuthService.ts`
- Wirkung: Passwortpruefung nutzt jetzt bcrypt-Hash-Verifikation (`$2a$`, `$2b$`, `$2y$`).
- Sicherheitsregel: In Produktion sind Klartextpasswoerter fuer Admin-Login nicht mehr gueltig.

5. Optionaler Produktions-Start-Blocker fuer Klartext-Admin-Passwoerter:
- Datei: `packages/backend/src/auth/AuthService.ts`
- Wirkung: In Produktion wird (standardmaessig) beim Start geprueft, ob `ADMIN_AUTH_USERS_JSON` nur bcrypt-Hashes enthaelt.
- Steuerung: `ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS` (Default in Produktion: aktiv; deaktivierbar fuer kurze Migrationsfenster).

6. Generator-Skript fuer sichere Migration:
- Datei: `packages/backend/scripts/generateAdminAuthUsersJson.mjs`
- NPM-Script: `npm run auth:hash-users --workspace=packages/backend -- --in <plain.json> --out <hashed.json> --cost 12`
- Wirkung: Erstellt aus Klartext-Admin-JSON ein bcrypt-basiertes Ziel-JSON fuer `ADMIN_AUTH_USERS_JSON`.

7. README-Dokumentation erweitert:
- Datei: `README.md`
- Inhalt: Neue Variable `ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS`, Migration-How-To, Input-/Output-Beispiel fuer `ADMIN_AUTH_USERS_JSON` mit Hashes.

8. Migrationshelfer fuer sichere Einzeilen-Env:
- Datei: `packages/backend/scripts/renderAdminAuthUsersEnv.mjs`
- NPM-Script: `npm run auth:render-users-env --workspace=packages/backend -- --in <hashed.json> --export --out <env-file>`
- Wirkung: Erstellt aus gehashtem Admin-JSON eine shell-sichere Einzeilenvariable `ADMIN_AUTH_USERS_JSON='[...]'` fuer direkte Nutzung in `.env`/Shell.

## 9. Soll-Ist-Audit (gegen Code und Chat, 2026-07-08)

### Verifiziert erledigt

1. Produktions-Guard fuer fehlendes JWT-Secret ist aktiv.
2. Produktions-Guard gegen Fallback-User ist aktiv.
3. Optionaler Produktions-Startblocker fuer nicht-gehashte Passwoerter ist aktiv (default aktiv in Produktion).
4. Passwortpruefung nutzt bcrypt-Hash-Verifikation.
5. Predeploy-Check blockiert verbotene Placeholder in produktiven Env-Dateien.
6. Generator-Skript fuer Hash-Migration ist vorhanden und ausfuehrbar.
7. Env-Render-Helfer fuer sichere Einzeilenvariable ist vorhanden und ausfuehrbar.
8. Backend-Build und Backend-Tests sind erfolgreich.

### Offen / heute noch zu erledigen

Keine offenen Security-P0-Punkte mehr aus diesem Arbeitsblock.

### Heute erledigt nach Audit

1. Dokumentationsrisiko bei `ADMIN_AUTH_JWT_SECRET` reduziert.
- Nachweis: `README.md` fuehrt fuer `ADMIN_AUTH_JWT_SECRET` keinen produktionsfaehigen Default mehr, sondern markiert den Wert als explizite Produktionspflicht.
- Ergebnis: Das zuvor offene Kriterium aus dem Soll-Ist-Audit ist erledigt.

2. Secret-Scanning als CI-Pflicht-Gate umgesetzt.
- Nachweis: `.github/workflows/ci.yml` enthaelt jetzt einen vorgeschalteten `secret-scan`-Job mit `gitleaks`; `.gitleaks.toml` definiert die minimale Allowlist fuer dokumentierte Platzhalter.
- Verifikation: Lokaler Repo-Scan mit `.gitleaks.toml` liefert `no leaks found`; separater Testfund wird im Non-Git-Modus mit Exit-Code `1` blockiert.
- Ergebnis: Das zuvor offene Kriterium aus dem Soll-Ist-Audit ist erledigt.

3. Operative Produktions-Secret-Rotation vollstaendig abgeschlossen.
- Nachweis: `docs/ROTATIONSPROTOKOLL_2026-07-08.md`
- Erfolgreich rotiert und verifiziert: `ADMIN_AUTH_JWT_SECRET`, `ADMIN_API_KEY`, `SUPPORT_SMTP_PASS`.
- Erfolgreich angepasst: `SUPPORT_SMTP_USER` auf `support@saarwood.saarwood.ch`.
- Erfolgreich verifiziert: Service `active`, Healthcheck gruen, Admin-Endpunkt mit neuem Key gruen, Live-Testticket `SWD-2026-000016` mit `confirmationEmailSent=true` und `supportNotificationEmailSent=true`.

4. Vollsync ueber alle Ebenen bestaetigt.
- Lokal iMac: Build/Test und Secret-Datei geprueft.
- GitHub: `main` lokal und remote auf gleichem Commit.
- Hostinger VPS: Service/Health gruen, produktive Env aktiv.
- Hostinger hPanel: Support-Mailbox aktiv, Passwortwechsel erfolgreich.
- Nachweisdatei lokal: `secrets/ACTIVE_ACCESS_AND_SECRETS_2026-07-08.txt`.

## 10. Nicht sicherheitsrelevante Aufgaben aus dem aktuellen Chat (heute, offen/teilweise offen)

1. Support-Ressourcen finalen E2E-Kurztest in `TEST_MVP` abschliessen
Status: erledigt.
Abgleich: Kurztest ist in `docs/TEST_MVP.md` als Runde 22 dokumentiert; produktive Mailflags sind bei `SWD-2026-000016` und `SWD-2026-000017` jeweils auf `true`.
Beleg: `docs/TEST_MVP.md`, `docs/NEXT_ACTION_PLAN_2026-07-08.md`, `docs/ROTATIONSPROTOKOLL_2026-07-08.md`.

2. Frontend-Performance-Warnung >500 kB in konkrete Massnahme ueberfuehren
Status: erledigt.
Abgleich: Konkrete technische Massnahme umgesetzt (Vite-`manualChunks` erweitert), Frontend-Build/Test erneut ausgefuehrt und ohne >500-kB-Warnung verifiziert.
Beleg: `packages/frontend/vite.config.ts`, `docs/TEST_MVP.md`, `docs/BACKLOG.md`, `docs/NEXT_ACTION_PLAN_2026-07-08.md`.

3. Go-Live-Haertung (Runbook + Abnahmecheckliste) auf heutigen Stand bringen
Status: erledigt.
Abgleich: Runbook und Owner-Abnahmecheckliste wurden auf Security-/SMTP-Produktionsstand synchronisiert; Day-0-Kriterien sind jetzt explizit als `Erledigt`/`Teilweise`/`Offen` markiert.
Beleg: `docs/HOSTINGER_DAY0_RUNLIST_DE.md`, `docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_DE.md`, `docs/SUPPORT_LICENSE_RUNBOOK_DE.md`, `docs/NEXT_ACTION_PLAN_2026-07-08.md`.

4. Strategischen GAP-Arbeitsblock anstossen und datiert dokumentieren
Status: deutlich fortgeschritten (teilweise erledigt).
Abgleich: Datierter GAP-Statusbericht wurde weitergefuehrt und vier v1-Entscheidungsdokumente wurden erstellt (Interviewkatalog, Preis/Tier, Lizenz-Policy, DSGVO/B2B-Kurzkonzept).
Beleg: `docs/STATUSBERICHT_GAP_ARBEITSBLOCK_DE_2026-07-09.md`, `docs/GAP_INTERVIEWFRAGENKATALOG_V1_DE_2026-07-09.md`, `docs/GAP_PREIS_TIER_GRENZEN_V1_DE_2026-07-09.md`, `docs/GAP_LIZENZ_BETA_POLICY_V1_DE_2026-07-09.md`, `docs/GAP_DSGVO_B2B_KURZKONZEPT_V1_DE_2026-07-09.md`, `docs/NEXT_ACTION_PLAN_2026-07-08.md`.
Naechste Umsetzungsstufe:
- Intervieweinladungen auf `fix` bringen und protokollieren.
- Preis-/Tiergrenzen als freigabefaehige Version v1 abschliessen.
- Lizenz-Beta-Policy und DSGVO/B2B-Kurzkonzept in Entscheidungsvorlagen ueberfuehren.

Hinweis zum Soll-Ist-Abgleich:
- Nicht-Security-Punkte, die im Chat als umgesetzt gemeldet wurden (z. B. Build/Test gruen, neue Migrationsskripte, Doku-Erweiterungen), sind geprueft und deshalb hier bewusst nicht erneut gelistet.
