import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { hashPassword } from './crypto.ts';

// Ruta relativa a la raíz del proyecto (npm run dev / npm start se ejecutan desde ahí)
const DB_PATH = process.env.PIANIQ_DB ?? resolve(process.cwd(), 'server', 'data', 'pianiq.db');

export interface UserRow {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  level: string;
  avatar: string | null;
  role: 'user' | 'admin';
  disabled: number;
  password_hash: string;
  created_at: string;
  last_login_at: string | null;
}

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  migrate(db);
  seed(db);
  return db;
}

function migrate(d: DatabaseSync) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
      email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name          TEXT NOT NULL,
      bio           TEXT NOT NULL DEFAULT '',
      level         TEXT NOT NULL DEFAULT 'principiante',
      avatar        TEXT,
      role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      disabled      INTEGER NOT NULL DEFAULT 0,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      last_login_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash  TEXT PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at  TEXT NOT NULL,
      user_agent  TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS password_resets (
      token_hash  TEXT PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at  TEXT NOT NULL,
      used_at     TEXT
    );
    CREATE TABLE IF NOT EXISTS user_data (
      user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data        TEXT NOT NULL,
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS outbox (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      to_email    TEXT NOT NULL,
      subject     TEXT NOT NULL,
      body        TEXT NOT NULL,
      link        TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

/** Usuario local de pruebas: admin / admin123 (rol administrador). */
function seed(d: DatabaseSync) {
  // En producción solo se crea si se pide explícitamente (PIANIQ_SEED_ADMIN=1)
  if (process.env.NODE_ENV === 'production' && process.env.PIANIQ_SEED_ADMIN !== '1') return;
  const exists = d.prepare('SELECT 1 FROM users WHERE username = ?').get('admin');
  if (exists) return;
  d.prepare(
    `INSERT INTO users (username, email, name, bio, level, role, password_hash)
     VALUES ('admin', 'admin@pianiq.local', 'Administrador', 'Cuenta local de pruebas.', 'avanzado', 'admin', ?)`,
  ).run(hashPassword('admin123'));
  console.log('[pianiq] usuario de pruebas creado: admin / admin123');
}
