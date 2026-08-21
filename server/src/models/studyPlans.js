import { run, queryOne } from "../db.js";

function toStudyPlan(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    userId: row.user_id,
    testDate: row.test_date,
    targetBand: row.target_band,
    currentBands: {
      listening: row.current_band_listening,
      reading: row.current_band_reading,
      writing: row.current_band_writing,
      speaking: row.current_band_speaking,
    },
    weeklyHours: row.weekly_hours,
    weakestSkill: row.weakest_skill,
    plan: JSON.parse(row.plan_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function upsertStudyPlan({
  userId,
  testDate = null,
  targetBand = null,
  currentBands = {},
  weeklyHours = null,
  weakestSkill = null,
  plan,
}) {
  await run(
    `INSERT INTO study_plans
      (user_id, test_date, target_band, current_band_listening, current_band_reading,
       current_band_writing, current_band_speaking, weekly_hours, weakest_skill, plan_json, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       test_date = excluded.test_date,
       target_band = excluded.target_band,
       current_band_listening = excluded.current_band_listening,
       current_band_reading = excluded.current_band_reading,
       current_band_writing = excluded.current_band_writing,
       current_band_speaking = excluded.current_band_speaking,
       weekly_hours = excluded.weekly_hours,
       weakest_skill = excluded.weakest_skill,
       plan_json = excluded.plan_json,
       updated_at = datetime('now')`,
    [
      userId,
      testDate,
      targetBand,
      currentBands.listening ?? null,
      currentBands.reading ?? null,
      currentBands.writing ?? null,
      currentBands.speaking ?? null,
      weeklyHours,
      weakestSkill,
      JSON.stringify(plan),
    ]
  );
  return findStudyPlanForUser(userId);
}

async function findStudyPlanForUser(userId) {
  return toStudyPlan(await queryOne(`SELECT * FROM study_plans WHERE user_id = ?`, [userId]));
}

export { upsertStudyPlan, findStudyPlanForUser };
