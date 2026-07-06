<!-- markdownlint-disable MD029 MD032 -->

# Masterreihenfolge: WordPress + Hostinger Integration (strikt getrennt)

Stand: 2026-07-06  
Team: manuelangel + GitHub Copilot (GPT-5.3-Codex)  
Ziel: Sofort umsetzbare Reihenfolge fuer Integrationen und Public-Beta-Betrieb.

## Wichtige Trennregel (verbindlich)

1. WordPress-Integration ist ein eigener Stream (Redaktion/Nachrichten).
2. Teleprompter-App ist ein eigener Stream (Hostinger Apps/Software).
3. Es gibt keine fachliche Vermischung der Features.
4. Verbindung nur ueber definierte Schnittstellen (Links/API/Webhooks), niemals ueber gemeinsame Logikannahmen.

## Aktueller Input (bereits geliefert)

1. WordPress-Domain: `saarwood.de`.
2. Hostinger-App-Domain: `saarwood.ch`.
3. WordPress MCP-Server: `https://public-api.wordpress.com/wpcom/v2/mcp/v1`.
4. Hostinger API Basis: `https://hpanel.hostinger.com/api`.
5. Hostinger Auth: Bearer Token (`Authorization: Bearer <TOKEN>`).
6. Hostinger MCP-Modell in VS Code: `npx --package=hostinger-api-mcp@latest ...`.
7. Teleprompter-Zieldomain: `teleprompter.saarwood.ch` (final).
8. WordPress API-Basis/Authentifizierung gewuenscht: REST + Bearer Token.

## Phase 0 - Zielbild festziehen (15-30 min)

1. WordPress bleibt Content-/Redaktionsplattform.
2. Hostinger bleibt App-/Softwareplattform.
3. Integrationen laufen ueber klare APIs/Links/Webhooks, nicht ueber direkte DB-Kopplung.
4. Public Teleprompter bleibt auf Hostinger mit eigener Domain/Subpath.

Ergebnis: Gemeinsames Architektur-Commitment mit expliziter Trennung beider Streams.

## Stream A - WordPress Integration (ohne Teleprompter-Featurekopplung)

### A1 - VS Code MCP fuer WordPress aktivieren

Workspace-Datei anlegen/oeffnen:

- `.vscode/mcp.json`

Inhalt (Startkonfiguration):

```json
{
  "servers": {
    "wpcom-mcp": {
      "type": "http",
      "url": "https://public-api.wordpress.com/wpcom/v2/mcp/v1"
    }
  }
}
```

### A2 - In VS Code aktivieren

1. Command Palette: `MCP: List Servers`
2. `wpcom-mcp` starten
3. Trust-Dialog bestaetigen (nur wenn Quelle vertrauenswuerdig)
4. In Chat pruefen, ob MCP-Tools angezeigt werden

### A3 - Sicherheitsregel

- Keine Secrets hart in `mcp.json`.
- Falls Auth benoetigt wird: Input-Variablen oder getrennte Env-Nutzung.

Ergebnis Stream A: WordPress-MCP in VS Code laeuft, ohne Teleprompter-Logik zu vermischen.

## Stream B - Hostinger Apps/Teleprompter Betrieb

### B1 - Integrationsvertrag WordPress <-> Hostinger festlegen

1. URL-Modell:
- WordPress: `www.<domain>`
- Apps: `apps.<domain>` oder `www.<domain>/apps/...`

2. Datenaustausch festlegen:
- Nur Links/REST/Webhooks
- Keine direkte Datenbankkopplung

3. Verantwortlichkeit:
- WordPress-Inhalte: manuelangel
- App-API/Endpoints: GitHub Copilot + manuelangel

### B2 - Minimaler Integrationsumfang (Start)

1. Von WordPress zur App:
- Feste CTA-Links zur Teleprompter-App
- Link zum Tester-Formular

2. Von App zu WordPress:
- Handbuch-/Guide-Links im Support-Bereich
- Optional Ruecklink auf News/Statusseite

Ergebnis B2: Einfache, stabile Grundintegration ohne Risiko.

### B3 - Hostinger Day-0 Betrieb finalisieren

1. Runbook verwenden:
- `docs/HOSTINGER_DAY0_RUNLIST_DE.md`

2. Owner-Checklisten verwenden:
- `docs/HOSTINGER_GOLIVE_CHECKLIST_OWNER_EXAMPLE_2P_DE.md`
- `docs/HOSTINGER_GOLIVE_ONEPAGER_2P_DE.md`

3. Muss-Checks vor Go-Live:
- `/api/health` gruen
- `/api/support/info` gruen
- Output-only View ok
- Ticketflow mit Ticket-ID ok
- Lizenzstatus testbar

Ergebnis Stream B: Hostinger-Deployment ist reproduzierbar und abnahmefaehig.

Ergebnis: Ein gemeinsames Architektur-Commitment fuer alle naechsten Schritte.

## Phase 1 - Gemeinsamer Integrationstest (WordPress + App)

### Testblock A - Linkfluss

1. Von WordPress Startseite in Teleprompter-App wechseln
2. Support/Guide-Links aus App oeffnen
3. Ruecknavigation validieren

### Testblock B - Betrieb

1. Teleprompter Start/Stop/Output-only pruefen
2. Ticket absenden und ID pruefen
3. Lizenzstatus-Endpunkt pruefen

### Testblock C - Fehlerfall

1. Simulierter Service-Neustart
2. Smoke-Test erneut ausfuehren
3. Rollback-Kriterien anwenden (nur wenn noetig)

Ergebnis: End-to-End Nutzbarkeit fuer Public-Beta nachgewiesen.

## Phase 2 - Public Beta Soft-Launch

1. Launch-Fenster klein halten (z. B. 2-4 Stunden).
2. Monitoring aktiv halten.
3. Incidents und Feedback direkt in Doku erfassen.
4. Nach Launch: 24h Review und Priorisierung.

Ergebnis: Kontrollierter Start mit klarer Lernschleife.

## Master-Reihenfolge als Kurzliste (ab heute direkt umsetzen)

1. Stream A aktivieren: MCP-Server in `.vscode/mcp.json` eintragen und starten.
2. Stream B entscheiden: URL-/Integrationsvertrag WordPress <-> Hostinger final festziehen.
3. Stream B umsetzen: Hostinger Day-0 Runlist durchlaufen.
4. Stream B steuern: 2P Owner-Checkliste live ausfuellen.
5. Beide Streams validieren: End-to-End Integrationstest fahren.
6. Soft-Launch durchfuehren.

## Was du mir als naechstes geben solltest

1. Finale Domainstruktur (WordPress + App).
2. Gewuenschtes URL-Modell (Subdomain oder Subpath).
3. Ob der WordPress-MCP-Server nach Start Auth-Parameter benoetigt.

## Hostinger-MCP: Was ich von dir brauche (wenn verfuegbar)

Sobald du die Hostinger-Infos hast, gib mir bitte genau diese Punkte:

1. MCP-Endpoint-URL (falls Hostinger MCP anbietet).
2. Server-Typ fuer VS Code (`http` oder `command`/`stdio`).
3. Auth-Art (API-Key, OAuth, Session) und wo sie in VS Code gesetzt wird.
4. Erlaubte Tools/Scopes (read-only oder write/deploy).
5. Sicherheitsvorgaben (IP-Allowlist, Token-Rotation, Ablaufzeit).

Status 2026-07-06:
- URL/Typ/Auth sind vorhanden.
- Domain-Zielentscheidung ist getroffen: `teleprompter.saarwood.ch`.
- Als naechstes: Auth-/Scope-Feinschnitt fuer WordPress API und Hostinger MCP festziehen.

Dann baue ich dir sofort die getrennte Hostinger-MCP-Konfiguration und den sicheren Betriebsablauf ohne Vermischung mit WordPress oder Teleprompter-Featurelogik.

Sobald diese drei Punkte da sind, mache ich dir die Final-Go-Version ohne Platzhalter.
