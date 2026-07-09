# GAP Lizenz-Beta-Policy v1

Stand: 2026-07-09
Ziel: Verbindliche Betriebsregeln fuer Lizenzlaufzeiten, Revocation und Offline-Verhalten in der Beta.

## 1. Policy-Ziele

- Hohe Betriebssicherheit im Feld
- Klare zentrale Steuerbarkeit (Ausgabe, Sperrung, Ersatz)
- Begrenztes Risiko bei Offline-Betrieb

## 2. Token- und Laufzeitregeln (v1)

- Tokens sind signiert und serverseitig pruefbar
- Beta-Laufzeiten sollen kurz genug fuer Steuerbarkeit bleiben
- Emergency-Lizenzen nur mit kurzer Laufzeit

## 3. Offline-Regeln (v1)

- Offline nur nach erfolgreicher Online-Erstpruefung
- Offline-Gnadenfenster begrenzt und tierabhaengig freigebbar
- Ohne gueltige Signatur keine Offline-Aktivierung

## 4. Revocation-Regeln (v1)

- Einzel-Lizenz-Sperre bei Missbrauch, Ersatz oder Vertragsende
- Generation-Sperre bei strukturellem Risiko
- Jede Sperrung mit Ticket-ID und Grund dokumentieren

## 5. Operativer Ablauf (Kurzprozess)

1. Lizenz ausstellen (Tier + Laufzeit + Offline-Fenster)
2. Aktivierung pruefen
3. Nutzung beobachten
4. Bei Bedarf sperren/ersetzen
5. Vorgang im Support-Runbook dokumentieren

## 6. Offene Freigabepunkte

- Standardlaufzeit je Tier (Beta)
- Offline-Gnadenfenster je Zielgruppe
- Kriterien fuer Emergency-Lizenz
- Eskalationsweg fuer Sperrfaelle

## 7. Abhaengigkeiten

- `docs/LICENSING_AND_RELEASE_PLAN_DE.md`
- `docs/SUPPORT_LICENSE_RUNBOOK_DE.md`
- `docs/STATUSBERICHT_GAP_ARBEITSBLOCK_DE_2026-07-09.md`
