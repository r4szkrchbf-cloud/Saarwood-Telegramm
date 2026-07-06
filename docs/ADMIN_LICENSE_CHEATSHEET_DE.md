# Admin Cheat-Sheet Lizenzsteuerung (Produktion)

Stand: 2026-07-07
Ziel: Kurze, direkt nutzbare Produktionskommandos fuer Lizenzausgabe, Entzug und Revocation-Status.

## 1. Vorbereitung

```bash
export BASE_URL="https://teleprompter.saarwood.ch"
export ADMIN_API_KEY="<dein-admin-key>"
```

Optional JSON-Formatierung:

```bash
alias cjson='python3 -m json.tool'
```

## 2. Token erstellen

Beispiel: Professional, 30 Tage Laufzeit, 14 Tage Offline-Gnadenfrist.

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/create" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "Pilotkunde Redaktion A",
    "tier": "professional",
    "days": 30,
    "offlineGraceDays": 14,
    "generation": "beta-v1",
    "channels": ["web", "electron", "pwa"],
    "features": []
  }' | cjson
```

Hinweis:
- `days` steuert das Ablaufdatum.
- `offlineGraceDays` begrenzt, wie lange ein Geraet nach Ablauf offline weiterlaufen darf.

## 3. Lizenz entziehen (Einzellizenz)

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/revoke-license" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"licenseId":"lic-123456"}' | cjson
```

Rueckgaengig machen:

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/unrevoke-license" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"licenseId":"lic-123456"}' | cjson
```

## 4. Generation killen (Kill-Switch)

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/revoke-generation" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"generation":"beta-v1"}' | cjson
```

Rueckgaengig machen:

```bash
curl -sS -X POST "$BASE_URL/api/admin/license/unrevoke-generation" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"generation":"beta-v1"}' | cjson
```

## 5. Revocation-Status pruefen

```bash
curl -sS "$BASE_URL/api/admin/license/revocations" \
  -H "x-admin-api-key: $ADMIN_API_KEY" | cjson
```

## 6. Betriebsregel fuer Feldkontrolle

- Sofortige Wirkung fuer Revocations gibt es nur auf online verbundenen Geraeten.
- Fuer harte Kontrolle im Feld:
  - kurze Token-Laufzeit (`days`),
  - kurze Offline-Gnadenfrist (`offlineGraceDays`).
