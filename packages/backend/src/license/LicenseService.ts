import fs from 'fs';
import path from 'path';
import { jwtVerify, importSPKI } from 'jose';

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

  private readonly revocationFilePath: string;

  constructor() {
    const envMode = (process.env.LICENSE_MODE ?? 'disabled').toLowerCase();
    if (envMode === 'monitor' || envMode === 'enforce' || envMode === 'disabled') {
      this.mode = envMode;
    } else {
      this.mode = 'disabled';
    }

    this.publicKeyPem = process.env.LICENSE_PUBLIC_KEY_PEM ?? null;
    this.revocationFilePath = process.env.LICENSE_REVOCATION_FILE
      ?? path.resolve(__dirname, '../../config/license-revocations.json');
  }

  getMode(): LicenseMode {
    return this.mode;
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
}
