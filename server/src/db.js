import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

/**
 * sql.js (WASM SQLite) instead of better-sqlite3: this machine has no working
 * native build toolchain (no prebuilt binary for this Node version, and the
 * installed Visual Studio Build Tools are missing the Windows SDK component
 * node-gyp needs), so a native addon can't be compiled. sql.js runs the same
 * synchronous query API entirely in WASM, at the cost of an async one-time
 * init and needing an explicit persist-to-disk step after writes, which is
 * wrapped here so callers never touch it directly.
 */

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "ielts.db");

let db;

async function initDb() {
  const SQL = await initSqlJs();

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const fileBuffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : undefined;
  db = new SQL.Database(fileBuffer);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      google_id     TEXT UNIQUE,
      display_name  TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS speaking_attempts (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id             INTEGER NOT NULL REFERENCES users(id),
      topic_id            TEXT NOT NULL,
      topic_label         TEXT NOT NULL,
      part1_audio_path    TEXT NOT NULL,
      part2_audio_path    TEXT NOT NULL,
      part3_audio_path    TEXT NOT NULL,
      criteria_json       TEXT NOT NULL,
      overall_band        REAL NOT NULL,
      raw_grader_json      TEXT NOT NULL,
      created_at           TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user ON speaking_attempts(user_id, created_at DESC);
  `);

  ensureColumn("speaking_attempts", "target_band", "REAL");
  ensureColumn("users", "email_verified", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn("users", "verification_token", "TEXT");
  ensureColumn("users", "verification_token_expires_at", "TEXT");
  ensureColumn("users", "reset_token", "TEXT");
  ensureColumn("users", "reset_token_expires_at", "TEXT");

  // Signup now auto-verifies (see routes/auth.js) since with no SMTP set up,
  // the old verification email never reached anyone. Backfill accounts stuck
  // unverified from before that change; leave Google-linked rows alone since
  // their verified flag reflects what Google itself reported.
  db.run(`UPDATE users SET email_verified = 1 WHERE email_verified = 0 AND google_id IS NULL`);

  persist();
  return db;
}

/**
 * Adds a column to an existing table if it isn't there yet. SQLite has no
 * "ADD COLUMN IF NOT EXISTS", and CREATE TABLE IF NOT EXISTS above is a
 * no-op once the table already exists on disk — this is what actually lets
 * the schema evolve without deleting existing local data on every change.
 */
function ensureColumn(table, column, definition) {
  const existing = queryAll(`PRAGMA table_info(${table})`).map((c) => c.name);
  if (!existing.includes(column)) {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized — call initDb() before using getDb()");
  }
  return db;
}

/**
 * Runs an INSERT/UPDATE/DELETE and persists the change to disk.
 * Returns the rowid of the last insert on this connection — must be read
 * before persist()/export(), which resets sql.js's last_insert_rowid() to 0.
 */
function run(sql, params = []) {
  getDb().run(sql, params);
  const id = queryOne("SELECT last_insert_rowid() AS id").id;
  persist();
  return id;
}

/** Runs a SELECT and returns the first matching row as a plain object, or undefined. */
function queryOne(sql, params = []) {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return row;
}

/** Runs a SELECT and returns all matching rows as plain objects. */
function queryAll(sql, params = []) {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export { initDb, getDb, run, queryOne, queryAll, DB_PATH };
