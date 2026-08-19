import { run, queryOne, queryAll } from "../db.js";

function toAttempt(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    passageId: row.passage_id,
    passageTitle: row.passage_title,
    mode: row.mode,
    questionType: row.question_type,
    answers: JSON.parse(row.answers_json),
    correctCount: row.correct_count,
    totalQuestions: row.total_questions,
    overallBand: row.overall_band,
    rawResult: JSON.parse(row.raw_result_json),
    createdAt: row.created_at,
  };
}

async function createAttempt({
  userId,
  passageId,
  passageTitle,
  mode = "full",
  questionType = null,
  answers,
  correctCount,
  totalQuestions,
  overallBand,
  rawResult,
}) {
  const id = await run(
    `INSERT INTO reading_attempts
      (user_id, passage_id, passage_title, mode, question_type, answers_json, correct_count, total_questions, overall_band, raw_result_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      passageId,
      passageTitle,
      mode,
      questionType,
      JSON.stringify(answers),
      correctCount,
      totalQuestions,
      overallBand,
      JSON.stringify(rawResult),
    ]
  );
  return findAttemptById(id);
}

async function listAttemptsForUser(userId) {
  const rows = await queryAll(
    `SELECT id, passage_id, passage_title, mode, question_type, correct_count, total_questions, overall_band, created_at
     FROM reading_attempts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id,
    passageId: row.passage_id,
    passageTitle: row.passage_title,
    mode: row.mode,
    questionType: row.question_type,
    correctCount: row.correct_count,
    totalQuestions: row.total_questions,
    overallBand: row.overall_band,
    createdAt: row.created_at,
  }));
}

async function findAttemptById(id) {
  return toAttempt(await queryOne(`SELECT * FROM reading_attempts WHERE id = ?`, [id]));
}

async function deleteAttempt(id) {
  await run(`DELETE FROM reading_attempts WHERE id = ?`, [id]);
}

export { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt };
