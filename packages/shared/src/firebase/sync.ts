import { AppState } from 'react-native';
import { remove, ref } from 'firebase/database';
import { getDatabase } from '../sqlite/db';
import { drainSyncQueue } from '../sqlite/schema';
import { firebaseSet, initAuth } from './household';
import { getFirebaseDb, isFirebaseConfigured } from './config';

export type SyncStatus = 'connected' | 'offline' | 'syncing' | 'error';

const statusListeners = new Set<(status: SyncStatus) => void>();
let currentStatus: SyncStatus = 'offline';
let lastError: string | null = null;

function emitStatus(status: SyncStatus) {
  currentStatus = status;
  statusListeners.forEach((cb) => cb(status));
}

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function subscribeSyncStatus(callback: (status: SyncStatus) => void): () => void {
  statusListeners.add(callback);
  callback(currentStatus);
  return () => statusListeners.delete(callback);
}

async function refreshStatusFromQueue(): Promise<void> {
  const db = await getDatabase();
  const pending = await db.getAllAsync<{ id: string }>(
    `SELECT id FROM sync_queue WHERE synced = 0 LIMIT 1`
  );
  if (lastError) {
    emitStatus('error');
  } else if (pending.length > 0) {
    emitStatus('offline');
  } else {
    emitStatus('connected');
  }
}

export async function writeShared(path: string, data: unknown): Promise<void> {
  if (!isFirebaseConfigured()) return;
  emitStatus('syncing');
  lastError = null;
  const db = await getDatabase();
  const id = path.replace(/\//g, '_');
  const payloadJson = JSON.stringify(data);
  const createdAt = Date.now();

  await db.runAsync(
    `INSERT OR REPLACE INTO sync_queue (id, path, payload, created_at, synced) VALUES (?, ?, ?, ?, 0)`,
    id,
    path,
    payloadJson,
    createdAt
  );

  try {
    await initAuth();
    await firebaseSet(path, data);
    await db.runAsync(`UPDATE sync_queue SET synced = 1 WHERE id = ?`, id);
  } catch {
    lastError = 'sync_failed';
  }
  await refreshStatusFromQueue();
}

export async function firebaseRemove(path: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  emitStatus('syncing');
  try {
    await initAuth();
    await remove(ref(getFirebaseDb(), path));
    lastError = null;
  } catch {
    lastError = 'sync_failed';
  }
  await refreshStatusFromQueue();
}

export async function runSyncDrain(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  emitStatus('syncing');
  try {
    const db = await getDatabase();
    await drainSyncQueue(db, firebaseSet);
    lastError = null;
  } catch {
    lastError = 'sync_failed';
  }
  await refreshStatusFromQueue();
}

export function subscribeSyncDrain(): () => void {
  void runSyncDrain();
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') void runSyncDrain();
  });
  const interval = setInterval(() => void runSyncDrain(), 5 * 60 * 1000);
  return () => {
    sub.remove();
    clearInterval(interval);
  };
}
