import fs from 'fs';
import path from 'path';
import { jwtVerify, importSPKI, importPKCS8, SignJWT } from 'jose';

export type LicenseMode = 'disabled' | 'monitor' | 'enforce';
export type LicenseStatus = 'active' | 'expired' | 'revoked' | 'invalid' | 'missing';

export interface LicenseClaims {
  lic_id: string;
  customer?: string;
  tier?: 'basic' | 'professional' | 'expert';
  issued_at?: number;
  expires_at?: number;
  grace_offline_until?: number;
  channels?: string[];
  features?: string[];
  beta_generation?: string;
}

interface RevocationState {
  revokedLicenses: string[];
  revokedGenerations: string[];
}

export interface CreateLicenseInput {
  customer: string;
  tier: 'basic' | 'professional' | 'expert';
  days: number;
  offlineGraceDays: number;
  generation: string;
  channels: string[];
  features: string[];
  licenseId?: string;
}

export interface CreatedLicense {
  token: string;
  claims: LicenseClaims;
}

export interface LicenseValidationResult {
  mode: LicenseMode;
  status: LicenseStatus;
  reason?: string;
  now: number;
  claims?: LicenseClaims;
}

export class LicenseService {
  private readonly mode: LicenseMode;

  private readonly publicKeyPem: string | null;

  private readonly privateKeyPem: string | null;

  private readonly revocationFilePath: string;

  constructor() {
    const envMode = (process.env.LICENSE_MODE ?? 'disabled').toLowerCase();
    if (envMode === 'monitor' || envMode === 'enforce' || envMode === 'disabled') {
      this.mode = envMode;
    } else {
      this.mode = 'disabled';
    }

    this.publicKeyPem = process.env.LICENSE_PUBLIC_KEY_PEM ?? null;
    this.privateKeyPem = process.env.LICENSE_PRIVATE_KEY_PEM ?? null;
    this.revocationFilePath = process.env.LICENSE_REVOCATION_FILE
      ?? path.resolve(__dirname, '../../config/license-revocations.json');
  }

  getMode(): LicenseMode {
    return this.mode;
  }

  canSignTokens(): boolean {
    return Boolean(this.privateKeyPem);
  }

  async validateToken(token: string | null | undefined): Promise<LicenseValidationResult> {
    const now = Math.floor(Date.now() / 1000);

    if (this.mode === 'disabled') {
      return { mode: this.mode, status: 'active', reason: 'licensing-disabled', now };
    }

    if (!token) {
      return { mode: this.mode, status: 'missing', reason: 'license-token-missing', now };
    }

    if (!this.publicKeyPem) {
      return {
        mode: this.mode,
        status: 'invalid',
        reason: 'license-public-key-missing',
        now,
      };
    }

    try {
      const publicKey = await importSPKI(this.publicKeyPem, 'EdDSA');
      const verified = await jwtVerify(token, publicKey, {
        algorithms: ['EdDSA'],
      });

      const payload = verified.payload;
      const claims: LicenseClaims = {
        lic_id: String(payload.lic_id ?? ''),
        customer: payload.customer ? String(payload.customer) : undefined,
        tier: payload.tier === 'basic' || payload.tier === 'professional' || payload.tier === 'expert'
          ? payload.tier
          : undefined,
        issued_at: typeof payload.issued_at === 'number' ? payload.issued_at : undefined,
        expires_at: typeof payload.expires_at === 'number' ? payload.expires_at : undefined,
        grace_offline_until:
          typeof payload.grace_offline_until === 'number' ? payload.grace_offline_until : undefined,
        channels: Array.isArray(payload.channels)
          ? payload.channels.map((v) => String(v))
          : undefined,
        features: Array.isArray(payload.features)
          ? payload.features.map((v) => String(v))
          : undefined,
        beta_generation: payload.beta_generation ? String(payload.beta_generation) : undefined,
      };

      if (!claims.lic_id) {
        return { mode: this.mode, status: 'invalid', reason: 'lic-id-missing', now };
      }

      const revocations = this.readRevocations();
      if (revocations.revokedLicenses.includes(claims.lic_id)) {
        return { mode: this.mode, status: 'revoked', reason: 'license-revoked', now, claims };
      }

      if (claims.beta_generation && revocations.revokedGenerations.includes(claims.beta_generation)) {
        return { mode: this.mode, status: 'revoked', reason: 'generation-revoked', now, claims };
      }

      if (claims.expires_at && now > claims.expires_at) {
        return { mode: this.mode, status: 'expired', reason: 'license-expired', now, claims };
      }

      return { mode: this.mode, status: 'active', now, claims };
    } catch {
      return { mode: this.mode, status: 'invalid', reason: 'signature-invalid', now };
    }
  }

  private readRevocations(): RevocationState {
    try {
      const raw = fs.readFileSync(this.revocationFilePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<RevocationState>;
      const revokedLicenses = Array.isArray(parsed.revokedLicenses)
        ? parsed.revokedLicenses.map((v) => String(v))
        : [];
      const revokedGenerations = Array.isArray(parsed.revokedGenerations)
        ? parsed.revokedGenerations.map((v) => String(v))
        : [];
      return { revokedLicenses, revokedGenerations };
    } catch {
      return { revokedLicenses: [], revokedGenerations: [] };
    }
  }

  getRevocations(): RevocationState {
    return this.readRevocations();
  }

  revokeLicense(licenseId: string): RevocationState {
    const state = this.readRevocations();
    if (!state.revokedLicenses.includes(licenseId)) {
      state.revokedLicenses.push(licenseId);
    }
    this.writeRevocations(state);
    return this.readRevocations();
  }

  unrevokeLicense(licenseId: string): RevocationState {
    const state = this.readRevocations();
    state.revokedLicenses = state.revokedLicenses.filter((id) => id !== licenseId);
    this.writeRevocations(state);
    return this.readRevocations();
  }

  revokeGeneration(generation: string): RevocationState {
    const state = this.readRevocations();
    if (!state.revokedGenerations.includes(generation)) {
      state.revokedGenerations.push(generation);
    }
    this.writeRevocations(state);
    return this.readRevocations();
  }

  unrevokeGeneration(generation: string): RevocationState {
    const state = this.readRevocations();
    state.revokedGenerations = state.revokedGenerations.filter((id) => id !== generation);
    this.writeRevocations(state);
    return this.readRevocations();
  }

  async createSignedLicense(input: CreateLicenseInput): Promise<CreatedLicense> {
    if (!this.privateKeyPem) {
      throw new Error('license-private-key-missing');
    }

    const privateKey = await importPKCS8(this.privateKeyPem, 'EdDSA');
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + Math.max(1, Math.floor(input.days)) * 24 * 60 * 60;
    const graceOfflineUntil = expiresAt + Math.max(0, Math.floor(input.offlineGraceDays)) * 24 * 60 * 60;
    const licenseId = input.licenseId ?? `lic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const claims: LicenseClaims = {
      lic_id: licenseId,
      customer: input.customer,
      tier: input.tier,
      issued_at: now,
      expires_at: expiresAt,
      grace_offline_until: graceOfflineUntil,
      channels: input.channels,
      features: input.features,
      beta_generation: input.generation,
    };

    const tokenPayload = {
      lic_id: claims.lic_id,
      customer: claims.customer,
      tier: claims.tier,
      issued_at: claims.issued_at,
      expires_at: claims.expires_at,
      grace_offline_until: claims.grace_offline_until,
      channels: claims.channels,
      features: claims.features,
      beta_generation: claims.beta_generation,
    };

    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(expiresAt)
      .sign(privateKey);

    return { token, claims };
  }

  private writeRevocations(state: RevocationState): void {
    fs.mkdirSync(path.dirname(this.revocationFilePath), { recursive: true });
    fs.writeFileSync(
      this.revocationFilePath,
      `${JSON.stringify(
        {
          revokedLicenses: Array.from(new Set(state.revokedLicenses)).sort(),
          revokedGenerations: Array.from(new Set(state.revokedGenerations)).sort(),
        },
        null,
        2,
      )}\n`,
      'utf-8',
    );
  }
}
