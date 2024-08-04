// src/background.js
'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import dotenv from 'dotenv'
import cron from 'node-cron'
import permissionQueue from './models/PermissionQueue'


dotenv.config({ path: path.join(__dirname, '.env') });

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 800,
    minWidth: 777,
    minHeight: 775,
    maxWidth: 1800,
    maxHeight: 800,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION === 'true',
      contextIsolation: process.env.ELECTRON_NODE_INTEGRATION !== 'true'
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

   // Configurando a tarefa agendada para rodar a cada minuto
   cron.schedule('* * * * * *', async () => {
    try {
      let queue = new permissionQueue();
      await queue.runQueue();
    } catch (error) {
      console.error('Erro na tarefa agendada:', error);
    }
  });
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
