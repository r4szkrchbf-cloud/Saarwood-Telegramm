import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = process.cwd();
const docsDir = path.join(repoRoot, 'docs');

function nowDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function runGit(command) {
  return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function safeGit(command, fallback = 'n/a') {
  try {
    return runGit(command);
  } catch {
    return fallback;
  }
}

function ensureDocsDir() {
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
}

function main() {
  ensureDocsDir();

  const date = nowDateStamp();
  const fileName = `DAILY_SNAPSHOT_${date}.md`;
  const filePath = path.join(docsDir, fileName);

  const branch = safeGit('git rev-parse --abbrev-ref HEAD');
  const commitMain = safeGit('git rev-list --count main');
  const commitAll = safeGit('git rev-list --count --all');
  const headShort = safeGit('git rev-parse --short HEAD');
  const headSubject = safeGit('git log -1 --pretty=%s');
  const headDate = safeGit('git log -1 --date=iso --pretty=%cd');
  const rootFull = safeGit('git rev-list --max-parents=0 HEAD | head -n 1');
  const rootShort = rootFull !== 'n/a' ? rootFull.slice(0, 7) : 'n/a';
  const rootSubject = rootFull !== 'n/a'
    ? safeGit(`git show -s --pretty=%s ${rootFull}`)
    : 'n/a';
  const wcStatus = safeGit('git status --short');

  const content = [
    '# Daily Snapshot Report',
    '',
    `Stand: ${date}`,
    '',
    '## Git Snapshot',
    '',
    `- Branch: ${branch}`,
    `- Commits auf main: ${commitMain}`,
    `- Commits gesamt: ${commitAll}`,
    `- Letzter Commit: ${headShort}`,
    `- Letzter Commit-Text: ${headSubject}`,
    `- Letztes Commit-Datum: ${headDate}`,
    `- Root-Commit: ${rootShort}`,
    `- Root-Commit-Text: ${rootSubject}`,
    '',
    '## Working Tree',
    '',
    ...(wcStatus
      ? wcStatus.split('\n').map((line) => `- ${line}`)
      : ['- clean']),
    '',
    '## Hinweis',
    '',
    '- Dieser Snapshot wird automatisch erzeugt mit `npm run snapshot:daily`.',
    '',
  ].join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
  process.stdout.write(`${path.relative(repoRoot, filePath)}\n`);
}

main();
