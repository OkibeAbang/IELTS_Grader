import "dotenv/config";
import express from "express";
import cors from "cors";
import { gradeEssay } from "./grade.js";

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`IELTS grader API listening on http://localhost:${PORT}`);
});
