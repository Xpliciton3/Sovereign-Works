import * as SQLite from 'expo-sqlite';
import { initDatabase, type SQLiteDatabase } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

function wrap(native: SQLite.SQLiteDatabase): SQLiteDatabase {
  return {
    execAsync: (sql) => native.execAsync(sql),
    runAsync: async (sql, ...params) => {
      await native.runAsync(sql, ...(params as (string | number)[]));
    },
    getAllAsync: (sql, ...params) => native.getAllAsync(sql, ...(params as (string | number)[])),
  };
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    const native = await SQLite.openDatabaseAsync('sovereignworks.db');
    await initDatabase(wrap(native));
    db = native;
  }
  return db;
}
