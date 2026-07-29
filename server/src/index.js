import "dotenv/config";
import express from "express";
import cors from "cors";
import { gradeEssay } from "./grade.js";
import { gradeSection } from "./gradeSection.js";
import { getPromptBank } from "./promptBank.js";
import { generatePrompt } from "./generatePrompt.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/grade", async (req, res) => {
  const { essay, prompt, taskType } = req.body ?? {};

  if (typeof essay !== "string" || !essay.trim()) {
    return res.status(400).json({ error: "essay is required" });
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  try {
    const result = await gradeEssay({ essay, prompt, taskType });
    res.json(result);
  } catch (err) {
    console.error("Grading failed:", err);
    res.status(502).json({ error: "Grading failed. Please try again." });
  }
});

app.post("/api/grade-section", async (req, res) => {
  const { text, prompt, taskType, section } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }
  if (!["introduction", "main_body", "conclusion"].includes(section)) {
    return res.status(400).json({ error: "section must be 'introduction', 'main_body', or 'conclusion'" });
  }

  try {
    const result = await gradeSection({ text, prompt, taskType, section });
    res.json(result);
  } catch (err) {
    console.error("Section grading failed:", err);
    res.status(502).json({ error: "Grading failed. Please try again." });
  }
});

app.get("/api/prompts", (req, res) => {
  const { taskType } = req.query;

  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  res.json({ prompts: getPromptBank(taskType) });
});

app.post("/api/prompts/generate", async (req, res) => {
  const { taskType, topic } = req.body ?? {};

  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  try {
    const result = await generatePrompt({ taskType, topic });
    res.json(result);
  } catch (err) {
    console.error("Prompt generation failed:", err);
    res.status(502).json({ error: "Question generation failed. Please try again." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`IELTS grader API listening on http://localhost:${PORT}`);
});
