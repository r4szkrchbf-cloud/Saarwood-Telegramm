import { randomUUID } from 'crypto';
import { compare } from 'bcryptjs';

export type AdminRole = 'owner' | 'operator' | 'editor' | 'viewer';
export type AdminAuthMethod = 'password' | 'sso' | 'magic-link';

interface AuthUser {
  adminId: string;
  email: string;
  displayName: string;
  role: AdminRole;
  password: string;
}

export interface AuthSession {
  adminId: string;
  email: string;
  displayName: string;
  role: AdminRole;
  authMethod: AdminAuthMethod;
  jti: string;
  exp: number;
}

interface JwtPayload {
  sub: string;
  aid: string;
  email: string;
  name: string;
  role: AdminRole;
  method: AdminAuthMethod;
  jti: string;
}

const FALLBACK_USERS: AuthUser[] = [
  {
    adminId: 'ADM-OWNER-01',
    email: 'owner@saarwood.ch',
    displayName: 'Owner Console',
    role: 'owner',
    password: 'CHANGE_ME_IN_ENV',
  },
  {
    adminId: 'ADM-OPS-01',
    email: 'operator@saarwood.ch',
    displayName: 'Operator Desk',
    role: 'operator',
    password: 'CHANGE_ME_IN_ENV',
  },
  {
    adminId: 'ADM-EDIT-01',
    email: 'editor@saarwood.ch',
    displayName: 'Editor Studio',
    role: 'editor',
    password: 'CHANGE_ME_IN_ENV',
  },
  {
    adminId: 'ADM-VIEW-01',
    email: 'viewer@saarwood.ch',
    displayName: 'Viewer Audit',
    role: 'viewer',
    password: 'CHANGE_ME_IN_ENV',
  },
];

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value.trim());
}

function parseUsers(raw: string | undefined): AuthUser[] {
  if (!raw?.trim()) return FALLBACK_USERS;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return FALLBACK_USERS;

    const users = parsed.filter((entry): entry is AuthUser => {
      if (typeof entry !== 'object' || entry === null) return false;
      const candidate = entry as Partial<AuthUser>;
      return Boolean(
        candidate.adminId
          && candidate.email
          && candidate.displayName
          && candidate.role
          && candidate.password,
      );
    });

    return users.length > 0 ? users : FALLBACK_USERS;
  } catch {
    return FALLBACK_USERS;
  }
}

export class AuthService {
  private readonly users: AuthUser[];
  private readonly jwtSecret: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly ttlSec: number;
  private readonly revokedJti = new Set<string>();

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const rawUsers = process.env.ADMIN_AUTH_USERS_JSON;
    const parsedUsers = parseUsers(rawUsers);
    const requireHashedPasswords = process.env.ADMIN_AUTH_REQUIRE_HASHED_PASSWORDS !== 'false';

    if (isProduction && parsedUsers === FALLBACK_USERS) {
      throw new Error(
        'auth-config-error: ADMIN_AUTH_USERS_JSON is required in production and must not use fallback users',
      );
    }

    if (isProduction && requireHashedPasswords) {
      const usersWithPlaintextPassword = parsedUsers
        .filter((user) => !isBcryptHash(user.password))
        .map((user) => user.adminId || user.email);

      if (usersWithPlaintextPassword.length > 0) {
        throw new Error(
          `auth-config-error: ADMIN_AUTH_USERS_JSON contains non-bcrypt passwords for: ${usersWithPlaintextPassword.join(', ')}`,
        );
      }
    }

    const rawJwtSecret = process.env.ADMIN_AUTH_JWT_SECRET?.trim();
    if (isProduction) {
      if (!rawJwtSecret) {
        throw new Error('auth-config-error: ADMIN_AUTH_JWT_SECRET is required in production');
      }

      const forbiddenSecrets = new Set(['dev-admin-auth-secret', 'change-me', 'CHANGE_ME_IN_ENV']);
      if (forbiddenSecrets.has(rawJwtSecret)) {
        throw new Error('auth-config-error: ADMIN_AUTH_JWT_SECRET uses a forbidden placeholder/default value');
      }
    }

    this.users = parsedUsers;
    this.jwtSecret = new TextEncoder().encode(rawJwtSecret ?? 'dev-admin-auth-secret');
    this.issuer = process.env.ADMIN_AUTH_ISSUER ?? 'saarwood-auth';
    this.audience = process.env.ADMIN_AUTH_AUDIENCE ?? 'saarwood-admin';
    this.ttlSec = Number.parseInt(process.env.ADMIN_AUTH_TTL_SEC ?? '28800', 10);
  }

  public getProviderConfig() {
    return {
      ssoProvider: process.env.ADMIN_AUTH_SSO_PROVIDER ?? 'oidc',
      ssoEnabled: process.env.ADMIN_AUTH_SSO_ENABLED === 'true',
      magicLinkEnabled: process.env.ADMIN_AUTH_MAGIC_LINK_ENABLED === 'true',
    };
  }

  public async login(params: {
    identifier: string;
    password: string;
    method: AdminAuthMethod;
  }): Promise<{ accessToken: string; expiresInSec: number; user: Omit<AuthSession, 'jti' | 'exp' | 'authMethod'>; authMethod: AdminAuthMethod }> {
    const account = this.findUser(params.identifier);

    if (!account) {
      throw new Error('auth-user-not-found');
    }

    if (params.method === 'password') {
      const isValidPassword = await this.verifyPassword(account.password, params.password);
      if (!isValidPassword) {
        throw new Error('auth-invalid-password');
      }
    }

    if (params.method === 'sso' && !this.getProviderConfig().ssoEnabled) {
      throw new Error('auth-sso-disabled');
    }

    if (params.method === 'magic-link' && !this.getProviderConfig().magicLinkEnabled) {
      throw new Error('auth-magic-link-disabled');
    }

    const jti = randomUUID();
    const expiresInSec = Number.isFinite(this.ttlSec) ? this.ttlSec : 28800;

    const { SignJWT } = await import('jose');

    const token = await new SignJWT({
      aid: account.adminId,
      email: account.email,
      name: account.displayName,
      role: account.role,
      method: params.method,
      jti,
    } satisfies Omit<JwtPayload, 'sub'>)
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(account.adminId)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setJti(jti)
      .setIssuedAt()
      .setExpirationTime(`${expiresInSec}s`)
      .sign(this.jwtSecret);

    return {
      accessToken: token,
      expiresInSec,
      authMethod: params.method,
      user: {
        adminId: account.adminId,
        email: account.email,
        displayName: account.displayName,
        role: account.role,
      },
    };
  }

  public async verifyToken(token: string): Promise<AuthSession | null> {
    try {
      const { jwtVerify } = await import('jose');
      const { payload } = await jwtVerify(token, this.jwtSecret, {
        issuer: this.issuer,
        audience: this.audience,
      });

      const jti = payload.jti;
      if (!jti || this.revokedJti.has(jti)) return null;

      return {
        adminId: String(payload.aid ?? payload.sub ?? ''),
        email: String(payload.email ?? ''),
        displayName: String(payload.name ?? ''),
        role: String(payload.role ?? 'viewer') as AdminRole,
        authMethod: String(payload.method ?? 'password') as AdminAuthMethod,
        jti,
        exp: Number(payload.exp ?? 0),
      };
    } catch {
      return null;
    }
  }

  public async revokeToken(token: string): Promise<void> {
    const session = await this.verifyToken(token);
    if (!session) return;
    this.revokedJti.add(session.jti);
  }

  private findUser(identifier: string): AuthUser | null {
    const needle = identifier.trim().toLowerCase();
    if (!needle) return null;

    return this.users.find(
      (user) => user.email.toLowerCase() === needle || user.adminId.toLowerCase() === needle,
    ) ?? null;
  }

  private async verifyPassword(storedPassword: string, providedPassword: string): Promise<boolean> {
    const normalizedStored = storedPassword.trim();
    const normalizedProvided = providedPassword;

    // bcrypt hash format: $2a$, $2b$, or $2y$ followed by cost and hash payload.
    if (isBcryptHash(normalizedStored)) {
      return compare(normalizedProvided, normalizedStored);
    }

    // Legacy plaintext is only tolerated outside production for local transition.
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    return normalizedStored === normalizedProvided;
  }
}
