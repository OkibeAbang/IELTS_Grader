import fs from "node:fs";
import crypto from "node:crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import {
  signAdminSession,
  verifyAdminSession,
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
} from "../auth/adminAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { listAllUsers, deleteUser, countUsers, countUsersSince, findById } from "../models/users.js";
import {
  listAllAttempts,
  countAttempts,
  countAttemptsSince,
  averageOverallBand,
  listFullAttemptsForUser,
  findAttemptById,
  deleteAttempt,
} from "../models/speakingAttempts.js";
import { deleteAttemptAudio, resolveAudioPath } from "../audioStorage.js";

const router = express.Router();

// A single fixed account is a natural credential-stuffing target, so this
// endpoint gets a tighter budget than the per-user authLimiter in auth.js.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes and try again." },
});

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace("T", " ");
}

router.post("/login", adminLoginLimiter, (req, res) => {
  const { username, password } = req.body ?? {};
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return res.status(500).json({ error: "Admin login is not configured on this server" });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "username and password are required" });
  }

  const valid =
    timingSafeStringEqual(username, expectedUsername) && timingSafeStringEqual(password, expectedPassword);
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = signAdminSession();
  res.cookie(ADMIN_COOKIE_NAME, token, adminCookieOptions);
  res.json({ ok: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, adminCookieOptions);
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  if (!token) {
    return res.json({ admin: false });
  }
  try {
    verifyAdminSession(token);
    res.json({ admin: true });
  } catch {
    res.json({ admin: false });
  }
});

// Everything below requires a valid admin session.
router.use(requireAdmin);

router.get("/stats", (_req, res) => {
  const since7d = isoDaysAgo(7);
  res.json({
    totalUsers: countUsers(),
    totalAttempts: countAttempts(),
    newUsersLast7Days: countUsersSince(since7d),
    attemptsLast7Days: countAttemptsSince(since7d),
    averageOverallBand: averageOverallBand(),
    recentUsers: listAllUsers().slice(0, 5),
    recentAttempts: listAllAttempts({ limit: 5 }),
  });
});

router.get("/users", (_req, res) => {
  res.json({ users: listAllUsers() });
});

router.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const attempts = listFullAttemptsForUser(userId);
  for (const attempt of attempts) {
    deleteAttemptAudio(attempt);
    deleteAttempt(attempt.id);
  }
  deleteUser(userId);
  res.status(204).end();
});

router.get("/attempts", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;
  res.json({ attempts: listAllAttempts({ limit, offset }), total: countAttempts() });
});

router.get("/attempts/:id", (req, res) => {
  const attempt = findAttemptById(req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: "Attempt not found" });
  }
  res.json({
    attempt: {
      ...attempt.rawGraderResult,
      attemptId: attempt.id,
      userId: attempt.userId,
      topicLabel: attempt.topicLabel,
      createdAt: attempt.createdAt,
    },
  });
});

router.get("/attempts/:id/audio/:part", (req, res) => {
  const attempt = findAttemptById(req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: "Attempt not found" });
  }
  const pathKey = `${req.params.part}AudioPath`;
  const relativePath = attempt[pathKey];
  if (!relativePath) {
    return res.status(404).json({ error: "Audio part not found" });
  }
  res.set("Content-Type", "audio/wav");
  fs.createReadStream(resolveAudioPath(relativePath)).pipe(res);
});

export { router as adminRouter };
