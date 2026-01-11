import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import path from 'path';
import fs from 'fs';

// Fix for missing types in this context
declare const __dirname: string;

let mainWindow: BrowserWindow | null = null;
const OFFLINE_DATA_PATH = path.join(app.getPath('userData'), 'shijra-offline-data.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#020617', // Match Navy-950
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the React App (In prod, this points to build/index.html)
  // In dev, usually localhost:3000
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Sync Offline Data on Load
  mainWindow.webContents.on('did-finish-load', () => {
    try {
      if (fs.existsSync(OFFLINE_DATA_PATH)) {
        const data = fs.readFileSync(OFFLINE_DATA_PATH, 'utf-8');
        mainWindow?.webContents.send('sync-offline-data', JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load offline data', e);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- APP LIFECYCLE ---

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // Cast process to any to avoid "Property 'platform' does not exist on type 'Process'" error
  if ((process as any).platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// --- IPC HANDLERS ---

// 1. Save Data for Offline Mode
ipcMain.handle('save-offline-data', async (event, data) => {
  try {
    fs.writeFileSync(OFFLINE_DATA_PATH, JSON.stringify(data));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// 2. Show Native Notification
ipcMain.handle('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'Shijra Legacy',
      body: body,
      icon: path.join(__dirname, '../public/logo.png')
    }).show();
  }
});