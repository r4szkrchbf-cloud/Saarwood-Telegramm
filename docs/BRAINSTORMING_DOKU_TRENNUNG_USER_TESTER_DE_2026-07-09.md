# Brainstorming - Doku-Trennung User/Tester

Stand: 2026-07-09

## 1. Zielsetzung

Die drei sichtbaren Beta-Dokumente werden neu geordnet, damit:

1. oeffentliche Nutzer nur nutzerrelevante Inhalte sehen,
2. externe Tester ein eigenes, praxisnahes Testdokument erhalten,
3. interne Informationen nicht mehr in oeffentlichen Dokumenten auftauchen.

Wichtige Leitentscheidung aus dem Brainstorming:

- Interne Inhalte bleiben in einem separaten Technik-Handbuch.
- Fuer die sichtbare Produktflaeche gelten nur zwei Ebenen:
  - Oeffentliche User
  - Externe Tester

## 2. Ausgangslage (Quellenbasis)

Bestehende Hauptdokumente:

- docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md
- docs/BETA_TESTER_GUIDE.md
- docs/TESTERFORMULAR_BETA_V1_DE.md

Relevante Betriebs-/Linkquellen:

- docs/HOSTINGER_PUBLIC_BETA_SUPPORT_CONCEPT_DE.md
- docs/APP_ZUGRIFF_DE.md

Aktueller Implementierungsstand laut Git:

- c54acee: Smartphone-Lock stabilisiert, Raum-Metriken erweitert
- 0f9e239: Smartphone-UI-Hardening
- 55fc0e5, 9adfa6b: Smartphone-Hochkantregeln und Hostinger-Sync

Aktuelle oeffentliche App-Basis:

- URL: https://teleprompter.saarwood.ch
- Support-Dokumente/Formular sind als externe Links vorgesehen (neues Fenster)

## 3. Neue Dokumentenlogik

### 3.1 Ebene A - Oeffentliche User

Zieldatei:

- docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md

Enthaelt:

- Onboarding (Start, Ansichten, Grundbedienung)
- Nutzung auf Desktop/Tablet/Smartphone
- klares Smartphone-Verhalten (nur Hochkant)
- PWA-Speicherung und Basis-Offlinehinweise
- einfache Import/Export-Nutzung aus Anwendersicht
- Support-Zugang (wo finde ich Hilfe)

Enthaelt nicht:

- interne Architekturdetails
- Admin-/Lizenz-Runbook-Schritte
- detaillierte Fehlerdiagnose und Debug-Workflows
- betriebliche Sicherheits- oder Secret-Hinweise

### 3.2 Ebene B - Externe Tester

Zieldatei:

- docs/BETA_TESTER_GUIDE.md

Enthaelt:

- Testablauf in klaren Testrunden
- reproduzierbare Testfaelle mit Erwartungswerten
- Pflichtlauf fuer Minimalabnahme
- klares Meldeschema fuer Befunde

Enthaelt nicht:

- interne Teamprozesse
- technische Betriebsinterna (Deploy, Secrets, Admin-Key)
- interne Eskalationskommandos

### 3.3 Separat intern - Technik-Handbuch

Neue interne Zieldatei (nicht fuer oeffentliche Links):

- docs/TECHNIK_HANDBUCH_INTERNAL_DE.md

Enthaelt:

- Betriebsarchitektur, Deploy-Pfade, Recovery
- Admin-/Lizenzbetrieb, Sicherheitsprozesse
- Monitoring, Incident-Playbooks, Diagnosebefehle
- interne Rollen, Verantwortung, Eskalation

Regel:

- Diese Datei wird nicht aus der User-App als oeffentlicher Hilfelink angeboten.

## 4. Testerformular als interaktives Dokument

Zieldatei fuer Inhaltsschema:

- docs/TESTERFORMULAR_BETA_V1_DE.md

Ziel in der App:

- Interaktive Eingabemaske unter fester URL (z. B. /apps/teleprompter/test-form)
- Felder direkt ausfuellbar
- Absenden an Backend-Endpunkt
- druckfreundliche Ansicht

Pflichtfelder im Formular:

1. Testerprofil (Geraet, Browser, Installationsart)
2. Testszenario (View-Modus, Room-Kontext)
3. Befundstruktur (Was gut, was fehlerhaft, Reproduktion)
4. Schweregrad
5. Einwilligung zur Rueckfrage

## 5. Technisches Zielbild fuer interaktiv + druckbar

Nicht als statische Einzel-PDF-Logik aufbauen, sondern als wartbare Quellstruktur:

1. Handbuch und Tester-Guide aus Markdown rendern
2. Testerformular aus strukturierter Formular-Definition rendern
3. Alle drei Inhalte in neuen Fenstern oeffnen
4. Druckansicht ueber Browser-Print (oder PDF-Export) bereitstellen
5. Formular-Submit an API mit Ticket-/Feedbackspeicherung

Empfohlene Routen:

- /apps/teleprompter/docs/handbuch
- /apps/teleprompter/docs/tester-guide
- /apps/teleprompter/test-form

Bestehende Env-Links fuer Support koennen darauf zeigen:

- SUPPORT_HANDBOOK_URL
- SUPPORT_TESTER_GUIDE_URL
- SUPPORT_TESTER_FORM_URL

## 6. Konkreter Inhaltsvorschlag je Dokument

### 6.1 Nutzerhandbuch - kuerzen und enttechnisieren

Behalten:

- Start und Bedienung
- Smartphone-Regeln
- typische Workflows
- kurze FAQ

Verschieben ins interne Technik-Handbuch:

- Support/Admin-Hinweise mit Betriebscharakter
- Revocation-Detailprozesse
- tiefe Integrations-/Systemdetails

### 6.2 Tester-Guide - fokussieren

Behalten:

- strukturierte Checklisten
- erwartete sichtbare Resultate
- Pflichtlauf fuer externe Tester

Reduzieren:

- reine interne Verweise und Entwicklernaehe
- Teaminterne Uebergabewege

### 6.3 Testerformular - produktiv ausrichtbar machen

Behalten:

- klare, kurze Feldlogik
- Freitext fuer Kontext
- Schweregrad

Ergaenzen:

- Pflichtfeldkennzeichnung
- Einreichungsstatus nach Submit
- druckbare Zusammenfassung nach Absenden

## 7. Naechster Schritt im Brainstorming

Zur Freigabe in der naechsten Runde:

1. Finales Inhalts-Delta pro Datei (Was raus, was bleibt)
2. Festlegung der oeffentlichen Links
3. Entscheidung, ob interne Datei im Repo bleibt oder in privates Repo wandert
4. Start der Umsetzungsphase fuer interaktive Dokumentseiten und Formularroute

## 8. Matrix pro Dokument (bleibt/raus/verschieben)

Baseline fuer diese Matrix:

- Oeffentliche App auf Hostinger (teleprompter.saarwood.ch)
- aktueller Git-Stand: c54acee
- Smartphone-Regel aktiv: Hochkantbetrieb, reduzierte Smartphone-UI

### 8.1 Datei: docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md

| Bereich | Bleibt (oeffentlich) | Raus aus User-Handbuch | Wohin verschieben |
| --- | --- | --- | --- |
| Start/Bedienung | View-Modi, Play/Pause, Speed, Reset, Prompter-Fenster, PWA | keine | - |
| Smartphone | Hochkantpflicht, reduzierte Buttons, Bedienlogik mobil | technische Begruendung auf Render-/State-Ebene | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Sync/Rooms | Room-ID fuer Mehrgeraete, Praxisbeispiele fuer Links | serverseitige Room-State-Details, WS-Owner-Logik | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Import/Export | Benutzernahe Beispiele, zulassige Formate | tiefe Feld- und Parserdetails, Integrationshinweise fuer Redaktionssysteme | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Lizenz/Offline | kurze Anwenderinfo: wann online/offline moeglich | Revocation-/Schluessel-/Policy-Details fuer Admins | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Support | Wo Hilfe, welche Links oeffnen im neuen Fenster | interne Triage-/Eskalationsprozesse | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |

### 8.2 Datei: docs/BETA_TESTER_GUIDE.md

| Bereich | Bleibt (externe Tester) | Raus aus externem Guide | Wohin verschieben |
| --- | --- | --- | --- |
| Testsetup | Geraet/Browser/Netzwerk/Tier als Testkontext | interne Infrastrukturannahmen | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Funktionstests | Editor/Prompter/Sync/Output-only mit Erwartungswerten | interne Debug- oder Entwicklerabkuerzungen | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Mobile | Smartphone-Hochkanttest und UI-Erwartung | Implementierungsdetails zum Lock-Mechanismus | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Performance | reproduzierbare Lasttests aus Nutzersicht | technische Profiler-/Diagnoseanweisungen | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Support/Lizenz | testerrelevante End-to-End-Pruefungen | interne Admin-Workflows und Secrets | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Ergebnisuebergabe | klare Struktur fuer Befunduebergabe | teaminterne Prozess- oder Toolpflichten | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |

### 8.3 Datei: docs/TESTERFORMULAR_BETA_V1_DE.md

| Bereich | Bleibt (interaktiv/fillable) | Raus aus Formular | Wohin verschieben |
| --- | --- | --- | --- |
| Stammdaten | Testerprofil, Geraet, Browser, Installation, Netzwerk | interne Kennungen oder Admin-Infos | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Testkontext | View-Modus, getestete Funktionen, Room-Kontext | technische Tiefenanalysefelder | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Befundkern | Was gut, was fehlerhaft, Reproduktionsschritte, Erwartung | lange Freitext-Essays ohne Struktur | im Guide als Verweis auf Kurzformat halten |
| Priorisierung | Schweregrad (Blocker/Hoch/Mittel/Niedrig) | interne SLA-/Incident-Codes | docs/TECHNIK_HANDBUCH_INTERNAL_DE.md |
| Einwilligung | Rueckfrage erlaubt ja/nein | DSGVO-Interndetails | separate oeffentliche Datenschutzhinweis-Seite |

## 9. Konkrete Redaktionsregeln ab jetzt

1. User-Handbuch bleibt strikt nutzerorientiert, ohne interne Betriebs- oder Sicherheitsdetails.
2. Externer Tester-Guide bleibt testorientiert, ohne Team-/Developer-Interna.
3. Testerformular bleibt kurz und strukturiert; Detaildiagnose gehoert nicht ins Formular.
4. Interne Inhalte werden ausschliesslich im separaten Technik-Handbuch gepflegt.
5. Alle drei oeffentlichen Ressourcen werden in separaten Fenstern geoeffnet und druckbar gehalten.

## 10. Sofort umsetzbare naechste Redaktionsrunde

1. Nutzerhandbuch: Kapitel fuer Kapitel markieren mit Tags `[BLEIBT]`, `[RAUS]`, `[INTERN]`.
2. Tester-Guide: Checklisten auf externen Bedarf kuerzen, interne Hinweise entfernen.
3. Testerformular: in finale Feldstruktur fuer UI-Formular ueberfuehren (Pflichtfelder + Submit-Feedback).

## 11. Interne Merkpunkte (nicht oeffentlich)

Diese Punkte bleiben intern und werden nicht in den oeffentlichen User-Dokumenten gezeigt:

1. Smartphone-Variante: Vorlagenkarte und Editor-Steuerkarte als spaeteres Feature einklappbar machen.
2. Support-Chat ist aktuell ein Platzhalter und wird erst nach separater Freigabe aktiv geschaltet.
3. Voice-Tracking wird kontrolliert und stufenweise freigeschaltet, nicht als oeffentlich zugesagte Sofortfunktion kommunizieren.
4. Support-Notiz fuer Pilotbetrieb und Basic-Werbemodell-Hinweise bleiben intern (nicht im User-Handbuch).

