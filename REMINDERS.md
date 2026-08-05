# Reminders — unfinished work

Running list of things we started, deferred, or flagged but haven't closed out. Check items off as they're done; add new ones as they come up.

## Immediate / small

- [ ] **Deploy for free (accepting data loss on redeploy/restart).** Frontend: Vercel, Netlify, or Cloudflare Pages (static build, free, trivial). Backend: a free host like Render's free web service — works as-is with zero migration, but its filesystem is wiped on every redeploy (and possibly on restart/sleep), so the `sql.js` DB file and any saved audio recordings periodically disappear. Fine for a demo/personal deployment; not fine once real user data matters. See Phase 3 below for the real fix (hosted DB + object storage).
- [ ] **Test the Anthropic fallback once a real `ANTHROPIC_API_KEY` is set.** `server/src/aiClient.js` falls back to Claude (`claude-opus-5`) for essay grading, section grading, and prompt generation when Gemini returns a quota/rate-limit (429) or capacity (5xx) error. The logic is in place and the no-key path is verified (falls through to the original Gemini error, unchanged behavior), but the actual fallback-succeeds path has never run against a real Claude response — needs a live key to force a Gemini failure and confirm Claude produces a valid graded result. Speaking grading has **no** fallback — Claude's API doesn't accept audio input.
- [ ] **Set up Google Sign-In.** `GOOGLE_CLIENT_ID` (server) and `REACT_APP_GOOGLE_CLIENT_ID` (client) are unset — you need to create a Google Cloud OAuth client yourself. Until then the Google Sign-In button stays hidden; password signup/login already works fully without it.
- [ ] **Rotate `GEMINI_API_KEY`.** It sat in plaintext in `server/.env` through the whole build session (visible in this chat). Only you can do this — generate a fresh one in Google AI Studio and swap it in.

## From the handoff roadmap

Full detail and reasoning in the published artifact: [Handoff Roadmap — IELTS Practice Tool](https://claude.ai/code/artifact/3d485c9c-e252-44be-b92a-2d57f086d489). Only Phase 2 (security hardening) is done so far.

- [ ] **Phase 1 — Legal & IP.** Rename away from "IELTS" for anything public-facing; get the band descriptor text in `rubric.js`/`speakingRubric.js` professionally verified; draft ToS/Privacy Policy/DPA; talk to an actual lawyer before any paid contract.
- [ ] **Phase 3 — Architecture for real scale.** Migrate off `sql.js` to Postgres (current setup can't handle concurrent writes from real usage); move audio off local disk to object storage; add an organization/admin model with role-based access; real hosting + staging environment; per-org usage quotas on Gemini calls.
- [ ] **Phase 4 — Grading validation.** Compare AI-graded scores against real certified-examiner scores on a sample set before claiming any accuracy to a buyer.
- [ ] **Phase 5 — Docs & tests.** Write a real README (setup, architecture, env vars); add an automated test suite (currently none); set up CI; do an accessibility pass.
- [ ] **Phase 6 — Business packaging.** Pick a standalone name/brand; decide the commercial model (per-seat, subscription, per-attempt usage fee); build a demo sandbox; draft a licensing/reseller agreement.
- [ ] **Phase 7 — The handoff itself.** Decide exactly what's being sold (code/IP transfer vs hosted license vs white-label); confirm no secrets ever hit git history; plan a support/transition window; get paid on milestone or escrow terms.

## Known, accepted limitations (not necessarily to-dos)

- `npm audit` on the client still shows ~30 vulnerabilities, all in `react-scripts`' dev-only toolchain (nothing shipped to users). Not fixable without migrating off Create React App — a bigger call, not a quick patch.
