const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  createAgent: (key: string) => ipcRenderer.invoke('create-agent', key),
  askQuestion: (question: string) => ipcRenderer.invoke('ask-question', question),
  onInitialize: (callback: (message: string) => void) => {
    ipcRenderer.on('initalize-agent', (_event: Electron.IpcRendererEvent, message: string) => {
      callback(message);
    });
  },
  saveGraphState: () => ipcRenderer.invoke('save-graph-state'),
  renderMarkdown: (md: string) => ipcRenderer.invoke('render-markdown', md)
});
