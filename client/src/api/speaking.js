import { requestJson, API_BASE_URL } from './http';

export async function fetchSpeakingTopics() {
  const data = await requestJson('/api/speaking/topics');
  return data.topics;
}

export async function fetchSpeakingTopic(id) {
  const data = await requestJson(`/api/speaking/topics/${encodeURIComponent(id)}`);
  return data.topic;
}

export async function submitSpeakingAttempt({ topicId, recordings, targetBand }) {
  const formData = new FormData();
  formData.append('topicId', topicId);
  formData.append('part1DurationSec', String(recordings.part1.durationSec));
  formData.append('part2DurationSec', String(recordings.part2.durationSec));
  formData.append('part3DurationSec', String(recordings.part3.durationSec));
  formData.append('part1Audio', recordings.part1.audioBlob, 'part1.webm');
  formData.append('part2Audio', recordings.part2.audioBlob, 'part2.webm');
  formData.append('part3Audio', recordings.part3.audioBlob, 'part3.webm');
  if (targetBand) {
    formData.append('targetBand', String(targetBand));
  }

  const res = await fetch(`${API_BASE_URL}/api/speaking/attempts`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed with status ${res.status}`);
    err.code = body.code;
    throw err;
  }

  return res.json();
}

export async function fetchAttemptHistory() {
  const data = await requestJson('/api/speaking/attempts');
  return data.attempts;
}

export async function fetchAttemptDetail(id) {
  const data = await requestJson(`/api/speaking/attempts/${encodeURIComponent(id)}`);
  return data.attempt;
}

export async function deleteAttempt(id) {
  await requestJson(`/api/speaking/attempts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function attemptAudioUrl(attemptId, part) {
  return `${API_BASE_URL}/api/speaking/attempts/${encodeURIComponent(attemptId)}/audio/${part}`;
}
