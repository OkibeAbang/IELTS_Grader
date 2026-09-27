import { run, queryOne } from "../db.js";

function toReview(row) {
  if (!row) return undefined;
  return {
    attemptType: row.attempt_type,
    attemptId: row.attempt_id,
    teacherId: row.teacher_id,
    overrideBand: row.override_band,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function upsertReview({ attemptType, attemptId, teacherId, overrideBand = null, comment = null }) {
  await run(
    `INSERT INTO teacher_reviews (attempt_type, attempt_id, teacher_id, override_band, comment, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(attempt_type, attempt_id) DO UPDATE SET
       teacher_id = excluded.teacher_id,
       override_band = excluded.override_band,
       comment = excluded.comment,
       updated_at = datetime('now')`,
    [attemptType, attemptId, teacherId, overrideBand, comment]
  );
  return findReview(attemptType, attemptId);
}

async function findReview(attemptType, attemptId) {
  return toReview(
    await queryOne(`SELECT * FROM teacher_reviews WHERE attempt_type = ? AND attempt_id = ?`, [
      attemptType,
      attemptId,
    ])
  );
}

export { upsertReview, findReview };
