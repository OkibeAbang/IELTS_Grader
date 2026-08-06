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
import { deleteAttemptAudio, streamAttemptAudio } from "../audioStorage.js";

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

router.get("/stats", async (_req, res) => {
  try {
    const since7d = isoDaysAgo(7);
    const [totalUsers, totalAttempts, newUsersLast7Days, attemptsLast7Days, avgBand, recentUsers, recentAttempts] =
      await Promise.all([
        countUsers(),
        countAttempts(),
        countUsersSince(since7d),
        countAttemptsSince(since7d),
        averageOverallBand(),
        listAllUsers(),
        listAllAttempts({ limit: 5 }),
      ]);
    res.json({
      totalUsers,
      totalAttempts,
      newUsersLast7Days,
      attemptsLast7Days,
      averageOverallBand: avgBand,
      recentUsers: recentUsers.slice(0, 5),
      recentAttempts,
    });
  } catch (err) {
    console.error("Loading admin stats failed:", err);
    res.status(502).json({ error: "Could not load stats. Please try again." });
  }
});

router.get("/users", async (_req, res) => {
  try {
    res.json({ users: await listAllUsers() });
  } catch (err) {
    console.error("Listing users failed:", err);
    res.status(502).json({ error: "Could not load users. Please try again." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const attempts = await listFullAttemptsForUser(userId);
    for (const attempt of attempts) {
      await deleteAttemptAudio(attempt);
      await deleteAttempt(attempt.id);
    }
    await deleteUser(userId);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting user failed:", err);
    res.status(502).json({ error: "Could not delete this user. Please try again." });
  }
});

router.get("/attempts", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const [attempts, total] = await Promise.all([listAllAttempts({ limit, offset }), countAttempts()]);
    res.json({ attempts, total });
  } catch (err) {
    console.error("Listing admin attempts failed:", err);
    res.status(502).json({ error: "Could not load attempts. Please try again." });
  }
});

router.get("/attempts/:id", async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    res.json({
      attempt: {
        ...attempt.rawGraderResult,
        attemptId: attempt.id,
        userId: attempt.userId,
        topicLabel: attempt.topicLabel,
        targetBand: attempt.targetBand,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading admin attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.get("/attempts/:id/audio/:part", async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    const pathKey = `${req.params.part}AudioPath`;
    const key = attempt[pathKey];
    if (!key) {
      return res.status(404).json({ error: "Audio part not found" });
    }
    res.set("Content-Type", "audio/wav");
    await streamAttemptAudio(key, res);
  } catch (err) {
    console.error("Streaming admin audio failed:", err);
    if (!res.headersSent) res.status(502).json({ error: "Could not load this audio file." });
  }
});

export { router as adminRouter };
