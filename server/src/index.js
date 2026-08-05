import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDb } from "./db.js";
import { writingRouter } from "./routes/writing.js";
import { authRouter } from "./routes/auth.js";
import { speakingRouter } from "./routes/speaking.js";
import { adminRouter } from "./routes/admin.js";

// Admin credentials live in a separate, gitignored `secret` file (not .env)
// so they can never end up committed alongside less sensitive config.
dotenv.config({ path: "secret" });

const app = express();
// Render (and most PaaS hosts) sit behind a reverse proxy that sets
// X-Forwarded-For; without this, express-rate-limit can't correctly key by
// client IP (and v8+ throws a validation error rather than silently misbehaving).
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api", writingRouter);
app.use("/api/speaking", speakingRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 4000;

await initDb();
app.listen(PORT, () => {
  console.log(`IELTS grader API listening on http://localhost:${PORT}`);
});
