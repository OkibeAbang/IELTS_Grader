# IELTS AI Essay Grader — Project Description

## 1. Goal

Build a webapp where a user pastes/writes an IELTS Writing Task 1 or Task 2 essay, and the app:
1. Grades it on the official 4-criterion, Band 1–9 IELTS rubric
2. Gives an overall band score (average of the 4, rounded per IELTS rules)
3. Gives specific, actionable feedback — not vague praise
4. Tracks progress over time across multiple attempts

---

## 2. The Grading Standard (what the AI needs to know)

IELTS Writing is scored on **four criteria, each worth 25%**:

| Criterion | What it measures |
|---|---|
| **Task Response / Task Achievement** | Does the essay fully answer the question? Is the position clear and maintained? Are ideas extended and supported with relevant examples? (Task 1 uses "Task Achievement" — accurate data description/overview; Task 2 uses "Task Response" — argument development) |
| **Coherence & Cohesion** | Logical organization, paragraphing, and use of linking devices (without being mechanical or overused) |
| **Lexical Resource** | Range and precision of vocabulary, natural collocations, spelling accuracy |
| **Grammatical Range & Accuracy** | Variety of sentence structures (simple/complex), error frequency, whether errors impede meaning |

The **overall band** = average of the 4 criteria scores, rounded to nearest whole or half band per IELTS conventions.

**Critical implementation detail:** you cannot just prompt an LLM with "grade this essay 1-9" — you need to embed the actual **band descriptor language** for each score (1-9) for each of the 4 criteria into your grading prompt, so the model reasons against the same anchors a real examiner would. I'd recommend building a reference file with the official public band descriptors (from the British Council/IDP public PDF) for both Task 1 and Task 2, since they differ.

---

## 3. High-Level Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌──────────┐
│  Frontend    │─────▶│  Backend API │─────▶│  AI Grading      │─────▶│ Database │
│ (essay input,│◀─────│ (validation, │◀─────│  Engine (LLM +   │      │ (history,│
│  results UI) │      │  orchestration)│    │  structured       │      │ progress)│
└─────────────┘      └──────────────┘      │  rubric prompting)│      └──────────┘
                                            └─────────────────┘
```

**Frontend:** React (or Next.js) — essay text editor, word counter, timer (to simulate exam conditions), task type selector (Task 1 Academic/General vs Task 2), results dashboard with per-criterion breakdown.

**Backend:** Node.js/Express or Python/FastAPI — handles the request, does pre-checks (word count, off-topic detection), calls the AI grading engine, stores results.

**AI Grading Engine:** This is the core. Use the Gemini API (or another LLM) with a carefully engineered system prompt (details in section 4).

**Database:** PostgreSQL or a simple SQLite/Supabase setup — stores essays, scores, feedback, and timestamps so users can track improvement over time.

---

## 4. AI Grading Engine — Prompt Design (the hard part)

This is where grading *quality* is won or lost. A few principles:

### 4.1 Give the model the actual rubric, not a summary
Embed the full official band descriptor text (bands 5-9 at minimum, since most learners are in that range) for the specific task type (Task 1 vs Task 2) directly in the system prompt. Don't rely on the model's memorized version — it drifts.

### 4.2 Force structured, per-criterion reasoning before scoring
Ask the model to:
1. Restate the task prompt and what a fully-satisfying response would need
2. Analyze the essay against **each criterion separately**, quoting/referencing specific parts of the essay as evidence
3. Only *then* assign a 1–9 score per criterion, citing which band descriptor it matches most closely
4. Compute the overall band

This "evidence-then-score" ordering matters a lot — models that jump straight to a number tend to be less consistent and more prone to matching surface impression ("sounds fluent") rather than the actual criteria (e.g., an essay can sound fluent but score low on Task Response if it never actually answers the question).

### 4.3 Request structured JSON output
Have the model return something like:

```json
{
  "task_type": "Task 2",
  "word_count": 267,
  "criteria": {
    "task_response": {
      "band": 6.5,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "evidence": ["quoted phrase or paraphrased observation"]
    },
    "coherence_cohesion": { "band": 7, "strengths": [...], "weaknesses": [...] },
    "lexical_resource": { "band": 6, "strengths": [...], "weaknesses": [...] },
    "grammar_accuracy": { "band": 6.5, "strengths": [...], "weaknesses": [...] }
  },
  "overall_band": 6.5,
  "top_3_improvements": ["...", "...", "..."],
  "next_band_gap": "What specifically separates this essay from Band 7"
}
```

This makes it trivial to render a clean UI, store history, and chart progress over time.

### 4.4 Few-shot calibration
Feed the model 2–3 example essays *with real, published band scores and examiner comments* (there are publicly available sample essays with official scores from British Council/IDP prep materials) as few-shot examples in the prompt. This anchors the model's scoring scale and reduces the tendency of LLMs to be overly generous.

### 4.5 Guard against common failure modes
- **Grade inflation:** LLMs tend to rate everything 6.5–7.5. Counter this by explicitly instructing the model to use the full 1-9 range and by giving it the low-band descriptors too, not just the aspirational ones.
- **Word-count gaming:** IELTS penalizes essays under the minimum word count (150 for Task 1, 250 for Task 2) — enforce this as a hard rule in your backend, not just an AI judgment call.
- **Off-topic essays:** Do a cheap pre-check (e.g., keyword/topic overlap between the prompt and essay) before sending to the AI, and flag potential rubric-breaking issues like copied prompt text.

---

## 5. Core Features (MVP)

1. **Essay submission** — text input with live word count, task type selector, and the actual essay question/prompt pasted in
2. **Grading** — calls the AI engine, returns the 4-criterion breakdown + overall band
3. **Feedback view** — per-criterion strengths/weaknesses, highlighted example sentences, and a "what would push you to the next band" section
4. **History/progress tracking** — chart of band scores over time, broken down by criterion, so the user can see which of the 4 areas is their bottleneck
5. **Timer mode** — optional 40-minute countdown to simulate real exam conditions (encourages realistic practice, not polished take-home essays)

## 6. Stretch Features (v2+)

- **Sentence-level annotation** — inline highlighting of specific grammar errors, weak transitions, or vocabulary repetition (like Grammarly-style markup)
- **Vocabulary upgrade suggestions** — "you used 'good' 4 times, consider: beneficial, advantageous, favorable..."
- **Model essay comparison** — show a Band 9 sample response to the same prompt
- **Essay prompt bank** — library of real past IELTS Task 1/2 questions to practice against
- **Multi-task support** — separate flows for Task 1 Academic (charts/graphs/processes), Task 1 General (letters), and Task 2 (essays), since the rubric weighting and expectations differ
- **Export/PDF report** — downloadable graded report

---

## 7. Suggested Tech Stack

| Layer | Suggestion |
|---|---|
| Frontend | Next.js + TailwindCSS + Recharts (for progress charts) |
| Backend | Next.js API routes or a separate FastAPI service |
| AI | Gemini API (Pro-class model is good for structured reasoning + long rubric context) |
| Database | Supabase (Postgres + auth built in) or SQLite for local prototyping |
| Auth | Supabase Auth or Clerk (if you want multi-user/progress tracking) |
| Hosting | Vercel (frontend) + Supabase (backend/db) |

---

## 8. Build Roadmap

**Phase 1 — Core grading loop (weekend project scope)**
- Static rubric reference file (band descriptors for Task 1 + Task 2)
- Single-page app: paste essay + prompt → get graded JSON → render results
- No auth, no history — just prove the grading quality is good

**Phase 2 — Calibration**
- Collect 10-15 essays with known real band scores (from official practice books or online with published scores)
- Run them through your prompt, compare AI score vs real score
- Iterate on the prompt until you're consistently within ±0.5 band of real scores

**Phase 3 — Persistence & tracking**
- Add auth, save essays + scores to DB
- Build the progress dashboard (band score trend by criterion)

**Phase 4 — Polish**
- Timer mode, prompt bank, sentence-level annotations, exportable reports

---

## 9. A Note on Accuracy

An AI grader — even a well-prompted one — will not be perfectly calibrated to a real IELTS examiner. Treat the output as a **strong diagnostic signal** (very useful for spotting patterns like "your Task Response consistently lags your Grammar") rather than a certified score. It's worth stating this clearly in the UI so users calibrate their trust appropriately, and it's worth periodically re-validating your prompt against fresh real-scored essays as you refine it.

---

**Next step:** I can help you build Phase 1 right now — the rubric reference file plus a working prototype (either as a quick HTML/JS artifact you can test immediately, or scaffolded Next.js project files). Want to start there?
