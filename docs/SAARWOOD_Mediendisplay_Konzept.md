# SAARWOOD Mediendisplay Konzept

Stand: 2026-07-09
Status: Brainstorming zusammengefuehrt
Entscheidungstendenz: Separate App (SAARWOOD_MedienDisplay)

## 1) Ausgangslage

Das bestehende Teleprompter-Produkt bietet bereits eine starke Basis:

- Steuerlogik
- Session-Denke
- Output-Fenster
- Echtzeit-Sync

Ziel ist ein eigener Medienanzeiger fuer Praesentationen, Bilder und Videos.

## 2) Zusammenfassung des bisherigen Brainstormings

### 2.1 Fruehe Idee: Display-Modus als Zusatzfunktion

Vorteile:

- Schnellster Start
- Nutzung der bestehenden Architektur
- Niedrigeres Umsetzungsrisiko

### 2.2 Hybrid-Gedanke

- Kurzfristig als Zusatzfunktion integrieren
- Mittelfristig intern modular trennen
- Langfristig optional als zweite App auskoppeln

### 2.3 Aktuelle Entscheidung (Owner-Entscheid)

Klare Ausrichtung: **Getrennte App**.

- Bestehenden Teleprompter als Grundlage klonen
- Hauptordner fuer neues Produkt: `saarwood_MedienDisplay`
- Teleprompter-spezifische Funktionen entfernen
- Medienanzeige-spezifische Funktionen fokussieren

## 3) Medienformate fuer Version 1 (MVP)

### 3.1 Praesentationen

- Primaer: PDF
- Optional spaeter: PPTX-Import mit serverseitiger Konvertierung nach PDF oder Bildfolgen
- Begruendung: PDF ist stabil, plattformunabhaengig und layout-treu

### 3.2 Bilder

- PNG
- JPG
- WEBP
- Optional: SVG mit Vorsicht (je nach Komplexitaet/Performance)

### 3.3 Videos

- Primaer: MP4 (H.264 Video + AAC Audio)
- Optional: WebM (VP9/Opus)
- Fuer MVP vermeiden: MKV, AVI, HEVC-only ohne Fallback

## 4) Kernlogik der neuen MedienDisplay-App

- Medienbibliothek
- Szenenliste/Playlist
- Anzeige-Modus (Fullscreen/Output)
- Steuerung: Play, Pause, Next, Previous, Jump, Blackout
- Output-Only-Clients (TV, Beamer, HDMI-Displays)
- Safe-Boot/Fallback fuer problematische TV-Browser (keine Schwarz/Weiss-Seiten)

## 5) Was aus dem Teleprompter entfernt werden soll

- Script-Editor
- Prompt-Scroll-Logik
- Prompt-spezifische Einstellungen
- Prompt-spezifische UI-Bloecke

## 6) Was als Shared Core erhalten bleiben soll

- Auth
- Session-Handling
- Device-Pairing
- Echtzeit-Sync
- Fehler-/Fallback-Handling

## 7) Kommunikation zwischen Teleprompter und MedienDisplay

Empfehlung: Schlanke API/Schnittstelle statt gemeinsamer UI.

Moegliche Events/Commands:

- LOAD_MEDIA
- PLAY
- PAUSE
- NEXT
- PREVIOUS
- JUMP
- BLACKOUT

## 8) Produktvorteile der Trennung

- Klarere Positionierung je Produkt
- Weniger UI-Komplexitaet je App
- Getrennte Roadmaps
- Unabhaengige Store-Strategien moeglich

## 9) Workflow-Dokumentation aus dem Chat

Ja, der Chat kann in den Workflow uebernommen werden.

Sinnvolle Struktur pro Arbeitsblock:

- Entscheidungen
- Offene Punkte
- Naechste Schritte
- Verantwortliche

## 10) Naechster Umsetzungsrahmen (3 Phasen)

### Phase 1: Clone und Bereinigung

- Repo/Ordner klonen
- Produktname, Titel, Branding umstellen
- Teleprompter-spezifische Teile entfernen

### Phase 2: MVP MedienDisplay

- Upload/Verwaltung fuer PDF/Bilder/MP4
- Playlist/Szenensteuerung
- Stabiler Output-Modus

### Phase 3: API-Kopplung

- Optionale Teleprompter <-> MedienDisplay Kommunikation
- Gemeinsames Protokoll fuer Remote-Commands

---

Hinweis: Dieses Dokument ist die konsolidierte Brainstorming-Fassung aus dem laufenden Chat-Workflow.
