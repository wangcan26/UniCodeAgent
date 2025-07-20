import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { Agenter, AgentType } from './agenter';
import * as ENV from 'dotenv';

let mainWindow: BrowserWindow | null = null;

let mainAgenter: Agenter | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  ENV.config();
  mainWindow.loadFile('index.html');
  
  // Send test message after window loads
  mainWindow.webContents.on('did-finish-load', () => {
    console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY}`)
    mainWindow?.webContents.send('initalize-agent', process.env.OPENAI_API_KEY);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Get application path
ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('create-agent', async (event, key: string) => {
  const config = {
    apiKey: key,
    type: AgentType.Custom
  }
  mainAgenter = new Agenter(config);
  console.log('Agent created');
});

ipcMain.handle('ask-question', async (event, question: string) => {
  if (mainAgenter) {
    try {
      // Simulate an async operation
      //await new Promise(resolve => setTimeout(resolve, 1000));
      const answer = await mainAgenter.run(question);
      return answer;
    } catch (error) {
      console.error('Error asking question:', error);
      return 'Error: Could not get an answer.';
    }
  }
  return 'Error: Agent not initialized.';
});

ipcMain.handle('save-graph-state', async () => {
  if (mainAgenter) {
    try {
      const appPath = app.getAppPath();
      return  await mainAgenter.saveGraphVisualization(appPath);
    } catch (error: unknown) {
      console.error('Error saving graph:', error);
      return null;
    }
  }
  return null;
});
