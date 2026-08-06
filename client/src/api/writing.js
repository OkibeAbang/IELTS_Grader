import { requestJson } from './http';

export async function gradeEssay({ essay, prompt, taskType }) {
  return requestJson('/api/grade', {
    method: 'POST',
    body: JSON.stringify({ essay, prompt, taskType }),
  });
}

export async function gradeSection({ text, prompt, taskType, section }) {
  return requestJson('/api/grade-section', {
    method: 'POST',
    body: JSON.stringify({ text, prompt, taskType, section }),
  });
}

export async function fetchPromptBank(taskType) {
  const data = await requestJson(`/api/prompts?taskType=${encodeURIComponent(taskType)}`);
  return data.prompts;
}

export async function generatePrompt({ taskType, topic }) {
  return requestJson('/api/prompts/generate', {
    method: 'POST',
    body: JSON.stringify({ taskType, topic }),
  });
}

export async function fetchEssayHistory() {
  const data = await requestJson('/api/essays');
  return data.attempts;
}

export async function fetchEssayAttemptDetail(id) {
  const data = await requestJson(`/api/essays/${encodeURIComponent(id)}`);
  return data.attempt;
}

export async function deleteEssayAttempt(id) {
  await requestJson(`/api/essays/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
