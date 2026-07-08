import fs from 'fs';
import path from 'path';
import { spawnSync, execSync } from 'child_process';

const repoRoot = process.cwd();
const docsDir = path.join(repoRoot, 'docs');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function runCommand(command, args) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  return {
    ok: result.status === 0,
    code: result.status ?? 1,
    durationSec: ((Date.now() - startedAt) / 1000).toFixed(1),
  };
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function hasTodayStand(filePath, date) {
  const content = readIfExists(filePath);
  if (!content) return false;
  const standRegex = new RegExp(`(?:_)?Stand:\\s*${date}`);
  return standRegex.test(content);
}

function git(command, fallback = 'n/a') {
  try {
    return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
}

function writeChecklistReport(date, checks, buildResult, testResult) {
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const reportPath = path.join(docsDir, `RELEASE_PREDEPLOY_CHECK_${date}.md`);
  const allPassed = checks.every((c) => c.ok) && buildResult.ok && testResult.ok;

  const content = [
    '# Release Pre-Deploy Check',
    '',
    `Stand: ${date}`,
    '',
    '## Ergebnis',
    '',
    `- Gesamtstatus: ${allPassed ? 'PASS' : 'FAIL'}`,
    `- Branch: ${git('git rev-parse --abbrev-ref HEAD')}`,
    `- Commit: ${git('git rev-parse --short HEAD')}`,
    '',
    '## Automatische Checkliste',
    '',
    `- [${buildResult.ok ? 'x' : ' '}] Build erfolgreich (Dauer: ${buildResult.durationSec}s)`,
    `- [${testResult.ok ? 'x' : ' '}] Tests erfolgreich (Dauer: ${testResult.durationSec}s)`,
    ...checks.map((item) => `- [${item.ok ? 'x' : ' '}] ${item.label}`),
    '',
    '## Details',
    '',
    ...(checks.map((item) => `- ${item.label}: ${item.ok ? 'ok' : 'fehlt/ungueltig'}`)),
    '',
  ].join('\n');

  fs.writeFileSync(reportPath, content, 'utf8');
  return { reportPath, allPassed };
}

function main() {
  const date = today();

  // Always refresh the daily snapshot first so deploy checks have a current artifact.
  const snapshot = runCommand('node', ['scripts/generate-daily-snapshot.mjs']);
  if (!snapshot.ok) process.exit(snapshot.code);

  const buildResult = runCommand('npm', ['run', 'build']);
  const testResult = buildResult.ok ? runCommand('npm', ['run', 'test']) : { ok: false, code: 1, durationSec: '0.0' };

  const checks = [
    {
      label: `Daily Snapshot vorhanden (docs/DAILY_SNAPSHOT_${date}.md)`,
      ok: fs.existsSync(path.join(docsDir, `DAILY_SNAPSHOT_${date}.md`)),
    },
    {
      label: `Code-Doku-Abgleich vorhanden (docs/STATUSABGLEICH_CODE_DOKU_${date}.md)`,
      ok: fs.existsSync(path.join(docsDir, `STATUSABGLEICH_CODE_DOKU_${date}.md`)),
    },
    {
      label: `CODE_DOC_SYNC_DE.md auf Stand ${date}`,
      ok: hasTodayStand(path.join(docsDir, 'CODE_DOC_SYNC_DE.md'), date),
    },
    {
      label: `PROJECT_STATUS_DE.md auf Stand ${date}`,
      ok: hasTodayStand(path.join(docsDir, 'PROJECT_STATUS_DE.md'), date),
    },
  ];

  const { reportPath, allPassed } = writeChecklistReport(date, checks, buildResult, testResult);
  process.stdout.write(`${path.relative(repoRoot, reportPath)}\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

main();
