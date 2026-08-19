import { run, queryOne, queryAll } from "../db.js";

function toAttempt(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    part: row.part,
    audioPath: row.audio_path,
    criteria: JSON.parse(row.criteria_json),
    overallBand: row.overall_band,
    rawGraderResult: JSON.parse(row.raw_grader_json),
    createdAt: row.created_at,
  };
}

async function createAttempt({ userId, topicId, topicLabel, part, audioPath, criteria, overallBand, rawGraderResult }) {
  const id = await run(
    `INSERT INTO speaking_drill_attempts
      (user_id, topic_id, topic_label, part, audio_path, criteria_json, overall_band, raw_grader_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, topicId, topicLabel, part, audioPath, JSON.stringify(criteria), overallBand, JSON.stringify(rawGraderResult)]
  );
  return findAttemptById(id);
}

async function listAttemptsForUser(userId) {
  const rows = await queryAll(
    `SELECT id, topic_id, topic_label, part, overall_band, created_at
     FROM speaking_drill_attempts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    part: row.part,
    overallBand: row.overall_band,
    createdAt: row.created_at,
  }));
}

async function findAttemptById(id) {
  return toAttempt(await queryOne(`SELECT * FROM speaking_drill_attempts WHERE id = ?`, [id]));
}

async function deleteAttempt(id) {
  await run(`DELETE FROM speaking_drill_attempts WHERE id = ?`, [id]);
}

export { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt };
