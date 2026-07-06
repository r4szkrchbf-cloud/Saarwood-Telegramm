<!-- markdownlint-disable MD029 MD032 -->

# MCP-Strategie fuer WordPress + Hostinger (Team: 2 Personen)

Stand: 2026-07-06

## 1. Ziel

Sichere und reproduzierbare MCP-Nutzung in VS Code, ohne Secrets ins Repository zu schreiben.

## 2. Warum `.vscode/mcp.json` lokal ist (und oft ignoriert wird)

- In vielen Projekten ist `.vscode/` in `.gitignore`, um persoenliche Editor-Einstellungen nicht zu verteilen.
- MCP-Konfigurationen enthalten oft serverbezogene Details und koennen indirekt sensible Informationen preisgeben.
- Bei euch ist diese Trennung sinnvoll: lokale Laufkonfiguration pro Person, dokumentierte Vorlagen im Repo.

## 3. Beste Team-Strategie (Empfehlung)

1. MCP-Laufkonfiguration lokal halten:
- VS Code User Settings oder lokale `.vscode/mcp.json`.

2. Repo-seitig nur Templates und Runbooks versionieren:
- JSON-Snippets in Doku-Dateien.
- Keine API-Tokens in Dateien unter Versionskontrolle.

3. Secrets immer ausserhalb des Repos:
- Bearer Tokens nur lokal in VS Code/OS Keychain/Secret Manager.

## 4. Startkonfigurationen

### 4.1 WordPress MCP (remote HTTP)

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

### 4.2 Hostinger MCP (stdio via npx, fokussiert)

```json
{
  "servers": {
    "hostinger-hosting": {
      "command": "npx",
      "args": ["--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp"]
    },
    "hostinger-dns": {
      "command": "npx",
      "args": ["--package=hostinger-api-mcp@latest", "hostinger-dns-mcp"]
    },
    "hostinger-vps": {
      "command": "npx",
      "args": ["--package=hostinger-api-mcp@latest", "hostinger-vps-mcp"]
    }
  }
}
```

Hinweis: Nur noetige Hostinger-Server aktivieren, damit Antworten fokussiert bleiben.

## 5. WordPress API Basis + Bearer Token

- WordPress API Basis und Bearer-Token muessen WordPress-seitig definiert werden (getrennt von Hostinger).
- Basis fuer Hostinger API ist bekannt: `https://hpanel.hostinger.com/api`.
- Fuer WordPress API-Betrieb mit Bearer Token gilt dieselbe Regel: Token nur lokal setzen, nie committen.
- Header-Muster:
- `Authorization: Bearer <TOKEN>`

## 6. Vercel - brauchen wir das?

Kurzantwort: fuer euren aktuellen Zielpfad eher nein.

- Ihr betreibt App + Backend/WebSocket auf Hostinger.
- Vercel bringt Mehrwert primär fuer statische Frontends und Preview-Deployments.
- Bei eurem Setup (Node/WS + Betriebskontrolle auf Hostinger) ist ein zusaetzlicher Plattformlayer unnötige Komplexitaet.

Empfehlung:
- Kein Vercel im initialen Go-Live.
- Optional spaeter fuer Marketing-/Landing-Previews pruefen, nicht fuer den Teleprompter-Live-Betrieb.

## 7. ClickUp als zentrale Steuerung

Empfehlung: Ja, ClickUp als Control Plane nutzen, aber nicht als Runtime-Abhaengigkeit.

### 7.1 Best Practice

1. ClickUp steuert Aufgaben, Releases, Checklisten und Freigaben.
2. Technische Aktionen laufen ueber definierte Integrationspfade (API/Webhooks).
3. Wenn ClickUp kurz ausfaellt, muss die App weiterlaufen.

### 7.2 Konkrete Nutzung im Projekt

- Release-Status, Go/No-Go und Owner-Aufgaben in ClickUp spiegeln.
- Optional Webhook->Backend fuer Statusevents (z. B. Deploy gestartet/abgeschlossen).
- Keine harte Laufzeitkopplung der Teleprompter-App an ClickUp.

## 8. Sofortplan (naechste 60 Minuten)

1. Lokale MCP-Konfiguration fuer WordPress + Hostinger aktivieren.
2. Domain-Beschluss anwenden: `teleprompter.saarwood.ch`.
3. ClickUp-Liste fuer Go-Live aus den bestehenden Checklisten anlegen.
4. Day-0 Runlist auf diese Struktur final abstimmen.
