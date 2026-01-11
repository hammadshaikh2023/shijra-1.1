import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Sync Data
  saveOfflineData: (data: any) => ipcRenderer.invoke('save-offline-data', data),
  onSyncOfflineData: (callback: (data: any) => void) => {
    ipcRenderer.on('sync-offline-data', (event, data) => callback(data));
  },

  // Native Notifications
  showNotification: (title: string, body: string) => ipcRenderer.invoke('show-notification', { title, body }),
  
  // Platform Check
  isElectron: true
});
