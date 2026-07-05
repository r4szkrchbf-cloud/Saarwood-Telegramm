import http from 'http';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ControlServer } from './websocket/ControlServer';
import { MosHandler } from './mos/MosHandler';
import { createNdiAdapter } from './ndi/NdiAdapter';
import { createRouter } from './routes/api';
import { LicenseService } from './license/LicenseService';
import { SupportService } from './support/SupportService';

// ─── Configuration ───────────────────────────────────────────────────────────

const HTTP_PORT = parseInt(process.env.PORT ?? '4000', 10);
const MOS_PORT = parseInt(process.env.MOS_PORT ?? '10540', 10);
const ENABLE_MOS = process.env.ENABLE_MOS !== 'false';
const ENABLE_NDI = process.env.ENABLE_NDI !== 'false';
const APP_TIER = (process.env.APP_TIER ?? 'basic') as 'basic' | 'professional' | 'expert';
// FRONTEND_DIST can be overridden (e.g. by the Electron wrapper) so the backend
// can serve the built frontend from an arbitrary absolute path.
const FRONTEND_DIST = process.env.FRONTEND_DIST ?? '../frontend/dist';

// ─── Express app ─────────────────────────────────────────────────────────────

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Global rate limiter — generous for a LAN broadcast device
app.use(
  rateLimit({
    windowMs: 60_000,   // 1 minute window
    limit: 300,         // max 300 requests per IP per window
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: '1mb' }));

// Serve the built frontend PWA in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(FRONTEND_DIST));
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

const httpServer = http.createServer(app);

// ─── WebSocket control server ─────────────────────────────────────────────────

const controlServer = new ControlServer(httpServer);
console.log('[Server] WebSocket control server initialised on /ws');

// ─── NDI adapter ──────────────────────────────────────────────────────────────

const ndiAdapter = createNdiAdapter();
if (ENABLE_NDI) {
  ndiAdapter
    .init('Saarwood Teleprompter')
    .catch((err: Error) =>
      console.error('[NDI] Init failed:', err.message),
    );
}

// ─── MOS handler (Professional / Expert tiers) ────────────────────────────────

const mosHandler = new MosHandler(MOS_PORT);
const licenseService = new LicenseService();
const supportService = new SupportService();

if (ENABLE_MOS && APP_TIER !== 'basic') {
  mosHandler
    .start()
    .then(() => {
      // Forward MOS running order updates to all WebSocket clients
      mosHandler.onEvent((event) => {
        controlServer.broadcastMosUpdate(event);
      });
    })
    .catch((err: Error) => {
      console.warn(
        `[MOS] Could not start on port ${MOS_PORT}: ${err.message}. ` +
        'MOS integration disabled.',
      );
    });
}

// ─── REST API ─────────────────────────────────────────────────────────────────

app.use('/api', createRouter(controlServer, mosHandler, ndiAdapter, licenseService, supportService));

// ─── 404 fallback (SPA) ───────────────────────────────────────────────────────

app.use((_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile('index.html', { root: FRONTEND_DIST });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

httpServer.listen(HTTP_PORT, () => {
  console.log(`[Server] Saarwood Teleprompter backend running on port ${HTTP_PORT}`);
  console.log(`[Server] Tier: ${APP_TIER}`);
  console.log(`[Server] MOS: ${ENABLE_MOS && APP_TIER !== 'basic' ? `TCP port ${MOS_PORT}` : 'disabled'}`);
  console.log(`[Server] NDI: ${ENABLE_NDI ? 'adapter loaded (stub if no native addon)' : 'disabled'}`);
  console.log(`[Server] License mode: ${licenseService.getMode()}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received — shutting down gracefully');
  mosHandler.stop();
  ndiAdapter.destroy();
  controlServer.close().finally(() => {
    httpServer.close(() => process.exit(0));
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received');
  mosHandler.stop();
  ndiAdapter.destroy();
  controlServer.close().finally(() => {
    httpServer.close(() => process.exit(0));
  });
});

export { httpServer, controlServer, mosHandler, ndiAdapter, licenseService, supportService };
