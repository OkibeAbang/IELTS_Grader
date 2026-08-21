import crypto from "node:crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import { OAuth2Client } from "google-auth-library";
import {
  createUser,
  findByEmail,
  findByGoogleId,
  findById,
  setVerificationToken,
  verifyEmailByToken,
  setResetToken,
  findByResetToken,
  resetPassword,
} from "../models/users.js";
import { hashPassword, verifyPassword } from "../auth/passwords.js";
import { signSession, verifySession, SESSION_COOKIE_NAME, cookieOptions } from "../auth/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../email.js";

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

// Shared across signup/login/forgot-password: these are the endpoints an
// attacker would script (credential stuffing, spam accounts, reset-email
// flooding). One IP gets 10 attempts per 15 minutes across each.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes and try again." },
});

function toPublicUser(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? row.displayName ?? null,
    emailVerified: !!row.email_verified,
    subscriptionTier: row.subscription_tier ?? row.subscriptionTier ?? "free",
    subscriptionStatus: row.subscription_status ?? row.subscriptionStatus ?? null,
    subscriptionCurrentPeriodEnd: row.subscription_current_period_end ?? row.subscriptionCurrentPeriodEnd ?? null,
  };
}

function setSessionCookie(res, user) {
  const token = signSession({ id: user.id, email: user.email });
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function isoInMs(ms) {
  return new Date(Date.now() + ms).toISOString().slice(0, 19).replace("T", " ");
}

router.post("/signup", authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    if (await findByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await hashPassword(password);
    // Auto-verified: with no SMTP configured, the verification email only
    // ever reached the server console, permanently blocking every real user
    // from the (paid, Gemini-backed) speaking grading endpoint.
    const user = await createUser({ email, passwordHash, emailVerified: true });

    setSessionCookie(res, user);
    res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(502).json({ error: "Signup failed. Please try again." });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const user = await findByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    setSessionCookie(res, user);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(502).json({ error: "Login failed. Please try again." });
  }
});

router.post("/google", async (req, res) => {
  const { credential } = req.body ?? {};

  if (typeof credential !== "string" || !credential) {
    return res.status(400).json({ error: "credential is required" });
  }
  if (!googleClient) {
    return res.status(500).json({ error: "Google sign-in is not configured on this server" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const displayName = payload.name ?? null;

    let user = await findByGoogleId(googleId);
    if (!user) user = await findByEmail(email);
    if (!user) {
      // Google has already verified this email as part of its own signup flow.
      user = await createUser({ email, googleId, displayName, emailVerified: !!payload.email_verified });
    }

    setSessionCookie(res, user);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Google sign-in failed:", err);
    res.status(401).json({ error: "Google sign-in failed" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
  res.json({ ok: true });
});

router.get("/session", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    return res.json({ user: null });
  }

  try {
    const payload = verifySession(token);
    const user = await findById(payload.sub);
    res.json({ user: user ? toPublicUser(user) : null });
  } catch {
    res.json({ user: null });
  }
});

router.post("/verify-email", async (req, res) => {
  const { token } = req.body ?? {};
  if (typeof token !== "string" || !token) {
    return res.status(400).json({ error: "token is required" });
  }

  try {
    const user = await verifyEmailByToken(token);
    if (!user) {
      return res.status(400).json({ error: "This verification link is invalid or has expired." });
    }

    setSessionCookie(res, user);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Email verification failed:", err);
    res.status(502).json({ error: "Verification failed. Please try again." });
  }
});

router.post("/resend-verification", requireAuth, async (req, res) => {
  try {
    const user = await findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Account not found" });
    }
    if (user.email_verified) {
      return res.json({ ok: true, alreadyVerified: true });
    }

    const token = generateToken();
    await setVerificationToken(user.id, token, isoInMs(VERIFICATION_TOKEN_TTL_MS));
    await sendVerificationEmail(user, token);
    res.json({ ok: true });
  } catch (err) {
    console.error("Resend verification failed:", err);
    res.status(502).json({ error: "Couldn't send the verification email. Please try again." });
  }
});

router.post("/forgot-password", authLimiter, async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  try {
    const user = await findByEmail(email);
    // Always report success — confirming whether an email exists is its own leak.
    if (user && user.password_hash) {
      const token = generateToken();
      await setResetToken(user.id, token, isoInMs(RESET_TOKEN_TTL_MS));
      await sendPasswordResetEmail(user, token);
    }
  } catch (err) {
    console.error("Sending password reset email failed:", err);
  }

  res.json({ ok: true });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body ?? {};
  if (typeof token !== "string" || !token) {
    return res.status(400).json({ error: "token is required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const user = await findByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: "This reset link is invalid or has expired." });
    }

    const passwordHash = await hashPassword(password);
    await resetPassword(user.id, passwordHash);

    setSessionCookie(res, user);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Password reset failed:", err);
    res.status(502).json({ error: "Password reset failed. Please try again." });
  }
});

export { router as authRouter, toPublicUser };
