export const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS grocery (
  item_key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amt TEXT,
  unit TEXT,
  count INTEGER DEFAULT 1,
  checked INTEGER DEFAULT 0,
  category TEXT,
  added_at INTEGER
);

CREATE TABLE IF NOT EXISTS hydration_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  oz REAL NOT NULL,
  type TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mood_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  rawScore REAL NOT NULL,
  category TEXT NOT NULL,
  rawText TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS planner_state (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  itemKey TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  skipped INTEGER NOT NULL DEFAULT 0,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS alarm_configs (
  id TEXT PRIMARY KEY,
  hour INTEGER NOT NULL,
  minute INTEGER NOT NULL,
  label TEXT NOT NULL,
  repeats TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quote_bank (
  id TEXT PRIMARY KEY,
  tradition TEXT NOT NULL,
  text TEXT NOT NULL,
  attribution TEXT,
  used INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL
);
`;

export interface SQLiteDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: unknown[]): Promise<void>;
  getAllAsync<T>(sql: string, ...params: unknown[]): Promise<T[]>;
}

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(SQLITE_SCHEMA);
}

export async function writeShared(
  db: SQLiteDatabase,
  firebasePath: string,
  payload: unknown,
  firebaseSet: (path: string, data: unknown) => Promise<void>
): Promise<void> {
  const id = firebasePath.replace(/\//g, '_');
  const createdAt = Date.now();
  const payloadJson = JSON.stringify(payload);

  await db.runAsync(
    `INSERT OR REPLACE INTO sync_queue (id, path, payload, created_at, synced) VALUES (?, ?, ?, ?, 0)`,
    id,
    firebasePath,
    payloadJson,
    createdAt
  );

  try {
    await firebaseSet(firebasePath, payload);
    await db.runAsync(`UPDATE sync_queue SET synced = 1 WHERE id = ?`, id);
  } catch {
    // Queued — drainSyncQueue will retry on network restore.
  }
}

export async function drainSyncQueue(
  db: SQLiteDatabase,
  firebaseSet: (path: string, data: unknown) => Promise<void>
): Promise<void> {
  const pending = await db.getAllAsync<{
    id: string;
    path: string;
    payload: string;
    created_at: number;
  }>(`SELECT * FROM sync_queue WHERE synced = 0 ORDER BY created_at ASC`);

  for (const item of pending) {
    try {
      await firebaseSet(item.path, JSON.parse(item.payload));
      await db.runAsync(`UPDATE sync_queue SET synced = 1 WHERE id = ?`, item.id);
    } catch {
      break;
    }
  }
}
