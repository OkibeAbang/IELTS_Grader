import { run, queryOne, queryAll } from "../db.js";

function toAttempt(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    mode: row.mode,
    taskType: row.task_type,
    section: row.section,
    promptText: row.prompt_text,
    essayText: row.essay_text,
    overallBand: row.overall_band,
    rawGraderResult: JSON.parse(row.raw_grader_json),
    createdAt: row.created_at,
  };
}

async function createAttempt({
  userId,
  mode,
  taskType,
  section = null,
  promptText,
  essayText,
  overallBand,
  rawGraderResult,
}) {
  const id = await run(
    `INSERT INTO essay_attempts
      (user_id, mode, task_type, section, prompt_text, essay_text, overall_band, raw_grader_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, mode, taskType, section, promptText, essayText, overallBand, JSON.stringify(rawGraderResult)]
  );
  return findAttemptById(id);
}

async function listAttemptsForUser(userId) {
  const rows = await queryAll(
    `SELECT id, mode, task_type, section, overall_band, created_at
     FROM essay_attempts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    taskType: row.task_type,
    section: row.section,
    overallBand: row.overall_band,
    createdAt: row.created_at,
  }));
}

async function findAttemptById(id) {
  return toAttempt(await queryOne(`SELECT * FROM essay_attempts WHERE id = ?`, [id]));
}

async function deleteAttempt(id) {
  await run(`DELETE FROM essay_attempts WHERE id = ?`, [id]);
}

export { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt };
