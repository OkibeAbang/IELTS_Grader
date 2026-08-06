import { run, queryOne, queryAll } from "../db.js";

function toAttempt(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    part1AudioPath: row.part1_audio_path,
    part2AudioPath: row.part2_audio_path,
    part3AudioPath: row.part3_audio_path,
    criteria: JSON.parse(row.criteria_json),
    overallBand: row.overall_band,
    targetBand: row.target_band,
    rawGraderResult: JSON.parse(row.raw_grader_json),
    createdAt: row.created_at,
  };
}

function createAttempt({
  userId,
  topicId,
  topicLabel,
  part1AudioPath,
  part2AudioPath,
  part3AudioPath,
  criteria,
  overallBand,
  targetBand = null,
  rawGraderResult,
}) {
  const id = run(
    `INSERT INTO speaking_attempts
      (user_id, topic_id, topic_label, part1_audio_path, part2_audio_path, part3_audio_path, criteria_json, overall_band, target_band, raw_grader_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      topicId,
      topicLabel,
      part1AudioPath,
      part2AudioPath,
      part3AudioPath,
      JSON.stringify(criteria),
      overallBand,
      targetBand,
      JSON.stringify(rawGraderResult),
    ]
  );
  return findAttemptById(id);
}

function listAttemptsForUser(userId) {
  const rows = queryAll(
    `SELECT id, topic_id, topic_label, overall_band, target_band, created_at
     FROM speaking_attempts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    overallBand: row.overall_band,
    targetBand: row.target_band,
    createdAt: row.created_at,
  }));
}

function findAttemptById(id) {
  return toAttempt(queryOne(`SELECT * FROM speaking_attempts WHERE id = ?`, [id]));
}

function deleteAttempt(id) {
  run(`DELETE FROM speaking_attempts WHERE id = ?`, [id]);
}

function listFullAttemptsForUser(userId) {
  return queryAll(`SELECT * FROM speaking_attempts WHERE user_id = ?`, [userId]).map(toAttempt);
}

function listAllAttempts({ limit = 50, offset = 0 } = {}) {
  const rows = queryAll(
    `SELECT sa.id, sa.user_id, u.email AS user_email, sa.topic_id, sa.topic_label, sa.overall_band, sa.created_at
     FROM speaking_attempts sa
     JOIN users u ON u.id = sa.user_id
     ORDER BY sa.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    topicId: row.topic_id,
    topicLabel: row.topic_label,
    overallBand: row.overall_band,
    createdAt: row.created_at,
  }));
}

function countAttempts() {
  return queryOne(`SELECT COUNT(*) AS count FROM speaking_attempts`).count;
}

function countAttemptsSince(isoDate) {
  return queryOne(`SELECT COUNT(*) AS count FROM speaking_attempts WHERE created_at >= ?`, [isoDate]).count;
}

function averageOverallBand() {
  const row = queryOne(`SELECT AVG(overall_band) AS avg FROM speaking_attempts`);
  return row.avg === null ? null : Math.round(row.avg * 10) / 10;
}

export {
  createAttempt,
  listAttemptsForUser,
  findAttemptById,
  deleteAttempt,
  listFullAttemptsForUser,
  listAllAttempts,
  countAttempts,
  countAttemptsSince,
  averageOverallBand,
};
