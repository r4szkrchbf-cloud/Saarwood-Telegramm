import fs from 'fs';
import path from 'path';

type Tier = 'basic' | 'professional' | 'expert';

type RevocationState = {
  revokedLicenses: string[];
  revokedGenerations: string[];
};

type ArgMap = Record<string, string | boolean>;

const DEFAULT_REVOCATION_FILE = path.resolve(__dirname, '../../config/license-revocations.json');

function parseArgs(argv: string[]): { command: string | null; args: ArgMap } {
  const command = argv[0] ?? null;
  const args: ArgMap = {};

  for (let i = 1; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }

  return { command, args };
}

function getStringArg(args: ArgMap, name: string): string | null {
  const value = args[name];
  return typeof value === 'string' ? value : null;
}

function getRequiredArg(args: ArgMap, name: string): string {
  const value = getStringArg(args, name);
  if (!value) {
    throw new Error(`Missing required argument: --${name}`);
  }
  return value;
}

function getNumberArg(args: ArgMap, name: string, fallback: number): number {
  const value = getStringArg(args, name);
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric argument: --${name}=${value}`);
  }
  return parsed;
}

function generateLicenseId(): string {
  return `lic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readTextFile(filePath: string): string {
  return fs.readFileSync(path.resolve(filePath), 'utf-8');
}

function resolveRevocationFile(args: ArgMap): string {
  return path.resolve(getStringArg(args, 'revocation-file') ?? process.env.LICENSE_REVOCATION_FILE ?? DEFAULT_REVOCATION_FILE);
}

function loadRevocations(filePath: string): RevocationState {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<RevocationState>;
    return {
      revokedLicenses: Array.isArray(parsed.revokedLicenses)
        ? parsed.revokedLicenses.map((v) => String(v))
        : [],
      revokedGenerations: Array.isArray(parsed.revokedGenerations)
        ? parsed.revokedGenerations.map((v) => String(v))
        : [],
    };
  } catch {
    return { revokedLicenses: [], revokedGenerations: [] };
  }
}

function saveRevocations(filePath: string, state: RevocationState): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify({
      revokedLicenses: Array.from(new Set(state.revokedLicenses)).sort(),
      revokedGenerations: Array.from(new Set(state.revokedGenerations)).sort(),
    }, null, 2)}\n`,
    'utf-8',
  );
}

function printHelp(): void {
  console.log(`\nSaarwood License Admin CLI\n\nUsage:\n  npm run license:admin --workspace @saarwood/backend -- <command> [options]\n\nCommands:\n  create                Create signed license token (Ed25519)\n  list-revocations      Print current revocation lists\n  revoke-license        Add license id to revocation list\n  unrevoke-license      Remove license id from revocation list\n  revoke-generation     Add beta generation to revocation list\n  unrevoke-generation   Remove beta generation from revocation list\n\ncreate options:\n  --private-key-file <path>     PKCS8 private key file (required)\n  --customer <name>             Customer label\n  --tier <basic|professional|expert>  (default: expert)\n  --days <n>                    Validity in days (default: 30)\n  --offline-grace-days <n>      Offline grace period in days (default: 14)\n  --generation <name>           Beta generation id (default: beta-v1)\n  --channels <csv>              e.g. web,electron,pwa\n  --features <csv>              Optional feature flags\n  --license-id <id>             Optional fixed license id\n  --out <path>                  Write token to file\n\nrevocation options:\n  --revocation-file <path>      Override revocation file path\n  --license-id <id>             For revoke-license / unrevoke-license\n  --generation <name>           For revoke-generation / unrevoke-generation\n`);
}

async function createLicense(args: ArgMap): Promise<void> {
  const { SignJWT, importPKCS8 } = await import('jose');
  const privateKeyFile = getRequiredArg(args, 'private-key-file');
  const privateKeyPem = readTextFile(privateKeyFile);
  const privateKey = await importPKCS8(privateKeyPem, 'EdDSA');

  const customer = getStringArg(args, 'customer') ?? 'beta-tester';
  const tier = (getStringArg(args, 'tier') ?? 'expert') as Tier;
  if (!['basic', 'professional', 'expert'].includes(tier)) {
    throw new Error('Invalid --tier. Use basic, professional, or expert.');
  }

  const days = getNumberArg(args, 'days', 30);
  const offlineGraceDays = getNumberArg(args, 'offline-grace-days', 14);
  const generation = getStringArg(args, 'generation') ?? 'beta-v1';
  const licenseId = getStringArg(args, 'license-id') ?? generateLicenseId();

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + Math.max(1, Math.floor(days)) * 24 * 60 * 60;
  const graceOfflineUntil = expiresAt + Math.max(0, Math.floor(offlineGraceDays)) * 24 * 60 * 60;

  const channels = (getStringArg(args, 'channels') ?? 'web,electron,pwa')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  const features = (getStringArg(args, 'features') ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const token = await new SignJWT({
    lic_id: licenseId,
    customer,
    tier,
    issued_at: now,
    expires_at: expiresAt,
    grace_offline_until: graceOfflineUntil,
    channels,
    features,
    beta_generation: generation,
  })
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(privateKey);

  const out = getStringArg(args, 'out');
  if (out) {
    fs.writeFileSync(path.resolve(out), `${token}\n`, 'utf-8');
  }

  console.log('\nLicense created:');
  console.log(`  lic_id: ${licenseId}`);
  console.log(`  customer: ${customer}`);
  console.log(`  tier: ${tier}`);
  console.log(`  beta_generation: ${generation}`);
  console.log(`  expires_at: ${new Date(expiresAt * 1000).toISOString()}`);
  console.log(`  grace_offline_until: ${new Date(graceOfflineUntil * 1000).toISOString()}`);
  if (out) {
    console.log(`  token_file: ${path.resolve(out)}`);
  }
  console.log('\nToken:');
  console.log(token);
}

function listRevocations(args: ArgMap): void {
  const revocationFile = resolveRevocationFile(args);
  const state = loadRevocations(revocationFile);
  console.log(`\nRevocation file: ${revocationFile}`);
  console.log(`revokedLicenses (${state.revokedLicenses.length}):`);
  state.revokedLicenses.forEach((id) => console.log(`  - ${id}`));
  console.log(`revokedGenerations (${state.revokedGenerations.length}):`);
  state.revokedGenerations.forEach((g) => console.log(`  - ${g}`));
}

function updateLicenseRevocation(args: ArgMap, remove = false): void {
  const revocationFile = resolveRevocationFile(args);
  const licenseId = getRequiredArg(args, 'license-id');
  const state = loadRevocations(revocationFile);

  if (remove) {
    state.revokedLicenses = state.revokedLicenses.filter((id) => id !== licenseId);
    saveRevocations(revocationFile, state);
    console.log(`Removed revoked license: ${licenseId}`);
    return;
  }

  if (!state.revokedLicenses.includes(licenseId)) {
    state.revokedLicenses.push(licenseId);
  }
  saveRevocations(revocationFile, state);
  console.log(`Revoked license: ${licenseId}`);
}

function updateGenerationRevocation(args: ArgMap, remove = false): void {
  const revocationFile = resolveRevocationFile(args);
  const generation = getRequiredArg(args, 'generation');
  const state = loadRevocations(revocationFile);

  if (remove) {
    state.revokedGenerations = state.revokedGenerations.filter((id) => id !== generation);
    saveRevocations(revocationFile, state);
    console.log(`Removed revoked generation: ${generation}`);
    return;
  }

  if (!state.revokedGenerations.includes(generation)) {
    state.revokedGenerations.push(generation);
  }
  saveRevocations(revocationFile, state);
  console.log(`Revoked generation: ${generation}`);
}

async function main(): Promise<void> {
  const { command, args } = parseArgs(process.argv.slice(2));

  if (!command || command === 'help' || args.help) {
    printHelp();
    return;
  }

  switch (command) {
    case 'create':
      await createLicense(args);
      return;
    case 'list-revocations':
      listRevocations(args);
      return;
    case 'revoke-license':
      updateLicenseRevocation(args, false);
      return;
    case 'unrevoke-license':
      updateLicenseRevocation(args, true);
      return;
    case 'revoke-generation':
      updateGenerationRevocation(args, false);
      return;
    case 'unrevoke-generation':
      updateGenerationRevocation(args, true);
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((err) => {
  console.error(`\n[license-admin] ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
