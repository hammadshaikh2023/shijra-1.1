// Interface for the data structure saved to disk
export interface OfflineStore {
  lastSync: string;
  userProfile: {
    id: string;
    name: string;
    email: string;
  };
  cachedTrees: {
    [treeId: string]: {
      name: string;
      members: any[]; // Simplified Member Type
      updatedAt: string;
    }
  };
  pendingChanges: any[]; // Queue of edits made while offline
}

// Initial state helper
export const initialOfflineState: OfflineStore = {
  lastSync: new Date().toISOString(),
  userProfile: { id: '', name: '', email: '' },
  cachedTrees: {},
  pendingChanges: []
};
