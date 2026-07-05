# Lizenz- und Release-Plan (Beta V1 -> Public MVP)

_Stand: 2026-07-05_

## 1. Zielbild

Wir brauchen zwei Dinge gleichzeitig:

1. Oeffentliche Nutzung ueber Internet (Web + PWA + Electron).
2. Kontrollierbare Beta-Freigabe mit spaeter deaktivierbaren Schluesseln.

Dafuer wird eine Lizenzarchitektur mit signierten Tokens, Revocation-Liste und Offline-Gnadenfrist eingefuehrt.

## 2. Lizenzmodell (technisch)

### 2.1 Kernprinzip

- Keine geheimen Schluessel im Frontend speichern.
- Im Client liegt nur der oeffentliche Pruefschluessel (Public Key).
- Jede Lizenz ist ein signiertes Token (Ed25519), das lokal verifiziert werden kann.

### 2.2 Lizenzdaten im Token

Empfohlene Felder:

- `lic_id` (eindeutige Lizenz-ID)
- `customer`
- `tier` (`basic` | `professional` | `expert`)
- `issued_at`
- `expires_at`
- `grace_offline_until`
- `channels` (`web`, `electron`, `pwa`)
- `features` (optionale Feature-Flags)
- `beta_generation` (z. B. `beta-v1`)

### 2.3 Deaktivierung (Kill-Switch)

Deaktivierung erfolgt serverseitig ueber zwei Hebel:

1. Einzel-Deaktivierung: `lic_id` wird in Revocation-Liste gesetzt.
2. Wellen-Deaktivierung: `beta_generation` wird global gesperrt.

Client-Verhalten:

- Online: bei jedem Start Revocation-Status abfragen.
- Offline: letzter gueltiger Status wird gecacht.
- Wenn `now > grace_offline_until`: App schaltet in `read-only` oder `blocked`.

## 3. Support-/Admin-Prozess

### 3.1 Ausgabe

- Support erstellt Lizenz im Admin-Tool (intern, nicht im Client).
- Kunde erhaelt Lizenz-Token als Datei oder Copy/Paste-String.

### 3.2 Aktivierung

- Web/PWA: Aktivierungsdialog in Settings -> Token speichern (localStorage/IndexedDB).
- Electron: Token lokal in AppData speichern.

### 3.3 Sperrung

- Bei Missbrauch/Ende Beta: `lic_id` oder `beta_generation` sperren.
- Naechster Online-Kontakt zieht Sperre auf Client.
- Offline greift spaetestens nach Ablauf der Gnadenfrist.

### 3.4 Supportfaelle

- Geratewechsel: alte Lizenz sperren, neue Lizenz ausstellen.
- Notfall-Freischaltung: kurzlebige 72h-Emergency-Lizenz.
- Audit: jede Ausgabe/Sperrung mit Timestamp und Operator protokollieren.

## 4. Public + Offline Release-Strategie (aus bestehenden Dokus abgeleitet)

Bereits dokumentierte Zielrichtung im Repo:

- Public MVP ueber eigenen VPS (Hostinger) mit Node/Express/WebSocket.
- PWA fuer installierbare Browser-App.
- Electron fuer komplett lokalen Offline-Betrieb.

Empfohlene Verteilung:

1. Internet-Betrieb:
- Reverse Proxy (Nginx/Caddy) + TLS + Domain.
- Backend + WebSocket unter gleicher Domain.
- Healthchecks und Restart-Policy (systemd/pm2).

2. Offline-Betrieb:
- Electron als primaerer Offline-Kanal.
- PWA nur fuer begrenzte Offline-Szenarien (Cache), aber ohne lokal laufendes Backend eingeschraenkt.

## 5. Konkreter Umsetzungsplan (phasenweise)

### Phase A - Lizenz-Basis (P0)

- Backend: `LicenseService` einbauen (Token-Verify + Revocation-Abfrage).
- API: `/api/license/status`, `/api/license/activate`.
- Frontend: Lizenzstatus-Banner + Aktivierungsdialog.
- Electron: lokale Lizenzablage + Check beim App-Start.

### Phase B - Admin/Support (P0)

- Internes Admin-CLI oder kleines Admin-Panel:
  - Lizenz erstellen
  - Lizenz sperren
  - Beta-Welle sperren
  - Audit exportieren

### Phase C - Rollout Public MVP (P0)

- Hostinger VPS bereitstellen.
- Domain + HTTPS + Reverse Proxy konfigurieren.
- Smoke-Tests fuer WebSocket und Lizenz-Endpoints.

### Phase D - Hardening (P1)

- Rate-Limits auf Aktivierung.
- Signatur-Rotation (Key-Rollover).
- Monitoring: Lizenzfehlerquote, Aktivierungen/Tag.

## 6. Sofort naechste Schritte (ab heute)

1. Lizenzdatenmodell finalisieren (`lic_id`, `expires_at`, `beta_generation`, `grace_offline_until`).
2. Entscheidung fuer Revocation-Backend treffen (zunaechst JSON/DB-Tabelle).
3. Ticket-Umsetzung starten: Backend-Statusendpoint + Frontend-Statusanzeige.
4. Hostinger MVP-Deployment mit TLS als Parallelspur starten.
5. Support-Runbook fuer Sperrung/Neuausgabe dokumentieren.

## 7. Entscheidungsvorlage fuer dich

Empfehlung fuer Beta V1:

- Signierte Lizenz-Tokens (Ed25519) + Revocation-Liste.
- Offline-Gnadenfrist: 14 Tage.
- Sperrmodus: zuerst Read-only, dann Hard-Block bei Fristablauf.
- Kein statischer geheimer "Master-Key" im Frontend, weil leicht extrahierbar.

Damit bleibt die App administrativ steuerbar, supportfaehig und trotzdem offline-brauchbar.
