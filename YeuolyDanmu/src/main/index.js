import { app, BrowserWindow, remote } from 'electron'
import { windowMove } from './move';
import { getInitialDanmuSize, saveDanmuSize } from './resize';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let danmuWindow;
let danmu_win_id;
let main_win_id;

//锁着的时候关不掉弹幕窗口
let danmu_lock = true;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


//定义最小化事件
const electron = require('electron');
const ipc = electron.ipcMain;
//登录窗口最小化
ipc.on('window-min', function () {
  mainWindow.minimize();
});
//关闭窗口
ipc.on('window-close', function () {
  if(main_win_id){
    BrowserWindow.fromId(main_win_id).close();
  }
});

const closeMain = () => {
  if(main_win_id){
    const window = BrowserWindow.fromId(main_win_id);
    if(window){
      window.close();
    }
  }
}

const closeDanmu = () => {
  if(danmu_win_id){
    const window = BrowserWindow.fromId(danmu_win_id);
    saveDanmuSize(window);
    if(window){
      window.close();
    }
  }
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    webPreferences : {
      webSecurity : false,
      nodeIntegration : true
    },
    resizable: false,
    frame: false,
    transparent : true,
    titleBarStyle: false,
    show: false,
    maximizable: false,
    title: '主窗口',
  });

  //mainWindow.setIcon(require('path').join(__dirname,'./../assets/logo.ico'));

  mainWindow.loadURL(winURL);

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
});

//窗口通讯
ipc.on('window-mounted',(sender, data) => {
  switch(data['window']){
    case 0:
      main_win_id = data['id'];
      mainWindow = BrowserWindow.fromId(main_win_id);
      mainWindow.webContents.send('window-mounted-success');
      mainWindow.on('close', () => {
        danmu_lock = false;
        closeDanmu();
      })
      windowMove(mainWindow, 0);
      break;
    case 1:
      danmu_win_id = data['id'];
      danmuWindow = BrowserWindow.fromId(danmu_win_id);
      danmuWindow.webContents.send('window-mounted-success');
      danmuWindow.on('close', e => {
        if(danmu_lock){
          e.preventDefault();
        }
      });
      windowMove(danmuWindow, 1);
      break;
  }
});
ipc.on('message',(sender, data) => {
  switch(data['from']){
    case 0:
      if(danmuWindow){
        danmuWindow.webContents.send('message', data['data']);
      }
      break;
    case 1:
      if(mainWindow){
        mainWindow.webContents.send('message', data['data']);
      }
      break;
  }
});

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
