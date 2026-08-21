import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

/**
 * Turso (hosted libSQL, SQLite-compatible) instead of sql.js — Render's free
 * tier has no persistent disk, so a file-backed DB was getting wiped on every
 * sleep/wake cycle. Falls back to a local SQLite file (no Turso account
 * needed) when TURSO_DATABASE_URL isn't set, so local dev stays zero-setup.
 */

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "ielts.db");
const usingLocalFile = !process.env.TURSO_DATABASE_URL;

if (usingLocalFile) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${LOCAL_DB_PATH}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      google_id     TEXT UNIQUE,
      display_name  TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
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
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user ON speaking_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS essay_attempts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id),
      mode            TEXT NOT NULL,
      task_type       TEXT NOT NULL,
      section         TEXT,
      prompt_text     TEXT NOT NULL,
      essay_text      TEXT NOT NULL,
      overall_band    REAL NOT NULL,
      raw_grader_json TEXT NOT NULL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_essay_attempts_user ON essay_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS reading_attempts (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id          INTEGER NOT NULL REFERENCES users(id),
      passage_id       TEXT NOT NULL,
      passage_title    TEXT NOT NULL,
      answers_json     TEXT NOT NULL,
      correct_count    INTEGER NOT NULL,
      total_questions  INTEGER NOT NULL,
      overall_band     REAL NOT NULL,
      raw_result_json  TEXT NOT NULL,
      created_at       TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_reading_attempts_user ON reading_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS listening_attempts (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id          INTEGER NOT NULL REFERENCES users(id),
      section_id       TEXT NOT NULL,
      section_title    TEXT NOT NULL,
      answers_json     TEXT NOT NULL,
      correct_count    INTEGER NOT NULL,
      total_questions  INTEGER NOT NULL,
      overall_band     REAL NOT NULL,
      raw_result_json  TEXT NOT NULL,
      created_at       TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_listening_attempts_user ON listening_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS speaking_drill_attempts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id),
      topic_id        TEXT NOT NULL,
      topic_label     TEXT NOT NULL,
      part            TEXT NOT NULL,
      audio_path      TEXT NOT NULL,
      criteria_json   TEXT NOT NULL,
      overall_band    REAL NOT NULL,
      raw_grader_json TEXT NOT NULL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_speaking_drill_attempts_user ON speaking_drill_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS full_test_attempts (
      id                        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id                   INTEGER NOT NULL REFERENCES users(id),
      listening_attempt_id      INTEGER REFERENCES listening_attempts(id),
      reading_attempt_id        INTEGER REFERENCES reading_attempts(id),
      writing_task1_attempt_id  INTEGER REFERENCES essay_attempts(id),
      writing_task2_attempt_id  INTEGER REFERENCES essay_attempts(id),
      speaking_attempt_id       INTEGER REFERENCES speaking_attempts(id),
      listening_band            REAL,
      reading_band              REAL,
      writing_band              REAL,
      speaking_band             REAL,
      overall_band              REAL,
      status                    TEXT NOT NULL DEFAULT 'in_progress',
      created_at                TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at              TEXT
    )
  `);

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_full_test_attempts_user ON full_test_attempts(user_id, created_at DESC)`
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS study_plans (
      id                      INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id                 INTEGER NOT NULL UNIQUE REFERENCES users(id),
      test_date               TEXT,
      target_band             REAL,
      current_band_listening  REAL,
      current_band_reading    REAL,
      current_band_writing    REAL,
      current_band_speaking   REAL,
      weekly_hours            REAL,
      weakest_skill           TEXT,
      plan_json               TEXT NOT NULL,
      created_at              TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at              TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await ensureColumn("speaking_attempts", "target_band", "REAL");
  await ensureColumn("reading_attempts", "mode", "TEXT NOT NULL DEFAULT 'full'");
  await ensureColumn("reading_attempts", "question_type", "TEXT");
  await ensureColumn("listening_attempts", "mode", "TEXT NOT NULL DEFAULT 'full'");
  await ensureColumn("listening_attempts", "question_type", "TEXT");
  await ensureColumn("users", "email_verified", "INTEGER NOT NULL DEFAULT 0");
  await ensureColumn("users", "verification_token", "TEXT");
  await ensureColumn("users", "verification_token_expires_at", "TEXT");
  await ensureColumn("users", "reset_token", "TEXT");
  await ensureColumn("users", "reset_token_expires_at", "TEXT");
  await ensureColumn("users", "stripe_customer_id", "TEXT");
  await ensureColumn("users", "stripe_subscription_id", "TEXT");
  await ensureColumn("users", "subscription_tier", "TEXT NOT NULL DEFAULT 'free'");
  await ensureColumn("users", "subscription_status", "TEXT");
  await ensureColumn("users", "subscription_current_period_end", "TEXT");

  // Signup now auto-verifies (see routes/auth.js) since with no SMTP set up,
  // the old verification email never reached anyone. Backfill accounts stuck
  // unverified from before that change; leave Google-linked rows alone since
  // their verified flag reflects what Google itself reported.
  await run(`UPDATE users SET email_verified = 1 WHERE email_verified = 0 AND google_id IS NULL`);
}

/**
 * Adds a column to an existing table if it isn't there yet. SQLite has no
 * "ADD COLUMN IF NOT EXISTS", and CREATE TABLE IF NOT EXISTS above is a
 * no-op once the table already exists — this is what actually lets the
 * schema evolve without losing existing data on every change.
 */
async function ensureColumn(table, column, definition) {
  const existing = (await queryAll(`PRAGMA table_info(${table})`)).map((c) => c.name);
  if (!existing.includes(column)) {
    await client.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

/** Runs an INSERT/UPDATE/DELETE. Returns the inserted row's id (0 for non-inserts). */
async function run(sql, params = []) {
  const result = await client.execute({ sql, args: params });
  return Number(result.lastInsertRowid ?? 0);
}

/** Runs a SELECT and returns the first matching row as a plain object, or undefined. */
async function queryOne(sql, params = []) {
  const result = await client.execute({ sql, args: params });
  return result.rows[0];
}

/** Runs a SELECT and returns all matching rows as plain objects. */
async function queryAll(sql, params = []) {
  const result = await client.execute({ sql, args: params });
  return result.rows;
}

export { initDb, run, queryOne, queryAll };
