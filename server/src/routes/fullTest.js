import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireVerifiedEmail } from "../middleware/requireVerifiedEmail.js";
import { getReadingPassageBank } from "../readingPassageBank.js";
import { getListeningSectionBank } from "../listeningPassageBank.js";
import { getPromptBank } from "../promptBank.js";
import { getSpeakingTopicBank } from "../speakingQuestionBank.js";
import { roundToIELTSBand } from "../ieltsBandRounding.js";
import {
  createFullTest,
  finalizeFullTest,
  listFullTestsForUser,
  findFullTestById,
  deleteFullTest,
} from "../models/fullTestAttempts.js";
import { findAttemptById as findReadingAttemptById } from "../models/readingAttempts.js";
import { findAttemptById as findListeningAttemptById } from "../models/listeningAttempts.js";
import { findAttemptById as findEssayAttemptById } from "../models/essayAttempts.js";
import { findAttemptById as findSpeakingAttemptById } from "../models/speakingAttempts.js";

const router = express.Router();

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

router.post("/", requireAuth, requireVerifiedEmail, async (req, res) => {
  try {
    const readingPassage = pickRandom(getReadingPassageBank());
    const listeningSection = pickRandom(getListeningSectionBank());
    const task1Prompt = pickRandom(getPromptBank("task1"));
    const task2Prompt = pickRandom(getPromptBank("task2"));
    const speakingTopic = pickRandom(getSpeakingTopicBank());

    const fullTest = await createFullTest({ userId: req.user.id });

    res.status(201).json({
      fullTest,
      assignment: {
        readingPassageId: readingPassage.id,
        listeningSectionId: listeningSection.id,
        writingTask1Prompt: { id: task1Prompt.id, text: task1Prompt.text },
        writingTask2Prompt: { id: task2Prompt.id, text: task2Prompt.text },
        speakingTopicId: speakingTopic.id,
      },
    });
  } catch (err) {
    console.error("Starting full test failed:", err);
    res.status(502).json({ error: "Could not start a full test. Please try again." });
  }
});

router.post("/:id/finalize", requireAuth, async (req, res) => {
  const {
    listeningAttemptId,
    readingAttemptId,
    writingTask1AttemptId,
    writingTask2AttemptId,
    speakingAttemptId,
  } = req.body ?? {};

  const ids = { listeningAttemptId, readingAttemptId, writingTask1AttemptId, writingTask2AttemptId, speakingAttemptId };
  for (const [key, value] of Object.entries(ids)) {
    if (!Number.isFinite(Number(value))) {
      return res.status(400).json({ error: `${key} is required` });
    }
  }

  try {
    const fullTest = await findFullTestById(req.params.id);
    if (!fullTest || fullTest.userId !== req.user.id) {
      return res.status(404).json({ error: "Full test not found" });
    }

    const [listeningAttempt, readingAttempt, task1Attempt, task2Attempt, speakingAttempt] = await Promise.all([
      findListeningAttemptById(listeningAttemptId),
      findReadingAttemptById(readingAttemptId),
      findEssayAttemptById(writingTask1AttemptId),
      findEssayAttemptById(writingTask2AttemptId),
      findSpeakingAttemptById(speakingAttemptId),
    ]);

    const attempts = { listeningAttempt, readingAttempt, task1Attempt, task2Attempt, speakingAttempt };
    for (const [key, attempt] of Object.entries(attempts)) {
      if (!attempt || attempt.userId !== req.user.id) {
        return res.status(404).json({ error: `${key} not found` });
      }
    }

    const listeningBand = listeningAttempt.overallBand;
    const readingBand = readingAttempt.overallBand;
    const writingBand = roundToIELTSBand((task1Attempt.overallBand + 2 * task2Attempt.overallBand) / 3);
    const speakingBand = speakingAttempt.overallBand;
    const overallBand = roundToIELTSBand((listeningBand + readingBand + writingBand + speakingBand) / 4);

    const finalized = await finalizeFullTest(fullTest.id, {
      listeningAttemptId,
      readingAttemptId,
      writingTask1AttemptId,
      writingTask2AttemptId,
      speakingAttemptId,
      listeningBand,
      readingBand,
      writingBand,
      speakingBand,
      overallBand,
    });

    res.json({ fullTest: finalized });
  } catch (err) {
    console.error("Finalizing full test failed:", err);
    res.status(502).json({ error: "Could not finalize this full test. Please try again." });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    res.json({ fullTests: await listFullTestsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing full tests failed:", err);
    res.status(502).json({ error: "Could not load your full test history. Please try again." });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const fullTest = await findFullTestById(req.params.id);
    if (!fullTest || fullTest.userId !== req.user.id) {
      return res.status(404).json({ error: "Full test not found" });
    }
    res.json({ fullTest });
  } catch (err) {
    console.error("Loading full test failed:", err);
    res.status(502).json({ error: "Could not load this full test. Please try again." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const fullTest = await findFullTestById(req.params.id);
    if (!fullTest || fullTest.userId !== req.user.id) {
      return res.status(404).json({ error: "Full test not found" });
    }
    await deleteFullTest(fullTest.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting full test failed:", err);
    res.status(502).json({ error: "Could not delete this full test. Please try again." });
  }
});

export { router as fullTestRouter };
