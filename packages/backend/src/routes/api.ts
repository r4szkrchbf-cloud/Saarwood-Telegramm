import { Router } from 'express';
import { z } from 'zod';
import type { Request, Response } from 'express';
import type { ControlServer } from '../websocket/ControlServer';
import type { MosHandler } from '../mos/MosHandler';
import type { NdiAdapter } from '../ndi/NdiAdapter';

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
): Router {
  const router = Router();

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
