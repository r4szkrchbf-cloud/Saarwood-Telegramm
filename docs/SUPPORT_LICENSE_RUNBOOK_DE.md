# Support-Runbook Lizenzverwaltung (Phase B)

Stand: 2026-07-05

Dieses Runbook beschreibt die internen Standardkommandos fuer das Support-Team.

## 1. Vorbereitung

1. Repository lokal vorhanden.
2. Abhaengigkeiten installiert (`npm install`).
3. Private Keys niemals ins Repository committen.

## 2. Schluessel erzeugen (einmalig)

Ed25519 Keypair via OpenSSL:

```bash
openssl genpkey -algorithm Ed25519 -out ./secrets/license-private.pem
openssl pkey -in ./secrets/license-private.pem -pubout -out ./secrets/license-public.pem
```

Backend-Konfiguration:

```bash
export LICENSE_MODE=enforce
export LICENSE_PUBLIC_KEY_PEM="$(cat ./secrets/license-public.pem)"
export LICENSE_REVOCATION_FILE="$(pwd)/packages/backend/config/license-revocations.json"
```

## 3. Lizenz erstellen

Beispiel (30 Tage + 14 Tage Offline-Gnadenfrist):

```bash
npm run license:admin --workspace @saarwood/backend -- create \
  --private-key-file ./secrets/license-private.pem \
  --customer "Pilotkunde Redaktion A" \
  --tier expert \
  --days 30 \
  --offline-grace-days 14 \
  --generation beta-v1 \
  --channels web,electron,pwa \
  --out ./secrets/license-pilotkunde-a.token
```

Ausgabe enthaelt:

- `lic_id`
- Ablaufzeitpunkte
- Token selbst (oder Datei via `--out`)

## 4. Lizenz sperren (Einzelfall)

```bash
npm run license:admin --workspace @saarwood/backend -- revoke-license --license-id lic-123456
```

Rueckgaengig machen:

```bash
npm run license:admin --workspace @saarwood/backend -- unrevoke-license --license-id lic-123456
```

## 5. Ganze Beta-Generation sperren

```bash
npm run license:admin --workspace @saarwood/backend -- revoke-generation --generation beta-v1
```

Rueckgaengig machen:

```bash
npm run license:admin --workspace @saarwood/backend -- unrevoke-generation --generation beta-v1
```

## 6. Revocation-Status anzeigen

```bash
npm run license:admin --workspace @saarwood/backend -- list-revocations
```

Mit alternativem Pfad:

```bash
npm run license:admin --workspace @saarwood/backend -- list-revocations \
  --revocation-file ./custom/license-revocations.json
```

## 7. Notfallprozess (72h Emergency)

```bash
npm run license:admin --workspace @saarwood/backend -- create \
  --private-key-file ./secrets/license-private.pem \
  --customer "Emergency Ticket #123" \
  --tier expert \
  --days 3 \
  --offline-grace-days 0 \
  --generation beta-v1-emergency
```

## 8. Support-Checkliste pro Vorgang

1. Ticket-ID und Kunde erfassen.
2. Ausgestellte `lic_id` protokollieren.
3. Ablaufdatum im Ticket hinterlegen.
4. Bei Sperrung: Grund dokumentieren (Missbrauch, Ablauf, Ersatzlizenz).
5. Nach Sperrung einmal `list-revocations` pruefen.

## 9. Phase C - Remote Admin API (ohne Server-SSH)

Voraussetzung: Backend laeuft mit gesetztem `ADMIN_API_KEY`.

```bash
export BASE_URL="https://beta.example.com"
export ADMIN_API_KEY="<dein-admin-key>"
```

Revocations anzeigen:

```bash
curl -sS "$BASE_URL/api/admin/license/revocations" \
  -H "x-admin-api-key: $ADMIN_API_KEY"
```

Lizenz sperren:

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/revoke-license" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"licenseId":"lic-123456"}'
```

Generation sperren:

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/revoke-generation" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"generation":"beta-v1"}'
```

Serverseitig signierte Lizenz erzeugen:

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/create" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "Pilotkunde Redaktion A",
    "tier": "expert",
    "days": 30,
    "offlineGraceDays": 14,
    "generation": "beta-v1",
    "channels": ["web", "electron", "pwa"],
    "features": []
  }'
```

## 10. Support-Ticket Auto-E-Mail (Ticket-ID + Ticket-Kopie)

Fuer jeden eingehenden Support-Fall kann der Absender automatisch eine Bestaetigungs-E-Mail erhalten.

Pflicht/Empfehlung fuer Produktivbetrieb:

```bash
export SUPPORT_CONFIRMATION_MAIL_ENABLED=true
export SUPPORT_CONFIRMATION_SUBJECT_PREFIX="[Saarwood Support]"
export SUPPORT_SMTP_HOST="smtp.example.com"
export SUPPORT_SMTP_PORT="587"
export SUPPORT_SMTP_SECURE="false"
export SUPPORT_SMTP_USER="support-smtp-user"
export SUPPORT_SMTP_PASS="<secret>"
export SUPPORT_MAIL_FROM="Saarwood Support <support@example.com>"
export SUPPORT_MAIL_REPLY_TO="support@example.com"
```

Erwartetes Verhalten:

1. Ticket wird erzeugt und mit ID gespeichert (z. B. `SWD-2026-000123`).
2. App bestaetigt: "Ihr Ticket ist beim Support eingegangen. Bitte verwenden Sie diese Ticket-ID: ...".
3. Absender erhaelt automatisch eine E-Mail mit Ticket-ID und Ticket-Kopie (Name, Betreff, Nachricht, Kontext, Zeitstempel).

## 11. Interne Test-Checkliste Professional-Lizenz (Web/Electron)

Ziel: Einen Professional-Beta-Token intern schnell pruefen, ohne den Ablauf jedes Mal neu zu suchen.

### 11.1 Professional-Token bereitstellen

1. Token lokal in Datei ablegen, z. B. `./secrets/license-professional-beta.token`.
2. Backend mit passendem Public Key starten:

```bash
export LICENSE_MODE=enforce
export LICENSE_PUBLIC_KEY_PEM="$(cat ./secrets/license-public.pem)"
export LICENSE_REVOCATION_FILE="$(pwd)/packages/backend/config/license-revocations.json"
```

### 11.2 Web-App aktivieren

1. App oeffnen.
2. Lizenz im Gate oder im Aktivierungsdialog einfuegen.
3. Erwartung: Tier wird auf `professional` gesetzt, Features sind ohne Expert-only-Funktionen aktiv.

API-Check (optional):

```bash
curl -sS "http://localhost:4000/api/license/status" \
  -H "x-license-token: $(cat ./secrets/license-professional-beta.token)"
```

### 11.3 Electron-App aktivieren

1. Electron-App starten.
2. Professional-Token in die Lizenzaktivierung einfuegen.
3. Erwartung: dieselbe Tier-Freigabe wie im Web, keine Expert-only Features.

### 11.4 Schnellvalidierung

Nach Aktivierung pruefen:

1. Lizenzstatus zeigt `active`.
2. `tier` ist `professional`.
3. Professional-Funktionen vorhanden.
4. Expert-Funktionen (z. B. Voice-Tracking) bleiben deaktiviert.

## 12. Offline-Haertung (ab 2026-07-06)

Ziel: Offline-Betrieb nur mit kryptografisch verifizierbaren Tokens, nicht mehr nur per Plausibilitaetscheck.

### 12.1 Verhalten

1. Die App cached nach erfolgreicher Online-Pruefung den Public Key lokal.
2. Bei Offline-Betrieb wird der Lizenz-Token lokal per Ed25519-Signatur verifiziert.
3. Ohne zuvor gecachten Public Key ist keine Erstaktivierung im Offline-Modus moeglich.
4. Zeitlogik fuer Offline basiert auf `grace_offline_until` (fallback: `expires_at` / `exp`).

### 12.2 Support-Hinweis fuer Nutzer

Vor geplanter Offline-Nutzung immer mindestens einmal online aktivieren bzw. den Lizenzstatus erfolgreich abrufen, damit der Public Key lokal vorliegt.

### 12.3 Kontrolle ueber verteilte Versionen

Volle zentrale Kontrolle ist online sofort wirksam:

- Lizenz sperren (`revoke-license`)
- Generation sperren (`revoke-generation`)
- Token mit kurzen Laufzeiten ausstellen (`--days`)
- Offline-Fenster begrenzen (`--offline-grace-days`)

Wichtig: Ein Geraet ohne Internet kann neue Sperrungen erst nach naechster Verbindung sehen. Fuer harte Kontrolle im Feld daher kurze `offlineGraceDays` nutzen.
