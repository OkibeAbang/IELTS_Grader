import { requestJson, API_BASE_URL } from './http';

export async function adminLogin({ username, password }) {
  return requestJson('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout() {
  await requestJson('/api/admin/logout', { method: 'POST' });
}

export async function getAdminSession() {
  const data = await requestJson('/api/admin/me');
  return data.admin;
}

export async function fetchAdminStats() {
  return requestJson('/api/admin/stats');
}

export async function fetchAdminUsers() {
  const data = await requestJson('/api/admin/users');
  return data.users;
}

export async function deleteAdminUser(id) {
  await requestJson(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function fetchAdminAttempts({ limit = 50, offset = 0 } = {}) {
  return requestJson(`/api/admin/attempts?limit=${limit}&offset=${offset}`);
}

export async function fetchAdminAttemptDetail(id) {
  const data = await requestJson(`/api/admin/attempts/${encodeURIComponent(id)}`);
  return data.attempt;
}

export function adminAttemptAudioUrl(attemptId, part) {
  return `${API_BASE_URL}/api/admin/attempts/${encodeURIComponent(attemptId)}/audio/${part}`;
}
