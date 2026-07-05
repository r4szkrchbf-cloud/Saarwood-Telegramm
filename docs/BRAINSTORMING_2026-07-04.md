# Saarwood Teleprompter — Brainstorming-Protokoll

_Datum: 2026-07-04 · Autor: saarnews + GitHub Copilot Agent_

---

## Ausgangssituation

Das Projekt ist als funktionierendes Monorepo aufgebaut (Frontend: React/Vite/PWA, Backend: Node.js/Express/WS).
Phase 1 (CI & Qualitätsgates) ist vollständig abgeschlossen.
Dieses Brainstorming-Protokoll dokumentiert die Entscheidungen und Priorisierungen für Welle 1 (MVP).

---

## 1. MVP-Scope — Welle 1 (Basic Tier, auslieferbar)

### Was ist bereits implementiert (Ist-Stand):
| Feature | Status |
|---|---|
| Tiptap-Editor + Segment-Modell | ✅ |
| CSS-Scroll-Engine (requestAnimationFrame, judder-free) | ✅ |
| WebSocket Sync (Backend ↔ Frontend) | ✅ |
| Mirror horizontal / vertikal | ✅ |
| Speech Tracking (Hook + Service, `enabled: false`) | ✅ (deaktiviert) |
| MOS-Handler (Grundgerüst) | ✅ |
| NDI-Stub | ✅ |
| PWA-Konfiguration (vite-plugin-pwa) | ✅ |

### **Kritische MVP-Funktion: Text-Transformation (Spiegel + Drehung)**

> **Entscheidung:** Text muss in alle Richtungen gespiegelt und gedreht werden können.
> Dies ist ein Tier-1-Pflichtfeature, da physische Teleprompter-Gläser in verschiedenen
> Winkeln und Ausrichtungen montiert werden (Standard: horizontal gespiegelt, 0°;
> auf dem Kopf montiert: 180°; Seitenmontage: 90°/270°).

**Implementierte Transformationen (GPU-Ebene, `transform: rotate() scale()`):**
- Mirror Horizontal (Flip X): `scale(-1, 1)` ✅
- Mirror Vertikal (Flip Y): `scale(1, -1)` ✅
- **Rotation 0° / 90° / 180° / 270°**: `rotate(Xdeg)` ← **NEU in MVP**

**Technische Umsetzung:**
- `DisplaySettings.rotation: 0 | 90 | 180 | 270` im Zustand-Store (persistiert)
- GPU-Transform auf Viewport-Ebene: `rotate(${rotation}deg) scale(${sx}, ${sy})`
- Rotation-Buttons im ControlPanel (direkte Bedienung ohne Settings-Drawer)
- Hotkeys: `[` = −90°, `]` = +90°

### Welle-1-Scope-Tabelle:

| Feature | Status | Prio | Tier |
|---|---|---|---|
| Editor + Prompter-Anzeige | ✅ fertig | – | Basic |
| Scroll-Steuerung (Speed/Pause/Reset) | ✅ fertig | – | Basic |
| Mirror H/V + **Rotation 0°/90°/180°/270°** | ✅/🔧 neu | **P0** | **Basic** |
| ASR Voice Tracking aktivierbar | 🔧 fast fertig | P1 | Basic |
| **Hotkey-Manager** (konfigurierbar) | ❌ neu | **P0** | **Basic** |
| **Ingest-API /api/v1/ingest** (n8n/ClickUp) | ❌ neu | P1 | Basic |
| Presenter-Profile UI | Teilimpl. | P2 | Professional |
| PWA installierbar | ✅ konfiguriert | – | Basic |

### Was explizit NICHT in Welle 1:
- MOS-Integration tief (Professional Tier)
- NDI-Ausgabe produktiv (Expert Tier)
- **Redundanz-Sync vollumfänglich (Expert Tier) → Welle 3 / TICKET-011**
- ST 2110 / PTP (Expert Tier)
- **CEA-708 Caption Export (Expert Tier) → Welle 3 / TICKET-013**
- On-Premise-ASR / Whisper / Llama (Expert Tier)
- Multi-Tenant / PostgreSQL / Prisma (Expert Tier)

---

## 7. Scope-Entscheidungen Welle 1 — Protokoll (2026-07-04)

> Diese Entscheidungen wurden vom Projektinhaber (@saarnews) verbindlich bestätigt und werden hier als dauerhaftes Protokoll abgelegt.

### Entscheidung A — Redundanz-Sync (Punkt 11) → Phase 3, nicht MVP

**Sachverhalt:**  
Der `ControlServer` synct beim Verbindungsaufbau und auf HEARTBEAT nur `{ isPlaying, speed, position }`.  
Der `RedundancyState` im Store (primary/backup/standalone, `peerAddress`, `isSynced`) ist typseitig modelliert, aber es gibt:
- keinen `/api/peer`-Endpunkt
- keinen periodischen Backup-Sync (100 ms Intervall)
- keine Failover-Logik

**Begründung: Nicht MVP-kritisch**  
Redundanz ist ein Expert-Feature für mehrstufigen Broadcast-Betrieb (Hauptregie + Backup-Maschine).  
Für Welle 1 = **eine einzelne Teleprompter-Instanz** wird Failover nicht benötigt.

**✅ Entscheidung (@saarnews, 2026-07-04):**  
Redundanz-Sync bleibt in **TICKET-011, Phase 3 (Expert Tier)**.  
Aus Welle 1 offiziell herausgenommen. Kein Code-Aufwand für MVP.

---

### Entscheidung B — CEA-708 Caption Export (Punkt 12) → Phase 3, nicht MVP

**Sachverhalt:**  
Aktuell vorhanden: nur Typ-Interfaces `Cea708Packet` und `Cea708PenStyle` in `packages/frontend/src/types/index.ts`.  
Nicht vorhanden: Encoder (Bit-Packing, Window-Management), API-Endpunkt, UI-Trigger, Datei-Download.

**Begründung: Nicht MVP-kritisch für Welle 1**

| Szenario | CEA-708 MVP-kritisch? |
|---|---|
| Teleprompter als reines Scroll-Display | ❌ Nein — kein Sendeketten-Anschluss erforderlich |
| Teleprompter als Teil der Sendekette (Encoder/Captioning) | ✅ Ja — dann zwingend |

**Einschätzung:** Ein vollständiger CEA-708-Encoder ist ca. 1–2 Tage Arbeit  
(Bit-Packing, Window-Management, SCC/MCC-Ausgabeformat) → sprengt Welle-1-MVP.

**✅ Entscheidung (@saarnews, 2026-07-04):**  
- Welle 1 = Teleprompter als **eigenständiges Display** (kein Sendeketten-Anschluss)
- CEA-708 Export → **TICKET-013, Phase 3 (Expert Tier)**
- Typen-Interfaces bleiben als Vorarbeit erhalten, werden aber nicht in Welle 1 produktiv genutzt

---

## 2. Lizenz- und Preismodell

### Empfehlung: Open-Core Hybrid

**Grundprinzip:** Basic Tier = Open Source / Self-hostable (Freemium).
Professional + Expert = kommerzielle Lizenz.

| Tier | Modell | Preis (Richtwert) |
|---|---|---|
| Basic | Open Source (MIT o. AGPL) | kostenlos / Self-hosted |
| Professional | SaaS Abo oder Einmallizenz | ~19–99 €/Monat pro Studio |
| Expert | Enterprise-Vertrag | ab ~5.000 € (Quote) |

**Offene Fragen (vor Launch zu klären):**
1. **Tiptap-Lizenz:** Tiptap v3 hat Pro-Features mit kommerzieller Lizenz — prüfen, ob verwendete Extensions betroffen sind.
2. **Open Source vs. Closed Source:** Core-Entscheidung notwendig.
3. **Whisper/Llama lokal:** Lizenzmodell prüfen (Llama 3: Meta License, Whisper: MIT).
4. **SaaS-Abo vs. Perpetual:** Für Broadcast-Umfeld bevorzugen Kunden oft Perpetual + Maintenance.

---

## 3. n8n/ClickUp Ingest — API-Spezifikation

### Endpoint: `POST /api/v1/ingest`

```
Authorization: ******
Content-Type: application/json

{
  "targetProfileId": "studio-1",    // required
  "slotKey": "slot_01_intro",       // required
  "rawText": "...",                 // required
  "source": "clickup|n8n|manual",  // optional
  "priority": "normal|breaking"    // optional → breaking löst Hot-Update aus
}
```

**Validierung:** Zod-Schema (laut SRS explizit gefordert)
**Response:** `{ ok: true, segmentId: "uuid" }` oder strukturierter Fehler-Payload
**Auth:** `INGEST_API_KEY` als Umgebungsvariable (Welle 1); Token-Tabelle in DB (Welle 2+)

### n8n-Workflow (Referenzimplementierung):
1. ClickUp Trigger: Task-Status wechselt zu „Sendebereit"
2. HTTP Request Node → `POST /api/v1/ingest` mit Bearer-Token
3. Optional: LLM-Node (GPT/Claude) für AI-Sanitizing vor dem Senden

---

## 4. Hotkey-Manager — Konzept

### Warum kritisch:
Broadcast-Regie arbeitet zu 90 % ohne Maus. Hotkeys sind kein Komfort-Feature —
sie sind eine Tier-1-Pflichtanforderung.

### Architektur:

```
HotkeyManager (Singleton Service)
├── register(key, action, context?)  // key = "Space", "ArrowUp", "m", etc.
├── unregister(key)
├── enable() / disable()             // Kontext-Switch (Editor hat Fokus)
└── getBindings()                    // für Settings-UI anzeigen
```

### Default-Bindings:

| Taste | Aktion |
|---|---|
| `Space` | Play / Pause toggle |
| `↑` | Speed +5 |
| `↓` | Speed −5 |
| `R` | Reset (Scroll-Position = 0, Stop) |
| `M` | Mirror horizontal toggle |
| `F` | Fullscreen toggle |
| `Esc` | Stop + zurück zu Editor-View |
| `[` | Rotation −90° |
| `]` | Rotation +90° |
| `1`–`9` | Sprung zu Segment N (zukünftig) |

### Design-Entscheidungen:
- **Context-Awareness:** Hotkeys deaktiviert wenn Tiptap-Editor Fokus hat
  (bereits implementierter Check: `isContentEditable`, `HTMLInputElement`)
- **Last-device-in-control:** Jede Hotkey-Aktion feuert `prompter:manual-control`-Event
- **Konfigurierbar:** Bindings in Presenter-Profile gespeichert (Welle 2)
- **Erweiterbar:** Bluetooth-Pedal-Mapping über gleichen Service (WebHID / WebSocket vom Backend)

---

## 6. Priorisierung & Zeitschätzung

| Aufgabe | Aufwand | Abhängigkeit |
|---|---|---|
| TICKET-006: MVP-Scope im Backlog finalisieren | ~30 min | – |
| TICKET-007: Hotkey-Manager implementieren | ~1 Tag | – |
| Rotation-Feature (Teil von TICKET-007) | ~2 h | Hotkey-Manager |
| TICKET-008: Ingest-API bauen | ~1 Tag | Zod installieren |
| Lizenzmodell (kein Code) | Separater Business-Track | – |

### MVP-Testbarkeit:

Mit diesen Tickets (006–008) + TICKET-003 (ASR) ist der MVP-Stand für **erste interne Tests bereit.
Schätzung: 2–3 Arbeitstage** für die technische Umsetzung, danach:

- Frontend lokal: `npm run dev --workspace=packages/frontend` (Port 3000)
- Backend lokal: `npm run dev --workspace=packages/backend` (Port 4000)
- PWA installierbar auf Smartphone/Tablet für Remote-Control
- n8n-Webhook testbar gegen `POST /api/v1/ingest`

---

## 8. Offene strategische Fragen

1. **Tiptap Pro-Lizenz:** Welche Extensions werden langfristig benötigt?
2. **Datenbankstrategie:** Wann kommt PostgreSQL/Prisma (Multi-Tenant, Token-Management)?
3. **On-Prem vs. Cloud:** Soll der Basic-Tier-Server auch als SaaS angeboten werden?
4. **Branding:** „Saarwood Teleprompter" als Produktname final?
5. **Sprachen:** RTL-Support (Arabisch/Hebräisch) für Professional Tier — wann?

---

_Dieses Protokoll ist versioniert und wird bei jeder Brainstorming-Session aktualisiert._
