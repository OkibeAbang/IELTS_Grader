import { requestJson } from './http';

export async function fetchListeningSections() {
  const data = await requestJson('/api/listening/sections');
  return data.sections;
}

export async function fetchListeningSection(id) {
  const data = await requestJson(`/api/listening/sections/${encodeURIComponent(id)}`);
  return data.section;
}

export async function submitListeningAttempt(sectionId, answers) {
  return requestJson('/api/listening/attempts', {
    method: 'POST',
    body: JSON.stringify({ sectionId, answers }),
  });
}

export async function fetchListeningHistory() {
  const data = await requestJson('/api/listening/attempts');
  return data.attempts;
}

export async function fetchListeningAttemptDetail(id) {
  const data = await requestJson(`/api/listening/attempts/${encodeURIComponent(id)}`);
  return data.attempt;
}

export async function deleteListeningAttempt(id) {
  await requestJson(`/api/listening/attempts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function submitListeningDrill(sectionId, questionType, answers) {
  return requestJson('/api/listening/attempts/drill', {
    method: 'POST',
    body: JSON.stringify({ sectionId, questionType, answers }),
  });
}
