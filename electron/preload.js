const { contextBridge, ipcRenderer } = require("electron/renderer");

// 暴露 Electron API 到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  request: (requestInfo) => ipcRenderer.invoke("request", requestInfo),

  getData: async (key) => {
    return await ipcRenderer.invoke("get-data", key);
  },

  setData: (key, value) => {
    ipcRenderer.invoke("set-data", key, value);
  },

  notify: (msg) => {
    ipcRenderer.send("notify", msg);
  },
  toInstall: () => ipcRenderer.invoke("install"),
  
  onDownloaded: (callback) => ipcRenderer.on("downloaded", callback),

  test: (callback) => ipcRenderer.on("test", callback),
});
