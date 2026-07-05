# Saarwood Teleprompter — Native App Guide

**Version:** Beta V1 (1.0.0-beta.1)  
**Stand:** 2026-07-04

Dieser Leitfaden beschreibt, wie du den Saarwood Teleprompter als native installierbare App für **macOS**, **Windows** und **Android** erzeugst.

---

## Übersicht der Plattformen

| Plattform | Methode | Ausgabe | Status |
|-----------|---------|---------|--------|
| **macOS** (Intel + Apple Silicon) | Electron | `.dmg` + `.app.zip` | ✅ Bereit |
| **Windows** 10/11 x64 | Electron | NSIS `.exe` Installer | ✅ Bereit |
| **Linux** x64 | Electron | `.AppImage` + `.deb` | ✅ Bereit |
| **Android** (Tablet + Smartphone) | Capacitor | `.apk` / `.aab` | ✅ Bereit |
| **iOS / iPadOS** | PWA (Safari) | Zum Home-Bildschirm | ✅ Sofort nutzbar |

---

## Teil 1 — macOS Desktop App (Electron, .dmg)

### Was ist das?

Der Saarwood Teleprompter wird in ein vollständiges macOS-Anwendungspaket eingebettet.  
Das Ergebnis ist eine eigenständige `.app`-Datei, die als `.dmg` ausgeliefert wird — ohne Browser, ohne Serverstart-Wissen.

Die App startet beim Öffnen automatisch den Backend-Server (WebSocket, API) im Hintergrund und öffnet das Teleprompter-Frontend in einem Electron-Fenster.

### Voraussetzungen

- **macOS** 12 (Monterey) oder neuer (für den Build-Vorgang)
- **Node.js** ≥ 22
- **npm** ≥ 10
- Für Apple Silicon + Intel Universal Binary: macOS Ventura oder neuer mit Xcode CLI-Tools (`xcode-select --install`)
- Für App-Notarisierung (für Weitergabe an Dritte): Apple Developer Account + App-spezifisches Passwort

### Build-Schritte

```bash
# 1. Repository klonen und Dependencies installieren
npm install

# 2. Frontend + Backend + Electron-Wrapper kompilieren
npm run electron:build
# Entspricht: npm run build (Frontend + Backend) + tsc (Electron)

# 3. macOS-Installer erzeugen (Universal Binary: Intel x64 + Apple Silicon arm64)
npm run electron:dist:mac
```

Ausgabe (nach erfolgreichem Build):
```
packages/electron/dist-app/
├── Saarwood Teleprompter-1.0.0-beta.1-universal.dmg   ← Installer
└── Saarwood Teleprompter-1.0.0-beta.1-universal-mac.zip
```

### Installation auf dem Mac

1. `.dmg`-Datei öffnen
2. App-Symbol auf das Programme-Verzeichnis (`/Applications`) ziehen
3. App aus `Programme` starten

> **Erster Start ohne Notarisierung:**  
> macOS zeigt ggf. eine Warnung „nicht verifizierten Entwickler". Einmalige Freigabe:  
> Systemeinstellungen → Datenschutz & Sicherheit → Trotzdem öffnen

### Code-Signierung und Notarisierung (für Weitergabe)

Für die offizielle Weitergabe über den Mac App Store oder als direkt herunterladbares `.dmg` muss die App code-signiert und bei Apple notarisiert werden.

```bash
export APPLE_ID="deine@apple-id.email"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"   # App-spezifisches Passwort (appleid.apple.com)
export APPLE_TEAM_ID="XXXXXXXXXX"                           # Apple Team ID (developer.apple.com)

npm run electron:dist:mac
```

Electron Builder notarisiert automatisch, wenn diese Umgebungsvariablen gesetzt sind.

---

## Teil 2 — Windows Desktop App (Electron, NSIS-Installer)

### Voraussetzungen

- **Windows** 10/11 x64 oder **macOS/Linux** mit Wine (Cross-Build)
- Node.js ≥ 22
- npm ≥ 10

### Build-Schritte

```bash
# Auf Windows:
npm install
npm run electron:dist:win
```

Ausgabe:
```
packages/electron/dist-app/
└── Saarwood Teleprompter Setup 1.0.0-beta.1.exe   ← NSIS-Installer
```

Der Installer erlaubt dem Nutzer, den Installationspfad zu wählen, erstellt Desktop- und Startmenü-Verknüpfungen und fügt einen Deinstaller hinzu.

---

## Teil 3 — Linux Desktop App (AppImage / .deb)

```bash
npm install
npm run electron:dist:linux
```

Ausgabe:
```
packages/electron/dist-app/
├── Saarwood Teleprompter-1.0.0-beta.1.AppImage   ← Portable (kein Install nötig)
└── saarwood-teleprompter_1.0.0-beta.1_amd64.deb
```

Das AppImage ist portabel und ohne Installation ausführbar:
```bash
chmod +x "Saarwood Teleprompter-1.0.0-beta.1.AppImage"
./"Saarwood Teleprompter-1.0.0-beta.1.AppImage"
```

---

## Teil 4 — Android App (Capacitor, APK / AAB)

### Was ist das?

Die bestehende PWA wird mit **Capacitor** in ein natives Android-Projekt eingebettet.  
Capacitor erzeugt ein vollständiges Android Studio-Projekt mit einer nativen App-Shell, die den Web-Content lädt — entweder offline (gebundelte Dist) oder von einem lokalen Backend.

Das Ergebnis ist eine installierbare `.apk`-Datei oder ein `.aab`-Bundle für den Google Play Store.

### Voraussetzungen

- **Android Studio** (neueste stabile Version) mit Android SDK 34+
- **Node.js** ≥ 22
- **JDK** 17 oder neuer
- Ein physisches Android-Gerät oder AVD (Emulator)

### Build-Schritte

```bash
# 1. Dependencies installieren (enthält @capacitor/core, @capacitor/android, @capacitor/cli)
cd packages/frontend
npm install

# 2. Frontend bauen
npm run build

# 3. Android-Projekt initialisieren (einmalig)
npx cap add android

# 4. Gebaute Dist-Dateien mit dem Android-Projekt synchronisieren
npx cap sync android

# 5. Android Studio öffnen
npx cap open android
```

### APK in Android Studio erzeugen

1. Android Studio öffnet sich mit dem Capacitor-Projekt (`packages/frontend/android/`)
2. Warten bis Gradle-Sync abgeschlossen
3. Menü: **Build → Generate Signed Bundle / APK…**
4. APK auswählen → Key-Store anlegen oder bestehenden verwenden
5. Release-Variant auswählen → Build starten
6. APK befindet sich in `android/app/build/outputs/apk/release/`

### APK über Befehlszeile (CI/CD)

```bash
cd packages/frontend/android
./gradlew assembleRelease
```

Ausgabe: `app/build/outputs/apk/release/app-release.apk`

### App auf Gerät installieren

```bash
# Via ADB (USB-Debugging aktiviert)
adb install app/build/outputs/apk/release/app-release.apk
```

### Modus: Offline vs. Live-Backend

Die Capacitor-Konfiguration (`capacitor.config.ts`) unterstützt zwei Modi:

**Offline-Modus (Standard):**  
Die gebauten Frontend-Dateien (`dist/`) werden direkt in die App eingebettet.  
WebSocket/API-Calls funktionieren nur, wenn ein Backend im gleichen Netzwerk läuft.

**Live-Backend-Modus (LAN):**  
In `capacitor.config.ts` die `server.url` auskommentieren und auf die Backend-IP zeigen:
```typescript
server: {
  url: 'http://192.168.1.100:4000',
  cleartext: true,
}
```
Dann: `npx cap sync android` → APK neu bauen.

---

## Teil 5 — PWA (sofort installierbar, kein Build nötig)

Die App ist bereits jetzt ohne zusätzlichen Build-Schritt auf **allen Plattformen installierbar** — als Progressive Web App (PWA).

### macOS / Windows / Linux — Chrome / Edge

1. App im Browser öffnen
2. Adressleiste: **Installieren**-Symbol klicken (⊕ oder Computer-Icon)
3. Dialog bestätigen → App erscheint auf dem Desktop / im Startmenü
4. App startet im Standalone-Modus (kein Browser-Chrome)

### iOS / iPadOS — Safari

1. App in Safari öffnen
2. Teilen-Symbol → **Zum Home-Bildschirm**
3. App erscheint auf dem Home-Bildschirm, läuft im Standalone-Modus

### Android — Chrome

1. App in Chrome öffnen
2. Banner oder Menü (⋮) → **App installieren** / **Zum Startbildschirm hinzufügen**
3. App im Standalone-Modus installiert, Netzwerk-Icon im App-Drawer

---

## Teil 6 — Electron-App-Konfiguration (Desktop-Modus)

Beim Start der Electron-App werden folgende Umgebungsvariablen automatisch gesetzt:

| Variable | Wert im Desktop-Modus | Beschreibung |
|----------|-----------------------|--------------|
| `NODE_ENV` | `production` | Frontend aus `dist/` bereitstellen |
| `APP_TIER` | `expert` | Alle Features freigeschaltet |
| `PORT` | `4000` | Backend-Port |
| `ENABLE_MOS` | `false` | MOS deaktiviert (kein NRCS im Desktop-Betrieb) |
| `ENABLE_NDI` | `false` | NDI deaktiviert (Stub, kein nativer Adapter) |
| `FRONTEND_DIST` | `<resources>/frontend` | Absoluter Pfad zur gebauten Frontend-Dist |

MOS und NDI können bei Bedarf vom Nutzer manuell aktiviert werden, indem die Electron-App als CLI mit gesetzten Umgebungsvariablen gestartet wird.

---

## Teil 7 — Projektstruktur (native Apps)

```
saarwood_telepromter/
├── packages/
│   ├── frontend/               ← React PWA
│   │   ├── capacitor.config.ts ← Android-Konfiguration
│   │   └── android/            ← Android Studio Projekt (nach cap add android)
│   ├── backend/                ← Node.js Control-Server
│   └── electron/               ← Electron Desktop-Wrapper
│       ├── src/main.ts         ← Electron Hauptprozess
│       ├── electron-builder.yml← Build-Konfiguration (DMG, NSIS, AppImage)
│       └── build/
│           └── entitlements.mac.plist ← macOS Berechtigungen
└── package.json                ← Root: electron:dist:mac / electron:dist:win
```

---

## FAQ

**Muss ich für jede Plattform separat bauen?**  
Ja. macOS-Builds (.dmg) können nur auf macOS erzeugt werden (Apple-Signierung).  
Windows-Builds können auf Windows oder mit Wine auf macOS/Linux erzeugt werden.  
Android-Builds benötigen Android Studio (Android SDK).

**Funktioniert die Electron-App ohne Internetverbindung?**  
Ja. Die gesamte App (Frontend + Backend) läuft lokal. Es ist keine Internetverbindung erforderlich.

**Kann ich im Electron-Desktop-Modus MOS aktivieren?**  
Ja. Starte die App mit:
```bash
ENABLE_MOS=true APP_TIER=expert Saarwood\ Teleprompter.app/Contents/MacOS/Saarwood\ Teleprompter
```

**Wird die Electron-App automatisch aktualisiert?**  
In Beta V1: Nein. Auto-Update über GitHub Releases ist in der Konfiguration vorbereitet (auskommentiert in `electron-builder.yml`) und kann in einem zukünftigen Release aktiviert werden.

---

_Dokumentiert: 2026-07-04 · Version: 1.0.0-beta.1_
