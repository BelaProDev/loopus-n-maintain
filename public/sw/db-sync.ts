const DB_VERSION = '1';
const DB_TABLES = ['emails', 'content', 'clients', 'providers', 'invoices', 'whatsapp-numbers'];
const SYNC_TAG = 'db-sync';

export async function initializeDB() {
  const cache = await caches.open(CACHE_NAME);
  return Promise.all(
    DB_TABLES.map(table => 
      cache.put(`/api/${table}`, new Response(JSON.stringify({
        version: DB_VERSION,
        data: []
      }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    )
  );
}

export async function handleSync(event: SyncEvent) {
  if (event.tag === SYNC_TAG) {
    return syncDatabase();
  }
}

async function syncDatabase() {
  const pendingChanges = await getPendingChanges();
  if (pendingChanges.length === 0) return;

  try {
    for (const change of pendingChanges) {
      await syncChange(change);
    }
    await clearPendingChanges();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function getPendingChanges() {
  const db = await openDB();
  return db.getAll('pendingChanges');
}

async function clearPendingChanges() {
  const db = await openDB();
  return db.clear('pendingChanges');
}

async function syncChange(change: any) {
  return fetch(change.url, {
    method: change.method,
    body: change.body,
    headers: { 'Content-Type': 'application/json' }
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SyncDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingChanges')) {
        db.createObjectStore('pendingChanges', { keyPath: 'timestamp' });
      }
    };
  });
}