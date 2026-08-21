import { requestJson } from './http';

export async function startFullTest() {
  return requestJson('/api/full-test', { method: 'POST' });
}

export async function finalizeFullTest(id, attemptIds) {
  const data = await requestJson(`/api/full-test/${encodeURIComponent(id)}/finalize`, {
    method: 'POST',
    body: JSON.stringify(attemptIds),
  });
  return data.fullTest;
}

export async function fetchFullTestHistory() {
  const data = await requestJson('/api/full-test');
  return data.fullTests;
}

export async function fetchFullTestDetail(id) {
  const data = await requestJson(`/api/full-test/${encodeURIComponent(id)}`);
  return data.fullTest;
}

export async function deleteFullTestAttempt(id) {
  await requestJson(`/api/full-test/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
