import { findById } from "../models/users.js";

/**
 * Chain after requireAuth. Gates the endpoints that cost real money per call
 * (Gemini-backed grading) behind a verified email, so an unverified/spam
 * account can't run up API usage. Verification status isn't in the JWT
 * (would go stale between issue and revocation), so this re-reads it.
 */
async function requireVerifiedEmail(req, res, next) {
  let user;
  try {
    user = await findById(req.user.id);
  } catch (err) {
    console.error("requireVerifiedEmail lookup failed:", err.message);
    return res.status(502).json({ error: "Could not verify your account. Please try again." });
  }
  if (!user) {
    return res.status(401).json({ error: "Not signed in" });
  }
  if (!user.email_verified) {
    return res.status(403).json({
      error: "Verify your email address before submitting a speaking attempt for grading.",
      code: "EMAIL_NOT_VERIFIED",
    });
  }
  next();
}

export { requireVerifiedEmail };
