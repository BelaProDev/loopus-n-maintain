import { toast } from '@/components/ui/use-toast';

const DB_VERSION = '1';
const DB_TABLES = ['emails', 'content', 'clients', 'providers', 'invoices', 'whatsapp-numbers'];
const SYNC_TAG = 'db-sync';

interface PendingChange {
  id: string;
  timestamp: number;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  retryCount: number;
}

class DBSync {
  private maxRetries = 3;
  private syncInProgress = false;

  async initializeDB() {
    const db = await this.openDB();
    if (!db.objectStoreNames.contains('pendingChanges')) {
      db.createObjectStore('pendingChanges', { keyPath: 'id' });
    }
    return db;
  }

  async addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>) {
    const db = await this.openDB();
    const tx = db.transaction('pendingChanges', 'readwrite');
    const store = tx.objectStore('pendingChanges');
    
    const pendingChange: PendingChange = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
      ...change
    };
    
    await store.add(pendingChange);
    this.triggerSync();
  }

  private async triggerSync() {
    if (this.syncInProgress) return;
    
    try {
      this.syncInProgress = true;
      const changes = await this.getPendingChanges();
      
      for (const change of changes) {
        try {
          await this.processChange(change);
          await this.removePendingChange(change.id);
        } catch (error) {
          if (change.retryCount >= this.maxRetries) {
            await this.handleFailedSync(change);
          } else {
            await this.incrementRetryCount(change.id);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processChange(change: PendingChange) {
    const endpoint = `/api/${change.table}`;
    const method = change.operation === 'delete' ? 'DELETE' :
                   change.operation === 'create' ? 'POST' : 'PUT';
    
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(change.data)
    });
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  private async handleFailedSync(change: PendingChange) {
    await this.removePendingChange(change.id);
    toast({
      title: "Sync Failed",
      description: `Failed to sync ${change.operation} operation on ${change.table}`,
      variant: "destructive"
    });
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SyncDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingChanges')) {
          db.createObjectStore('pendingChanges', { keyPath: 'id' });
        }
      };
    });
  }

  private async getPendingChanges(): Promise<PendingChange[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pendingChanges', 'readonly');
      const store = tx.objectStore('pendingChanges');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async removePendingChange(id: string) {
    const db = await this.openDB();
    const tx = db.transaction('pendingChanges', 'readwrite');
    const store = tx.objectStore('pendingChanges');
    await store.delete(id);
  }

  private async incrementRetryCount(id: string) {
    const db = await this.openDB();
    const tx = db.transaction('pendingChanges', 'readwrite');
    const store = tx.objectStore('pendingChanges');
    const change = await store.get(id);
    change.retryCount++;
    await store.put(change);
  }
}

export const dbSync = new DBSync();