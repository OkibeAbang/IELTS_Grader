import express from "express";
import { getListeningSectionBank, getListeningTestBank, getListeningSection } from "../listeningPassageBank.js";
import { scoreListeningAttempt, scoreListeningDrill, scoreListeningFullTest } from "../scoreListening.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/listeningAttempts.js";
import { streamListeningAudio } from "../audioStorage.js";

const router = express.Router();

router.get("/sections", (_req, res) => {
  res.json({ sections: getListeningSectionBank() });
});

// Complete tests (one test = its Parts 1-4), for the "choose a test"
// picker on the Listening practice page.
router.get("/tests", (_req, res) => {
  res.json({ tests: getListeningTestBank() });
});

router.get("/sections/:id", (req, res) => {
  const section = getListeningSection(req.params.id);
  if (!section) return res.status(404).json({ error: "Section not found" });
  res.json({ section });
});

router.get("/sections/:id/audio", async (req, res) => {
  try {
    const section = getListeningSection(req.params.id);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }
    // streamListeningAudio sets headers itself once it knows the file exists,
    // so Content-Type is only set on the success path — setting it before
    // knowing whether the file exists would need undoing on the 404 branch.
    const streamed = await streamListeningAudio(section.id, req, res);
    if (!streamed) {
      return res.status(404).json({ error: "Audio hasn't been generated for this section yet" });
    }
  } catch (err) {
    console.error("Streaming listening audio failed:", err);
    if (!res.headersSent) res.status(502).json({ error: "Could not load this audio file." });
  }
});

router.post("/attempts", requireAuth, async (req, res) => {
  const { sectionId, answers } = req.body ?? {};

  if (typeof sectionId !== "string" || !sectionId.trim()) {
    return res.status(400).json({ error: "sectionId is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreListeningAttempt({ sectionId, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      sectionId: result.sectionId,
      sectionTitle: result.sectionTitle,
      answers,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "SECTION_NOT_FOUND") {
      return res.status(404).json({ error: "Section not found" });
    }
    console.error("Listening scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

// Real IELTS Listening: 4 parts in one continuous ~30-minute recording, one
// combined score — not a single section in isolation. Same reuse pattern as
// Reading's full-test route: existing listening_attempts table, new
// mode value, JSON blob columns absorb the multi-section shape without a
// migration.
router.post("/attempts/full-test", requireAuth, async (req, res) => {
  const { answersBySectionId, sectionIds, testNumber } = req.body ?? {};

  if (typeof answersBySectionId !== "object" || answersBySectionId === null) {
    return res.status(400).json({ error: "answersBySectionId must be an object" });
  }
  if (sectionIds !== undefined && !Array.isArray(sectionIds)) {
    return res.status(400).json({ error: "sectionIds must be an array when provided" });
  }

  try {
    const result = scoreListeningFullTest({ answersBySectionId, sectionIds });
    const sectionCount = result.sectionResults.length;
    const attempt = await createAttempt({
      userId: req.user.id,
      sectionId: JSON.stringify(result.sectionResults.map((s) => s.sectionId)),
      sectionTitle: Number.isFinite(Number(testNumber))
        ? `Listening Test ${Number(testNumber)} (${sectionCount} part${sectionCount === 1 ? "" : "s"})`
        : `Full Listening Test (${sectionCount} part${sectionCount === 1 ? "" : "s"})`,
      mode: "full_listening_test",
      answers: answersBySectionId,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "SECTION_NOT_FOUND") {
      return res.status(404).json({ error: "Section not found" });
    }
    console.error("Listening full-test scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.post("/attempts/drill", requireAuth, async (req, res) => {
  const { sectionId, questionType, answers } = req.body ?? {};

  if (typeof sectionId !== "string" || !sectionId.trim()) {
    return res.status(400).json({ error: "sectionId is required" });
  }
  if (typeof questionType !== "string" || !questionType.trim()) {
    return res.status(400).json({ error: "questionType is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreListeningDrill({ sectionId, questionType, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      sectionId: result.sectionId,
      sectionTitle: result.sectionTitle,
      mode: "drill",
      questionType: result.questionType,
      answers,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "SECTION_NOT_FOUND") {
      return res.status(404).json({ error: "Section not found" });
    }
    if (err.code === "NO_QUESTIONS_OF_TYPE") {
      return res.status(400).json({ error: "No questions of that type in this section" });
    }
    console.error("Listening drill scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.get("/attempts", requireAuth, async (req, res) => {
  try {
    res.json({ attempts: await listAttemptsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing listening attempts failed:", err);
    res.status(502).json({ error: "Could not load your listening history. Please try again." });
  }
});

router.get("/attempts/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    res.json({
      attempt: {
        ...attempt.rawResult,
        attemptId: attempt.id,
        sectionTitle: attempt.sectionTitle,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading listening attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.delete("/attempts/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    await deleteAttempt(attempt.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting listening attempt failed:", err);
    res.status(502).json({ error: "Could not delete this attempt. Please try again." });
  }
});

export { router as listeningRouter };
