import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const args = {
    in: '',
    export: false,
    out: '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--in') {
      args.in = argv[i + 1] ?? '';
      i += 1;
      continue;
    }

    if (token === '--export') {
      args.export = true;
      continue;
    }

    if (token === '--out') {
      args.out = argv[i + 1] ?? '';
      i += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!args.in) {
    printUsage();
    throw new Error('Missing required argument --in.');
  }

  return args;
}

function printUsage() {
  process.stdout.write(
    [
      'Usage:',
      '  node packages/backend/scripts/renderAdminAuthUsersEnv.mjs --in <hashed-users.json> [--export] [--out <file>]',
      '',
      'Output:',
      '  Prints one line: ADMIN_AUTH_USERS_JSON=<one-line-json>',
      '  With --export: export ADMIN_AUTH_USERS_JSON=<one-line-json>',
      '  With --out: writes the same line to a file.',
      '',
    ].join('\n'),
  );
}

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value.trim());
}

function isValidRole(role) {
  return role === 'owner' || role === 'operator' || role === 'editor' || role === 'viewer';
}

function readUsers(filePath) {
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
    throw new Error('Input JSON must be an array.');
  }

  for (let i = 0; i < parsed.length; i += 1) {
    const user = parsed[i];
    if (typeof user !== 'object' || user === null) {
      throw new Error(`Entry ${i} is not an object.`);
    }

    const requiredFields = ['adminId', 'email', 'displayName', 'role', 'password'];
    for (const field of requiredFields) {
      if (typeof user[field] !== 'string' || !user[field].trim()) {
        throw new Error(`Entry ${i} has missing or invalid field: ${field}`);
      }
    }

    if (!isValidRole(user.role)) {
      throw new Error(`Entry ${i} has invalid role: ${user.role}`);
    }

    if (!isBcryptHash(user.password)) {
      throw new Error(`Entry ${i} has non-bcrypt password. Use auth:hash-users first.`);
    }
  }

  return parsed;
}

function shellSingleQuote(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.in);
  const users = readUsers(inputPath);
  const oneLineJson = JSON.stringify(users);
  const variableLinePrefix = args.export ? 'export ' : '';
  const line = `${variableLinePrefix}ADMIN_AUTH_USERS_JSON=${shellSingleQuote(oneLineJson)}`;

  process.stdout.write(`${line}\n`);

  if (args.out) {
    const outputPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${line}\n`, 'utf8');
    process.stderr.write(`Wrote env line to: ${outputPath}\n`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
