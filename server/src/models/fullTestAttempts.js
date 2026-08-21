import { run, queryOne, queryAll } from "../db.js";

function toAttempt(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    listeningAttemptId: row.listening_attempt_id,
    readingAttemptId: row.reading_attempt_id,
    writingTask1AttemptId: row.writing_task1_attempt_id,
    writingTask2AttemptId: row.writing_task2_attempt_id,
    speakingAttemptId: row.speaking_attempt_id,
    listeningBand: row.listening_band,
    readingBand: row.reading_band,
    writingBand: row.writing_band,
    speakingBand: row.speaking_band,
    overallBand: row.overall_band,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

async function createFullTest({ userId }) {
  const id = await run(`INSERT INTO full_test_attempts (user_id) VALUES (?)`, [userId]);
  return findFullTestById(id);
}

async function finalizeFullTest(
  id,
  {
    listeningAttemptId,
    readingAttemptId,
    writingTask1AttemptId,
    writingTask2AttemptId,
    speakingAttemptId,
    listeningBand,
    readingBand,
    writingBand,
    speakingBand,
    overallBand,
  }
) {
  await run(
    `UPDATE full_test_attempts
     SET listening_attempt_id = ?, reading_attempt_id = ?, writing_task1_attempt_id = ?,
         writing_task2_attempt_id = ?, speaking_attempt_id = ?,
         listening_band = ?, reading_band = ?, writing_band = ?, speaking_band = ?, overall_band = ?,
         status = 'completed', completed_at = datetime('now')
     WHERE id = ?`,
    [
      listeningAttemptId,
      readingAttemptId,
      writingTask1AttemptId,
      writingTask2AttemptId,
      speakingAttemptId,
      listeningBand,
      readingBand,
      writingBand,
      speakingBand,
      overallBand,
      id,
    ]
  );
  return findFullTestById(id);
}

async function listFullTestsForUser(userId) {
  const rows = await queryAll(
    `SELECT id, overall_band, status, created_at, completed_at
     FROM full_test_attempts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    overallBand: row.overall_band,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  }));
}

async function findFullTestById(id) {
  return toAttempt(await queryOne(`SELECT * FROM full_test_attempts WHERE id = ?`, [id]));
}

async function deleteFullTest(id) {
  await run(`DELETE FROM full_test_attempts WHERE id = ?`, [id]);
}

export { createFullTest, finalizeFullTest, listFullTestsForUser, findFullTestById, deleteFullTest };
