const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
// 导入 Node.js 的 path 模块
const path = require("node:path");
const {autoUpdater} = require("electron-updater");
const fs = require("fs");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const iconvLite = require("iconv-lite");
const winState = require("electron-window-state");
const { shell, dialog } = require("electron");
const { Notification } = require("electron");
// 动态导入 electron-store
let Store;
let store;
(async () => {
  Store = (await import("electron-store")).default;
  store = new Store();
})();

// 检查是否已经有一个实例运行
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  // 如果已经有一个实例在运行，关闭当前实例并退出
  app.quit();
}

let isDev = false;
async function checkIsDev() {
  const module = await import("electron-is-dev");
  isDev = module.default;
  // 关闭开发模式
  // 全局捕获一下
  try {
    console.log("isDev:", isDev);
    work();
  } catch (error) {
    dialog.showMessageBox({
      type: "error", // 对话框类型
      title: "未知错误", // 标题栏文本
      message: "未知错误，请联系开发者", // 主消息文本
      // detail: error.message, // 详细错误信息
      buttons: ["确定"], // 对话框按钮
    });
  }
}
checkIsDev();

// 主程序
const work = () => {
  let win = null;
  // 配置electron的应用窗口
  const createWindow = () => {
    // 防止重复创建窗口
    if (win) return;
    // 创建浏览器窗口
    win = new BrowserWindow({
      width: 1100,
      height: 640,
      webPreferences: {
        devTools: isDev,
        webSecurity: false, // 禁用 Web 安全策略
        backgroundThrottling: false, // 取消节流
        // 不安全，不建议使用
        // nodeIntegration: true, // 启用Node.js集成
        // contextIsolation: false, // 取消上下文隔离
        sandbox: false, // 取消沙箱模式
        nodeIntegration: true, // 如果你需要在渲染进程中使用Node.js
        // 连接与渲染层的交互
        preload: path.join(__dirname, "preload.js"),
      },
    });
    // win.setSize(1100, 700); // 显式设置窗口大小，因为之前的大小被缓存了
    win.center(); // 使窗口居中
    // 设置窗口的菜单为空，即移除窗口的菜单栏
    win.setMenu(null);
    // 根据环境加载不同的URL
    if (isDev) {
      // 开发模式下加载本地的index.html
      win.loadURL("http://localhost:6155");
      // 打开开发工具
      win.webContents.openDevTools();
    } else {
      win.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
    }
    //winState.manage(win); // 配置持久化
    win.on("ready-to-show", () => {
      win.show();
    });
    // 配置所有外部url都使用浏览器打开
    win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url); // 使用外部浏览器打开
      return { action: "deny" }; // 阻止 Electron 打开新窗口
    });
  };

  const addTodoWindow = () => {
    let todoWin = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    // 将窗口置于最底层
    alwaysOnTop: false,
      type:"desktop",
    skipTaskbar: true,
    webPreferences: {
      sandbox: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, "preload.js"),
    },
    });
    todoWin.setAlwaysOnBottom(true); // 置于最底层
    if(isDev){
      todoWin.loadURL("http://localhost:6155/#/todoDesktop");
    }else{
      todoWin.loadURL(`file://${path.join(__dirname, "../dist/index.html#todoDesktop")}`);
    }
        // 等待加载完成以后并且延迟500ms发送消息
    // 自行测试时间，之前我的100ms就可以，但是电脑性能慢一点需要的时间更多，我索性就直接500ms了
    /* todoWin.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        todoWin.webContents.send("load-html-content", title, content);
        console.log("Message sent after delay!");
      }, 500); // 延迟时间，以毫秒为单位
    }); */
    todoWin.setAlwaysOnTop(globalSettings[0].todoP); // 动态配置是否置顶

    // todoWin.webContents.openDevTools(); // 打开开发者工具

    todoWin.on("closed", () => {
      todoWin = null;
    });
    // 优雅的打开窗口
    todoWin.once("ready-to-show", () => {
      todoWin.show();
    });
    // hook这个右键消息，禁用窗口
    todoWin.hookWindowMessage(278, function (e) {
      todoWin.setEnabled(false); //窗口禁用
      setTimeout(() => {
        todoWin.setEnabled(true); //窗口启用
      }, 1);
      return true;
    });
  }

  async function request(requestInfo) {
    requestInfo = JSON.parse(requestInfo);
    let args = [];
    if(requestInfo.mode != "4"){
      args.push(requestInfo.mode);
      args.push(requestInfo.account);
      args.push(requestInfo.password);
      if (requestInfo.mode == "1") {
        args.push(requestInfo.xn);
        args.push(requestInfo.xq);
      }
    }else{
      console.log('requestInfo.xn',requestInfo.xn)
      console.log('requestInfo.xq',requestInfo.xq)
      console.log('requestInfo.token',requestInfo.token)
      args.push(requestInfo.mode);
      args.push(requestInfo.xn);//requestInfo.xn
      args.push(requestInfo.xq);
      args.push(requestInfo.token)
    }


    console.log("request:", requestInfo, "args:", args);
    return new Promise((resolve, reject) => {
      let exePath;
      if (isDev) {
        exePath = path.join(__dirname, "/python/request.exe");
      } else {
        // app.getPath("exe") =\ztimer\app_client\win-unpacked\zTimer.exe
        exePath = path.join(app.getPath("exe"), "../resources/request.exe");
      }
      console.log("exePath:", exePath);
      //console.log("exePath:", exePath);
      const child = spawn(exePath, args);
      let result = "";
      child.stdout.on("data", (data) => {
        //console.log(`stdout: ${iconvLite.decode(data, "cp936")}`);
        result += iconvLite.decode(data, "cp936");
      });
      child.stderr.on("data", (data) => {
        //console.log(`stderr: ${iconvLite.decode(data, "cp936")}`);
        result += iconvLite.decode(data, "cp936");
      });
      child.on("close", (code) => {
        if (code !== 0) {
          console.log("result1:", result);
          reject(result);
        } else {
          console.log("result2:", result);
          resolve(result);
        }
      });
      child.on("error", (error) => {
        reject(result);
      });
    });
  }


  const initStore = () => {
    console.log("store Service initialized");
    ipcMain.handle("get-data", (event, key) => {
      console.log("store path:", store.path);
      const data = store.get(key);
      console.log("get data key: ", key, " data:", data);
      return JSON.stringify(data);
    });

    ipcMain.handle("set-data", (event, key, value) => {
      store.set(key, JSON.parse(value));
    });
  };

  app.whenReady().then(() => {
    globalShortcut.register("CommandOrControl+Shift+i", function () {
      win.webContents.openDevTools();
    });
    // 初始化数据存储
    initStore();
    createWindow();
    ipcMain.handle("request", (event, requestInfo) => request(requestInfo));

    ipcMain.on('notify',(event,message) =>{
      const notice = JSON.parse(message)
      console.log('notyfy :',notice)
      new Notification({
        title: notice.title || '标题',
        body: notice.body || '内容',
      }).show();
    
    })



  if(!isDev){
    autoUpdater.setFeedURL({
      provider: "generic",
      url: "http://zjumsc.com/zta/update",
    });
  }else{
    // console.log('开发模式下自动更新,url:',path.join(__dirname, "../app_client"))
    autoUpdater.setFeedURL({
      provider: "generic",
      url: "http://zjumsc.com/zta/update"
    });
  }
  
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.forceDevUpdateConfig = true
  autoUpdater.checkForUpdatesAndNotify().catch()
  ipcMain.handle('install',()=>autoUpdater.quitAndInstall())
  autoUpdater.on('update-available', (info) => {
    console.log('有新版本需要更新');
    autoUpdater.downloadUpdate();
  });
  autoUpdater.on('update-not-available', (info) => {
    console.log('无需更新');
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log('下载完成');
    setTimeout(() => {
      console.log('4秒后发送下载完成消息')
      win.webContents.send('downloaded')
    },4000)
    //win.webContents.send('downloaded');
    // 通知渲染进程下载完成
    // 下载完成后强制用户安装，不推荐
    // autoUpdater.quitAndInstall();
  });
  autoUpdater.on('download-progress', (progressObj) => {
    // 通知渲染进程下载进度
    /* ipcMainService.send('app:update-info', {
      type: 'download-progress',
      data: progressObj
    }) */
   console.log('下载进度', progressObj.percent)
  })
  });



  // 关闭所有窗口时退出应用
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
};
