import { requestJson } from './http';

export async function getSession() {
  const data = await requestJson('/api/auth/session');
  return data.user;
}

export async function signup({ email, password }) {
  const data = await requestJson('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function login({ email, password }) {
  const data = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function loginWithGoogle(credential) {
  const data = await requestJson('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  return data.user;
}

export async function logout() {
  await requestJson('/api/auth/logout', { method: 'POST' });
}

export async function verifyEmail(token) {
  const data = await requestJson('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return data.user;
}

export async function resendVerification() {
  return requestJson('/api/auth/resend-verification', { method: 'POST' });
}

export async function forgotPassword(email) {
  return requestJson('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ token, password }) {
  const data = await requestJson('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
  return data.user;
}
