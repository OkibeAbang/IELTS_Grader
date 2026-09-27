import { requestJson } from './http';

export async function joinClass(code) {
  const data = await requestJson('/api/classes/join', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return data.class;
}

export async function fetchMyClasses() {
  const data = await requestJson('/api/classes/mine');
  return data.classes;
}
