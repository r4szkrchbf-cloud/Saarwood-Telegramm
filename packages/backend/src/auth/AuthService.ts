import { randomUUID } from 'crypto';

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
    password: 'owner123!',
  },
  {
    adminId: 'ADM-OPS-01',
    email: 'operator@saarwood.ch',
    displayName: 'Operator Desk',
    role: 'operator',
    password: 'operator123!',
  },
  {
    adminId: 'ADM-EDIT-01',
    email: 'editor@saarwood.ch',
    displayName: 'Editor Studio',
    role: 'editor',
    password: 'editor123!',
  },
  {
    adminId: 'ADM-VIEW-01',
    email: 'viewer@saarwood.ch',
    displayName: 'Viewer Audit',
    role: 'viewer',
    password: 'viewer123!',
  },
];

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
    this.users = parseUsers(process.env.ADMIN_AUTH_USERS_JSON);
    this.jwtSecret = new TextEncoder().encode(process.env.ADMIN_AUTH_JWT_SECRET ?? 'dev-admin-auth-secret');
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

    if (params.method === 'password' && account.password !== params.password) {
      throw new Error('auth-invalid-password');
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
}
