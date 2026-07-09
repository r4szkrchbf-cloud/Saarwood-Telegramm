import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

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

async function listFilesShallow(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(dirPath, entry.name));
  } catch {
    return [];
  }
}

function rel(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

function bulletList(files) {
  if (files.length === 0) return '- (keine Dateien gefunden)';
  return files.map((file) => `- ${file}`).join('\n');
}

async function main() {
  const frontendRoot = path.join(repoRoot, 'packages/frontend');
  const pagesDir = path.join(frontendRoot, 'src/pages');
  const supportPublicDir = path.join(frontendRoot, 'public/support');
  const docsDir = path.join(repoRoot, 'docs');

  const frontendHtml = (await listFilesShallow(frontendRoot))
    .filter((file) => file.endsWith('.html'))
    .map(rel)
    .sort();

  const pageFiles = (await listFilesRecursive(pagesDir))
    .filter((file) => /Form/i.test(path.basename(file)) && /\.(tsx|css)$/i.test(file))
    .map(rel)
    .sort();

  const supportPdfs = (await listFilesRecursive(supportPublicDir))
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map(rel)
    .sort();

  const docSources = (await listFilesRecursive(docsDir))
    .filter((file) => file.toLowerCase().endsWith('.md'))
    .map(rel)
    .filter((file) => /HANDBUCH|GUIDE|FORMULAR/i.test(path.basename(file)))
    .sort();

  const fixedSupportFiles = [
    'packages/frontend/src/components/Settings/SettingsPanel.tsx',
    'packages/backend/src/support/SupportService.ts',
    'packages/backend/src/routes/api.ts',
    'packages/frontend/src/tester-form.tsx',
    'packages/frontend/vite.config.ts',
  ];

  const content = `# Pfadindex: Aenderbare Inhalte\n\nStand: ${new Date().toISOString().slice(0, 10)}\nZweck: Zentrale Uebersicht, wo Formulare, Dokumente, Support-Links und Landingpages geaendert werden koennen.\n\nHinweis: Diese Datei ist automatisch generiert via npm run docs:pathindex:sync.\n\n## 1) Haupt-Landingpage saarwood.ch\n\n- Live URL: https://teleprompter.saarwood.ch/\n- Quellseite: packages/frontend/index.html\n\n## 2) Landingpages / Einstiegspunkte\n\n${bulletList(frontendHtml)}\n\n## 3) Interaktive Formulare (Code + Styling)\n\n${bulletList(pageFiles)}\n\n## 4) Support-Buttons, URL-Logik und Ticket-API\n\n${bulletList(fixedSupportFiles)}\n\n## 5) Oeffentliche Support-Dokumente (PDF-Dateien)\n\n${bulletList(supportPdfs)}\n\n## 6) Bearbeitbare Quell-Dokumente (Markdown)\n\n${bulletList(docSources)}\n\n## 7) Produktionskonfiguration (Server, nicht im Repo)\n\n- /srv/saarwood_telepromter/.env.production\n\nRelevante Variablen:\n- SUPPORT_HANDBOOK_URL\n- SUPPORT_TESTER_GUIDE_URL\n- SUPPORT_TESTER_FORM_URL\n- SUPPORT_TICKET_FILE\n- SUPPORT_TICKET_SEQUENCE_FILE\n- SUPPORT_CLIENT_LOG_FILE\n\n## 8) Schnellantwort: Wo aendere ich was?\n\n- Formularfelder, Pflichtregeln, Tickettext: packages/frontend/src/pages/TesterFormPage.tsx\n- Formular-Layout und Druckansicht: packages/frontend/src/pages/TesterFormPage.css\n- Support-Linkziele in Einstellungen: packages/frontend/src/components/Settings/SettingsPanel.tsx\n- Standard-Linkziele serverseitig: packages/backend/src/support/SupportService.ts\n- Statische Dokumente fuer /support/...: packages/frontend/public/support/\n`;

  await fs.writeFile(path.join(repoRoot, 'docs/PFADINDEX_AENDERBARE_INHALTE_DE.md'), content, 'utf8');
  console.log('Updated docs/PFADINDEX_AENDERBARE_INHALTE_DE.md');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
