import { app, BrowserWindow, remote } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

import '../renderer/store';

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirnamse, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let danmu_win_id;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


//定义最大化最小化事件
const electron = require('electron');

const ipc = electron.ipcMain;
//登录窗口最小化
ipc.on('window-min', function () {
  mainWindow.minimize();
});
//登录窗口最大化
ipc.on('window-max', function () {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});
//关闭弹幕窗口
ipc.on('window-close-danmu',function () {
  if(danmu_win_id){
    BrowserWindow.fromId(danmu_win_id).close();
    danmu_win_id = 0;
  }
});
//关闭窗口
ipc.on('window-close', function () {
  mainWindow.close();
  if(danmu_win_id){
    BrowserWindow.fromId(danmu_win_id).close();
  }
});
//向弹幕窗口的通讯
ipc.on('to-danmu',function(sender,channel,msg){
  if(danmu_win_id){
    BrowserWindow.fromId(danmu_win_id).webContents.send('to-danmu',channel,msg);
  }
});
//获取弹幕窗口
ipc.on('danmu-mounted',function(sender,id){
  danmu_win_id = id;
});
//向主窗口的通讯
ipc.on('to-main',function(sender,channel,msg){
  mainWindow.webContents.send('to-main',channel,msg);
});

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    webPreferences : {
      webSecurity : false
    },
    resizable: false,
    frame: false,
    titleBarStyle: false,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  });

  mainWindow.on('ready-to-show',() => {
    mainWindow.show();
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
