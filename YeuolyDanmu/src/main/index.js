import { app, BrowserWindow } from 'electron'
import { DialogSocket } from './utils/channel';
global.channel = new DialogSocket(32862);
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let danmu_win_id;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


process.on('uncaughtException', err => {
  console.log('求你了别退了');
});

//定义最小化事件
const electron = require('electron');
const ipc = electron.ipcMain;
//登录窗口最小化
ipc.on('window-min', function () {
  mainWindow.minimize();
});
//关闭窗口

//这个是个大工程？大概，首先用ipc发出信号关掉两个客户端的websocket，再执行关闭服务器
ipc.on('window-close', function () {
  mainWindow.webContents.send('close-websocket');
  BrowserWindow.fromId(danmu_win_id).webContents.send('close-websocket');
});
let closed_num = 0;
ipc.on('closed-websocket', () => {
  if(++closed_num === 2){
    global.channel.stopServer(() => {
      BrowserWindow.fromId(danmu_win_id).close();
      mainWindow.close();
    });
  }
})
//获取弹幕窗口
ipc.on('danmu-mounted',function(sender,id){
  danmu_win_id = id;
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
 * 为窗口通讯开启socket，为什么不用ipc呢？因为占资源太高了
 */

channel.startServer();

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
