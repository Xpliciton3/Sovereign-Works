export const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  data TEXT NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS grocery (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  unit TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0,
  addedBy TEXT NOT NULL,
  recipeSource TEXT,
  addedAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
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

export async function writeShared<T extends { id: string; updatedAt: number }>(
  db: SQLiteDatabase,
  localTable: string,
  firebasePath: string,
  record: T,
  firebaseSet: (path: string, data: unknown) => Promise<void>
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO ${localTable} (id, data, updatedAt) VALUES (?, ?, ?)`,
    record.id,
    JSON.stringify(record),
    record.updatedAt
  );

  await db.runAsync(
    `INSERT OR REPLACE INTO sync_queue (id, path, data, updatedAt) VALUES (?, ?, ?, ?)`,
    record.id,
    firebasePath,
    JSON.stringify(record),
    record.updatedAt
  );

  try {
    await firebaseSet(firebasePath, record);
    await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, record.id);
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
    data: string;
    updatedAt: number;
  }>(`SELECT * FROM sync_queue ORDER BY updatedAt ASC`);

  for (const item of pending) {
    try {
      await firebaseSet(item.path, JSON.parse(item.data));
      await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, item.id);
    } catch {
      break;
    }
  }
}
