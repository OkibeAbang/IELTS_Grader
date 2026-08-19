import { requestJson } from './http';

export async function fetchReadingPassages() {
  const data = await requestJson('/api/reading/passages');
  return data.passages;
}

export async function fetchReadingPassage(id) {
  const data = await requestJson(`/api/reading/passages/${encodeURIComponent(id)}`);
  return data.passage;
}

export async function submitReadingAttempt(passageId, answers) {
  return requestJson('/api/reading/attempts', {
    method: 'POST',
    body: JSON.stringify({ passageId, answers }),
  });
}

export async function fetchReadingHistory() {
  const data = await requestJson('/api/reading/attempts');
  return data.attempts;
}

export async function fetchReadingAttemptDetail(id) {
  const data = await requestJson(`/api/reading/attempts/${encodeURIComponent(id)}`);
  return data.attempt;
}

export async function deleteReadingAttempt(id) {
  await requestJson(`/api/reading/attempts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function submitReadingDrill(passageId, questionType, answers) {
  return requestJson('/api/reading/attempts/drill', {
    method: 'POST',
    body: JSON.stringify({ passageId, questionType, answers }),
  });
}
