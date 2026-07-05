# Projektvorbereitung: Saarwood Teleprompter

Dieses Dokument bereitet das Projekt für die Umsetzung und das erste Meeting vor.

## 1) Status & Ziel

- Monorepo mit `packages/frontend` und `packages/backend`
- Build- und Test-Skripte sind bereits vorhanden
- Copilot-Cloud-Agent Setup ist vorbereitet über:
  - `/home/runner/work/saarwood_telepromter/saarwood_telepromter/.github/workflows/copilot-setup-steps.yml`

## 2) Git- und Copilot-Basis (bereit)

Damit Copilot die App zuverlässig bauen kann, ist nun ein dedizierter Setup-Workflow vorhanden:

- Workflow Name: **Copilot Setup Steps**
- Job Name: **copilot-setup-steps** (Pflichtname)
- Runner: `ubuntu-latest`
- Schritte:
  1. Repository checkout
  2. Node.js 22 einrichten
  3. `npm ci`
  4. `npm run build --workspaces`

Wichtig:
- Der Workflow muss auf dem **Default-Branch** vorhanden sein, damit Copilot ihn nutzt.
- Änderungen am Workflow werden automatisch als GitHub-Action getestet.

## 3) Standard-Entwicklungsablauf

Aus dem Repo-Root:

- Installation: `npm install`
- Entwicklung: `npm run dev`
- Build: `npm run build`
- Tests: `npm test`
- Lint: `npm run lint`

## 4) Vorbereitung für das erste Meeting

Bitte folgende Punkte/Dateien hochladen oder bereitstellen:

- Funktionswünsche (Muss/Kann/Nice-to-have)
- UI-/UX-Wünsche (Layouts, Referenzbilder, Farben, Schrift)
- Workflow im Studio/Redaktion (Wer steuert was, wann?)
- Integrationsanforderungen (MOS/NDI/ST2110, falls relevant)
- Geräte- und Browser-Ziele (z. B. iPad, Android, Desktop)
- Prioritäten und Go-Live-Reihenfolge

## 5) Empfohlene Meeting-Agenda (Kickoff)

1. Produktziel und Erfolgskriterien
2. Scope für Version 1 (MVP)
3. Rollen und Freigabeprozess
4. Technische Rahmenbedingungen
5. Umsetzungsphasen und nächste Milestones

## 6) Designentscheidungen (nachvollziehbar dokumentiert)

Die folgenden Entscheidungen wurden bewusst getroffen und sind hier zur Nachvollziehbarkeit festgehalten.

### 6.1 · Schriften und Sprachen — nur LTR-Latein

**Entscheidung:** Diese App unterstützt ausschließlich **links-nach-rechts (LTR) lateinische Schriften** (z. B. Deutsch, Englisch, Französisch, Spanisch, Italienisch …).

**Explizit NICHT unterstützt in dieser App:**
- Arabisch (rechts nach links)
- Hebräisch (rechts nach links)
- Chinesisch / CJK (vertikal / gemischte Richtung)
- Kyrillisch (LTR, aber nicht-lateinisch)
- Alle sonstigen nicht-lateinischen Schriftsysteme

**Begründung:** Ein Teleprompter, der ausschließlich auf LTR-Lateinschriften ausgerichtet ist, lässt sich in Layout, Schriftdarstellung, Zeilenumbruch und Sprach-Tracking gezielt optimieren. Die gleichzeitige Unterstützung von RTL- und Komplexschriften würde Komplexität und Risiko erhöhen, ohne der primären Zielgruppe (europäische Broadcast-Redaktionen) einen Mehrwert zu bringen.

**Unterprojekt — Saarwood Teleprompter (Multi-Schrift-Edition):**
> Als **offizielles Unterprojekt dieses Projekts** wird eine eigene, separate Anwendung für Arabisch, Hebräisch, Chinesisch, Kyrillisch und alle weiteren Nicht-LTR-Schriften entwickelt — einschließlich der zweisprachigen Nutzung zusammen mit Englisch.
> Diese App wird von Grund auf für diese Schriften ausgelegt und optimiert: RTL-Layout, bidirektionaler Text, komplexe Rendering-Engines, passende Schriftarten, RTL-Benutzeroberfläche.
> Sie teilt dieselbe Backend-Infrastruktur (WebSocket-Steuerbus, MOS, NDI-Abstraktion), verwendet aber ein separates Frontend-Paket.

**Betroffene Codedateien (Rückverfolgbarkeit):**
| Datei | Änderung |
|-------|----------|
| `packages/frontend/src/types/index.ts` | `TextDirection`-Typ auf `'ltr'` eingeschränkt (vorher `'ltr' \| 'rtl' \| 'auto'`) |
| `packages/frontend/package.json` | Abhängigkeit `tiptap-text-direction` entfernt |
| `packages/frontend/src/components/Editor/ScriptEditor.tsx` | Tiptap-Extension `TextDirection`, LTR/RTL-Toolbar-Buttons und `setDirection`-Callback entfernt |
| `packages/frontend/src/components/PrompterDisplay/PrompterDisplay.tsx` | `dir`-Attribut liest immer `segment.direction` (immer `'ltr'`) — kein `'auto'`/`'rtl'`-Zweig mehr |

---

### 6.2 · Render-Engine — CSS-Compositor (WebGL später als optionaler Zusatz-Layer)

**Entscheidung:** Die Teleprompter-Ausgabe wird mittels **CSS `transform: translateY()`** gerendert, angetrieben durch `requestAnimationFrame`. WebGL / WebGPU wird in der ersten Version **nicht** eingesetzt.

**Begründung:**
- CSS-Compositor-Transforms laufen auf dem GPU-Compositor-Thread ohne Layout/Paint-Overhead — gleichwertig oder besser als ein WebGL-Canvas für reines Textscrollen.
- CSS vermeidet die bei einem WebGL-Textrenderer notwendigen Frame-für-Frame-Texture-Uploads.
- Der CSS-only-Ansatz ist ohne externe Abhängigkeiten, maximal kompatibel (alle modernen Browser, iOS Safari, Android WebView) und leicht prüfbar.

**Geplanter WebGL-Layer (zukünftig):**
> WebGL / WebGPU wird **später als optionaler, additiver Layer** über dem bestehenden CSS-Renderer ergänzt — nicht als Ersatz.
> Anwendungsfälle: animierte Chroma-Key-Overlays, Echtzeit-Farbkorrektur, eigene Shader-Effekte auf der Prompter-Ausgabe.
> Die Architektur ist dafür ausgelegt: Das `prompter-content`-Div ist ein sauberer Einfügepunkt für ein WebGL-Canvas, das über oder anstelle des CSS-Scrollinhalts kompositiert.
> Diese Arbeit ist bewusst aufgeschoben und wird als separater Feature-Branch verfolgt.

---

## 7) Nächster Schritt

Sobald deine zusätzlichen Dateien mit Wünschen und Brainstorming-Inhalten hochgeladen sind, wird daraus ein priorisierter Umsetzungsplan für Sprint 1 erstellt.

## 8) Externe Referenzlisten (wichtig und relevant)

Die folgenden drei iCloud-Notizen sind als wichtige und relevante Referenzen für Anforderungen und Priorisierung dokumentiert:

1. https://www.icloud.com/notes/045l_lo2kVm7Miml4b4DSZdow
2. https://www.icloud.com/notes/0c3iy6aWi5WxgCSuPHr-MzIQQ
3. https://www.icloud.com/notes/08e7syc7g3MlplEYAGB3DtmAQ
