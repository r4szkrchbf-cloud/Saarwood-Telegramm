import fs from 'fs';
import path from 'path';
import { hash } from 'bcryptjs';

function parseArgs(argv) {
  const args = {
    in: '',
    out: '',
    cost: 12,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--in') {
      args.in = argv[i + 1] ?? '';
      i += 1;
      continue;
    }

    if (token === '--out') {
      args.out = argv[i + 1] ?? '';
      i += 1;
      continue;
    }

    if (token === '--cost') {
      const raw = argv[i + 1] ?? '';
      const parsed = Number.parseInt(raw, 10);
      if (Number.isNaN(parsed) || parsed < 8 || parsed > 15) {
        throw new Error('Invalid --cost value. Use an integer between 8 and 15.');
      }
      args.cost = parsed;
      i += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!args.in || !args.out) {
    printUsage();
    throw new Error('Missing required arguments --in and --out.');
  }

  return args;
}

function printUsage() {
  process.stdout.write(
    [
      'Usage:',
      '  node packages/backend/scripts/generateAdminAuthUsersJson.mjs --in <plain-users.json> --out <hashed-users.json> [--cost 12]',
      '',
      'Input format (array):',
      '  [{"adminId":"ADM-OWNER-01","email":"owner@example.com","displayName":"Owner","role":"owner","password":"plain-password"}]',
      '',
      'Output format:',
      '  Same schema, but password values are bcrypt hashes.',
      '',
    ].join('\n'),
  );
}

function isValidRole(role) {
  return role === 'owner' || role === 'operator' || role === 'editor' || role === 'viewer';
}

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value.trim());
}

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Input is not valid JSON: ${filePath}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Input JSON must be an array of admin users.');
  }

  return parsed;
}

function validateUser(user, index) {
  if (typeof user !== 'object' || user === null) {
    throw new Error(`Entry ${index} is not an object.`);
  }

  const requiredFields = ['adminId', 'email', 'displayName', 'role', 'password'];
  for (const field of requiredFields) {
    if (typeof user[field] !== 'string' || !user[field].trim()) {
      throw new Error(`Entry ${index} has missing or invalid field: ${field}`);
    }
  }

  if (!isValidRole(user.role)) {
    throw new Error(`Entry ${index} has invalid role: ${user.role}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.in);
  const outputPath = path.resolve(args.out);

  const users = readJsonArray(inputPath);
  for (let i = 0; i < users.length; i += 1) {
    validateUser(users[i], i);
  }

  const hashedUsers = [];
  for (const user of users) {
    const currentPassword = user.password.trim();
    const nextPassword = isBcryptHash(currentPassword)
      ? currentPassword
      : await hash(currentPassword, args.cost);

    hashedUsers.push({
      adminId: user.adminId.trim(),
      email: user.email.trim(),
      displayName: user.displayName.trim(),
      role: user.role,
      password: nextPassword,
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(hashedUsers, null, 2)}\n`, 'utf8');

  process.stdout.write(`Wrote hashed users JSON: ${outputPath}\n`);
  process.stdout.write('Use in environment as ADMIN_AUTH_USERS_JSON=<file-content-as-one-line-json>\n');
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
