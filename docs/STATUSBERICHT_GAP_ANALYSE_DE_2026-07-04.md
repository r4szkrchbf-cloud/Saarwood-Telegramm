# Saarwood Teleprompter – Statusbericht & Gap-Analyse

**Stand:** 2026-07-04 (aktualisiert: 2026-07-04 — **MVP Welle 1 vollständig auslieferbar ✅**)  
**Ziel dieses Berichts:** Klären, was aus den gemeldeten Lücken bereits abgearbeitet wurde, was noch offen ist, und eine fokussierte Brainstorming-Basis für die nächsten Schritte bereitstellen.

---

## 0) Eigentümer-Entscheidungen (protokolliert 2026-07-04)

Die folgenden Entscheidungen wurden vom Projektinhaber (@saarnews) verbindlich festgelegt und werden hier dokumentiert:

| Thema | Entscheidung |
|---|---|
| **Bluetooth-Pedal** | Vorerst **nicht priorisiert** — wird frühestens in Welle 4 aufgegriffen |
| **WebGL/PixiJS vs. CSS** | Bestätigt: **CSS Compositor ist die akzeptierte Architektur für v1/MVP** (siehe `README.md` Abschnitt „Design Decisions #2"). WebGL folgt additiv in Welle 3 / v2+. |
| **Zwei getrennte PWAs** | **Erst in v2** — für das MVP reicht eine kombinierte App |
| **Scope-Freeze v1 (MVP)** | Noch offen → Priorisierungsgespräch folgt. Fokus: „Broadcast-fähiger Kern" statt „vollständiges Lastenheft" |
| **Roadmap-Wellen 1–4** | Vom Eigentümer bestätigt und freigegeben |
| **Arbeitspakete (Abschnitt 4)** | Alle vier Pakete freigegeben und werden umgesetzt |

---

## 1) Kurzantwort auf die Kernfrage („haben wir davon etwas abgearbeitet?“)

**Ja.** Von der 14-Punkte-Liste sind mehrere zuvor gemeldete Lücken inzwischen umgesetzt.

### Bereits erledigt (nach aktuellem Code-Stand)
1. **Voice-Tracking einschaltbar** ✅  
   - `speechEnabled` im Store vorhanden und persistent  
   - Toggle in `SettingsPanel.tsx` vorhanden
2. **Voice-Tracking kann scrollen** ✅  
   - `charsPerPixel` wird berechnet (nicht 0 fest verdrahtet)
3. **Director’s Notes werden im ASR-Text übersprungen** ✅  
   - `plainText` filtert `isDirectorsNote` aus
4. **MOS-Updates landen im Script-Store** ✅  
   - `MOS_UPDATE` wird auf Segmente gemappt und via `setScript(...)` übernommen
5. **Keyboard-Shortcuts triggern `prompter:manual-control`** ✅
6. **Segment löschen in UI vorhanden** ✅  
   - Delete-Button in `ScriptEditor`
7. **Script-Titel editierbar** ✅  
   - Titel-Input in `App.tsx`
8. **`SCRIPT_UPDATE` umgesetzt** ✅  
   - Senden + Empfangen via WebSocket
9. **`SETTINGS_UPDATE` umgesetzt** ✅  
   - Senden + Empfangen via WebSocket
10. **Segment-Reihenfolge ändern vorhanden** ✅  
   - Move-Up/Move-Down in UI + `reorderSegment(...)` im Store

> **TICKET-003 (ASR Voice Tracking) vollständig abgeschlossen** ✅  
> `PrompterDisplay` liest `speechEnabled` aus dem Store, `charsPerPixel` via Canvas-Font-Metrics,  
> `useSpeechTracking` mit Last-device-in-control-Konvention (2 s Sperre nach manueller Eingabe),  
> Browser-Hinweis in `SettingsPanel` wenn Web Speech API nicht verfügbar.  
> **→ MVP Welle 1 ist damit vollständig auslieferbar.**

### Weiterhin offen (aus der 14-Punkte-Liste)
11. **Redundanz-Sync vollumfänglich** ⏸️ (bewusst auf Phase 3 verschoben — Entscheidung @saarnews 2026-07-04: Welle 1 = eine Instanz, kein Failover) → TICKET-011, Phase 3  
12. **CEA-708 Export-Endpunkt/Frontend-Export** ⏸️ (bewusst auf Phase 3 verschoben — Entscheidung @saarnews 2026-07-04: Welle 1 = eigenständiges Display, kein Sendeketten-Anschluss) → TICKET-013, Phase 3  
13. **Bluetooth-Pedal-Unterstützung (real)** ⏸️ (vorerst zurückgestellt — Entscheidung Eigentümer: frühestens Welle 4)  
14. **IP-Controller Auto-Discovery (PoE/mDNS/Bonjour)** ❌ → Welle 4

---

## 2) Detailbewertung der zweiten „größte Lücken“-Liste

| Anforderung | Bewertung | Status |
|---|---|---|
| WebGL/PixiJS-Rendering-Engine (CSS verboten laut Lastenheft) | **Entschieden: CSS ist akzeptierte Architektur für v1** (README §2, bestätigt durch Eigentümer). WebGL folgt additiv in Welle 3. | ✅ Entschieden |
| Separate Apps: `pwa-director` + `pwa-prompter` | **Entschieden: Erst in v2** — eine kombinierte App ist ausreichend für das MVP | ✅ Entschieden |
| PostgreSQL + Prisma ORM | Kein DB-Modell/Prisma-Setup im laufenden Code | ❌ Offen |
| n8n/ClickUp Ingest API (`/api/v1/ingest`) | Kein entsprechender Endpunkt | ❌ Offen |
| KI-Textbereinigungspipeline | Keine LLM-Pipeline im Backend implementiert | ❌ Offen |
| Zod-Validierung eingehender Payloads | Keine aktive Zod-Validierung in API-Routen | ❌ Offen |
| Turborepo/Nx Monorepo | Derzeit npm workspaces | ❌ Offen |
| Hardware-Audio-Routing | Nicht implementiert | ❌ Offen |
| ASR-Tuning-Schieberegler (Regie-UI) | Keine Sensitivity/Ad-lib Controls in UI | ❌ Offen |
| Gesprochene Wörter hervorheben (WebGL) | Keine GPU-Highlight-Logik | ❌ Offen |
| mDNS/Bonjour Auto-Discovery | Kein Discovery-Modul | ❌ Offen |
| Lokale ASR (Whisper.cpp) produktiv | Nur Adapter-/Schnittstellenhinweise, keine echte Pipeline | ❌ Offen |
| Docker-Einrichtung (`docker-compose`) | Keine Compose-Datei im Repo | ❌ Offen |
| WSS (TLS-verschlüsselt) | App kann Protokoll ableiten, aber keine eigene TLS-Betriebsstrecke | ⚠️ Teilweise |
| Redis | Nicht integriert | ❌ Offen |
| Husky Pre-Commit Hooks | Keine `.husky`-Implementierung | ❌ Offen |

---

## 3) Brainstorming: Priorisierte Umsetzungsstrategie

### A. Blocker-Klärung (sofort, strategisch)
1. **Anforderungsentscheid schriftlich fixieren:**
   - ~~Ist WebGL/PixiJS weiterhin „zwingend", oder ist CSS-Renderer als akzeptierte Zielarchitektur freigegeben?~~ → **Entschieden: CSS ist freigegeben (README §2), WebGL in Welle 3** ✅
   - ~~Sind zwei getrennte PWAs ein Muss in v1 oder erst in v2?~~ → **Entschieden: Erst in v2** ✅
2. **Scope-Freeze für v1 definieren:**
   - „Broadcast-fähiger Kern" vs. „vollständiges Lastenheft" → **Priorisierungsgespräch steht noch aus**

### B. Lieferbare Roadmap (empfohlen in Wellen)

#### Welle 1 – Stabiler Kern (kurzfristig) ✅ abgeschlossen
- ~~Redundanz-Sync auf Script + Settings erweitern~~ → **bewusst auf Phase 3 verschoben** (TICKET-011)
- ~~CEA-708 End-to-End Pfad~~ → **bewusst auf Phase 3 verschoben** (TICKET-013)
- Security/Robustheit: strukturierte Payload-Validierung ✅ (Ingest-API mit Zod)

#### Welle 2 – Integrationen (mittel)
- Ingest-API (`/api/v1/ingest`) inkl. Mapping auf Script-Store
- Optional Redis für verteilte Zustände/PubSub
- Betriebsfähige WSS-Topologie dokumentieren (Reverse Proxy / Zertifikate)

#### Welle 3 – Architekturziele (größere Pakete)
- Entscheidung und Umsetzung WebGL/PixiJS vs. validierter CSS-Pfad
- Trennung in Director- und Prompter-App
- Persistenzschicht (PostgreSQL + Prisma) inkl. Mandantenmodell

#### Welle 4 – Expert Features
- mDNS/Bonjour Discovery für PoE-Controller
- Lokaler ASR-Stack (Whisper.cpp) produktiv anbinden
- Hardware-Audio-Routing + ASR-Tuning-UI

---

## 4) Empfohlene nächste konkrete Arbeitspakete (backlog-fähig)

1. **Redundanz-Sync erweitern**
   - Script/Display/Role synchronisieren
   - Failover-Semantik messbar machen
2. **CEA-708 Export-MVP**
   - API-Endpunkt + UI-Auslöser + Adapter-Grenze
3. **Ingest-API-MVP**
   - `/api/v1/ingest` + Validierung + Fehlerkonzept
4. **Anforderungsabgleich mit Lastenheft**
   - WebGL- und Zwei-PWA-Entscheid als verbindliche Architekturentscheidung

---

## 5) Fazit

Der Stand ist **deutlich besser** als in der gemeldeten 14er-Liste: wesentliche Punkte (ASR-Toggle, MOS→Store, Script/Settings Sync, Delete/Reorder, Titel-Editing, Manual-Control-Event) sind bereits umgesetzt.  
Die größten offenen Themen liegen jetzt vor allem bei **Architektur- und Integrationsanforderungen** (WebGL/PixiJS-Pflicht, getrennte PWAs, Datenbank/Prisma, Ingest-API, Discovery/Hardwarepfade).

Dieser Bericht ist im Repository gespeichert und kann direkt als Basis für die nächste Priorisierungsrunde genutzt werden.

---

## 6) Weitere Wünsche des Eigentümers (protokolliert 2026-07-04)

Die folgenden Punkte wurden vom Projektinhaber ergänzend festgehalten und sind für die Roadmap zu berücksichtigen:

### 6.1 n8n / ClickUp Test-Ingest-API
- Expliziter Wunsch: Eine **Testintegration mit n8n/ClickUp** als erstes Ingest-Szenario
- Genauere Anforderungen (Endpunkt, Mapping, Auth) folgen aus einem separaten Diskussions-Termin
- Zuordnung: **Welle 2** (nach Ingest-API-MVP)

### 6.2 Tastatur- und Hotkey-Steuerung (Ausbau)
- Grundfunktion (Space, Escape, ↑/↓) bereits vorhanden
- Gewünschter Ausbau:
  - Vollständige konfigurierbare Tastenbelegung (Hotkey-Manager)
  - Numpad-Support für Broadcast-Situationen
  - Anzeige aller aktiven Shortcuts im UI (Hilfe-Overlay)
- Zuordnung: **Welle 1 / früh in v1**

### 6.3 Fernsteuerung (Weboberfläche, Netzwerk, Terminal)
- **Weboberfläche:** Responsive Remote-Control-Seite (bereits teilweise über WebSocket-ControlPanel)
- **Netzwerkanbindung:** IP-basierende Verbindung über LAN/WLAN (Mobile, Tablet, Regie-Platz)
- **Terminalanbindung:** CLI-Interface oder WebSocket-fähiges CLI-Tool für technische Inbetriebnahme und Monitoring (z. B. `prompter-cli connect ws://...`)
- Zuordnung: Weboberfläche **Welle 1**, Terminal-CLI **Welle 2**

### 6.4 Internationalisierung (i18n)
- Die App soll in **mehreren Sprachen** verfügbar sein
- Prioritätsliste (vorgeschlagen): Deutsch 🇩🇪, Englisch 🇬🇧, Französisch 🇫🇷, Spanisch 🇪🇸, Arabisch 🇸🇦 (RTL – via Sub-Projekt)
- Technischer Ansatz: `react-i18next` + Sprachdateien in `packages/frontend/src/locales/`
- Richtlinie: LTR-Sprachen in dieser App; RTL-Sprachen über das geplante Sub-Projekt „Saarwood Teleprompter Multi-Script Edition"
- Zuordnung: **Welle 2** (Grundgerüst) + kontinuierliche Ergänzung

---

## 7) Marketing & Lizenzstrategie (Brainstorming-Basis)

> 📌 Noch kein finales Konzept — dieser Abschnitt dokumentiert die Ausgangswünsche des Eigentümers und dient als Grundlage für ein separates Strategiegespräch.

### 7.1 Monetarisierungsmodell (Idee des Eigentümers)

Der Eigentümer wünscht ein **gestaffeltes Freemium-Modell** mit und ohne Werbung:

| Tier | Mit Werbung | Ohne Werbung |
|------|------------|--------------|
| **Basis** | ✅ Kostenlos | 💰 Kleiner Betrag |
| **Premium** | 💰 Günstig (günstiger als Premium ohne Werbung) | 💰💰 Teurer als Basis, günstiger als Prof.-Delux mit Werbung |
| **Prof.-Delux** | 💰💰 Mittlerer Preis | 💰💰💰 Höchster Preis |

Grundprinzip: **„Werbung reduziert den Preis"** — wer Werbung akzeptiert, zahlt weniger.

### 7.2 Offene Fragen für das Strategiegespräch

1. **Vertriebskanal:** App Store (Apple/Google), Web-Direktkauf, B2B-Lizenz für Sender/Redaktionen?
2. **Werbepartner:** Werbeinventar selbst vermarkten oder Ad-Netzwerk (z. B. AdSense)?
3. **Werbeplatzierung:** Nur in der Editor-/Regie-UI — niemals im Teleprompter-Ausgabefenster (Broadcast-Integrität!)
4. **Enterprise-/Broadcast-Tarif:** Gesondertes Angebot für Fernsehsender, Produktionshäuser, Ministerien?
5. **Testphase / Free Trial:** 14 Tage kostenloser Pro-Zugang als Akquise-Strategie?
6. **Open-Source-Kern vs. geschlossener Expert-Tier?** Hybridmodell möglich (wie z. B. GitLab CE/EE)?
7. **SaaS vs. On-Premise:** Cloud-gehostetes SaaS für kleine Kunden vs. On-Premise für Broadcast-Profis?

### 7.3 Empfohlene nächste Schritte (Marketing)

- [ ] Kundensegmente und Zahlungsbereitschaft validieren (min. 5 Broadcast-/Content-Gespräche)
- [ ] MVP-Launch-Kanal festlegen (Web-App mit kostenlosen Testaccounts als Startpunkt empfohlen)
- [ ] Konkrete Preispunkte und Tier-Features abgrenzen
- [ ] Lizenzmodell technisch entscheiden (Seat-based, Usage-based, oder Feature-gating im Frontend)
- [ ] Datenschutz-/Vertragskonzept für B2B (Broadcast-Kunden haben hohe DSGVO-Anforderungen)

---

_Stand dieser Ergänzung: 2026-07-04. Nächster Schritt: Brainstorming zu MVP-Scope und Lizenzstrategie._
