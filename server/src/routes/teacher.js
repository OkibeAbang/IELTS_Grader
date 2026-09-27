import bcrypt from "bcryptjs";
import express from "express";
import rateLimit from "express-rate-limit";
import {
  signTeacherSession,
  verifyTeacherSession,
  TEACHER_COOKIE_NAME,
  teacherCookieOptions,
} from "../auth/teacherAuth.js";
import { requireTeacher } from "../middleware/requireTeacher.js";
import { verifyPassword } from "../auth/passwords.js";
import { findByUsername } from "../models/teachers.js";
import {
  createClass,
  findClassById,
  listClassesForTeacher,
  deleteClass,
} from "../models/classes.js";
import {
  listStudentsForClass,
  removeStudentFromClass,
  isStudentInTeachersClasses,
} from "../models/classStudents.js";
import { upsertReview, findReview } from "../models/teacherReviews.js";
import { findById as findUserById } from "../models/users.js";
import { listAttemptsForUser as listEssayAttempts, findAttemptById as findEssayAttemptById } from "../models/essayAttempts.js";
import {
  listAttemptsForUser as listSpeakingAttempts,
  findAttemptById as findSpeakingAttemptById,
} from "../models/speakingAttempts.js";
import {
  listAttemptsForUser as listSpeakingDrillAttempts,
  findAttemptById as findSpeakingDrillAttemptById,
} from "../models/speakingDrillAttempts.js";
import { listAttemptsForUser as listReadingAttempts } from "../models/readingAttempts.js";
import { listAttemptsForUser as listListeningAttempts } from "../models/listeningAttempts.js";

const router = express.Router();

// Teacher usernames are predictable (teacher.001, teacher.002, ...), so this
// endpoint gets a tighter budget than admin's — a guessable username space
// makes credential stuffing cheaper to attempt.
const teacherLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes and try again." },
});

// A precomputed bcrypt hash with no corresponding real password. Comparing
// against this when a username doesn't exist means both branches of login
// pay the same bcrypt cost, so response timing can't be used to enumerate
// which teacher.NNN usernames are real.
const DUMMY_HASH = bcrypt.hashSync("no-such-teacher-account", 10);

const ATTEMPT_TYPES = {
  essay: { findAttemptById: findEssayAttemptById },
  speaking: { findAttemptById: findSpeakingAttemptById },
  speaking_drill: { findAttemptById: findSpeakingDrillAttemptById },
};

router.post("/login", teacherLoginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "username and password are required" });
  }

  try {
    const teacher = await findByUsername(username);
    const valid = await verifyPassword(password, teacher?.password_hash ?? DUMMY_HASH);

    if (!teacher || !valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = signTeacherSession({ id: teacher.id, username: teacher.username });
    res.cookie(TEACHER_COOKIE_NAME, token, teacherCookieOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error("Teacher login failed:", err);
    res.status(502).json({ error: "Login failed. Please try again." });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(TEACHER_COOKIE_NAME, teacherCookieOptions);
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = req.cookies?.[TEACHER_COOKIE_NAME];
  if (!token) {
    return res.json({ teacher: null });
  }
  try {
    const payload = verifyTeacherSession(token);
    res.json({ teacher: { id: payload.sub, username: payload.username } });
  } catch {
    res.json({ teacher: null });
  }
});

// Everything below requires a valid teacher session.
router.use(requireTeacher);

router.post("/classes", async (req, res) => {
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  try {
    const created = await createClass({ teacherId: req.teacher.id, name: name.trim() });
    res.status(201).json({ class: created });
  } catch (err) {
    console.error("Creating class failed:", err);
    res.status(502).json({ error: "Could not create class. Please try again." });
  }
});

router.get("/classes", async (req, res) => {
  try {
    res.json({ classes: await listClassesForTeacher(req.teacher.id) });
  } catch (err) {
    console.error("Listing classes failed:", err);
    res.status(502).json({ error: "Could not load classes. Please try again." });
  }
});

async function requireOwnedClass(req, res) {
  const cls = await findClassById(req.params.id);
  if (!cls || cls.teacherId !== req.teacher.id) {
    res.status(404).json({ error: "Class not found" });
    return null;
  }
  return cls;
}

router.get("/classes/:id", async (req, res) => {
  try {
    const cls = await requireOwnedClass(req, res);
    if (!cls) return;
    const students = await listStudentsForClass(cls.id);
    res.json({ class: cls, students });
  } catch (err) {
    console.error("Loading class failed:", err);
    res.status(502).json({ error: "Could not load this class. Please try again." });
  }
});

router.delete("/classes/:id", async (req, res) => {
  try {
    const cls = await requireOwnedClass(req, res);
    if (!cls) return;
    await deleteClass(cls.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting class failed:", err);
    res.status(502).json({ error: "Could not delete this class. Please try again." });
  }
});

router.delete("/classes/:id/students/:studentId", async (req, res) => {
  try {
    const cls = await requireOwnedClass(req, res);
    if (!cls) return;
    await removeStudentFromClass(cls.id, Number(req.params.studentId));
    res.status(204).end();
  } catch (err) {
    console.error("Removing student failed:", err);
    res.status(502).json({ error: "Could not remove this student. Please try again." });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const owned = await isStudentInTeachersClasses(req.teacher.id, userId);
    if (!owned) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = await findUserById(userId);
    const [essays, speaking, speakingDrills, reading, listening] = await Promise.all([
      listEssayAttempts(userId),
      listSpeakingAttempts(userId),
      listSpeakingDrillAttempts(userId),
      listReadingAttempts(userId),
      listListeningAttempts(userId),
    ]);

    res.json({
      student: { id: student.id, email: student.email, displayName: student.display_name },
      attempts: {
        essay: essays,
        speaking,
        speakingDrill: speakingDrills,
        reading,
        listening,
      },
    });
  } catch (err) {
    console.error("Loading student progress failed:", err);
    res.status(502).json({ error: "Could not load this student. Please try again." });
  }
});

async function loadOwnedAttempt(req, res, attemptType) {
  const { findAttemptById } = ATTEMPT_TYPES[attemptType];
  const attempt = await findAttemptById(req.params.id);
  if (!attempt) {
    res.status(404).json({ error: "Attempt not found" });
    return null;
  }
  const owned = await isStudentInTeachersClasses(req.teacher.id, attempt.userId);
  if (!owned) {
    res.status(404).json({ error: "Attempt not found" });
    return null;
  }
  return attempt;
}

router.get("/essays/:id", async (req, res) => {
  try {
    const attempt = await loadOwnedAttempt(req, res, "essay");
    if (!attempt) return;
    res.json({
      attempt: {
        ...attempt.rawGraderResult,
        attemptId: attempt.id,
        mode: attempt.mode,
        taskType: attempt.taskType,
        section: attempt.section,
        promptText: attempt.promptText,
        essayText: attempt.essayText,
        createdAt: attempt.createdAt,
        teacherReview: await findReview("essay", attempt.id),
      },
    });
  } catch (err) {
    console.error("Loading essay attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.get("/speaking-attempts/:id", async (req, res) => {
  try {
    const attempt = await loadOwnedAttempt(req, res, "speaking");
    if (!attempt) return;
    res.json({
      attempt: {
        ...attempt.rawGraderResult,
        attemptId: attempt.id,
        topicLabel: attempt.topicLabel,
        targetBand: attempt.targetBand,
        createdAt: attempt.createdAt,
        teacherReview: await findReview("speaking", attempt.id),
      },
    });
  } catch (err) {
    console.error("Loading speaking attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.get("/speaking-drill-attempts/:id", async (req, res) => {
  try {
    const attempt = await loadOwnedAttempt(req, res, "speaking_drill");
    if (!attempt) return;
    res.json({
      attempt: {
        ...attempt.rawGraderResult,
        attemptId: attempt.id,
        topicLabel: attempt.topicLabel,
        part: attempt.part,
        createdAt: attempt.createdAt,
        teacherReview: await findReview("speaking_drill", attempt.id),
      },
    });
  } catch (err) {
    console.error("Loading speaking drill attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.put("/reviews", async (req, res) => {
  const { attemptType, attemptId, overrideBand, comment } = req.body ?? {};

  if (!Object.keys(ATTEMPT_TYPES).includes(attemptType)) {
    return res.status(400).json({ error: "attemptType must be 'essay', 'speaking', or 'speaking_drill'" });
  }
  if (overrideBand != null && (typeof overrideBand !== "number" || overrideBand < 1 || overrideBand > 9)) {
    return res.status(400).json({ error: "overrideBand must be a number between 1 and 9" });
  }

  try {
    const { findAttemptById } = ATTEMPT_TYPES[attemptType];
    const attempt = await findAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    const owned = await isStudentInTeachersClasses(req.teacher.id, attempt.userId);
    if (!owned) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    const review = await upsertReview({
      attemptType,
      attemptId: attempt.id,
      teacherId: req.teacher.id,
      overrideBand: overrideBand ?? null,
      comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
    });
    res.json({ review });
  } catch (err) {
    console.error("Saving teacher review failed:", err);
    res.status(502).json({ error: "Could not save this review. Please try again." });
  }
});

export { router as teacherRouter };
