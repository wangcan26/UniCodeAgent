const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  createAgent: (key: string) => ipcRenderer.invoke('create-agent', key),
  askQuestion: (question: string) => ipcRenderer.invoke('ask-question', question)
});
