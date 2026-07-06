# Google Search Console Checkliste fuer Saarwood

## Ziel

Saarwood soll fuer Google und andere Suchmaschinen sauber auffindbar, indexierbar und als Marke konsistent dargestellt sein.

## Vorbereitungen

- Die oeffentliche Hauptdomain festlegen: `saarwood.ch`
- Die Produktdomain festlegen: `teleprompter.saarwood.ch`
- Weitere kuenftige App-Subdomains nach demselben Muster einplanen
- Sicherstellen, dass jede oeffentliche Seite ein klares `title`, `description`, `canonical` und ein sichtbares Impressum/Datenschutz hat

## Reihenfolge

### 1. Property in Search Console anlegen

1. Google Search Console oeffnen.
2. Neue Property mit dem Domain-Typ anlegen.
3. Zuerst `saarwood.ch` anlegen.
4. Danach `teleprompter.saarwood.ch` als eigene Property anlegen, falls die Subdomain separat bewertet werden soll.

### 2. Domain verifizieren

1. Die von Google ausgegebene DNS-TXT-Record-Anweisung kopieren.
2. TXT-Record beim DNS-Provider von `saarwood.ch` eintragen.
3. Verifizierung in Search Console erneut pruefen.
4. Erst weitergehen, wenn die Property bestaetigt ist.

### 3. Sitemap einreichen

1. In der Property fuer `teleprompter.saarwood.ch` die Sitemap einreichen.
2. Sitemap-URL verwenden:
   - `https://teleprompter.saarwood.ch/sitemap.xml`
3. Wenn spaeter eine Hauptseiten-Sitemap vorhanden ist, auch diese einreichen.

### 4. Indexierung pruefen

1. Home-URL pruefen.
2. Einzelne wichtige Seiten mit "URL-Pruefung" testen.
3. Falls noetig, Indexierung anfordern.
4. Im Coverage-/Indexbericht auf Fehler, Ausschluesse und Doppelungen achten.

### 5. Inhalte fuer gute Sichtbarkeit

- Eindeutiger Seitentitel mit Marke und Produktname
- Praezise Beschreibung mit Nutzungskontext
- Oeffentliche Seiten fuer Impressum und Datenschutz
- Keine versehentlichen `noindex`-Tags auf oeffentlichen Seiten
- Canonical-URL auf die saubere Haupt-URL setzen

### 6. Wiederkehrende Pflege

- Nach neuen Releases Sitemap bei Bedarf aktualisieren
- Search Console regelmaessig auf Crawling-Fehler pruefen
- Neue Apps/Subdomains nach demselben Schema eintragen
- Marken- und Copy-Hinweise zentral halten, damit Saarwood konsistent erscheint

## Kurzfassung fuer den Betrieb

1. Domain-Property anlegen.
2. DNS verifizieren.
3. Sitemap einreichen.
4. Indexierung pruefen.
5. Fuer neue Apps dieselbe Routine wiederholen.
