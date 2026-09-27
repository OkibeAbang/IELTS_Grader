import { requestJson } from './http';

export async function teacherLogin({ username, password }) {
  return requestJson('/api/teacher/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function teacherLogout() {
  await requestJson('/api/teacher/logout', { method: 'POST' });
}

export async function getTeacherSession() {
  const data = await requestJson('/api/teacher/me');
  return data.teacher;
}

export async function createClass({ name }) {
  const data = await requestJson('/api/teacher/classes', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.class;
}

export async function fetchClasses() {
  const data = await requestJson('/api/teacher/classes');
  return data.classes;
}

export async function fetchClassDetail(id) {
  return requestJson(`/api/teacher/classes/${encodeURIComponent(id)}`);
}

export async function deleteClass(id) {
  await requestJson(`/api/teacher/classes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function removeStudentFromClass(classId, studentId) {
  await requestJson(
    `/api/teacher/classes/${encodeURIComponent(classId)}/students/${encodeURIComponent(studentId)}`,
    { method: 'DELETE' }
  );
}

export async function fetchStudentDetail(id) {
  return requestJson(`/api/teacher/students/${encodeURIComponent(id)}`);
}

const ATTEMPT_PATHS = {
  essay: 'essays',
  speaking: 'speaking-attempts',
  speaking_drill: 'speaking-drill-attempts',
};

export async function fetchTeacherAttempt(attemptType, id) {
  const path = ATTEMPT_PATHS[attemptType];
  const data = await requestJson(`/api/teacher/${path}/${encodeURIComponent(id)}`);
  return data.attempt;
}

export async function saveReview({ attemptType, attemptId, overrideBand, comment }) {
  const data = await requestJson('/api/teacher/reviews', {
    method: 'PUT',
    body: JSON.stringify({ attemptType, attemptId, overrideBand, comment }),
  });
  return data.review;
}
