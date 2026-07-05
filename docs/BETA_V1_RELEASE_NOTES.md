# Saarwood Teleprompter — Beta V1 Release Notes

**Version:** 1.0.0-beta.1  
**Release date:** 2026-07-04  
**Status:** Public Beta — alle Funktionen freigeschaltet  

---

## Was ist die Beta V1?

Die Beta V1 ist die erste offiziell benannte und nach außen freigebbare Version des **Saarwood Teleprompters**.

Sie bündelt alle MVP-Features aus den drei Tiers (Basic / Professional / Expert) in einer einzigen, vollständig freigeschalteten Version. Ziel ist ein ausgiebiger **Langzeittest mit echten Nutzern** unter realen Sendebedingungen, um Fehler, Usability-Probleme und Performance-Engpässe zu identifizieren.

---

## Neue Funktionen in Beta V1

| Feature | Status |
|---------|--------|
| **BETA V1 Badge** im App-Header | ✅ Neu |
| **Alle Tiers vollständig freigeschaltet** (Expert als Standard) | ✅ Neu |
| App-Titel: `Saarwood Teleprompter — Beta V1` | ✅ Neu |
| PWA-Name: `Saarwood Teleprompter Beta` | ✅ Neu |
| Version 1.0.0-beta.1 in allen Paketen | ✅ Neu |
| **Electron Desktop App** (macOS .dmg, Windows .exe, Linux AppImage) | ✅ Neu |
| **Capacitor Android** (APK / AAB via Android Studio) | ✅ Neu |

---

## Vollständiger Feature-Umfang (Beta V1)

### Basic-Tier (Content Creator / Education)
- ✅ Cross-Platform PWA — installierbar auf Windows, macOS, iOS, Android
- ✅ Offline-Betrieb (Workbox PWA Cache)
- ✅ Hardware-beschleunigtes Scrollen (CSS Compositor + rAF, 60/120 fps)
- ✅ Rich-Text-Editor (Fett, Kursiv, Unterstrichen, Farbe) — LTR Latin
- ✅ Horizontal- und Vertikal-Spiegel (CSS transform)
- ✅ Hardware-beschleunigte Rotation 0°/90°/180°/270° (GPU Compositor)
- ✅ Dark Mode (Director/Editor-UI)
- ✅ WebSocket Remote Control (Smartphone, Tablet, Bluetooth-Pedal-Relay)
- ✅ Voice Tracking (Web Speech API, automatisches Scrollen zum gesprochenen Wort)
- ✅ Einstellbarer Cue-Marker
- ✅ Tastaturkürzel: Space=Play/Pause, Esc=Stop, ↑/↓=Speed, [/]=Rotation
- ✅ Moderator-Einstellungen (Schriftgröße, Familie, Farben, Zeilenhöhe) mit localStorage-Persistenz

### Professional-Tier (Regionaler Broadcast)
- ✅ MOS Protocol v2.8.5 (TCP/XML, Profile 0 Heartbeat + Profile 2 Running Order)
- ✅ Hot-Update während Scrollen (Tiptap → Zustand → rAF, kein Scroll-Unterbruch)
- ✅ Cloak Text (Segment für Moderator ausblenden)
- ✅ Director's Notes (ASR überspringt markierte Segmente)
- ✅ Moderator-Profile (Named Presets speichern/anwenden/löschen)

### Expert-Tier (Enterprise Broadcast)
- ✅ A/B-Redundanz-Architektur (Primary/Backup/Standalone mit SYNC_STATE)
- ✅ NDI-Abstraktionsschicht (StubNdiAdapter + Shell für Native Addon)
- ✅ SMPTE ST 2110 Bereitschaftshaken (Hardware-Schnittstelle offen)
- ✅ CEA-708 Caption-Typdefinitionen (Encoder-Export vorbereitet)
- ✅ Last-device-in-control (manuelle Eingabe unterdrückt ASR 2 s)
- ✅ On-Premise-ASR-Adapter-Interface (Whisper.cpp / Vosk / DeepSpeech kompatibel)

---

## Installation (als PWA — auf jedem Gerät installierbar)

### Desktop (Chrome / Edge)
1. App im Browser öffnen
2. Adressleiste: **„Installieren"**-Symbol (⊕) klicken
3. Dialogbox bestätigen → App erscheint auf dem Desktop / Startmenü

### iOS (Safari)
1. App in Safari öffnen
2. Teilen-Symbol antippen → **„Zum Home-Bildschirm"**
3. App erscheint auf dem Home-Bildschirm und läuft im Standalone-Modus

### Android (Chrome)
1. App in Chrome öffnen
2. Banner oder Menü → **„Zum Startbildschirm hinzufügen"**
3. App im Standalone-Modus installiert

### Hinter eigenem Server (On-Premise)
```bash
# Build
npm run build

# Backend starten (produziert Frontend aus packages/frontend/dist)
NODE_ENV=production APP_TIER=expert node packages/backend/dist/server.js
```

---

## Bekannte Einschränkungen

| # | Einschränkung | Priorität |
|---|--------------|-----------|
| B-01 | JS-Bundle 619 kB (minif.) / 199 kB (gzip) — Code-Splitting geplant | Niedrig |
| B-02 | Echte NDI-Ausgabe nur mit NDI-SDK-Native-Addon (nicht im Beta-Scope) | Offen |
| B-03 | SMPTE ST 2110 erfordert dedizierte Hardware | Architektur-Entscheidung |
| B-04 | Web Speech API nicht in allen Browsern verfügbar (Firefox, Safari eingeschränkt) | Bekannt |

---

## Feedback & Bug-Reporting

Alle Fehler, Wünsche und Beobachtungen aus dem Beta-Test werden in der Datei  
📄 `docs/TEST_MVP.md` mit Datum und Uhrzeit protokolliert.

Detaillierte Tester-Anleitung: `docs/BETA_TESTER_GUIDE.md`
