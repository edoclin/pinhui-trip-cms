import { app, BrowserWindow, nativeTheme, ipcMain, globalShortcut, dialog, net } from 'electron'
import { autoUpdater, UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'electron-updater/out/differentialDownloader/ProgressDifferentialDownloadCallbackTransform'

import path from 'path'
import os from 'os'
import Timeout = NodeJS.Timeout

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

let timer: Timeout

const registryShortcut = () => {

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

const updateHandle = () => {
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('checking-for-update', {
      message: '开始检查更新'
    })
  })

  // 检查更新出错
  autoUpdater.on('error', (info) => {
    mainWindow.webContents.send('update-error', {
      message: '检查更新出错',
      info: info
    })
  })

  // 检查到新版本
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    if (platform === 'darwin') {

      clearInterval(timer)
      autoUpdater.autoDownload = false
      autoUpdater.removeAllListeners()

      if (dialog.showMessageBoxSync(mainWindow, {
        title: '提示',
        message: '当前平台不支持自动更新',
        detail: '应用有新版本, 请手动下载更新!',
        type: 'warning',
        buttons: ['暂不更新', '立即下载'],
      }) === 1) {
        mainWindow.loadURL('https://pinhui-trip-1304812488.cos.ap-shanghai.myqcloud.com/static/download/%E6%B8%B8%E5%93%81%E6%85%A7.dmg').then(r => {
        })
      }
    }

    mainWindow.webContents.send('update-available', {
      message: `检查到新版本 v ${info.version}，开始下载`,
      info: info
    })
  })

  // 已经是新版本
  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    mainWindow.webContents.send('update-not-available', {
      message: `当前版本已经是最新 v ${info.version}`,
      info: info
    })
  })

  // 更新下载中
  autoUpdater.on('download-progress', (info: ProgressInfo) => {
    mainWindow.webContents.send('download-progress', {
      info: info
    })
  })

  // 更新下载完毕
  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-downloaded', {
      message: '新版本下载完毕',
      info: info
    })
    let result = dialog.showMessageBoxSync(mainWindow, {
      title: '应用更新',
      message: '当前应用有更新, 是否立即重启更新应用?',
      type: 'question',
      buttons: ['暂不更新', '立即更新'],
      detail: '更新会重启应用, 请确认当前工作已保存!'
    })
    if (result === 1) {
      autoUpdater.quitAndInstall()
    }
  })

  // 立即更新
  ipcMain.handle('update-quit-install', () => {
    autoUpdater.quitAndInstall()
  })
  autoUpdater.checkForUpdatesAndNotify().then()
  timer = setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify().then()
  }, 1000 * 60 * 12)
}

const createWindow = () => {
  const { screen } = require('electron')

  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const {
    width,
    height
  } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: width,
    height: height,
    useContentSize: true,
    frame: false,
    minimizable: true,
    webPreferences: {
      // isTrue -> nodeIntegration is valid!
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      // @ts-ignore
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      nodeIntegration: true
    },
  })

  mainWindow.loadURL(process.env.APP_URL).then(r => {
  })

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools()
  }
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  })


  mainWindow.on('closed', () => {
    mainWindow = undefined
  })

  if (!net.isOnline()) {
    dialog.showMessageBox(mainWindow, {
      title: '提示',
      message: '请检查当前网络连接是否正常',
      detail: '当前网络环境大概率下无法连接远程网站',
      type: 'warning',
      buttons: ['确认'],
    }).then(r => {})
  }

  registryShortcut()

  updateHandle()


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
app.on('browser-window-blur', () => {
  globalShortcut.unregisterAll()
})

app.on('browser-window-focus', () => {
  registryShortcut()
})


app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})


