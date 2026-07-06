# Werbekonzept Basic-Tier (kostenlose Version)

_Stand: 2026-07-06_

## 1. Ziel

Vor der oeffentlichen Hostinger-Veroeffentlichung muss fuer die kostenlose Basic-Version klar definiert sein,
wie Werbung, Hinweise auf Upgrades und Sponsor-/Partnerflaechen eingebunden werden duerfen,
ohne den Teleprompter-Betrieb oder den Output zu stoeren.

Grundsatz:

- Werbung darf nur die kostenlose Basic-Version betreffen.
- Professional und Expert bleiben werbefrei.
- Die Prompter-Ausgabe selbst darf nicht mit Werbung ueberdeckt oder technisch beeintraechtigt werden.
- Output-only View (`?view=prompter&output=1`) bleibt komplett werbefrei.

## 2. Produktregeln

### 2.1 Was als Werbung zaehlt

Folgende Elemente gelten im Kontext der Basic-Version als Werbung oder Upgrade-Kommunikation:

- Hinweisflaechen fuer Upgrade auf Professional / Expert
- Hinweise auf Saarwood-Partner oder Sponsoren
- Verlinkte Feature-Hinweise fuer Zusatzprodukte
- Kontextbanner fuer Hosting / Support / Upgrade

### 2.2 Was nicht erlaubt ist

Nicht erlaubt in der Basic-Version:

- Pop-ups waehrend laufendem Scrollbetrieb
- Werbung innerhalb des Prompter-Textes
- Werbung im Output-only Modus
- Audio-/Video-Autoplay
- Externe Werbenetzwerke, die Timing, Layout oder Stabilitaet des Teleprompters beeinflussen
- Tracking-Skripte, die den Renderpfad des Prompter-Outputs verlangsamen

## 3. Platzierungskonzept

### 3.1 Erlaubte Zonen

Werbe- oder Upgrade-Hinweise duerfen nur in den Bedienoberflaechen erscheinen:

- Header / App-Randbereich
- Settings / Info-Bereich
- Editor-Seitenbereich
- Leere Zustandsflaechen, z. B. wenn noch keine Vorlage ausgewaehlt ist

### 3.2 Verbotene Zonen

Werbe- oder Upgrade-Hinweise duerfen nicht erscheinen:

- im Prompter-Output
- auf dem zweiten Monitor / Vollbild-Output
- ueber Cue-Marker oder laufendem Scripttext
- in Notfall-/Fehlerdialogen, die schnellen Betrieb betreffen

## 4. Empfohlenes MVP-Modell fuer Hostinger

Empfohlen wird fuer die erste Public-Basic-Version ein sehr kontrolliertes Modell:

### Stufe A - nur Eigenhinweise

- Keine Drittanbieter-Werbenetzwerke
- Nur interne Saarwood-Hinweise:
  - Upgrade auf Professional
  - Upgrade auf Expert
  - Hinweis auf Support / Hosting / Enterprise-Version

Vorteile:

- kein externer Scriptballast
- besserer Datenschutz
- keine Abhaengigkeit von Ad-Netzwerken
- geringeres Risiko fuer Render- oder Layoutprobleme

### Stufe B - optionale Sponsor-Flaechen spaeter

Erst nach stabiler Public-Beta pruefen:

- statische Sponsor-Flaechen in Basic
- nur bild- oder textbasierte, lokal kontrollierte Banner
- kein Real-Time-Ad-Bidding
- keine aggressiven Tracker

## 5. Technische Leitlinien

### 5.1 Tier-Steuerung

Werbeflaechen muessen strikt an das Tier gekoppelt sein:

- `basic`: Werbung / Upgrade-Hinweise moeglich
- `professional`: keine Werbung
- `expert`: keine Werbung

### 5.2 Rendering-Regeln

- Werbe-Hinweise nur ausserhalb von `PrompterDisplay`
- Keine Werbe-Elemente innerhalb des Scrollcontainers
- Keine Werbe-Requests pro Frame oder pro Editor-Update
- Keine Layout-Verschiebung in ControlPanel oder Output waehrend Play

### 5.3 Hostinger / Public-Beta-Regeln

Vor Hostinger-Go-Live muss definiert sein:

- ob nur interne Upgrade-Hinweise oder bereits Sponsor-Flaechen aktiv sind
- welche Texte und Links gezeigt werden
- ob Cookies / Consent erforderlich sind
- wie Datenschutz und Impressum darauf verweisen

## 6. UX-Regeln

- Werbung in Basic muss klar als Hinweis oder Upgrade-Flaeche erkennbar sein
- Werbung darf Bedienwege nicht blockieren
- Werbung muss schliessbar oder dauerhaft dezent sein, wenn sie Platz wegnimmt
- kein visuelles Flackern
- kein automatisches Nachladen mitten im Betrieb

Empfohlen fuer Beta:

- kleine statische Upgrade-Karte im Editor oder in den Einstellungen
- klare Aussage: "Kostenlose Basic-Version" / "Werbefrei ab Professional"

## 7. Dokumentationsfolgen

Wenn das Konzept umgesetzt wird, muessen mindestens diese Dokumente nachgezogen werden:

- `docs/HOSTINGER_PUBLIC_BETA_SUPPORT_CONCEPT_DE.md`
- `docs/PROJECT_STATUS_DE.md`
- `docs/SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md`
- `docs/BETA_V1_RELEASE_NOTES.md`
- `docs/BACKLOG.md`

## 8. Entscheidung fuer die naechste Phase

Empfehlung fuer die Veroeffentlichung ueber Hostinger:

1. Basic-Version startet ohne Drittanbieter-Werbenetzwerke.
2. Es werden nur interne Upgrade-/Produkt-Hinweise verwendet.
3. Prompter-Output und Output-only View bleiben vollstaendig werbefrei.
4. Sponsor-/Partnerflaechen werden erst nach stabiler Public-Beta gesondert freigegeben.

## 9. Offene Entscheidungen

Vor der finalen Public-Basic-Freigabe noch klaeren:

- Soll Basic nur Upgrade-Hinweise zeigen oder auch Sponsor-Flaechen?
- Brauchen wir Cookie-/Consent-Mechanik fuer spaetere Werbeformen?
- Welche Flaechen im Editor/Settings sind dafuer final freigegeben?
- Ob "Projekt-/Sendungsname" und Werbehinweise gleichzeitig sichtbar sein duerfen oder getrennt behandelt werden sollen.
