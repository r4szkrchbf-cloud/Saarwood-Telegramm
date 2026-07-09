import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

function run(command) {
  return execSync(command, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

async function readText(relPath) {
  try {
    return await fs.readFile(path.join(repoRoot, relPath), 'utf8');
  } catch {
    return '';
  }
}

async function listFilesRecursive(dirPath) {
  const result = [];
  let entries = [];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...await listFilesRecursive(fullPath));
    } else {
      result.push(fullPath);
    }
  }

  return result;
}

function rel(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

function lineFromIndex(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function firstDefined(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return '';
}

function extractTickets(backlogText) {
  const lines = backlogText.split(/\r?\n/);
  const tickets = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^###\s+(TICKET-\d+)\s+·\s+(.+)$/);
    if (!match) continue;

    const ticketId = match[1].trim();
    const title = match[2].trim();
    let priority = 'unbekannt';

    for (let j = i + 1; j < Math.min(i + 12, lines.length); j += 1) {
      const p = lines[j].match(/^\*\*Prioritaet:\*\*\s*(.+)$/);
      if (p) {
        priority = p[1].trim();
        break;
      }
    }

    tickets.push({ ticketId, title, priority });
  }

  return tickets;
}

function extractOpenChecklistItems(markdownText, sourceLabel) {
  const lines = markdownText.split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^\s*-\s*\[\s\]\s+(.+)$/);
    if (m) {
      items.push({ source: sourceLabel, text: m[1].trim() });
    }
  }
  return items;
}

async function writeProjectStatus(nowIso) {
  const branch = run('git branch --show-current');
  const head = run('git rev-parse HEAD');
  const remoteMain = run("git ls-remote origin -h refs/heads/main | awk '{print $1}'");
  const lastCommitFiles = run('git show --name-only --pretty=format: -n 1').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  const logRaw = run("git log -n 25 --date=iso --pretty=format:'%h|%ad|%an|%s'");
  const commitLines = logRaw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [hash, date, author, ...subjectParts] = line.split('|');
      return `- ${date} | ${author} | ${hash} | ${subjectParts.join('|')}`;
    });

  const statusSync = head === remoteMain ? 'ja' : 'nein';

  const content = `# IST-Projektstatus (Automatisch)

Stand: ${nowIso}
Pflegemodus: Automatisch ueber npm run docs:governance:sync
Zielphase: PRE-LAUNCH fuer ausgesuchte Tester (kein oeffentlicher Launch)

## 1) Betriebsstatus Snapshot

- Branch: ${branch}
- Lokaler HEAD: ${head}
- GitHub main HEAD: ${remoteMain}
- Lokal/GitHub synchron: ${statusSync}

## 2) Letzte geaenderte Dateien (letzter Commit)

${lastCommitFiles.length > 0 ? lastCommitFiles.map((file) => `- ${file}`).join('\n') : '- keine Dateiliste verfuegbar'}

## 3) Fortlaufende Aenderungshistorie (Datum | Autor | Commit | Betreff)

${commitLines.length > 0 ? commitLines.join('\n') : '- keine Historie verfuegbar'}

## 4) Pflegehinweis

- Diese Datei wird aus Git-Status und Git-Log generiert.
- Datum/Uhrzeit und "wer geaendert hat" kommen direkt aus den Commit-Metadaten.
- Nach jeder relevanten Aenderung: npm run docs:sync-all
`;

  await fs.writeFile(path.join(repoRoot, 'docs/PROJEKTSTATUS_AUTOMATISCH_DE.md'), content, 'utf8');
}

async function writeDevRoadmap(nowIso) {
  const backlog = await readText('docs/BACKLOG.md');
  const urgent = await readText('docs/DRINGENDE_TODO_2026-07-08.md');
  const minor = await readText('docs/TODO_MINOR_PDF_FORMAT_2026-07-09.md');

  const tickets = extractTickets(backlog);
  const openItems = [
    ...extractOpenChecklistItems(backlog, 'docs/BACKLOG.md'),
    ...extractOpenChecklistItems(urgent, 'docs/DRINGENDE_TODO_2026-07-08.md'),
    ...extractOpenChecklistItems(minor, 'docs/TODO_MINOR_PDF_FORMAT_2026-07-09.md'),
  ];

  const roadmapLines = tickets.map((ticket) => `- ${ticket.ticketId} | ${ticket.priority} | ${ticket.title}`);
  const openLines = openItems.map((item) => `- [ ] (${item.source}) ${item.text}`);

  const content = `# Zentrale Dev-Roadmap und TODO (Automatisch)

Stand: ${nowIso}
Pflegemodus: Automatisch ueber npm run docs:governance:sync
Scope: Nur Entwickler-/Chefentwickler-Planung, keine Tester- oder User-Empfehlungen als Quelle.

## 1) Leitplanken

- Diese Datei ist die zentrale technische TODO-/Roadmap-Datei fuer das Gesamtprojekt.
- Quelle fuer Planung: interne Entwicklerdokumente und technische Backlog-Tickets.
- Keine direkten Feature-Empfehlungen aus Tester- oder User-Feedback in dieser Datei aufnehmen.

## 2) Geplante Funktionen und Erweiterungen (automatisch aus Entwickler-Backlog)

${roadmapLines.length > 0 ? roadmapLines.join('\n') : '- keine Tickets gefunden'}

## 3) Offene Aufgaben bis heute (automatisch)

Anzahl offene Aufgaben: ${openItems.length}

${openLines.length > 0 ? openLines.join('\n') : '- [ ] keine offenen Aufgaben gefunden'}

## 4) Pflegehinweis

- Aktualisierung laeuft per Script und soll nach Aenderungen ausgefuehrt werden.
- Pflichtkommando: npm run docs:sync-all
`;

  await fs.writeFile(path.join(repoRoot, 'docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md'), content, 'utf8');
}

async function writeRulebook(nowIso) {
  const docsDir = path.join(repoRoot, 'docs');
  const allDocs = (await listFilesRecursive(docsDir)).map(rel);

  const autoRuleFiles = allDocs.filter((file) => /RULE|REGEL|INSTRUCTIONS|AGENT|AUTOMATISCH|PFADINDEX/i.test(path.basename(file)));

  const knownFiles = [
    {
      file: 'AGENTS.md',
      description: 'Zentrale verpflichtende Regeln fuer KI- und Coding-Assistenten in diesem Repo.',
    },
    {
      file: 'package.json',
      description: 'Definiert die Automations-Kommandos fuer Doku- und Governance-Synchronisierung.',
    },
    {
      file: 'scripts/sync-pathindex.mjs',
      description: 'Automatisch gepflegter Pfadindex fuer aenderbare Inhalte (Formulare, Dokumente, Landingpages).',
    },
    {
      file: 'scripts/sync-governance-docs.mjs',
      description: 'Automatische Pflege von Projektstatus, zentraler Dev-Roadmap/TODO und Regelbook.',
    },
    {
      file: 'docs/PFADINDEX_AENDERBARE_INHALTE_DE.md',
      description: 'Auto-generierte Uebersicht aller aenderbaren Pfade und Formular-/Landingpage-Dateien.',
    },
    {
      file: 'docs/CHECKLIST_AENDERUNGEN_FORMULARE_PFADE_DE.md',
      description: 'Operative Checkliste fuer sichere Aenderungen an Formularen, Pfaden und Support-Ressourcen.',
    },
    {
      file: 'docs/PROJEKTSTATUS_AUTOMATISCH_DE.md',
      description: 'Auto-generierter IST-Status inklusive Datum/Uhrzeit, Autor und Aenderungshistorie.',
    },
    {
      file: 'docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md',
      description: 'Auto-generierte zentrale Entwickler-Roadmap und Gesamt-TODO mit offenen Aufgaben.',
    },
    {
      file: 'docs/MELDUNGEN.md',
      description: 'Auto-generierte zentrale Uebersicht aller Nutzer-Rueckmeldungen inkl. Fundstelle/Dateipfad.',
    },
    {
      file: 'docs/AGENTEN_KI_REGELBOOK_DE.md',
      description: 'Dieses selbstpflegende Verzeichnis aller Regel- und Agentensteuerungsdateien.',
    },
  ];

  const merged = new Map();
  for (const item of knownFiles) {
    merged.set(item.file, item.description);
  }
  for (const file of autoRuleFiles) {
    if (!merged.has(file)) {
      merged.set(file, 'Weitere erkannte Regel-/Governance-Datei (automatisch erkannt).');
    }
  }

  const sorted = [...merged.entries()].sort(([a], [b]) => a.localeCompare(b));

  const lines = sorted.map(([file, description]) => `- ${file}\n  - ${description}`);

  const content = `# Agenten- und KI-Regelbook (Automatisch)

Stand: ${nowIso}
Pflegemodus: Automatisch ueber npm run docs:governance:sync
Zweck: Zentrales Verzeichnis aller Regeldateien und Agentensteuerungsdateien mit Kurzbeschreibung und Pfad.

## 1) Verbindliche Pflege

- Diese Datei wird automatisch gepflegt und erweitert, sobald neue relevante Regel-/Governance-Dateien erkannt werden.
- Nach Aenderungen an Regeln, Automationen oder Agentensteuerung: npm run docs:sync-all ausfuehren.

## 2) Regel- und Steuerungsdateien

${lines.length > 0 ? lines.join('\n') : '- keine Dateien erkannt'}
`;

  await fs.writeFile(path.join(repoRoot, 'docs/AGENTEN_KI_REGELBOOK_DE.md'), content, 'utf8');
}

async function writeMessagesDoc(nowIso) {
  const frontendRoot = path.join(repoRoot, 'packages/frontend/src');
  const backendRoot = path.join(repoRoot, 'packages/backend/src');

  const frontendFiles = (await listFilesRecursive(frontendRoot))
    .filter((file) => /\.(ts|tsx)$/i.test(file));

  const backendFiles = (await listFilesRecursive(backendRoot))
    .filter((file) => /\.(ts|tsx)$/i.test(file));

  const entries = [];
  const ignoredMessages = new Set([
    'error',
    'success',
    'submitting',
    'idle',
    'listening',
    'no-speech',
    'microphone-denied',
    'microphone-unavailable',
    'network',
    'starting',
  ]);

  const addEntries = (filePath, source, pattern, kind) => {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const message = firstDefined(match[2], match[3], match[4], match[1]).trim();
      if (!message) continue;
      if (ignoredMessages.has(message)) continue;
      const line = lineFromIndex(source, match.index);
      entries.push({
        file: rel(filePath),
        line,
        kind,
        message,
      });
    }
  };

  const addCombinedTemplateEntries = (filePath, source, pattern, kind) => {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const first = (match[1] ?? '').trim();
      const second = (match[2] ?? '').trim();
      const combined = `${first}${second}`.trim();
      if (!combined) continue;
      const line = lineFromIndex(source, match.index);
      entries.push({
        file: rel(filePath),
        line,
        kind,
        message: combined,
      });
    }
  };

  for (const filePath of frontendFiles) {
    const source = await fs.readFile(filePath, 'utf8');

    addEntries(
      filePath,
      source,
      /set[A-Za-z0-9_]*(Status|Info|Message)\(\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/g,
      'frontend-status',
    );

    addEntries(
      filePath,
      source,
      /_setStatus\(\s*\{[^}]*detail:\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/gs,
      'frontend-speech-detail',
    );

    addEntries(
      filePath,
      source,
      /aria-live[^\n]*\|\|\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/g,
      'frontend-aria-live',
    );

    addCombinedTemplateEntries(
      filePath,
      source,
      /setSupportStatus\(\s*`([^`]+)`\s*\+\s*`([^`]+)`/gs,
      'frontend-status',
    );
  }

  for (const filePath of backendFiles) {
    const source = await fs.readFile(filePath, 'utf8');

    addEntries(
      filePath,
      source,
      /res\.status\([^)]*\)\.json\(\s*\{[^}]*error:\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/gs,
      'backend-api-error',
    );
  }

  const unique = new Map();
  for (const entry of entries) {
    const key = `${entry.file}:${entry.line}:${entry.kind}:${entry.message}`;
    unique.set(key, entry);
  }

  const sorted = [...unique.values()].sort((a, b) => {
    if (a.file === b.file) return a.line - b.line;
    return a.file.localeCompare(b.file);
  });

  // Add explicit resolved example for the most important live ticket success info.
  sorted.push({
    file: 'packages/frontend/src/components/Settings/SettingsPanel.tsx',
    line: 1079,
    kind: 'frontend-status-live-example',
    message: 'Ihr Ticket ist beim Support eingegangen. Bitte verwenden Sie diese Ticket-ID: SWD-2026-000007. Sie haben eine automatische E-Mail mit einer Kopie Ihres Tickets erhalten. Support-Mail-Benachrichtigung: gesendet. Webhook-Weiterleitung: nicht aktiv.',
  });

  const isErrorMessage = (entry) => {
    if (entry.kind === 'backend-api-error') return true;
    const text = entry.message.toLowerCase();
    return /(fehler|fehl|error|invalid|unauthorized|not found|konnte nicht|failed|verweigert|ticket-not-found)/i.test(text);
  };

  const errorEntries = sorted.filter((entry) => isErrorMessage(entry));
  const infoEntries = sorted.filter((entry) => !isErrorMessage(entry));

  const formatEntry = (entry) => `- Meldung: ${entry.message}\n  - Typ: ${entry.kind}\n  - Fundstelle: ${entry.file}:${entry.line}`;

  const errorLines = errorEntries.map(formatEntry);
  const infoLines = infoEntries.map(formatEntry);

  const content = `# Meldungen (Automatisch)

Stand: ${nowIso}
Pflegemodus: Automatisch ueber npm run docs:governance:sync
Zweck: Zentrale Uebersicht aller Nutzer-Rueckmeldungen (Erfolg, Fehler, Status) mit Fundstelle und Dateipfad.

## 1) Regeln fuer Pflege

- Diese Datei wird automatisch aus Frontend- und Backend-Quelltext erzeugt.
- Nach Aenderungen an Rueckmeldungen/Fehlertexten: npm run docs:sync-all ausfuehren.

## 2) Meldungen und Fundstellen

Anzahl erkannter Meldungen: ${sorted.length}

### Fehlermeldungen

Anzahl Fehlermeldungen: ${errorEntries.length}

${errorLines.length > 0 ? errorLines.join('\n') : '- keine Fehlermeldungen erkannt'}

### Informationsmeldungen

Anzahl Informationsmeldungen: ${infoEntries.length}

${infoLines.length > 0 ? infoLines.join('\n') : '- keine Informationsmeldungen erkannt'}
`;

  await fs.writeFile(path.join(repoRoot, 'docs/MELDUNGEN.md'), content, 'utf8');
}

async function main() {
  const nowIso = new Date().toISOString();
  await writeProjectStatus(nowIso);
  await writeDevRoadmap(nowIso);
  await writeRulebook(nowIso);
  await writeMessagesDoc(nowIso);
  console.log('Updated docs/PROJEKTSTATUS_AUTOMATISCH_DE.md');
  console.log('Updated docs/ZENTRALE_DEV_ROADMAP_TODO_DE.md');
  console.log('Updated docs/AGENTEN_KI_REGELBOOK_DE.md');
  console.log('Updated docs/MELDUNGEN.md');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
