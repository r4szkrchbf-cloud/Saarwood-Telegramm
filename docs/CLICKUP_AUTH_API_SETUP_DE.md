# ClickUp Auth und API Setup (Token und OAuth)

Stand: 2026-07-06

## 1. Warum der 401 Fehler sofort behoben werden sollte

Wenn der Token nicht erneuert wird:

1. Copilot und verbundene API-Funktionen schlagen weiter fehl.
2. MCP-Server-Aufrufe mit Auth koennen fehlschlagen.
3. Automationen, die auf API-Zugriff bauen, stoppen oder laufen unzuverlaessig.
4. Fehlersuche wird unklar, weil echte Codefehler und Auth-Fehler sich mischen.

Empfehlung: Token immer zeitnah erneuern und den Zugriff direkt testen.

## 2. VS Code Re-Login fuer GitHub und Copilot (genau so)

### Schritt A: Abmelden

1. VS Code Command Palette oeffnen.
2. Nach Sign Out suchen.
3. Abmelden fuer GitHub und Copilot durchfuehren.

### Schritt B: Neu anmelden

1. Wieder Command Palette oeffnen.
2. Nach Sign In suchen.
3. Mit dem GitHub Account anmelden, der die Copilot-Lizenz hat.
4. Browser-Freigabe bestaetigen.

### Schritt C: VS Code neu starten

1. VS Code komplett schliessen.
2. VS Code neu oeffnen.

### Schritt D: Copilot Extension pruefen

1. Erweiterungen oeffnen.
2. Nach GitHub Copilot suchen.
3. Pruefen, dass die Erweiterung installiert und aktiviert ist.
4. Falls deaktiviert: aktivieren und VS Code neu laden.

### Schritt E: Richtigen Account verifizieren

Der richtige Account ist derjenige, auf dem:

1. GitHub Copilot aktiv ist.
2. Repo-Zugriff auf euer Projekt vorhanden ist.
3. Die benoetigten Berechtigungen fuer MCP/API-Aufrufe vorhanden sind.

### Schritt F: Testanfrage senden

Nach dem Re-Login eine einfache Anfrage im Chat senden, zum Beispiel:

1. Bitte zeige mir den aktuellen git Status.
2. Oder: Bitte lies die Datei docs/README.md.

Wenn das ohne 401 durchlaeuft, ist die Session wieder gueltig.

## 3. ClickUp Auth Setup - Variante 1 (Personal Token, schnellster Start)

Geeignet fuer 1-2 Personen Team und schnellen Go-Live.

1. In ClickUp einen Personal API Token erstellen.
2. Token nur lokal speichern (nie im Repo).
3. Token in Integrations-Tool oder Backend-Env eintragen.
4. API-Test machen (Workspace, Listen, Tasks abrufen).
5. Rechte auf notwendige Bereiche begrenzen.

Vorteile:

1. Schnell.
2. Wenig Setup-Aufwand.

Nachteile:

1. An Person gebunden.
2. Token-Rotation muss aktiv gepflegt werden.

## 4. ClickUp Auth Setup - Variante 2 (OAuth, skalierbar)

Geeignet fuer spaetere Team-Erweiterung und robusten Betrieb.

1. ClickUp App registrieren.
2. Redirect URL korrekt setzen.
3. OAuth Flow implementieren.
4. Access Token und Refresh Token sicher speichern.
5. Scope-Minimierung definieren.
6. Token-Refresh automatisieren.

Vorteile:

1. Skalierbar.
2. Besseres Rechtemodell.

Nachteile:

1. Hoeherer Initialaufwand.

## 5. Empfohlene Reihenfolge fuer euch (du + ich)

1. Sofort mit Personal Token starten.
2. Prozesse und Feldmapping stabil machen.
3. Danach bei Bedarf auf OAuth migrieren.

## 6. Minimale ClickUp API Tests (nach Auth)

1. Workspace abrufen.
2. Ziel-Liste abrufen.
3. Test-Task erstellen.
4. Statuswechsel testen.
5. Task-Kommentar testen.
6. Optional Webhook testen.

## 7. Sicherheitsregeln

1. Kein Token in Git oder Doku mit Klarwert.
2. Tokens nur lokal oder im Secret Manager.
3. Regelmaessige Rotation einplanen.
4. Zugriff auf noetige Scopes begrenzen.

## 8. Verbindung zu euren bestehenden Dateien

- docs/CLICKUP_GOLIVE_TEMPLATE_DE.md
- docs/CLICKUP_GOLIVE_TASKS_TEMPLATE.csv
- docs/HOSTINGER_GOLIVE_ONEPAGER_2P_DE.md
- docs/MASTERREIHENFOLGE_WP_HOSTINGER_INTEGRATION_DE.md
