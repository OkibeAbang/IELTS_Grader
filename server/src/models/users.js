import { run, queryOne, queryAll } from "../db.js";

const PUBLIC_FIELDS = "id, email, display_name, email_verified, created_at";

function createUser({ email, passwordHash = null, googleId = null, displayName = null, emailVerified = false }) {
  const id = run(
    `INSERT INTO users (email, password_hash, google_id, display_name, email_verified) VALUES (?, ?, ?, ?, ?)`,
    [email, passwordHash, googleId, displayName, emailVerified ? 1 : 0]
  );
  return findById(id);
}

function findByEmail(email) {
  return queryOne(`SELECT * FROM users WHERE email = ?`, [email]);
}

function findByGoogleId(googleId) {
  return queryOne(`SELECT * FROM users WHERE google_id = ?`, [googleId]);
}

function findById(id) {
  return queryOne(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id]);
}

function setVerificationToken(userId, token, expiresAt) {
  run(`UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE id = ?`, [
    token,
    expiresAt,
    userId,
  ]);
}

function verifyEmailByToken(token) {
  const user = queryOne(
    `SELECT * FROM users WHERE verification_token = ? AND verification_token_expires_at > datetime('now')`,
    [token]
  );
  if (!user) return null;

  run(`UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires_at = NULL WHERE id = ?`, [
    user.id,
  ]);
  return findById(user.id);
}

function setResetToken(userId, token, expiresAt) {
  run(`UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?`, [token, expiresAt, userId]);
}

function findByResetToken(token) {
  return queryOne(`SELECT * FROM users WHERE reset_token = ? AND reset_token_expires_at > datetime('now')`, [token]);
}

function resetPassword(userId, passwordHash) {
  run(`UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?`, [
    passwordHash,
    userId,
  ]);
}

function listAllUsers() {
  const rows = queryAll(
    `SELECT u.id, u.email, u.display_name, u.email_verified, u.google_id, u.created_at,
            COUNT(sa.id) AS attempt_count
     FROM users u
     LEFT JOIN speaking_attempts sa ON sa.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    emailVerified: !!row.email_verified,
    authProvider: row.google_id ? "google" : "password",
    createdAt: row.created_at,
    attemptCount: row.attempt_count,
  }));
}

function deleteUser(id) {
  run(`DELETE FROM users WHERE id = ?`, [id]);
}

function countUsers() {
  return queryOne(`SELECT COUNT(*) AS count FROM users`).count;
}

function countUsersSince(isoDate) {
  return queryOne(`SELECT COUNT(*) AS count FROM users WHERE created_at >= ?`, [isoDate]).count;
}

export {
  createUser,
  findByEmail,
  findByGoogleId,
  findById,
  setVerificationToken,
  verifyEmailByToken,
  setResetToken,
  findByResetToken,
  resetPassword,
  listAllUsers,
  deleteUser,
  countUsers,
  countUsersSince,
};
