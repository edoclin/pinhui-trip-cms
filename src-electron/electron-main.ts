import { app, BrowserWindow, nativeTheme, ipcMain, globalShortcut} from 'electron'
import path from 'path'
import os from 'os'

ipcMain.on('app-quit', () => {
  app.quit()
})

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    )
  }
} catch (_) {
}

let mainWindow: BrowserWindow | undefined


function registryShortcut () {
  globalShortcut.register('CommandOrControl+J+K', () => {
    // 获取当前窗口
    // @ts-ignore
    mainWindow.webContents.openDevTools()
  })

  globalShortcut.register('CommandOrControl+W', () => {
    // @ts-ignore
    mainWindow.webContents.send('close-tab')
  })

  globalShortcut.register('Control+Tab', () => {
    // @ts-ignore
    mainWindow.webContents.send('switch-tab')
  })
}

app.whenReady().then(() => {
  // 注册快捷键
  registryShortcut()
})

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1920,
    height: 1080,
    useContentSize: true,
    frame: false,
    webPreferences: {
      // isTrue -> nodeIntegration is valid!
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      // @ts-ignore
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      nodeIntegration: true
    },
  })

  // @ts-ignore
  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools()
  } else {
    // // we're on production; no access to devtools pls
    // mainWindow.webContents.on('devtools-opened', () => {
    //   mainWindow?.webContents.closeDevTools()
    // })
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
