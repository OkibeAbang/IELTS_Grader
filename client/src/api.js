export async function gradeEssay({ essay, prompt, taskType }) {
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ essay, prompt, taskType }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function gradeSection({ text, prompt, taskType, section }) {
  const res = await fetch('/api/grade-section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, prompt, taskType, section }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function fetchPromptBank(taskType) {
  const res = await fetch(`/api/prompts?taskType=${encodeURIComponent(taskType)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.prompts;
}

export async function generatePrompt({ taskType, topic }) {
  const res = await fetch('/api/prompts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskType, topic }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
