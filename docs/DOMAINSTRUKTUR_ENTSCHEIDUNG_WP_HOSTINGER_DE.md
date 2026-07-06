<!-- markdownlint-disable MD032 -->

# Domainstruktur-Entscheidung: WordPress + Hostinger

Stand: 2026-07-06  
Kontext: Redaktion/Nachrichten ueber WordPress, Apps/Software ueber Hostinger.  
Wichtige Regel: WordPress-Integration und Teleprompter-App-Funktionalitaet bleiben fachlich getrennt.

## 1. Eingangsparameter (von manuelangel)

- WordPress-Domain: `saarwood.de`
- Hostinger-App-Domain: `saarwood.ch`
- Hostinger API Basis: `https://hpanel.hostinger.com/api`
- Hostinger Auth: Bearer-Token (`Authorization: Bearer <TOKEN>`)
- WordPress MCP: `https://public-api.wordpress.com/wpcom/v2/mcp/v1`

## 2. Entscheidung: Subdomain statt Subpath

### Empfehlung (verbindlich fuer Start)

Subdomain-Architektur nutzen, nicht Subpath.

### Warum Subdomain hier klar besser ist

1. Zwei unterschiedliche Plattformen/Hoster sind einfacher sauber zu trennen.
2. TLS, Caching, Routing und Deploys bleiben pro Plattform beherrschbar.
3. Kein komplexes Cross-Host-Reverse-Proxy-Setup fuer `/apps/...` erforderlich.
4. Sicherheitsgrenzen (Cookies, Sessions, Adminbereiche) sind klarer.

## 3. Konkrete Zielstruktur (Vorschlag)

### WordPress (Redaktion)

- `www.saarwood.de` -> WordPress Hauptseite (News/Redaktion)

### Apps/Software (Hostinger)

- `apps.saarwood.ch` -> App-Hub
- `teleprompter.saarwood.ch` -> SAARwooD-Teleprompter (final beschlossen)

Hinweis: Die Subpath-Variante `apps.saarwood.ch/teleprompter` wird fuer den Start nicht verwendet.

## 4. Integrationsregeln zwischen beiden Welten

1. Von WordPress zur App nur ueber Links/CTA.
2. Von App zu WordPress nur ueber Handbuch-/Guide-/Status-Links.
3. Datenaustausch nur ueber definierte APIs/Webhooks.
4. Keine gemeinsame DB und keine direkte Plugin-zu-App-Kopplung.

## 5. Sofort umsetzbare Naechste Schritte

1. DNS fuer `apps.saarwood.ch` und `teleprompter.saarwood.ch` vorbereiten.
2. Hostinger Reverse-Proxy/TLS fuer die Ziel-Subdomain(s) aktivieren.
3. In WordPress CTA-Links auf die App-Subdomain setzen.
4. In der App Support-/Guide-Ruecklinks auf `www.saarwood.de` setzen.
5. End-to-End Smoke-Test fahren (Health, WS, Ticketflow, Output-only).

## 6. Beschluss (fix)

Teleprompter laeuft direkt auf `teleprompter.saarwood.ch`.
