# Reminders — unfinished work

Running list of things we started, deferred, or flagged but haven't closed out. Check items off as they're done; add new ones as they come up.

## Immediate / small

- [x] ✅ **Deployed — frontend on Vercel (`https://ielts-grader-kappa.vercel.app`), backend on Render (`ielts-grader-api`).** Database persistence is solved: production runs on a hosted Turso (libSQL) database, not the wipeable local file, so user/attempt data survives redeploys and sleep cycles. **Still open:** saved audio recordings still fall back to local disk on Render, which *is* still wiped — needs Cloudflare R2 (see Phase 3 below) before Speaking recordings are safe in production.
- [ ] **Test the Anthropic fallback once a real `ANTHROPIC_API_KEY` is set.** `server/src/aiClient.js` falls back to Claude (`claude-opus-5`) for essay grading, section grading, and prompt generation when Gemini returns a quota/rate-limit (429) or capacity (5xx) error. The logic is in place and the no-key path is verified (falls through to the original Gemini error, unchanged behavior), but the actual fallback-succeeds path has never run against a real Claude response — needs a live key to force a Gemini failure and confirm Claude produces a valid graded result. Speaking grading has **no** fallback — Claude's API doesn't accept audio input.
- [ ] **Set up Google Sign-In.** `GOOGLE_CLIENT_ID` (server) and `REACT_APP_GOOGLE_CLIENT_ID` (client) are unset — you need to create a Google Cloud OAuth client yourself. Until then the Google Sign-In button stays hidden; password signup/login already works fully without it.
- [ ] **Rotate `GEMINI_API_KEY`.** It sat in plaintext in `server/.env` through the whole build session (visible in this chat). Only you can do this — generate a fresh one in Google AI Studio and swap it in.
- [ ] **Connect a clean custom domain for production.** Live frontend is currently on the auto-generated `https://ielts-grader-kappa.vercel.app` (Vercel project `ielts-grader`, team `okibes-projects`) — works fine, just not a polished long-term URL. Buy/connect a real domain in Vercel's project settings whenever ready; deliberately deferred for now (2026-09-26).
- [ ] **Re-add the subscription plans / paywall.** Everything is temporarily free (2026-09-26) — nothing was deleted, just switched off. Flip `PAYWALL_ENABLED` back to `true` in both `server/src/billing/feedbackAccess.js` and `client/src/config/paywall.js` (they're meant to stay in sync) to restore: Pro-gated detailed feedback, the study-plan Pro gate, and the Pricing/Billing navigation + tier badges across the sidebar, Learn, and Profile.

## Deferred feature ideas

- [ ] **Class scheduling + student schedules + notification opt-in.** In the teacher dashboard (built 2026-09-27, see `BUSINESS_FEATURES.md` #3), let a teacher schedule classes/sessions; every student in that class gets their schedule updated automatically and can view it in a new dedicated "Schedule" section of the app. Students should be able to opt in to notifications about schedule changes, reminders, etc. (needs a real notification channel — email at minimum, since there's no push infrastructure today).
- [ ] **(Long-run, not now) Lightweight D2L-style classroom features.** Teacher-posted homework, class notes, class recordings, etc. — explicitly deferred; the app stays a focused IELTS practice tool for now, not a full classroom platform.

## Feature parity push

Full checklist in [FEATURE_PARITY.md](FEATURE_PARITY.md) — closing the gap with ieltspractice.io. **28 of 39 tracked items shipped** (Reading/Listening/Writing/Speaking modules, unified dashboard stats, sidebar restructure, Stripe monetization + paywall gating, Full Test placement mode, and the Pro-only study plan). What's left is mostly content-authoring (more passages/sections/topics — the architecture already supports it) plus a few cosmetic dashboard items and open research questions — see the file for the current unchecked list.

## From the handoff roadmap

Full detail and reasoning in the published artifact: [Handoff Roadmap — IELTS Practice Tool](https://claude.ai/code/artifact/3d485c9c-e252-44be-b92a-2d57f086d489). Phase 2 (security hardening) is done; Phase 3 is partially underway (see below). Phases 1, 4, 5, 6, 7 not started.

- [ ] **Phase 1 — Legal & IP.** Rename away from "IELTS" for anything public-facing; get the band descriptor text in `rubric.js`/`speakingRubric.js` professionally verified; draft ToS/Privacy Policy/DPA; talk to an actual lawyer before any paid contract.
- [ ] **Phase 3 — Architecture for real scale (partially done).** ✅ Hosted, persistent database is live (Turso/libSQL, not the originally-scoped Postgres, but it solves the same concurrent-writes/data-loss problem in practice) and the app is deployed (Render + Vercel). **Still open:** move audio off local disk to object storage (Cloudflare R2); add an organization/admin model with real role-based access (today's admin auth is a single username/password, not RBAC); a proper staging environment; per-org usage quotas on Gemini calls.
- [ ] **Phase 4 — Grading validation.** Compare AI-graded scores against real certified-examiner scores on a sample set before claiming any accuracy to a buyer.
- [ ] **Phase 5 — Docs & tests.** Write a real README (setup, architecture, env vars); add an automated test suite (currently none); set up CI; do an accessibility pass.
- [ ] **Phase 6 — Business packaging.** Pick a standalone name/brand; decide the commercial model (per-seat, subscription, per-attempt usage fee); build a demo sandbox; draft a licensing/reseller agreement.
- [ ] **Phase 7 — The handoff itself.** Decide exactly what's being sold (code/IP transfer vs hosted license vs white-label); confirm no secrets ever hit git history; plan a support/transition window; get paid on milestone or escrow terms.

## Known, accepted limitations (not necessarily to-dos)

- `npm audit` on the client still shows ~30 vulnerabilities, all in `react-scripts`' dev-only toolchain (nothing shipped to users). Not fixable without migrating off Create React App — a bigger call, not a quick patch.
