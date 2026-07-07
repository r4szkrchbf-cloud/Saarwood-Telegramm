# Saarwood Teleprompter — Backlog

_Stand: 2026-07-04 · Phase 2 (MVP Welle 1) · **Welle 1 vollständig ✅**_

Dieses Dokument enthält alle offenen Aufgaben als priorisierte Backlog-Tickets.
Jedes Ticket enthält Akzeptanzkriterien (AK), die den „Definition of Done" definieren.

---

## HOTFIX-Block 2026-07-05 (P0 fuer MVP-Langzeittest)

### TICKET-031 · Offene Layout-Feinschliffe in Sammel-Backlog fuehren

**Prioritaet:** P0  
**Beschreibung:**  
Alle weiteren UI/Layout-Aenderungen werden bis zur naechsten Umsetzungsrunde zentral als To-do gesammelt, damit nur freigegebene Layout-Eingriffe live gehen.

**Akzeptanzkriterien:**
- [ ] Offene Layout-Wuensche sind als Liste mit Ziel-Layout (Desktop/Tablet/Mobil) erfasst
- [ ] Pro Wunsch ist ein klares Soll-Verhalten inkl. Positionierung dokumentiert
- [ ] Umsetzung erfolgt erst nach expliziter Freigabe pro Ticketblock

### TICKET-032 · Einstellungen > Kontakt/Support Links aktiv schalten

**Prioritaet:** P0  
**Beschreibung:**  
Die verlinkten Hilferessourcen unter Kontakt/Support (Handbuch, Live-Tester-Guide, Testerformular) sind aktuell nicht aktiv und muessen funktional verdrahtet werden. Fuer die Beta werden separate Dokumente als saubere PDFs bereitgestellt, in einem getrennten Fenster angezeigt und als Download angeboten.

**Akzeptanzkriterien:**
- [ ] Link zu Handbuch oeffnet korrekt
- [ ] Link zum Live-Tester-Guide oeffnet korrekt
- [ ] Link zum Testerformular oeffnet korrekt
- [ ] Handbuch, Live-Tester-Guide und Testerformular liegen als PDF-Dateien vor
- [ ] PDF-Links oeffnen in einem separaten Fenster/Tab
- [ ] PDF-Dateien sind direkt herunterladbar
- [ ] Links funktionieren in Desktop/Tablet/Mobil
- [ ] Kurztest in `docs/TEST_MVP.md` dokumentiert

### TICKET-033 · Expert-Uhr im Prompter (Desktop/Tablet + separates Output-Fenster)

**Prioritaet:** P1  
**Beschreibung:**  
Im Prompter-Modus soll fuer Tier Expert eine konfigurierbare Uhr eingeblendet werden. Die Anzeige muss sowohl im normalen Prompter-Modus (Desktop/Tablet) als auch im separaten Prompter-Ausgabefenster verfuegbar sein.

**Akzeptanzkriterien:**
- [ ] Uhr ist nur sichtbar, wenn Tier = Expert
- [ ] Uhr ist im Prompter-Modus (Desktop/Tablet) sichtbar
- [ ] Uhr ist im separaten Prompter-Ausgabefenster sichtbar
- [ ] Uhr ist in den Einstellungen konfigurierbar (Position/Ein-Aus)
- [ ] Uhr beeinflusst den Scrolltext nicht und bleibt lesbar

### TICKET-034 · Vollabgleich 3 Projekte + Dokumentation vor Support-Link-Block

**Prioritaet:** P0  
**Beschreibung:**  
Vor Start des Kontakt/Support-Link-Blocks wird ein kompletter Abgleich zwischen allen drei Projekten und der Dokumentation durchgefuehrt, damit Code- und Doku-Stand konsistent sind.

**Akzeptanzkriterien:**
- [ ] Aenderungen in allen drei Projekten sind gegengeprueft und konsistent
- [ ] Relevante Doku-Dateien sind auf den aktuellen Code-Stand aktualisiert
- [ ] Offene Abweichungen sind als explizite Tickets dokumentiert
- [ ] Abgleichsergebnis ist datiert in einem Statusdokument festgehalten

### TICKET-013 · Frontend-Testharness fuer Persist-Store stabilisieren

**Prioritaet:** P0
**Beschreibung:**
`prompterStore.test.ts` scheitert aktuell im Vitest-Lauf wegen Storage/Persist-Verhalten (`setItem` auf `undefined`).

**Akzeptanzkriterien:**
- [ ] `npm run test --workspace=packages/frontend` ist komplett gruen
- [ ] `prompterStore.test.ts` laeuft stabil lokal und in CI
- [ ] Persist-Middleware wird im Testkontext korrekt gemockt oder isoliert

### TICKET-014 · MVP-LAN-Testcheckliste produktionsnah machen

**Prioritaet:** P0
**Beschreibung:**
Feste Durchfuehrungsanleitung fuer echten Langzeittest mit Usern erstellen und anwenden.

**Akzeptanzkriterien:**
- [ ] Testcheckliste dokumentiert (Startsequenz, Browser, Netzwerk, Rollback)
- [ ] Erfolgskriterien definiert (Stabilitaet, Latenz, Bedienbarkeit, Fehlerquote)
- [ ] Logging-Schema fuer Nutzerfeedback und technische Vorfaelle festgelegt

### TICKET-015 · Doku-Code-Drift kontinuierlich verhindern

**Prioritaet:** Hoch  
**Beschreibung:**  
Bestehende Doku wich vom aktuellen Teststatus ab. Es braucht einen kleinen Governance-Mechanismus.

**Akzeptanzkriterien:**
- [ ] `PROJECT_STATUS_DE.md`, `TEST_MVP.md`, `FEHLERBEHEBUNGEN.md` werden nach jedem Gate-Lauf aktualisiert
- [ ] Neue Statusberichte werden datiert unter `docs/` abgelegt
- [ ] Jeder Build-/Testlauf wird mit Datum/Uhrzeit und Ergebnis dokumentiert

### TICKET-016 · Frontend-Bundlegroesse optimieren (Vite Warning > 500 kB)

**Prioritaet:** P1  
**Beschreibung:**  
Der Frontend-Build ist erfolgreich, meldet aber eine bekannte Performance-Warnung: ein Haupt-Chunk liegt ueber dem Vite-Standardgrenzwert von 500 kB (minifiziert).  
Wichtig: Das ist **kein Laufzeitfehler** und **kein MVP-Blocker**. Die App ist betriebsbereit.  
Trotzdem ist das Thema relevant fuer Ladezeit und Reaktionsverhalten auf schwaecheren Clients, besonders bei laengeren Feldtests mit echten Nutzern.

**Warum P1 (und nicht P0):**
- Funktionale Stabilitaet und Test-Gates sind bereits gruen.
- Kein Einfluss auf Go/No-Go des MVP-LAN-Tests.
- Performance-Verbesserung hat hohen Nutzen, aber nicht die gleiche Dringlichkeit wie Betriebsfaehigkeit.

**Technische Zielrichtung:**
- Code-Splitting fuer nicht-kritische UI-Bereiche einführen (`dynamic import()`),
- optional `manualChunks` in Vite/Rollup definieren,
- grosse Abhaengigkeiten und eager Imports reduzieren,
- Messung je Schritt dokumentieren.

**Akzeptanzkriterien:**
- [ ] Build bleibt gruen (`npm run build --workspace=packages/frontend`)
- [ ] Warnung zur Chunk-Groesse ist entfernt oder nachvollziehbar reduziert
- [ ] Mindestens ein wirksamer Split ist umgesetzt (lazy geladenes Feature oder manueller Chunk)
- [ ] Vorher/Nachher-Messung dokumentiert (Chunk-Groesse minifiziert + gzip)
- [ ] Keine Regression in Frontend-Tests (`npm run test --workspace=packages/frontend`)

### TICKET-017 · Hostinger VPS als oeffentliche MVP-Variante vorbereiten

**Prioritaet:** P0  
**Beschreibung:**  
Wir sind aktuell noch in der Testphase und wollen die MVP-Version danach als oeffentliche Web-App fuer echte Nutzer bereitstellen.  
WordPress oder klassisches Shared Hosting sind fuer unseren Node/Express/WebSocket-Stack nicht passend. Die naechste realistische Public-Hosting-Variante ist ein eigener VPS, konkret Hostinger VPS, weil dort ein dauerhafter Node-Server mit WebSocket-Unterstuetzung betrieben werden kann.

**Warum diese Aufgabe wichtig ist:**
- Die App ist bereits lokal testbar und die naechsten Schritte sollen von Test zu realem Pilotbetrieb fuehren.
- Ein VPS erlaubt uns Frontend, Backend und WebSocket-Sync unter einer kontrollierten Infrastruktur zu betreiben.
- Damit koennen wir die MVP-Version fuer externe Nutzer oeffentlich erreichbar machen.

**Technische Zielrichtung:**
- Node/Express-Backend dauerhaft auf einem VPS betreiben
- WebSocket-Verbindung stabil unter einer oeffentlichen Domain bereitstellen
- Frontend und Backend mit Reverse Proxy oder aehnlicher Infrastruktur verbinden
- Deployment-Dokumentation fuer den öffentlichen Pilotbetrieb erstellen

**Akzeptanzkriterien:**
- [ ] Hostinger VPS-Plan ausgewaehlt und dokumentiert
- [ ] Public MVP-Architektur festgelegt (Domain, Frontend, Backend, WebSocket)
- [ ] `VITE_WS_URL` oder vergleichbare Konfiguration fuer externe Backend-URL umgesetzt
- [ ] Test-Deployment auf VPS erfolgreich
- [ ] Betriebsdoku fuer oeffentliche Nutzung erstellt
- [ ] Pilotbetrieb fuer echte Nutzer moeglich

### TICKET-027 · Werbekonzept fuer kostenlose Basic-Version vor Hostinger-Go-Live finalisieren

**Prioritaet:** P0
**Beschreibung:**
Vor der oeffentlichen Veroeffentlichung der Basic-Version ueber Hostinger muss das Werbe- und Upgrade-Modell verbindlich definiert sein.
Die kostenlose Version darf den Teleprompter-Betrieb nicht stoeren und der Output-only Modus muss werbefrei bleiben.

Referenz:

- `docs/BASIC_TIER_ADS_CONCEPT_DE.md`

**Akzeptanzkriterien:**
- [ ] Entscheidung dokumentiert: nur interne Upgrade-Hinweise oder zusaetzlich Sponsor-Flaechen
- [ ] Entscheidung dokumentiert, ob Upgrade-Hinweise auch im Prompter-/Output-Bild erscheinen duerfen
- [ ] Falls Prompter-/Output-Werbung erlaubt wird: nur kleine Overlay-Ebene, nicht im Scrolltext, nicht stoerend
- [ ] Professional und Expert bleiben werbefrei
- [ ] Datenschutz-/Consent-Bedarf fuer die gewaehlte Werbeform bewertet
- [ ] Hostinger-Go-Live-Dokumentation verweist auf das finale Werbemodell

### TICKET-028 · Teleprompter-Sessions isolieren (kein globales Shared State)

**Prioritaet:** P0
**Beschreibung:**
Mehrere gleichzeitige Nutzer duerfen nicht dieselbe globale Teleprompter-Instanz teilen. Steuerbefehle, Script-Updates und Settings muessen pro Session/Room getrennt sein.

**Akzeptanzkriterien:**
- [ ] WebSocket-Verbindung nutzt Session-/Room-ID (z. B. Query-Parameter)
- [ ] Backend broadcastet nur innerhalb derselben Session/Room
- [ ] Neuer Client erhaelt nur den Zustand seiner Session/Room (kein fremder Zustand)
- [ ] Output-Fenster uebernimmt beim Oeffnen dieselbe Session/Room wie Controller-Fenster
- [ ] Manuelle 2-Client-Pruefung bestaetigt: Session A beeinflusst Session B nicht

### TICKET-029 · Scroll-Stottern und Sync-Last im Livebetrieb reduzieren

**Prioritaet:** P0
**Beschreibung:**
Das Scrollen stottert unter Last. Der Sync-Fluss muss entkoppelt und die Last reduziert werden, insbesondere bei mehreren verbundenen Clients.

**Akzeptanzkriterien:**
- [ ] Output-Only-Clients senden keine Script-/Settings-/Positions-Updates zurueck
- [ ] Position-Sync wird gedrosselt (throttled/coalesced) und verursacht keine Echo-Schleifen
- [ ] CPU-Last und Netzwerknachrichten sinken messbar in Mehrclient-Szenario
- [ ] Scrollen bleibt visuell stabil bei mindestens 2 parallelen Session/Room-Instanzen
- [ ] Kurztestprotokoll in `docs/TEST_MVP.md` ergaenzt (Szenario, Ergebnis, Auffaelligkeiten)

### TICKET-030 · Sofortige Rotation offengelegter Produktions-Secrets

**Prioritaet:** P0
**Beschreibung:**
Im Support-/Ops-Chat wurden produktive Secrets sichtbar. Diese muessen unverzueglich rotiert werden, um Missbrauchsrisiken und Session-Faelschungen zu verhindern.

**Betroffene Secrets (Muss-Rotation):**
- `SUPPORT_SMTP_PASS`
- `ADMIN_API_KEY`
- `ADMIN_AUTH_JWT_SECRET`
- Klartext-Passwoerter in `ADMIN_AUTH_USERS_JSON`

**Akzeptanzkriterien:**
- [ ] Alle oben genannten Secrets sind mit neuen Werten ersetzt und sicher gespeichert.
- [ ] `/srv/saarwood_telepromter/.env.production` ist aktualisiert und Service neu gestartet.
- [ ] Bestehende Admin-Sessions/Token mit altem JWT-Secret sind ungueltig (Re-Login erzwungen).
- [ ] Support-Ticket-E2E bleibt nach Rotation gruen (`confirmationEmailSent=true`, `supportNotificationEmailSent=true`).
- [ ] Rotationszeitpunkt und verantwortliche Person sind in einem datierten Statusbericht dokumentiert.

### TICKET-018 · Restproblem Speed-Slider-Sprung (nach Langzeittest beheben)

**Prioritaet:** P0 (direkt nach Abschluss des Langzeittests)  
**Beschreibung:**  
Trotz der letzten Stabilisierung gibt es vereinzelt weiterhin beobachtete Spruenge am Speed-Slider bei Tastaturbedienung in bestimmten Laufzustaenden. Das Thema ist als bekanntes Restproblem aufgenommen und wird bewusst **nach** dem aktuellen Langzeittest gezielt abgeschlossen.

**Akzeptanzkriterien:**
- [ ] Reproduktion sauber dokumentiert (inkl. exakter Fokus-/View-/Play-Zustaende)
- [ ] Slider reagiert in allen Fokuszustaenden linear ohne Spruenge
- [ ] Keyboard-Steuerung konsistent (Left/Right) in Editor-, Split- und Prompter-View
- [ ] Kein Nebeneffekt auf Play/Pause/Stop-Hotkeys
- [ ] Regression-Tests erweitert (manuell + automatisiert, soweit sinnvoll)

### TICKET-019 · Automatische Bildschirmanpassung + Screen-Presets

**Prioritaet:** P1 (direkt nach Langzeittest)  
**Beschreibung:**  
Automatische Anpassung des Prompter-Layouts an reale Bildschirmformate (Querformat/Hochformat) weiter verfeinern. Zusaetzlich feste, auswaehlbare Screen-Presets anbieten (z. B. typische Tablet-/Monitor-Groessen), damit Operatoren reproduzierbare Ausgabeprofile waehlen koennen.

**Akzeptanzkriterien:**
- [ ] Automatische Anpassung funktioniert robust fuer Quer- und Hochformat
- [ ] 90/270 Grad Modi koennen auf verschiedenen Geraeteklassen sauber skaliert werden
- [ ] Preset-Auswahl fuer definierte Zielgeraete in Settings verfuegbar
- [ ] Presets speichern/verladen ueber bestehendes Profilsystem moeglich
- [ ] Dokumentation mit empfohlenen Presets fuer Broadcast-Workflows vorhanden
- [ ] Tablet-Strategie fuer mehr Nutzflaeche trotz Browser-UI bewertet (PWA-Install, Vollbild, optional Native-Wrapper) und als Bedienempfehlung dokumentiert
- [ ] Separates Smartphone-Layoutkonzept fuer kommende Version definiert (kleinere Headerdichte, priorisierte Controls, schnellere Einhand-Bedienung)

### TICKET-020 · Tally-Schnittstelle (On-Air/Preview Status)

**Prioritaet:** P1 (nach MVP-Langzeittest)  
**Beschreibung:**  
Anbindung einer Tally-Schnittstelle, damit der Prompter den Produktionsstatus (z. B. Program/Preview) empfangen und visuell anzeigen kann.

**Akzeptanzkriterien:**
- [ ] Technische Ziel-Schnittstelle festgelegt (z. B. HTTP, WebSocket, GPIO/Relay-Bridge)
- [ ] Eingangssignale fuer mindestens `ON_AIR` und `PREVIEW` definiert
- [ ] Visuelle Tally-Anzeige im Prompter-Output implementiert (klarer Farbindikator)
- [ ] Fallback-Verhalten bei Signalverlust definiert und dokumentiert
- [ ] Manuelle Testfaelle fuer Program/Preview-Wechsel in `TEST_MVP.md` dokumentiert

### TICKET-021 · Voice Tracking in Beta als nicht enthalten markieren und neu aufbauen

**Prioritaet:** P0
**Beschreibung:**
Voice Tracking ist im aktuellen Beta-Betrieb fuer den produktiven Ablauf nicht stabil genug und wird deshalb explizit als nicht enthalten markiert, bis ein robuster Neuaufbau abgeschlossen ist.

**Akzeptanzkriterien:**
- [ ] App-Header zeigt klaren Hinweis: Voice Tracking in Beta-Version nicht enthalten
- [ ] Nutzerhandbuch und Beschreibung dokumentieren den eingeschraenkten Beta-Status
- [ ] Offener Repro- und Fehlerkatalog fuer Voice Tracking ist in der Doku enthalten
- [ ] Neuer Stabilitaetsplan mit messbaren Kriterien (z. B. 30 Minuten fehlerfreier Lauf ohne Fehltrigger) dokumentiert
- [ ] Erst nach erfolgreichen Stabilitaetstests wird der Hinweis wieder entfernt

### TICKET-022 · Lizenz-Kill-Switch fuer Beta V1 (signierte Schluessel + Revocation)

**Prioritaet:** P0
**Beschreibung:**
Ein kontrollierbarer Lizenzmechanismus wird eingefuehrt, damit Beta-Freigaben supportseitig deaktivierbar sind.
Technische Zielarchitektur: signierte Lizenz-Tokens (Ed25519), lokale Pruefung im Client, serverseitige Revocation-Liste und optionaler Generation-Kill-Switch (`beta_generation`).

**Akzeptanzkriterien:**
- [ ] Lizenzdatenmodell definiert (`lic_id`, `tier`, `expires_at`, `grace_offline_until`, `beta_generation`)
- [ ] Backend-Endpunkt `/api/license/status` implementiert
- [ ] Revocation fuer einzelne `lic_id` und ganze `beta_generation` moeglich
- [ ] Frontend zeigt klaren Lizenzstatus (aktiv/abgelaufen/gesperrt/offline-grace)
- [ ] Offline-Gnadenfrist ist technisch umgesetzt und dokumentiert
- [ ] Kein geheimer Privatschluessel im Frontend/Electron-Bundle enthalten

### TICKET-023 · Admin-/Support-Workflow fuer Lizenzausgabe und Sperrung

**Prioritaet:** P0
**Beschreibung:**
Interner Support-Prozess fuer Ausgabe, Sperrung und Ersetzung von Lizenzschluesseln aufsetzen.
Minimalstart mit internem CLI oder Admin-Endpunkten, spaeter optional als kleines Web-Adminpanel.

**Akzeptanzkriterien:**
- [ ] Interner Prozess "Lizenz erstellen" dokumentiert
- [ ] Interner Prozess "Lizenz sperren" dokumentiert
- [ ] Notfallprozess fuer 72h-Emergency-Lizenz dokumentiert
- [ ] Audit-Log fuer Ausgabe/Sperrung mit Timestamp und Operator vorhanden
- [ ] Runbook fuer Supportfaelle (Geraetewechsel, Verlust, Missbrauch) vorhanden

### TICKET-032 · Teleprompter-Runbook mit finalen Cross-Repo-Verweisen stabil halten

**Prioritaet:** P1
**Beschreibung:**
Nach der Repo-Trennung muessen Support-/Lizenz-Runbooks im Teleprompter-Projekt die gueltigen Schwester-Repositories und klare Zustaendigkeiten enthalten.

**Akzeptanzkriterien:**
- [x] `SUPPORT_LICENSE_RUNBOOK_DE.md` enthaelt finale Cross-Repo-Verweise
- [ ] Cross-Repo-Links werden quartalsweise auf Erreichbarkeit geprueft
- [ ] Repo-Zustaendigkeiten bleiben in Runbooks und README konsistent

### TICKET-024 · Public MVP Rollout (Internet + Offline) verbindlich umsetzen

**Prioritaet:** P0
**Beschreibung:**
Bestehende Strategie fuer oeffentlichen Internet-Betrieb und Offline-Nutzung in eine umsetzbare Betriebsstrecke ueberfuehren.

**Akzeptanzkriterien:**
- [ ] Hostinger VPS Zielsetup final (Domain, TLS, Reverse Proxy, Node-Prozessmanager)
- [ ] WebSocket unter oeffentlicher Domain stabil getestet
- [ ] Deployment-Runbook fuer Public MVP erstellt
- [ ] Electron-Offline-Betrieb als offizieller Fallback dokumentiert
- [ ] Abnahme-Checkliste fuer Go-Live (Health, Lizenzstatus, WS, Rollback) erstellt

### TICKET-025 · In-App Supportkontakt, Chat und Tickets (operator-only)

**Prioritaet:** P0
**Beschreibung:**
Support-Zugang direkt in der App (Kontakt, Chat, Ticketformular), ohne Einfluss auf Prompter-Output oder Laufzeit-Performance.

**Akzeptanzkriterien:**
- [ ] Support-Bereich im Settings-Panel vorhanden
- [ ] Kontakt-E-Mail und Chat-Link konfigurierbar via Backend-Env
- [ ] Ticket-Erstellung via API-Endpunkt erfolgreich
- [ ] Ticket wird serverseitig gespeichert und optional per Webhook weitergeleitet
- [ ] Ticket-ID ist zentral fortlaufend und supportfaehig (z. B. `SWD-YYYY-XXXXXX`)
- [ ] Output-Only-View (`?view=prompter&output=1`) bleibt frei von Support-UI

### TICKET-026 · Plattform-Baukasten fuer mehrere Apps (API + Events)

**Prioritaet:** P1
**Beschreibung:**
Die Plattform soll aus mehreren Apps bestehen, die zentral auf der Hauptwebsite beworben werden, aber technisch als entkoppelte Services laufen und Daten standardisiert austauschen.

**Akzeptanzkriterien:**
- [ ] API-Vertrag fuer app-uebergreifende Calls dokumentiert (`/api/v1/...`)
- [ ] Event-Vertrag fuer Kernereignisse dokumentiert (z. B. `ticket.created`, `script.updated`)
- [ ] Service-zu-Service-Auth-Standard festgelegt (API-Key/JWT)
- [ ] Keine direkte DB-Kopplung zwischen Apps (nur API/Event)
- [ ] Rollout-Schema fuer getrennte App-Server (www + app-subdomains/-paths) dokumentiert

### Ausgegliederte Saarwood-Projekte

Die oeffentliche Saarwood-Hauptseite und das zentrale Adminpanel werden nicht mehr im Teleprompter-Backlog weitergefuehrt.

- Die Hauptseite lebt in einem eigenen Repo fuer `saarwood.ch`.
- Das Adminpanel-MVP lebt in einem eigenen Repo fuer interne Saarwood-Operationen.
- Dieses Backlog bleibt auf Teleprompter-, Plattform- und Betriebsaufgaben des Monorepos fokussiert.

### TICKET-031 · Smartphone-Design und Layout-Strategie zuerst neu definieren

**Prioritaet:** P0
**Beschreibung:**
Smartphone-Layouts sollen bewusst anders geloest werden als Tablet- und Desktop-Layouts. Ziel ist eine schlankere, einhandfreundliche Bedienung mit klarer Priorisierung der wichtigsten Controls und weniger visueller Dichte.

**Akzeptanzkriterien:**
- [ ] Smartphone-spezifisches Layoutkonzept dokumentiert
- [ ] Priorisierte Bedienelemente fuer kleine Screens festgelegt
- [ ] Tablet-Regeln werden nicht blind auf Smartphone uebertragen
- [ ] Eine klare Design-Richtung fuer mobile Einhand-Bedienung definiert
- [ ] Umsetzungsschritte fuer den naechsten UI-Release beschrieben

---

## Phase 1 — CI & Qualitätsgates (abgeschlossen)

### TICKET-001 · CI-Workflow einrichten ✅

**Status:** Erledigt  
**Beschreibung:** GitHub Actions Workflow `ci.yml` für alle PRs und Pushes auf `main`.

**Akzeptanzkriterien:**
- [x] Workflow läuft bei jedem Push und PR auf `main`/`master`
- [x] Schritte: install → type-check → lint → test → build (frontend + backend)
- [x] CI schlägt fehl, wenn TypeScript-Fehler, Lint-Fehler, Tests fehlschlagen oder Build scheitert

---

### TICKET-002 · ESLint einrichten (Frontend + Backend) ✅

**Status:** Erledigt  
**Beschreibung:** ESLint v10 mit typescript-eslint v8 und react-hooks-Plugin konfigurieren.

**Akzeptanzkriterien:**
- [x] ESLint v10 + typescript-eslint v8 in beiden Paketen als devDependency
- [x] Flat-Config (`eslint.config.js` / `eslint.config.mjs`) in beiden Paketen
- [x] `--max-warnings 0` – keine Warnungen toleriert
- [x] `npm run lint` läuft fehlerfrei in beiden Paketen
- [x] 0 bekannte Security-Schwachstellen in ESLint-Dependencies

---

## Phase 2 — Produktionsreife Kernsystem

### TICKET-003 · ASR-Steuerung im UI aktivieren ✅

**Status:** Erledigt  
**Priorität:** Hoch  
**Tier:** Basic → Professional  
**Beschreibung:**  
`useSpeechTracking` ist implementiert und vollständig im UI aktivierbar.
`speechEnabled` wird aus dem Store gelesen und an `useSpeechTracking` übergeben.

**Akzeptanzkriterien:**
- [x] Neues Toggle „Voice tracking" im SettingsPanel (nur sichtbar wenn `speechService.isSupported`)
- [x] State in Zustand-Store: `speechEnabled: boolean` (persistiert in localStorage)
- [x] `charsPerPixel` wird korrekt berechnet (per Canvas-Font-Metrics: `ctx.measureText`)
- [x] Bei aktiviertem ASR: Prompter scrollt automatisch mit der gesprochenen Position
- [x] "Last-device-in-control"-Konvention bleibt aktiv (kein Überschreiben für 2 s nach manueller Eingabe)
- [x] Browser-Hinweis, wenn Web Speech API nicht verfügbar (z. B. Firefox)

---

### TICKET-004 · MOS-Integration vertiefen

**Priorität:** Mittel  
**Tier:** Professional  
**Beschreibung:**  
MOS-Handshake und Running-Order-Empfang sind implementiert. Die empfangenen Stories werden
jedoch noch nicht ins Segment-Modell überführt und im Editor/Prompter angezeigt.

**Akzeptanzkriterien:**
- [ ] `MOS_UPDATE`-WebSocket-Nachricht wird im Frontend zu konkreten `ScriptSegment`-Einträgen gemappt
- [ ] Empfangene MOS-Stories erscheinen als Segmente im Editor
- [ ] Hot-Update während des Scrollens: neue Segmente erscheinen ohne Scroll-Unterbrechung
- [ ] `mosItemId` in `ScriptSegment` wird beim MOS-Import korrekt gesetzt
- [ ] MOS-Verbindungsstatus wird im ControlPanel oder SettingsPanel angezeigt (verbunden / getrennt)
- [ ] Integrationstest: MOS-Simulator schickt `mosROCreate` → Segmente erscheinen im Editor

---

### TICKET-005 · Presenter-Profile UI vervollständigen

**Priorität:** Mittel  
**Tier:** Professional  
**Beschreibung:**  
Presenter-Profile sind im Store implementiert und im SettingsPanel abrufbar. Die Aktualisierung
eines bestehenden Profils (Überschreiben ohne Duplikat) ist noch nicht direkt im UI möglich.

**Akzeptanzkriterien:**
- [ ] Bestehendes Profil kann überschrieben werden (per Name oder Auswahl)
- [ ] Profil-Auswahl im SettingsPanel ist alphabetisch sortiert
- [ ] Löschen eines aktiven Profils setzt `activeProfileId` korrekt zurück
- [ ] Unit-Tests für saveProfile (neues Profil, Überschreiben, Löschen) vorhanden

---

## Phase 2 — MVP Welle 1 (Basic Tier, auslieferbar)

### TICKET-006 · MVP-Scope Welle 1 finalisieren ✅

**Status:** Erledigt (dokumentiert in `docs/BRAINSTORMING_2026-07-04.md`)  
**Priorität:** P0  
**Tier:** Basic  
**Beschreibung:**  
Definition des MVP-Scopes für Welle 1: welche Features kommen rein, welche werden zurückgestellt.

**Akzeptanzkriterien:**
- [x] Brainstorming-Protokoll erstellt (`docs/BRAINSTORMING_2026-07-04.md`)
- [x] MVP-Feature-Tabelle mit Tier-Zuordnung dokumentiert
- [x] Rotation als P0-Feature explizit im MVP verankert
- [x] Hotkey-Manager als P0-Feature definiert
- [x] Ingest-API als P1-Feature definiert
- [x] Nicht-MVP-Features (MOS tief, NDI produktiv, Redundanz, ST 2110) klar abgegrenzt

---

### TICKET-007 · Text-Rotation (0°/90°/180°/270°) implementieren

**Priorität:** P0 — MVP-Pflichtfeature  
**Tier:** Basic  
**Beschreibung:**  
Physische Teleprompter-Gläser werden in verschiedenen Winkeln montiert. Der Text muss auf
GPU-Ebene drehbar sein — zusammen mit dem bestehenden H/V-Mirror. Alle vier Transformationen
(Mirror H, Mirror V, Rotation) werden kombiniert als ein einziger CSS-`transform`-Aufruf auf
dem Viewport ausgeführt, damit kein Reflow entsteht.

**Akzeptanzkriterien:**
- [x] `DisplaySettings.rotation: 0 | 90 | 180 | 270` im Typen-System
- [x] Standard-Wert: `rotation: 0`
- [x] Store persistiert `rotation` in localStorage
- [x] `PrompterDisplay`: kombinierter GPU-Transform `rotate(Xdeg) scale(sx, sy)`
- [x] Rotation-Buttons im ControlPanel (◀ Rotate −90°, ▶ Rotate +90°)
- [x] Hotkeys `[` (−90°) und `]` (+90°) über HotkeyManager
- [x] Mirror und Rotation gleichzeitig nutzbar (korrekte Transform-Reihenfolge)

---

### TICKET-008 · Hotkey-Manager implementieren

**Priorität:** P0 — MVP-Pflichtfeature  
**Tier:** Basic  
**Beschreibung:**  
Broadcast-Regie arbeitet primär ohne Maus. Ein zentraler Hotkey-Manager als Singleton-Service
löst den bestehenden ad-hoc `keydown`-Handler in `App.tsx` ab und bietet Context-Awareness
(kein Feuern wenn Tiptap-Editor Fokus hat), erweiterbare Bindings und Last-device-in-control.

**Akzeptanzkriterien:**
- [x] `HotkeyManager`-Service (`packages/frontend/src/services/HotkeyManager.ts`)
- [x] `useHotkeyManager`-Hook für React-Integration
- [x] Bestehender `keydown`-Handler in `App.tsx` durch Hook ersetzt
- [x] Default-Bindings: Space (Play/Pause), ↑/↓ (Speed), R (Reset), M (Mirror H), F (Fullscreen), Esc (Stop), `[`/`]` (Rotation)
- [x] Context-Check: keine Hotkeys wenn `isContentEditable`, `INPUT`, `TEXTAREA` aktiv
- [x] Jede Aktion feuert `prompter:manual-control`-Event (Last-device-in-control)
- [x] `enable()` / `disable()` für externen Kontext-Switch

---

### TICKET-009 · Ingest-API `/api/v1/ingest` bauen

**Priorität:** P1  
**Tier:** Basic  
**Beschreibung:**  
Das Backend öffnet einen REST-Endpunkt für automatisierten Content-Ingest via n8n/ClickUp-Webhooks.
Eingehende Payloads werden per Zod-Schema validiert und als WebSocket-`SCRIPT_UPDATE`-Message
an alle verbundenen Clients gebroadcastet (Hot-Update ohne Scroll-Unterbrechung).

**Akzeptanzkriterien:**
- [x] `POST /api/v1/ingest` implementiert
- [x] Zod-Validierung: `targetProfileId`, `slotKey`, `rawText` (required); `source`, `priority` (optional)
- [x] API-Key-Auth via `Authorization: ****** (Key aus `INGEST_API_KEY` env-Variable)
- [x] Erfolg: `{ ok: true, segmentId: "uuid" }` mit HTTP 201
- [x] Fehler: strukturierter JSON-Error mit HTTP 400/401/422
- [x] `priority: "breaking"` löst sofortigen WebSocket-Broadcast aus
- [x] Integrationstest: POST → WebSocket-Clients empfangen `SCRIPT_UPDATE`

---

## Phase 3 — Broadcast-Integration

### TICKET-010 · NDI Native Addon anbinden

**Priorität:** Niedrig  
**Tier:** Expert  
**Beschreibung:**  
`NativeNdiAdapter` versucht `require('ndi-sdk-node')`, fällt auf Stub zurück.
Dieser Ticket beschreibt den Weg zur echten NDI-Ausgabe.

**Akzeptanzkriterien:**
- [ ] Pflichtenheft für NDI-Addon erstellt (welche NDI SDK API-Funktionen werden benötigt)
- [ ] `ndi-sdk-node` (node-gyp Wrapper) evaluiert oder eigenes Addon geskaffoldet
- [ ] `NativeNdiAdapter.init()` startet einen echten NDI Sender (verifiziert mit NDI Tools Monitor)
- [ ] `NativeNdiAdapter.sendFrame()` sendet BGRA-Frames mit korrektem PTS
- [ ] Graceful Fallback zu Stub wenn Addon nicht geladen werden kann (bleibt bestehen)
- [ ] `/api/ndi/status` liefert `available: true` wenn Addon aktiv

---

### TICKET-011 · Redundanz-Sync implementieren

**Priorität:** Niedrig  
**Tier:** Expert  
**Phase:** 3 (Broadcast-Integration) — **bewusst aus MVP Welle 1 herausgenommen**

> **Scope-Entscheidung (@saarnews, 2026-07-04):**  
> Redundanz ist ein Expert-Feature für mehrstufigen Broadcast-Betrieb (Hauptregie + Backup-Maschine).  
> Welle 1 = eine einzelne Teleprompter-Instanz. Failover wird für MVP nicht benötigt.  
> Typen (`RedundancyState`) bleiben als Vorarbeit erhalten, werden aber in Welle 1 nicht produktiv genutzt.

**Beschreibung:**  
`RedundancyState` (primary/backup/standalone) ist im Store modelliert.
Die Synchronisierungslogik zwischen zwei Instanzen via WebSocket ist noch nicht implementiert.

**Akzeptanzkriterien:**
- [ ] Backend: neuer Endpunkt `POST /api/peer` zum Verbinden mit einer Peer-Instanz
- [ ] `SYNC_STATE` wird vom Primary regelmäßig (alle 100 ms) an den Backup gesendet
- [ ] Backup-Instanz übernimmt Scroll-Position und Skript-Stand vom Primary
- [ ] Failover: wenn Primary unerreichbar, Backup übernimmt Steuerung ohne manuellen Eingriff
- [ ] Heartbeat-Timeout konfigurierbar via `REDUNDANCY_TIMEOUT_MS` Environment-Variable
- [ ] Redundanz-Status im ControlPanel sichtbar (Rolle + Sync-Zustand)

---

### TICKET-012 · Betriebsdokumentation ergänzen

**Priorität:** Niedrig  
**Tier:** Alle  
**Beschreibung:**  
Für den On-Premise-Betrieb in Redaktionen fehlt eine Betriebsdokumentation.

**Akzeptanzkriterien:**
- [ ] `docs/OPERATIONS.md`: Systemanforderungen, Installationsschritte, Umgebungsvariablen
- [ ] Docker-Compose-Beispiel für lokalen Broadcast-Betrieb (Backend + statisches Frontend)
- [ ] Monitoring-Hinweise: Health-Endpunkt `/api/health`, Log-Ausgaben, Neustart-Strategie
- [ ] Bekannte Limitierungen (NDI, ST 2110, Browser-ASR) klar benannt

---

### TICKET-013 · CEA-708 Caption Export implementieren

**Priorität:** Niedrig  
**Tier:** Expert  
**Phase:** 3 (Broadcast-Integration) — **bewusst aus MVP Welle 1 herausgenommen**

> **Scope-Entscheidung (@saarnews, 2026-07-04):**  
> Welle 1 = Teleprompter als eigenständiges Display (kein direkter Sendeketten-Anschluss).  
> CEA-708 ist ein Broadcast-Untertitel-Standard — für das MVP-Szenario nicht erforderlich.  
> Ein vollständiger Encoder (Bit-Packing, Window-Management, SCC/MCC-Format) kostet ~1–2 Tage → sprengt Welle-1-MVP.  
> Typ-Interfaces `Cea708Packet` / `Cea708PenStyle` bleiben als Vorarbeit in `packages/frontend/src/types/index.ts`.

**Beschreibung:**  
Aktuell sind nur Typ-Interfaces vorhanden. Für den Einsatz in der Sendekette
wird ein vollständiger CEA-708-Encoder mit API-Endpunkt und Frontend-Download benötigt.

**Akzeptanzkriterien:**
- [ ] `POST /api/v1/export/cea708` im Backend (Encoder: Bit-Packing, Window-Management)
- [ ] Ausgabeformat: SCC oder MCC (konfigurierbar)
- [ ] Frontend-UI: „Export Captions"-Button im Editor oder ControlPanel (nur Expert-Tier sichtbar)
- [ ] Datei-Download im Browser (`.scc` / `.mcc`)
- [ ] Zeitsynchronisation mit Scroll-Position (PTS-Berechnung auf Basis Scroll-Speed)
- [ ] Integrationstest: Script → Export → valides SCC-Dateiformat

---

## Backlog-Verwaltung

| ID          | Titel                                    | Phase | Priorität | Tier         | Status       |
|-------------|------------------------------------------|-------|-----------|--------------|--------------|
| TICKET-001  | CI-Workflow einrichten                   | 1     | ✅ Fertig  | Alle         | ✅ Erledigt  |
| TICKET-002  | ESLint einrichten                        | 1     | ✅ Fertig  | Alle         | ✅ Erledigt  |
| TICKET-003  | ASR-Steuerung im UI aktivieren           | 2     | ✅ Fertig  | Basic+Prof   | ✅ Erledigt  |
| TICKET-004  | MOS-Integration vertiefen                | 2     | Mittel    | Professional | 🔲 Offen     |
| TICKET-005  | Presenter-Profile UI vervollständigen    | 2     | Mittel    | Professional | 🔲 Offen     |
| TICKET-006  | MVP-Scope Welle 1 finalisieren           | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-007  | Text-Rotation (0°/90°/180°/270°)         | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-008  | Hotkey-Manager implementieren            | 2     | P0        | Basic        | ✅ Erledigt  |
| TICKET-009  | Ingest-API `/api/v1/ingest`              | 2     | P1        | Basic        | ✅ Erledigt  |
| TICKET-010  | NDI Native Addon anbinden                | 3     | Niedrig   | Expert       | 🔲 Offen     |
| TICKET-011  | Redundanz-Sync implementieren            | 3     | Niedrig   | Expert       | 🔲 Offen (Phase 3) |
| TICKET-012  | Betriebsdokumentation ergänzen           | 3     | Niedrig   | Alle         | 🔲 Offen     |
| TICKET-013  | CEA-708 Caption Export                   | 3     | Niedrig   | Expert       | 🔲 Offen (Phase 3) |
| TICKET-016  | Frontend-Bundlegroesse optimieren        | 2     | P1        | Alle         | 🔲 Offen     |
| TICKET-017  | Hostinger VPS public MVP vorbereiten     | 3     | P0        | Alle         | 🔲 Offen     |
| TICKET-022  | Lizenz-Kill-Switch Beta V1               | 3     | P0        | Alle         | 🔲 Offen     |
| TICKET-023  | Admin-/Support-Lizenzprozess             | 3     | P0        | Alle         | 🔲 Offen     |
| TICKET-024  | Public MVP Rollout Internet + Offline    | 3     | P0        | Alle         | 🔲 Offen     |
| TICKET-025  | In-App Supportkontakt + Chat + Tickets   | 3     | P0        | Alle         | 🔲 Offen     |
| TICKET-026  | Plattform-Baukasten API + Events         | 3     | P1        | Alle         | 🔲 Offen     |
