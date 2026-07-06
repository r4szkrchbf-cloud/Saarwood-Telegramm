# Saarwood Unified Admin, SEO & Public Discovery Roadmap

## Zielbild

SAARwooD soll als zentrale Marke auf `saarwood.ch` einheitlich auftreten. Alle heutigen und kuenftigen Apps, Subdomains und Operator-Flows sollen unter einem gemeinsamen Marken- und Admin-Konzept sichtbar sein.

Markenstil:

- `SAAR` gross und rot
- `woo` klein und weiss
- `D` gross und rot

## Was bereits umgesetzt ist

- Die Teleprompter-App ist crawlbar und indexierbar vorbereitet.
- Die SAARwooD-Hauptseite kann als eigenes Brand-Landingpage-Layout unter `saarwood.ch` oder `www.saarwood.ch` ausgespielt werden.
- `robots.txt` und `sitemap.xml` sind vorhanden.
- Basis-SEO-Metadaten sind gesetzt.
- Admin-Lizenzfunktionen sind bereits ueber geschuetzte API-Endpunkte verfuegbar.
- Die Support- und Lizenz-Runbooks sind dokumentiert.

## Was der Nutzer erreichen will

- Google soll die App finden und indexieren.
- SAARwooD soll auf allen Subdomains und kuenftigen Apps eine einheitliche Markenstruktur haben.
- Es soll ein zentrales Adminpanel geben, statt nur API-Aufrufe.
- Impressum, Datenschutz und Copy-Hinweise sollen klar verankert sein.
- Smartphone-Layouts sollen zuerst separat gedacht werden, statt Tablet- und Desktop-Regeln blind zu uebertragen.

## Empfohlene Zielarchitektur

### 1. Oeffentliche Hauptseite

- `https://saarwood.ch/` als Marken- und Produktlandeseite.
- Enthalt:
  - Produktuebersicht
  - Impressum
  - Datenschutz
  - Kontakt
  - App-Verweise
  - Status / Release-Hinweise

### 2. Zentrales Adminpanel

Empfohlene Zieloptionen. Beide Varianten sind freigegeben und sollen langfristig konsistent bleiben:

- `https://saarwood.ch/admin`
- `https://admin.saarwood.ch`

Empfehlung fuer die technische Umsetzung:

- ein gemeinsames Admin-Frontend
- rollenbasierte Authentifizierung
- API-Backends fuer alle Saarwood-Produkte
- einheitliche Audit-Logs
- zentrale Lizenz-, Support- und Freigabefunktionen

### 3. Einheitliches Brand-/Copy-System

- einheitliche Schreibweise: `SAARwooD`
- einheitliche Produktnamen fuer alle Apps
- Copy-Hinweise und Branding-Texte zentral pflegen
- Links zu Impressum/DSGVO in jeder App-Footer-Leiste

### 4. SEO-Basis

- Canonical-URLs pro Produktseite
- Robots + Sitemap pro Hauptdomain
- strukturierte Daten je Produkt
- Search Console fuer Hauptdomain und ggf. Subdomains
- Verifikation der Sitemap-Einreichung

## Fahrplan

### Phase 0: Smartphone-Design zuerst

1. Fuer Smartphones eigene Layout-Loesungen definieren, statt Tablet-Regeln zu 1:1 uebernehmen.
2. Headerdichte, Button-Groessen und Informationsprioritaet fuer Einhand-Bedienung neu auslegen.
3. Erst danach Tablet-Feinschliff und Desktop-Polish iterativ weiterziehen.

### Phase 1: Sofort umsetzen

1. Die Teleprompter-App mit der Marken-/SEO-Basis live halten.
2. Die Google Search Console fuer `saarwood.ch` und `teleprompter.saarwood.ch` vorbereiten.
3. Sitemap einreichen.
4. Impressum- und Datenschutzlinks in der Plattformdoku final verankern.

### Phase 2: Zentrales Adminpanel definieren

1. Route/Domain-Entscheidung treffen: `/admin` oder `admin.saarwood.ch`.
2. Authentifizierung und Rollenmodell definieren.
3. Lizenz- und Support-Operationen aus den APIs in ein UI ueberfuehren.
4. Audit-Log und Freigabe-Workflow einbauen.

### Phase 3: Marken- und App-Plattform vereinheitlichen

1. Weitere Saarwood-Apps an die gleiche Navigations- und Branding-Sprache anbinden.
2. Gemeinsame Footer- und Kopierhinweise einfuehren.
3. Einheitliche DSGVO-/Impressumslinks pro App.
4. Subdomain-Strategie fuer neue Produkte standardisieren.

### Phase 4: Suchmaschinen- und Reichweitenpflege

1. Search-Console-Daten regelmaessig auswerten.
2. Sitemap und Titles/Descriptions iterativ verbessern.
3. Oeffentliche Produktseiten und Release-Notizen erweitern.
4. Content so pflegen, dass Saarwood als Marke maschinenlesbar bleibt.

## Offene Entscheidungen

- Soll das Adminpanel direkt unter `saarwood.ch/admin` oder als eigene Subdomain betrieben werden?
- Welche Rollen braucht das Adminpanel zu Beginn wirklich?
- Welche Inhalte gehoeren auf die oeffentliche Markenhauptseite und welche bleiben intern?

## Nächster praktischer Schritt

1. Decision fuer Adminpanel-URL treffen.
2. Search-Console einrichten.
3. Oeffentliche Saarwood-Hauptseite definieren.
4. Adminpanel-MVP als eigenes Ticket anlegen.

## Konkrete Checklisten

- Die Schrittfolge fuer Search Console ist in [GOOGLE_SEARCH_CONSOLE_CHECKLIST_DE](./GOOGLE_SEARCH_CONSOLE_CHECKLIST_DE.md) dokumentiert.
