# Saarwood Teleprompter - Leitfaden App-Veroeffentlichung in Stores

Stand: 2026-07-09  
Autor: GitHub Copilot (GPT-5.3-Codex) mit manuelangel

Dieser Leitfaden beschreibt den operativen Weg, die bestehende Web-App in folgende Stores zu bringen:

- Google Play Store (Android)
- Apple App Store (iOS)
- Microsoft Store (Windows)

Ziel ist ein wiederholbarer Release-Ablauf ohne kompletten Native-Neubau.

---

## 1) Architektur-Entscheidung pro Store

### Android
- Ansatz: Trusted Web Activity (TWA) mit Bubblewrap.
- Vorteil: Direkte Nutzung der bestehenden Web-App mit nativer Store-Auslieferung.

### Apple
- Ansatz: Capacitor iOS Wrapper (WKWebView).
- Hinweis: Reine PWA ist fuer den klassischen App-Store-Upload nicht ausreichend.

### Microsoft
- Ansatz: PWA-Einreichung ueber Microsoft Partner Center.
- Vorteil: Sehr nah am Web-Stack, geringer Umbau.

---

## 2) Gemeinsame Voraussetzungen (alle Stores)

- HTTPS produktiv stabil verfuegbar.
- Valides Web App Manifest (Name, Icons, Start-URL, Display, Theme).
- Service Worker robust (inkl. Fallback, keine Blank-Screens).
- App Icons und Splash Assets in den benoetigten Groessen vorhanden.
- Rechtstexte/Store-Texte vorbereitet:
	- Datenschutzerklaerung
	- Impressum/Anbieterkennzeichnung
	- Support-Kontakt
- Versionierungsregel definiert (SemVer + Release Notes).

---

## 3) Android - Google Play Store (TWA)

### 3.1 Technischer Ablauf
1. Android Packaging mit Bubblewrap initialisieren.
2. App-ID, Name, Start-URL und Icon-Set konfigurieren.
3. Digital Asset Links auf der Domain bereitstellen (Domain-Verifikation).
4. AAB bauen und signieren.
5. Upload in Google Play Console (intern -> closed/open test -> production).

### 3.2 Pflicht-Checks vor Upload
- Startseite laedt ohne weisse/schwarze Seite.
- Offline-/Fehlerfall zeigt Fallback-Hinweis.
- Deep-Link/Start-URL zeigt in die korrekte App-Route.
- Datenschutz- und Datennutzungsformular in Play Console korrekt gepflegt.

### 3.3 Abnahme (Done)
- Interner Testlauf auf mindestens 2 Android-Geraeten gruen.
- Closed-Test mit Testgruppe erfolgreich.
- Release Notes und Rollback-Plan dokumentiert.

---

## 4) Apple - App Store (Capacitor iOS)

### 4.1 Technischer Ablauf
1. iOS-Projekt mit Capacitor erzeugen/synchronisieren.
2. iOS-Bundle-ID, App-Name, Icons, Splash, Berechtigungen pflegen.
3. WKWebView-Start und Fallbacks fuer API-/Netzwerkfehler absichern.
4. Build und Archive in Xcode.
5. Einreichung ueber App Store Connect und TestFlight.

### 4.2 Apple-spezifische Punkte
- Klarer App-Mehrwert ueber reine Website-Wrapping-Darstellung hinaus dokumentieren.
- Alle angefragten Berechtigungen fachlich begruenden.
- Support-URL, Datenschutz-URL und Metadaten konsistent halten.

### 4.3 Abnahme (Done)
- TestFlight Build stabil auf iPhone und iPad.
- Kein kritischer Startfehler im First-Run.
- App Store Connect Metadaten vollstaendig.

---

## 5) Microsoft Store - PWA

### 5.1 Technischer Ablauf
1. PWA-Tauglichkeit pruefen (Manifest, SW, installierbar).
2. App-Listing im Partner Center anlegen.
3. Store-Metadaten, Alterseinstufung und Datenschutzangaben ausfuellen.
4. Paket/Einreichung finalisieren und Freigabeprozess durchlaufen.

### 5.2 Pflicht-Checks vor Einreichung
- Installierbarkeit unter Windows ohne Fehler.
- App startet aus dem Startmenue stabil.
- Aktualisierungen werden korrekt uebernommen.

### 5.3 Abnahme (Done)
- Store-Eintrag veroeffentlicht.
- Install/Start/Update auf mindestens einem Referenzsystem verifiziert.

---

## 6) Release-Reihenfolge (empfohlen)

1. Android zuerst (schnellster valider Store-Pfad mit TWA).
2. Microsoft parallel oder direkt danach (PWA-nah).
3. Apple danach mit eigener Review-Pufferzeit.

Begruendung: Schnellster Nutzwert bei gleichzeitigem Lernen fuer spaetere iOS-Einreichung.

---

## 7) Operative Checkliste pro Release-Welle

1. Code Freeze fuer Store-Branch.
2. Build + Smoke-Test + Store-spezifischer Testlauf.
3. Metadaten und rechtliche Inhalte aktualisieren.
4. Submission an Ziel-Store.
5. Review-Rueckmeldungen tracken und zeitnah beheben.
6. Go-Live dokumentieren (Version, Datum, Owner, bekannte Einschraenkungen).

---

## 8) Rollen und Verantwortlichkeiten

- Product Owner: Priorisierung, Store-Textfreigaben, Go/No-Go.
- Tech Owner: Build, Signierung, technische Submission.
- QA: Store-spezifische Testlaeufe und Freigabeprotokoll.
- Support: Vorbereitung von FAQ und Kontaktwegen nach Go-Live.

---

## 9) Risiken und Gegenmassnahmen

- Risiko: Store-Review Ablehnung wegen unklarer App-Mehrwerte.
	- Gegenmassnahme: Feature-Nutzen klar beschreiben, Testscreenshots und Nutzungsszenarien sauber darstellen.
- Risiko: Startfehler auf aelteren Geraeten/Browsern.
	- Gegenmassnahme: Safe-Boot/Fallbacks und Error-Overlay verbindlich.
- Risiko: Uneinheitliche Datenschutzaussagen.
	- Gegenmassnahme: Eine zentrale, versionierte Datenschutzquelle nutzen.

---

## 10) Verknuepfte Tickets und Dokus

- Backlog-Ticket: TICKET-039 in `docs/BACKLOG.md`
- TV-Kompatibilitaet: TICKET-038 in `docs/BACKLOG.md`
- Zentrale Auto-Roadmap: `docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md`
- Governance-Status: `docs/PROJEKTSTATUS_AUTOMATISCH_DE.md`

