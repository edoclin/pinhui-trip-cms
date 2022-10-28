/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *

 */

import { contextBridge, ipcMain, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('$electron', {
  exitApp: () => ipcRenderer.send("app-quit"),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  closeTab: (callback: any) => ipcRenderer.on('close-tab', callback),
  switchTab: (callback: any) => ipcRenderer.on('switch-tab', callback),
  checkingUpdate: (callback: any) => ipcRenderer.on('checking-for-update', callback),
  checkingUpdateError: (callback: any) => ipcRenderer.on('update-error', callback),
  checkingUpdateAvailable: (callback: any) => ipcRenderer.on('update-available', callback),
  checkingUpdateNotAvailable: (callback: any) => ipcRenderer.on('update-not-available', callback),
  UpdateDownloading: (callback: any) => ipcRenderer.on('download-progress', callback),
  UpdateDownloaded: (callback: any) => ipcRenderer.on('update-downloaded', callback),
  quitAndInstall: () => ipcRenderer.send("update-quit-install"),
})
