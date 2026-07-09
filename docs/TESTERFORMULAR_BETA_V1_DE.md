# Saarwood Teleprompter - Testerformular Beta V1

Stand: 2026-07-09
Zweck: Ausfuellbares Formular fuer externe Tester mit klarer Fehlerstruktur, druckbarer Zusammenfassung und direkter Uebergabe an den Support-Prozess.

## 1. Formularziel

Das Formular soll externe Tester dabei unterstuetzen, einen Befund schnell, strukturiert und nachvollziehbar zu erfassen.

Wichtige Regeln:

- nur testerrelevante Inhalte
- keine internen Admin-, Deploy- oder Secret-Details
- kurz genug fuer den mobilen Einsatz
- ausfuellbar im Browser, als PWA und auf Tablet/Smartphone
- druckbar nach dem Absenden

## 2. Formularfluss

1. Tester fuellt die Pflichtfelder aus.
2. Optional werden Name und Tester-ID fuer die Zuordnung ergaenzt.
3. Formular wird an den Support-Prozess uebergeben.
4. Nach dem Absenden erscheint eine bestaetigte Zusammenfassung mit Ticket-Referenz und E-Mail-Kopie.
5. Tester kann die Zusammenfassung bei Bedarf drucken.

## 2. Feste URL

Das interaktive Formular wird unter der festen URL `/tester-form.html` bereitgestellt.

Diese URL oeffnet die Browser-Formularansicht und wird in der App als eigener Support-Link verwendet.

## 3. Feldmatrix

### 3.1 Pflichtfelder

| Feld | Typ | Zweck | Hinweise |
| --- | --- | --- | --- |
| E-Mail-Adresse | E-Mail | Kopie und Rueckmeldung | Pflichtfeld |
| Betreff | Text | Ticket-Zuordnung | wird mitgeschickt |
| Testerbericht | Mehrzeiliger Text | Befundbeschreibung | kurz, konkret, reproduzierbar |

### 3.2 Optionale Felder

| Feld | Typ | Zweck | Hinweise |
| --- | --- | --- | --- |
| Tester Name | Text | Zuordnung | echter Name oder Alias |
| Tester ID | Text | interne Zuordnung | falls vorhanden |
| Ergänzende Notizen | Mehrzeiliger Text | Freitext | fuer Beobachtungen ohne direkten Fehlerbezug |

## 4. Validierungsregeln

- Pflichtfelder muessen vor dem Absenden ausgefuellt sein.
- Die E-Mail-Adresse muss syntaktisch gueltig sein.
- Der Betreff darf nicht leer sein.
- Der Testerbericht muss mindestens eine sinnvolle Kurzbeschreibung enthalten.
- Name und Tester-ID bleiben optional und duerfen leer bleiben.

## 5. Output nach dem Absenden

Nach dem Absenden zeigt das Formular eine kompakte Bestaetigung mit:

- Eingangszeitpunkt
- Tester Name oder Alias
- Tester ID falls vorhanden
- Ticket-ID
- Hinweis, dass eine Kopie an die angegebene E-Mail gesendet wurde

Zusatz:

- Die Bestaetigung kann ausgedruckt werden.
- Die Bestaetigung kann als Grundlage fuer Rueckfragen und Nachtests dienen.

## 6. Druckansicht

Die Druckansicht soll:

- ohne ueberfluessige Navigation erscheinen
- die eingegebenen Felder und den Bericht in lesbarer Reihenfolge darstellen
- einen kompakten Kopfbereich mit Tester, E-Mail und Ticket-ID enthalten
- fuer Telefon, Tablet und Desktop sinnvoll umbrechen

## 7. Inhalte, die nicht ins Formular gehoeren

- interne Deploy-, Git- oder Recovery-Details
- Admin-Keys, Secrets oder Serverpfade
- technische Diagnoseanweisungen fuer Entwickler
- interne Diskussionen zu Freigaben oder Roadmap
- Support-Interna, die nicht fuer Tester sichtbar sein sollen

## 8. Naechster Umsetzungsblock

Aus diesem Dokument wird spaeter die interaktive Formularansicht aufgebaut:

1. Pflichtfelder als echte Form-Controls
2. Optionalfelder fuer Name und Tester-ID
3. Textbereich fuer den Testerbericht
4. Submit-Handling mit Bestaetigungsansicht und E-Mail-Kopie
5. Druckansicht und feste Formular-URL
