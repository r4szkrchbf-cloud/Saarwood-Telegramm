import { Router } from 'express';
import { z } from 'zod';
import type { Request, Response } from 'express';
import type { ControlServer } from '../websocket/ControlServer';
import type { MosHandler } from '../mos/MosHandler';
import type { NdiAdapter } from '../ndi/NdiAdapter';
import type { LicenseService } from '../license/LicenseService';
import type { SupportService } from '../support/SupportService';
import { AuthService } from '../auth/AuthService';

/**
 * REST API routes
 *
 * All endpoints are prefixed with /api (configured in server.ts).
 * Secured via CORS policy set in server.ts.
 */

// ─── Ingest schema (SRS-REQ-3.1) ─────────────────────────────────────────────

const ingestSchema = z.object({
  /** Target profile identifier (studio, presenter, or show profile). */
  targetProfileId: z.string().min(1),
  /** Logical slot key within the show profile (e.g. "slot_01_intro"). */
  slotKey: z.string().min(1),
  /** Raw text content to ingest (plain text or simple HTML). */
  rawText: z.string().min(1),
  /** Origin system for audit logging. */
  source: z.enum(['clickup', 'n8n', 'manual']).optional(),
  /**
   * breaking: triggers an immediate hot-update WebSocket broadcast to all
   * connected clients without waiting for any debounce window.
   */
  priority: z.enum(['normal', 'breaking']).optional().default('normal'),
});

export type IngestPayload = z.infer<typeof ingestSchema>;

export function createRouter(
  controlServer: ControlServer,
  mosHandler: MosHandler,
  ndiAdapter: NdiAdapter,
  licenseService: LicenseService,
  supportService: SupportService,
): Router {
  const router = Router();
  const adminApiKey = process.env.ADMIN_API_KEY ?? '';
  const authService = new AuthService();

  const authMethodSchema = z.enum(['password', 'sso', 'magic-link']);

  const authLoginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().default(''),
    method: authMethodSchema.default('password'),
  });

  const activateSchema = z.object({
    token: z.string().min(10),
  });

  const revokeLicenseSchema = z.object({
    licenseId: z.string().min(1),
  });

  const revokeGenerationSchema = z.object({
    generation: z.string().min(1),
  });

  const createLicenseSchema = z.object({
    customer: z.string().min(1),
    tier: z.enum(['basic', 'professional', 'expert']).default('expert'),
    days: z.number().int().min(1).max(3650).default(30),
    offlineGraceDays: z.number().int().min(0).max(3650).default(14),
    generation: z.string().min(1).default('beta-v1'),
    channels: z.array(z.string().min(1)).default(['web', 'electron', 'pwa']),
    features: z.array(z.string().min(1)).default([]),
    licenseId: z.string().min(1).optional(),
  });

  const supportTicketSchema = z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(200),
    subject: z.string().min(3).max(200),
    message: z.string().min(10).max(8000),
    appVersion: z.string().max(64).default('unknown'),
    context: z.enum(['editor', 'split', 'prompter', 'unknown']).default('unknown'),
  });

  const supportTicketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);

  const updateSupportTicketSchema = z.object({
    status: supportTicketStatusSchema.optional(),
    assignedTo: z.string().max(120).optional().nullable(),
    internalNote: z.string().max(4000).optional().nullable(),
  });

  const supportClientLogSchema = z.object({
    level: z.enum(['info', 'warn', 'error']).default('info'),
    source: z.string().min(1).max(120).regex(/^[a-z0-9._-]+$/i),
    message: z.string().min(1).max(2000),
    details: z.string().max(4000).optional(),
  });

  const getTokenFromRequest = (req: Request): string | null => {
    const fromHeader = req.headers['x-license-token'];
    if (typeof fromHeader === 'string' && fromHeader.trim()) return fromHeader.trim();

    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      if (token) return token;
    }

    return null;
  };

  const getAccessTokenFromRequest = (req: Request): string | null => {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'string') return null;
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    return token || null;
  };

  const hasAdminAccess = (req: Request): boolean => {
    if (!adminApiKey) return false;

    const fromHeader = req.headers['x-admin-api-key'];
    if (typeof fromHeader === 'string' && fromHeader === adminApiKey) return true;

    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim() === adminApiKey;
    }

    return false;
  };

  const enforceAdminAccess = (req: Request, res: Response): boolean => {
    if (!adminApiKey) {
      res.status(503).json({ ok: false, error: 'admin-api-disabled' });
      return false;
    }

    if (!hasAdminAccess(req)) {
      res.status(401).json({ ok: false, error: 'admin-unauthorized' });
      return false;
    }

    return true;
  };

  const enforceAdminSessionOrApiKey = async (req: Request, res: Response): Promise<{ actor: string } | null> => {
    if (adminApiKey && hasAdminAccess(req)) {
      return { actor: 'admin-api-key' };
    }

    const token = getAccessTokenFromRequest(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'admin-unauthorized' });
      return null;
    }

    const session = await authService.verifyToken(token);
    if (!session) {
      res.status(401).json({ ok: false, error: 'admin-unauthorized' });
      return null;
    }

    return { actor: session.displayName || session.email || session.adminId };
  };

  // ─── Health check ────────────────────────────────────────────────────────
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      wsClients: controlServer.clientCount,
      mosClients: mosHandler.connectedNrcsCount,
    });
  });

  // ─── NDI status ──────────────────────────────────────────────────────────
  router.get('/ndi/status', (_req, res) => {
    res.json(ndiAdapter.getStatus());
  });

  // ─── Central admin auth API (JWT/session) ───────────────────────────────
  router.get('/admin/auth/providers', (_req, res) => {
    res.json({ ok: true, ...authService.getProviderConfig() });
  });

  router.post('/admin/auth/login', async (req, res) => {
    const parsed = authLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }

    try {
      const result = await authService.login(parsed.data);
      res.json({ ok: true, ...result });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'auth-login-failed';
      res.status(401).json({ ok: false, error: reason });
    }
  });

  router.get('/admin/auth/session', async (req, res) => {
    const token = getAccessTokenFromRequest(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'auth-token-missing' });
      return;
    }

    const session = await authService.verifyToken(token);
    if (!session) {
      res.status(401).json({ ok: false, error: 'auth-token-invalid' });
      return;
    }

    res.json({ ok: true, session });
  });

  router.post('/admin/auth/logout', async (req, res) => {
    const token = getAccessTokenFromRequest(req);
    if (!token) {
      res.status(200).json({ ok: true });
      return;
    }

    await authService.revokeToken(token);
    res.json({ ok: true });
  });

  // ─── WebSocket info (for mobile remote control UI) ───────────────────────
  router.get('/info', (req, res) => {
    const host = req.hostname;
    const proto = req.protocol === 'https' ? 'wss' : 'ws';
    res.json({
      wsUrl: `${proto}://${host}/ws`,
      version: '1.0.0',
      tier: process.env.APP_TIER ?? 'basic',
    });
  });

  // ─── License status / activation (Beta control) ─────────────────────────
  router.get('/license/status', async (req, res) => {
    const token = getTokenFromRequest(req);
    const result = await licenseService.validateToken(token);
    res.json({
      ...result,
      publicKeyPem: licenseService.getPublicKeyPem() ?? undefined,
    });
  });

  router.post('/license/activate', async (req, res) => {
    const parsed = activateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        ok: false,
        error: 'Validation failed',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
      return;
    }

    const result = await licenseService.validateToken(parsed.data.token);
    const ok = result.status === 'active';
    res.status(ok ? 200 : 403).json({
      ok,
      ...result,
      publicKeyPem: licenseService.getPublicKeyPem() ?? undefined,
    });
  });

  // ─── Admin license API (Phase C) ───────────────────────────────────────
  router.get('/admin/license/revocations', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    res.json({ ok: true, ...licenseService.getRevocations() });
  });

  router.post('/admin/license/revoke-license', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const parsed = revokeLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }
    const state = licenseService.revokeLicense(parsed.data.licenseId);
    res.json({ ok: true, ...state });
  });

  router.post('/admin/license/unrevoke-license', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const parsed = revokeLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }
    const state = licenseService.unrevokeLicense(parsed.data.licenseId);
    res.json({ ok: true, ...state });
  });

  router.post('/admin/license/revoke-generation', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const parsed = revokeGenerationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }
    const state = licenseService.revokeGeneration(parsed.data.generation);
    res.json({ ok: true, ...state });
  });

  router.post('/admin/license/unrevoke-generation', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const parsed = revokeGenerationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }
    const state = licenseService.unrevokeGeneration(parsed.data.generation);
    res.json({ ok: true, ...state });
  });

  router.post('/admin/license/create', async (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const parsed = createLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }

    try {
      const created = await licenseService.createSignedLicense(parsed.data);
      res.json({ ok: true, ...created });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'license-create-failed';
      res.status(500).json({ ok: false, error: message });
    }
  });

  // ─── Support contact/chat/ticket API ───────────────────────────────────
  router.get('/support/info', (_req, res) => {
    res.json({ ok: true, ...supportService.getInfo() });
  });

  router.post('/support/tickets', async (req, res) => {
    const parsed = supportTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        ok: false,
        error: 'validation-failed',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
      return;
    }

    try {
      const result = await supportService.createTicket(parsed.data);
      res.status(201).json({
        ok: true,
        ticketId: result.id,
        ...result,
      });
    } catch {
      res.status(500).json({ ok: false, error: 'support-ticket-create-failed' });
    }
  });

  router.post('/support/logs/client', (req, res) => {
    const parsed = supportClientLogSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }
    supportService.storeClientLog(parsed.data);
    res.status(201).json({ ok: true });
  });

  router.get('/support/logs', (req, res) => {
    if (!enforceAdminAccess(req, res)) return;
    const rawHours = Number(req.query.hours ?? 78);
    const rawLimit = Number(req.query.limit ?? 2000);
    const hours = Number.isFinite(rawHours) ? Math.max(1, Math.min(240, rawHours)) : 78;
    const limit = Number.isFinite(rawLimit) ? Math.max(10, Math.min(10000, rawLimit)) : 2000;
    const logs = supportService.getClientLogsWithinHours(hours, limit);
    res.json({ ok: true, hours, count: logs.length, logs });
  });

  router.get('/admin/support/tickets', async (req, res) => {
    const access = await enforceAdminSessionOrApiKey(req, res);
    if (!access) return;

    const rawLimit = Number(req.query.limit ?? 300);
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(2000, rawLimit)) : 300;
    const tickets = supportService.listTickets(limit);
    res.json({ ok: true, count: tickets.length, tickets });
  });

  router.patch('/admin/support/tickets/:ticketId', async (req, res) => {
    const access = await enforceAdminSessionOrApiKey(req, res);
    if (!access) return;

    const ticketId = String(req.params.ticketId ?? '').trim();
    if (!ticketId) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }

    const parsed = updateSupportTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ ok: false, error: 'validation-failed' });
      return;
    }

    const updated = supportService.updateTicket(ticketId, {
      ...parsed.data,
      actor: access.actor,
    });

    if (!updated) {
      res.status(404).json({ ok: false, error: 'ticket-not-found' });
      return;
    }

    res.json({ ok: true, ticket: updated });
  });

  // ─── Content Ingest (n8n / ClickUp webhook target) ───────────────────────
  // SRS-REQ-3.1: POST /api/v1/ingest
  // Authorization: ******
  router.post('/v1/ingest', (req: Request, res: Response) => {
    // ── Auth ──────────────────────────────────────────────────────────────
    const apiKey = process.env.INGEST_API_KEY;
    if (apiKey) {
      const authHeader = req.headers['authorization'] ?? '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
      if (token !== apiKey) {
        res.status(401).json({ ok: false, error: 'Unauthorized' });
        return;
      }
    }

    // ── Validation ────────────────────────────────────────────────────────
    const parsed = ingestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        ok: false,
        error: 'Validation failed',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
      return;
    }

    const { targetProfileId, slotKey, rawText, source, priority } = parsed.data;

    // ── Build segment & broadcast ─────────────────────────────────────────
    const segmentId = `ingest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Wrap plain text in a paragraph tag — the frontend renders it via Tiptap/DOMPurify
    const html = rawText.trimStart().startsWith('<')
      ? rawText
      : `<p>${rawText.replace(/\n/g, '</p><p>')}</p>`;

    const segment = {
      id: segmentId,
      html,
      direction: 'ltr' as const,
      isCloaked: false,
      isDirectorsNote: false,
    };

    // Broadcast as SCRIPT_UPDATE — clients merge incoming segments
    controlServer.broadcastIngest({
      segmentId,
      targetProfileId,
      slotKey,
      segment,
      priority: priority ?? 'normal',
      source: source ?? 'n8n',
      ingestedAt: Date.now(),
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log(
        `[Ingest] ${priority === 'breaking' ? '🔴 BREAKING' : '📥'} ` +
        `slot=${slotKey} profile=${targetProfileId} source=${source ?? 'n8n'} id=${segmentId}`,
      );
    }

    res.status(201).json({ ok: true, segmentId });
  });

  return router;
}
