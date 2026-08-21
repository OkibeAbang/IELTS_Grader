import { run, queryOne, queryAll } from "../db.js";

const PUBLIC_FIELDS =
  "id, email, display_name, email_verified, created_at, " +
  "stripe_customer_id, stripe_subscription_id, subscription_tier, subscription_status, subscription_current_period_end";

async function createUser({ email, passwordHash = null, googleId = null, displayName = null, emailVerified = false }) {
  const id = await run(
    `INSERT INTO users (email, password_hash, google_id, display_name, email_verified) VALUES (?, ?, ?, ?, ?)`,
    [email, passwordHash, googleId, displayName, emailVerified ? 1 : 0]
  );
  return findById(id);
}

async function findByEmail(email) {
  return queryOne(`SELECT * FROM users WHERE email = ?`, [email]);
}

async function findByGoogleId(googleId) {
  return queryOne(`SELECT * FROM users WHERE google_id = ?`, [googleId]);
}

async function findById(id) {
  return queryOne(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id]);
}

async function setVerificationToken(userId, token, expiresAt) {
  await run(`UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE id = ?`, [
    token,
    expiresAt,
    userId,
  ]);
}

async function verifyEmailByToken(token) {
  const user = await queryOne(
    `SELECT * FROM users WHERE verification_token = ? AND verification_token_expires_at > datetime('now')`,
    [token]
  );
  if (!user) return null;

  await run(`UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires_at = NULL WHERE id = ?`, [
    user.id,
  ]);
  return findById(user.id);
}

async function setResetToken(userId, token, expiresAt) {
  await run(`UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?`, [token, expiresAt, userId]);
}

async function findByResetToken(token) {
  return queryOne(`SELECT * FROM users WHERE reset_token = ? AND reset_token_expires_at > datetime('now')`, [token]);
}

async function resetPassword(userId, passwordHash) {
  await run(`UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?`, [
    passwordHash,
    userId,
  ]);
}

async function findByStripeCustomerId(customerId) {
  return queryOne(`SELECT * FROM users WHERE stripe_customer_id = ?`, [customerId]);
}

async function updateSubscription(
  userId,
  { stripeCustomerId, stripeSubscriptionId, tier, status, currentPeriodEnd }
) {
  await run(
    `UPDATE users
     SET stripe_customer_id = ?,
         stripe_subscription_id = ?,
         subscription_tier = ?,
         subscription_status = ?,
         subscription_current_period_end = ?
     WHERE id = ?`,
    [stripeCustomerId, stripeSubscriptionId, tier, status, currentPeriodEnd, userId]
  );
  return findById(userId);
}

async function listAllUsers() {
  const rows = await queryAll(
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

async function deleteUser(id) {
  await run(`DELETE FROM users WHERE id = ?`, [id]);
}

async function countUsers() {
  const row = await queryOne(`SELECT COUNT(*) AS count FROM users`);
  return row.count;
}

async function countUsersSince(isoDate) {
  const row = await queryOne(`SELECT COUNT(*) AS count FROM users WHERE created_at >= ?`, [isoDate]);
  return row.count;
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
  findByStripeCustomerId,
  updateSubscription,
  listAllUsers,
  deleteUser,
  countUsers,
  countUsersSince,
};
