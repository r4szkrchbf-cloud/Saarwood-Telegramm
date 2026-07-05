import { app, BrowserWindow, shell, Menu, dialog } from 'electron';
import { ChildProcess, spawn } from 'child_process';
import http from 'http';
import path from 'path';

// ─── Configuration ─────────────────────────────────────────────────────────────

const BACKEND_PORT = 4000;
const HEALTH_URL = `http://localhost:${BACKEND_PORT}/api/health`;
const FRONTEND_URL = `http://localhost:${BACKEND_PORT}`;

let backendProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

// ─── Resolve paths ─────────────────────────────────────────────────────────────

/**
 * Resolve the path to the bundled backend server.js.
 * In packaged builds, extra resources are placed under process.resourcesPath.
 * In development, fall back to the workspace relative path.
 */
function resolveBackendPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend', 'server.js');
  }
  // Development: backend is built into packages/backend/dist/server.js
  return path.resolve(__dirname, '../../backend/dist/server.js');
}

/**
 * Resolve the path to the built frontend static files.
 * In packaged builds, the frontend dist is bundled under resources/frontend.
 * In development, fall back to the workspace relative path.
 */
function resolveFrontendDist(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'frontend');
  }
  return path.resolve(__dirname, '../../frontend/dist');
}

// ─── Backend lifecycle ─────────────────────────────────────────────────────────

function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverPath = resolveBackendPath();
    const frontendDist = resolveFrontendDist();

    console.log('[Electron] Starting backend:', serverPath);

    backendProcess = spawn(process.execPath, [serverPath], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: String(BACKEND_PORT),
        APP_TIER: 'expert',
        ENABLE_MOS: 'false',   // MOS disabled by default in desktop mode
        ENABLE_NDI: 'false',   // NDI disabled by default in desktop mode
        CORS_ORIGIN: FRONTEND_URL,
        FRONTEND_DIST: frontendDist,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    backendProcess.stdout?.on('data', (chunk: Buffer) => {
      process.stdout.write(`[Backend] ${chunk.toString().trim()}\n`);
    });

    backendProcess.stderr?.on('data', (chunk: Buffer) => {
      process.stderr.write(`[Backend ERR] ${chunk.toString().trim()}\n`);
    });

    backendProcess.on('error', (err) => {
      console.error('[Electron] Failed to start backend process:', err.message);
      reject(err);
    });

    backendProcess.on('exit', (code) => {
      if (code !== null && code !== 0) {
        console.error(`[Electron] Backend exited unexpectedly with code ${code}`);
      }
      backendProcess = null;
    });

    // Poll the health endpoint until the backend is ready
    const timeout = setTimeout(() => {
      reject(new Error('Backend health check timed out after 30 seconds'));
    }, 30_000);

    const poll = (attempt = 0) => {
      if (attempt > 0) {
        console.log(`[Electron] Waiting for backend... (attempt ${attempt})`);
      }
      http.get(HEALTH_URL, (res) => {
        clearTimeout(timeout);
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(() => poll(attempt + 1), 1000);
        }
        res.resume();
      }).on('error', () => {
        setTimeout(() => poll(attempt + 1), 1000);
      });
    };

    // Give the process a head-start before first poll
    setTimeout(() => poll(), 800);
  });
}

function stopBackend(): void {
  if (backendProcess) {
    console.log('[Electron] Stopping backend...');
    backendProcess.kill('SIGTERM');
    backendProcess = null;
  }
}

// ─── Window ────────────────────────────────────────────────────────────────────

function buildMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences…',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow?.loadURL(`${FRONTEND_URL}/?settings=1`),
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/saarnews/saarwood_telepromter');
          },
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/saarnews/saarwood_telepromter/issues');
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    title: 'Saarwood Teleprompter — Beta V1',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Open external links in the system browser, not in Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url).catch(console.error);
    return { action: 'deny' };
  });

  mainWindow.loadURL(FRONTEND_URL).catch((err) => {
    dialog.showErrorBox('Load Error', `Could not load app: ${err.message}`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  buildMenu();
  try {
    await startBackend();
    createWindow();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    dialog.showErrorBox('Startup Failed', `Saarwood Teleprompter could not start:\n\n${message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopBackend();
});
