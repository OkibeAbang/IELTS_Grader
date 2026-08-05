// Empty in dev (CRA's "proxy" field in package.json forwards /api to localhost:4000).
// Set to the deployed backend's origin (e.g. https://xxx.onrender.com) at build
// time when the frontend and backend are hosted separately.
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed with status ${res.status}`);
    err.code = body.code;
    throw err;
  }

  if (res.status === 204) {
    return null;
  }
  return res.json();
}

export { requestJson, API_BASE_URL };
