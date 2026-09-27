# Business Features — IELTS school partnership

Tracking doc for turning this app into something we can pitch to IELTS schools, starting with the school(s) introduced through family. Check items off as they're resolved, with a short note on how — this is meant to be walked into that meeting with, not just a wishlist.

## 1. Unit economics

- [x] ✅ **Cost per attempt calculated (2026-09-26).** Correction to the original advice: the primary grader is **Gemini** (`gemini-flash-latest`, currently resolving to Gemini 3.8 Flash), not Claude — Claude (`claude-opus-5`) and Groq only fire as rare fallbacks when Gemini's quota/capacity is hit. At current Gemini paid-tier pricing ($0.75/M input, $3.75/M output tokens):
  - Essay, full grade: **~$0.007**
  - Essay, section drill: **~$0.005**
  - Speaking, full grade (3 audio parts): **~$0.015**
  - Speaking, section drill (1 audio part): **~$0.006**
  - A realistic active student (~2 essays + 2 speaking attempts/week) costs roughly **$0.14/month** in raw AI compute. Even a very heavy daily user stays under $0.50/month. **AI cost is not the constraint on pricing** — a $1–2/student/month school price would carry >85% gross margin on compute alone; price should be set by value delivered, not cost recovery.
  - **Real blocker, not cost:** production is still on Gemini's **free tier**, capped at 20 requests/day for this model (confirmed earlier via live 429s during testing). A school cohort would blow through that almost immediately. **Must enable Gemini paid-tier billing before any real pilot** — this is the actual prerequisite, not a pricing question.
  - **Known gap:** Speaking grading has no fallback at all (Claude/Groq don't accept audio) — a Gemini outage/quota hit fails speaking grading outright for the user, with no safety net today. Worth flagging as an accepted pilot-scale risk, or building a minimal retry/credit path before scaling past a pilot.

## 2. Pilot program design

- [x] ✅ **Pilot design locked in (2026-09-27), updated now that the teacher dashboard exists.**
  - **Cohort & length**: one class from the partner school, ~15–25 students, 6 weeks.
  - **Structure**: teacher creates the class in their dashboard on day 1 and hands out the join code; every student takes a **Full Test** that same day as a baseline. Through weeks 2–5, a light required cadence (2 writing + 2 speaking attempts/week, student's choice of full or drill) — Reading/Listening stay open but ungated. Week 6: a second Full Test — the band delta vs. baseline is the headline result.
  - **Cost/access**: free for the pilot (paywall's already off). **Prerequisite from item #1**: Gemini must be on paid-tier billing before this starts — free tier's 20/day cap would choke a class this size fast.
  - **Evidence to collect**:
    1. Usage lift — attempt counts per student, visible live in the teacher's roster.
    2. Band improvement — baseline vs. final Full Test, per student and cohort average.
    3. AI-vs-teacher agreement — the teacher deliberately reviews a sample (~15–20 attempts) through the override feature; whether they leave the AI band as-is or override it, and by how much, IS the trust metric ("agreed within half a band on X% of reviewed attempts").
    4. A 5-minute end-of-pilot survey for students and the teacher.
  - **Reporting** — superseded by the teacher dashboard: no manual weekly export needed anymore, the teacher has live self-serve visibility into their class the whole time.
  - **Privacy**: a one-paragraph data notice (what's collected, that it's not shared with the school beyond aggregate pilot stats) plus a guardian consent line, since students are likely minors — see item #4.

## 3. Teacher/school-facing features

- [x] ✅ **Teacher dashboard built and verified end-to-end (2026-09-27).** Teachers are a separate account type from students — admin creates each one from the admin dashboard's new "Teachers" tab (enter a number, get `teacher.NNN` with an admin-chosen password; e.g. number `2` → `teacher.002`). A teacher logs in at `/teacher/login`, creates classes (each gets a short join code to hand out), and students join once via a "Class" card on their own Profile page. Per class, the teacher gets a roster with attempt counts, drills into any student's full progress across all 4 skills, and can open any essay or speaking attempt to see full AI feedback plus set an **override band and/or comment** — which shows up immediately on that student's own results page as a distinct "Teacher feedback" block next to the AI band. Reading/Listening are shown for progress context only (no override — they're objectively scored, no AI judgment to second-guess).
  - Verified: full flow end-to-end (teacher creates class → student joins by code → student submits essay → teacher reviews and overrides → student sees it), ownership checks (a teacher can't reach a student/attempt outside their own classes — 404s correctly), and login rate-limiting (blocks after 5 bad attempts in 15 min — tighter than admin's, since `teacher.001`, `teacher.002`... are guessable usernames).
  - Deleting a teacher account removes their classes/rosters but keeps any feedback they already gave students — that shouldn't vanish retroactively.
  - Not built (deliberately out of scope for now, per "don't over-build before the pilot"): bulk CSV roster import, review history/versioning (a new save just overwrites the last one), and any reporting/export beyond what's on-screen.

## 4. Student data & privacy

- [ ] Decide data ownership (you / school / student), visibility rules (what teachers and schools can see), protection standards, and the extra care needed given some students will likely be minors.
