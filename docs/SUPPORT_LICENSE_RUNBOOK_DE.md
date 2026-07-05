# Support-Runbook Lizenzverwaltung (Phase B)

_Stand: 2026-07-05_

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
