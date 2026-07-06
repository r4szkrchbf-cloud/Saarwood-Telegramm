# ClickUp Go-Live Struktur (SAARwooD)

Stand: 2026-07-06

## 1. Empfohlene ClickUp Hierarchie

1. Space: `SAARwooD Platform`
2. Folder: `Go-Live`
3. Lists:
- `WP Redaktion Integration`
- `Hostinger App Betrieb`
- `Teleprompter Public Launch`
- `Incidents & Follow-up`

## 2. Status-Workflow (einheitlich)

- `Backlog`
- `Ready`
- `In Progress`
- `Blocked`
- `Review`
- `Done`
- `Post-Launch`

## 3. Custom Fields (empfohlen)

- `Owner Role` (Dropdown): Release Lead, Infra Lead, Backend Lead, Frontend Lead, QA Lead, Security Owner, Support Lead
- `System` (Dropdown): WordPress, Hostinger, Teleprompter, ClickUp, DNS
- `Environment` (Dropdown): Staging, Production
- `Severity` (Dropdown): P0, P1, P2, P3
- `Go-Live Gate` (Checkbox): true/false
- `Domain Scope` (Text): z. B. `teleprompter.saarwood.ch`
- `Runbook Ref` (URL/Text): Doku-Link

## 4. Automations (minimal)

1. Wenn Status -> `Blocked`: Kommentar mit Blockergrund verpflichtend.
2. Wenn `Go-Live Gate = true` und Status -> `Done`: Release Lead mention.
3. Wenn `Severity = P0`: automatisch Prioritaet `Urgent`.
4. Wenn Aufgabe in `Incidents & Follow-up` erstellt: automatisch Due Date +1 Tag.

## 5. Labels/Tags

- `stream:wordpress`
- `stream:hostinger`
- `stream:teleprompter`
- `phase:day0`
- `phase:launch`
- `phase:postlaunch`

## 6. Import-Vorlage (CSV)

Datei fuer direkten Import:
- `docs/CLICKUP_GOLIVE_TASKS_TEMPLATE.csv`

Import-Mapping in ClickUp:
1. `Task Name` -> Name
2. `Description` -> Beschreibung
3. `Status` -> Status
4. `Priority` -> Prioritaet
5. `Due Date` -> Due Date
6. `Owner Role` -> Custom Field `Owner Role`
7. `System` -> Custom Field `System`
8. `Environment` -> Custom Field `Environment`
9. `Severity` -> Custom Field `Severity`
10. `Go Live Gate` -> Custom Field `Go-Live Gate`
11. `Domain Scope` -> Custom Field `Domain Scope`
12. `Runbook Ref` -> Custom Field `Runbook Ref`

## 7. Trennregel (verbindlich)

- WordPress-Aufgaben nie mit Teleprompter-Featurelogik vermischen.
- Verbindung nur ueber Links/API/Webhooks.
- Teleprompter Runtime bleibt unabhaengig von ClickUp-Verfuegbarkeit.

## 8. Verknuepfte Doku

- `docs/MASTERREIHENFOLGE_WP_HOSTINGER_INTEGRATION_DE.md`
- `docs/DOMAINSTRUKTUR_ENTSCHEIDUNG_WP_HOSTINGER_DE.md`
- `docs/HOSTINGER_DAY0_RUNLIST_DE.md`
- `docs/HOSTINGER_GOLIVE_ONEPAGER_2P_DE.md`
