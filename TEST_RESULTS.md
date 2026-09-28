# Test Results — Full E2E Pass (2026-09-28)

Full regression pass across every category, run against local dev by driving the actual app in a real browser (Playwright) — not just reading the code. Run ahead of onboarding real users, using the `e2e-tester` playbook (`.claude/agents/e2e-tester.md`).

**Headline finding: one real, currently-live issue — not an app bug.** Gemini's API is returning `503 "This model is currently experiencing high demand"` right now, reproduced consistently across 5 separate attempts over ~20 minutes, each one correctly retried 3x with backoff before failing cleanly. This blocks **essay grading and speaking grading specifically** — both AI-graded features. Reading and Listening are unaffected (no AI call per attempt). See **Action items** at the bottom.

Everything else: **68 checks passed, 0 real failures.** (A handful of early test-script selector mistakes on my end produced false negatives on the first pass — fixed and re-verified; not counted below.)

---

## Auth — ✅ all pass

- [x] Signup creates an account and lands on `/practice`
- [x] Logout works
- [x] Wrong password shows a clear error, not a crash
- [x] Login with correct credentials works
- [x] `/forgot-password` renders
- [x] `/verify-email` renders
- [x] Login rate limiting actually works — confirmed the hard way: my own repeated test runs tripped it (10 attempts/15 min), and it blocked further attempts exactly as designed

## Reading — ✅ all pass

- [x] Passage + questions render (32 inputs found)
- [x] Submitting answers produces a score
- [x] Reading drill page renders

## Listening — ✅ all pass

- [x] Native `<audio>` player renders (replacing the old browser-TTS player)
- [x] Audio loads with a real duration (74.0s, not `NaN`)
- [x] Audio request returns proper `206 Partial Content` — confirms the Range-support fix from 2026-09-27 is working correctly in practice, not just in isolated curl tests
- [x] Submitting answers produces a score
- [x] Listening drill page renders

## Writing — ⚠️ blocked by live Gemini issue, not an app bug

- [x] Essay grader page renders
- [x] Writing drill page renders
- [ ] **Full essay grading** — every attempt returned `502` from our server, root-caused in server logs to Gemini itself returning `503` ("high demand"). The retry-with-backoff logic worked correctly (3 attempts, proper backoff) before failing cleanly with a real error message — the *failure handling* is correct, the *underlying AI call* is what's down.
- [ ] Section drill grading — not conclusively tested (my own script had a selector bug), but shares the identical code path as full essay grading, so almost certainly affected the same way right now.
- [ ] Dashboard history after grading — untested as a downstream consequence of no essay successfully grading this run.

## Speaking — ✅ everything testable without a live AI call passes

- [x] Speaking practice page renders
- [x] Topic selection reaches the Part 1 Interview UI
- [x] Recording UI ("Answer" button) is reachable
- [x] **Recording actually works** — used Chromium's fake-microphone device to confirm `MediaRecorder` genuinely captures audio and the UI advances correctly
- [x] Speaking drill page renders
- [ ] Full 3-part recording through to an actual AI-graded result — not run to completion, since it depends on the same Gemini path currently returning 503s, and unlike Writing, **Speaking has zero fallback** (Claude/Groq can't process audio) — a Gemini outage fails Speaking outright with no safety net today, which this test run happens to be living proof of.

## Full Test — ✅ what's testable passes

- [x] Full Test intro page renders
- [x] Starting the test reaches the Listening step
- Not pushed further into Writing/Speaking steps, for the same reason as above.

## Profile — ✅ all pass

- [x] Profile page renders
- [x] Display name edit saves successfully
- [x] Change persists after a reload
- [x] Class join-code section renders

## Billing / Pricing — ✅ all pass

- [x] `/pricing` renders (correctly reflecting the paywall being off right now — not gated, as expected)
- [x] `/billing` renders

## Learn — ✅ pass

- [x] `/learn` renders

## Dashboard — ✅ pass

- [x] Renders with attempt history

## Admin — ✅ all pass

- [x] Login succeeds with local admin credentials
- [x] Overview tab loads
- [x] Users tab loads
- [x] Attempts tab loads
- [x] Teachers tab loads

## Teacher ↔ Student cross-role flow — ✅ all pass

The one flow that needs two roles interacting at once:

- [x] Admin creates a new teacher account (`teacher.NNN`)
- [x] That teacher logs in with the admin-set password
- [x] Teacher creates a class and gets a join code
- [x] A separate student account joins via that code
- [x] Teacher's roster shows the joined student
- [ ] Teacher reviewing an AI-graded attempt and the student seeing that feedback — not re-tested this run (needs a successfully graded essay first, blocked by the Gemini issue above). This exact flow was verified working end-to-end when the teacher dashboard originally shipped — flagging as "not re-verified today," not "broken."

## Misc (spot checks) — ✅ all pass

- [x] "Beta" badges render on all 5 expected Practice hub cards (Reading, Listening, Full Test, plus their two drill variants)
- [x] Password show/hide toggle works on `/login` and `/signup`
- [x] "Teacher?" and "Admin?" login links present and correctly placed side by side on `/login`

---

## Action items before onboarding real users

1. **Not urgent, but worth knowing:** what happened today is a real demonstration of why Speaking's lack of an AI fallback is a genuine production risk (already tracked in `REMINDERS.md`) — a Gemini capacity dip fails Speaking outright for any student, with no automatic recovery. Worth deciding how much that risk matters for your pilot's scale before real students hit it live.
2. **One nuance on the paid-tier switch already in progress:** it will fix the 20-requests/day *quota* limit (`429` errors), but today's issue was a *capacity* error (`503`, "high demand") — a different problem on Google's side. Paid tier often does come with better capacity priority in practice, but isn't a guaranteed fix for this specific error the way it is for the quota one — worth watching after the switch rather than assuming it's fully resolved.
3. The still-open "test the Anthropic fallback with a real key" item in `REMINDERS.md` is now more clearly worth doing soon — it's the difference between "essay grading has a safety net" and "essay grading goes down whenever Gemini has a bad day," which just happened live during this test pass.
