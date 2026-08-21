import { requestJson } from './http';

export async function generateStudyPlan(answers) {
  const data = await requestJson('/api/study-plan', {
    method: 'POST',
    body: JSON.stringify(answers),
  });
  return data.studyPlan;
}

export async function fetchStudyPlan() {
  try {
    const data = await requestJson('/api/study-plan');
    return data.studyPlan;
  } catch (err) {
    if (err.code === 'NO_PLAN') return null;
    throw err;
  }
}
