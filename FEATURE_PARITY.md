# Feature parity — ieltspractice.io

Tracking doc for closing the gap with ieltspractice.io (a full-suite IELTS prep competitor) while keeping our own UI/UX. Check items off as they ship; add a one-line note with the commit/PR when you do, so this stays a real changelog and not just a wishlist.

**Source:** two dashboard screenshots (logged-in, free plan), 2026-08-17. Confirmed items come directly from those screenshots. Inferred items are marked — they're standard IELTS test-format knowledge or reasonable guesses about pages we haven't seen yet (Practice tab, Learn tab, Stats tab, a live test screen, a results screen). Revise as more screenshots come in.

## Legend
- ✅ We already have this (maybe in a different shape)
- 🟡 Partial — some of this exists but not the full thing
- ❌ Missing entirely
- 🔎 Inferred (not yet confirmed by a screenshot)

## 1. Information architecture / navigation

- [x] ✅ Sidebar now matches the 4-section shape — shipped 2026-08-17: `Practice` (hub page linking to Essay Grading/Reading/Listening/Speaking), `Learn` (hub page, Writing enabled + Reading/Listening/Speaking "Coming soon"), `Dashboard` (our name for their `Stats`). See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md`
- [x] ✅ Confirmed 2026-08-18 — every real section (Practice, Learn, Dashboard, and every practice/history page) is `ProtectedRoute`-gated and redirects to `/login` when signed out; the only public routes are the marketing page (`/`) and the auth pages themselves. Nothing to change here, this was already the case
- [ ] ❌ Persistent account widget (avatar initials + name) pinned at the bottom of the sidebar
- [ ] ❌ Sitewide promo banner slot ("Fresh practice material every week") — a dismissible/rotating announcement bar

## 2. Dashboard home

- [ ] ❌ Hero spotlight card: headline feature callout ("Instant AI band-score feedback"), rubric summary blurb, "Bands 0–9" badge, single primary CTA
- [ ] ❌ 4 quick-action tiles below the hero: Start Practice, Learn, View Statistics, Upgrade Plan
- [ ] 🟡 "Practice Sections" grid — icon + description + duration per section. We have this content per-page but not as a unified dashboard grid across all sections
- [ ] ❌ Welcome subtitle copy ("Continue your IELTS preparation journey") — cosmetic, low priority
- [x] ✅ Pre-login product preview shipped 2026-08-18 — `client/src/pages/OverviewPage.js` now has a tabbed "See it in action" section between the hero and the tools grid, showing 4 static in-brand mockups (Writing results, Reading question, Listening player, Speaking corrections) built from the app's own real CSS classes, not screenshots. The whole mockup card and a "Start practicing free" button both link straight to `/signup`. Also fixed the marketing nav/tools grid, which had gone stale (only listed Essay Grading + Speaking, missing Reading/Listening entirely)

## 3. Reading module

- [x] ✅ Reading test-taking flow shipped 2026-08-17 — `server/src/routes/reading.js`, `client/src/pages/ReadingPracticePage.js`. 1 seed passage ("Bringing Back the Beaver," 12 questions), objective scoring (`scoreReading.js`), raw-score→band lookup (`readingBandTable.js`), full history/detail/delete + dashboard integration (stat tiles, trend chart, table). See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md` for the full plan.
- [x] ✅ Question types: Multiple Choice, True/False/Not Given, Short Answer implemented. Matching Headings/Features **deliberately deferred** (needs drag-drop/dropdown UI, bigger lift) — still ❌
- [ ] ❌ 3-passage / 40-question full test — v1 ships with 1 passage / 12 questions by design (validate the pattern first, expand content later without code changes). Architecture supports more passages; only content-authoring is needed to grow the bank
- [ ] 🔎 ❌ Academic vs General Training passage tracks — not addressed
- [x] ✅ Rule-based scoring + band conversion — objective correct-count → /40-scaled band-table lookup, no AI call (`readingBandTable.js`, `scoreReading.js`)

## 4. Listening module

- [x] ✅ Listening test-taking flow shipped 2026-08-17 — `server/src/routes/listening.js`, `client/src/pages/ListeningPracticePage.js`. 1 seed section ("Joining the Riverside Pottery Studio," a 15-turn dialogue, 12 questions), same objective scoring/band-lookup architecture as Reading (`scoreListening.js`, shared `bandConversionTable.js`). See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md` for the full plan.
- [x] ✅ Audio playback — via the browser's built-in Web Speech API (`client/src/utils/speech.js`), **not** a hosted/generated audio file. Zero infra cost, ships fast; trade-off noted in the plan: voice quality varies by browser, and the script text is technically visible in the network response (though not rendered in the UI) since the browser needs it to synthesize speech. Real accents/varied-voice audio would need server-generated TTS or real recordings — a future upgrade, not required for v1
- [x] ✅ Question types: Multiple Choice + Short Answer (Form/Note Completion) — the two real IELTS Listening types (confirmed: True/False/Not Given is Reading-only, not used here). Matching deferred, same as Reading
- [x] ✅ Objective scoring + band conversion — reuses Reading's `bandConversionTable.js` directly (same 40-question, 9-band scale)
- [ ] ❌ 4-section / 40-question full test with varied accents — v1 ships with 1 section / 12 questions, same "prove the pattern first" scoping as Reading

## 5. Speaking module

- [x] ✅ 3-part structure (Introduction, Long Turn, Discussion) — already implemented (`SpeakingPracticePage`)
- [x] ✅ AI examiner / conversational partner — already implemented (`useLiveMic`, live conversation flow)
- [x] ✅ AI band scoring across the 4 criteria — already implemented
- [ ] Confirm our timing matches their 11–14 min framing (cosmetic/copy check, not a build item)

## 6. Writing module

- [x] ✅ Task 1 (chart/letter) + Task 2 essay — already implemented (`EssayGraderPage`)
- [x] ✅ AI scoring across the 4 criteria — already implemented
- [x] ✅ 60 min framing / timer — already implemented

## 7. "Learn" mode (drill practice) — relocated 2026-08-21, see section 11

**Update 2026-08-21:** the `/learn` section itself has been repurposed into the Pro-only study plan (section 11 below). The 4 drill pages described in this section still exist and work exactly as shipped — only their URLs moved, from `/learn/writing` etc. to `/practice/drills/writing` etc., now reachable from a "Drill mode" row on the Practice hub instead of their own hub page. Still fully free, no functional changes.

- [x] ✅ Writing drill shipped 2026-08-17 — `client/src/pages/LearnWritingPage.js`. This wasn't new functionality: `EssayGraderPage.js` already had it half-hidden as a "Practice by Section" tab (`PracticeForm.js` + `POST /api/grade-section`); it was **moved** to its own page under the new Learn hub rather than duplicated, and `EssayGraderPage.js` simplified back to full-essay-only
- [x] ✅ Reading/Listening drills shipped 2026-08-17 — `LearnReadingPage.js`/`LearnListeningPage.js`. Pick a question type (Reading: MC/T-F-NG/Short Answer; Listening: MC/Short Answer), answer just those questions from the existing passage/section, scored by the same objective scorer. Reuses `PassageViewer`/`ReadingResultsView`/`ListeningResultsView` almost unchanged. New `mode`/`question_type` columns on `reading_attempts`/`listening_attempts` (same pattern `essay_attempts` already used) — drills are saved and show up in the Dashboard table (new Mode column) but are excluded from the average/best/trend-chart stats via a new opt-in `statsAttempts` prop on `AttemptSection`, so a quick drill doesn't skew the "real test performance" trend
- [x] ✅ Speaking drill shipped 2026-08-17 — `LearnSpeakingPage.js`. Pick a topic, pick one part (Part 1/2/3), record just that part, get graded on the same 4 criteria via a new `gradeSpeakingSection.js` (new AI prompt, single-part framing, provisional band). Needed real new backend: `speaking_drill_attempts` table (separate from `speaking_attempts` — its 3 NOT NULL audio-path columns don't fit a one-part drill), new `/api/speaking/drill-attempts` routes, new audio storage functions. New `SpeakingSectionResultsView` reuses `CriterionCard` (confirmed already generic across Writing/Speaking) plus the corrections-list pattern from `SpeakingResultsView`. Own "Speaking Drills" Dashboard block (5th section) rather than merging into "Speaking Practice", for the same table-shape reason. Verified with a real end-to-end recording through the actual browser UI (fake-media-stream Chromium), including the AI correctly flagging a silent test clip with a low band and a "no speech detected" transcript rather than hallucinating content
- [ ] 🔎 ❌ Reading/Listening/Speaking drills all currently only work against the single existing passage/section/topic each skill has — same "prove the pattern first" scoping as the modules themselves; more content is a content-authoring task, not a code change

## 8. Stats / progress tracking

- [x] 🟡 Band trend chart — covers Speaking, Reading, and Listening (`BandTrendChart`, now at `client/src/components/BandTrendChart.js`), Essay/Writing has stats but no chart yet (deliberately preserved as-is during the refactor below, not a gap introduced by it)
- [x] ✅ Dashboard blocks unified 2026-08-17 — the 4 copy-pasted Speaking/Essay/Reading/Listening blocks in `AttemptHistoryPage.js` (380 lines) now all render through a single `client/src/components/AttemptSection.js` (page shrank to ~140 lines). Verified zero visual regression against real seeded test-account data. See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md`
- [ ] 🔎 ❌ "Section breakdowns" — per-criterion trends, not just overall band over time — still not addressed; would be a next enhancement now that `AttemptSection` gives a single place to add it

## 9. Monetization / plan gating

- [x] ✅ Free vs Pro plan concept — shipped 2026-08-20: `users.subscription_tier`/`subscription_status`/`subscription_current_period_end` + Stripe customer/subscription id columns, synced via webhook (`server/src/routes/billing.js`). Stripe not yet connected to a real account (test-mode keys pending), but the whole path degrades gracefully (`503`) until then. See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md`
- [x] ✅ "Free"/"Pro" indicator in the sidebar (next to the account email) + "Billing" nav link — shipped 2026-08-20
- [x] ✅ Actual paywall logic — shipped 2026-08-20: overall band score free for everyone; AI-generated detailed feedback (per-criterion bands, strengths/weaknesses, corrections, improvement suggestions) on Essay and Speaking (full + drill) requires Pro, enforced server-side (`server/src/billing/feedbackAccess.js`) so it can't be bypassed by inspecting network responses. Reading/Listening stay fully free (objectively scored, no AI feedback to gate). Filtering happens at read time off live `subscription_tier`, so upgrading retroactively unlocks all past attempts with no re-grading.
- [x] ✅ Pricing page (`/pricing`, Free vs Pro comparison, monthly/annual toggle) + Billing/subscription management page (`/billing`, upgrade + Stripe customer portal) — shipped 2026-08-20

## 10. Full Test (placement test)

- [x] ✅ Timed, single-sitting Full Test spanning all 4 skills (Listening 30 min, Reading 60 min, Writing 60 min across Task 1 + Task 2, Speaking ~15 min) — shipped 2026-08-21, `/full-test`. Free to take; content auto-assigned per attempt (no picker). Orchestrates the existing per-skill grading pipelines via a new `full_test_attempts` linkage table (`server/src/models/fullTestAttempts.js`) rather than duplicating any grading logic. Writing band is the official Task1×1 + Task2×2 weighted average; Overall band is the average of all 4 skills — both rounded via the official IELTS rounding rule (`server/src/ieltsBandRounding.js`). Results follow the existing paywall automatically (Reading/Listening always full detail; Writing/Speaking detail Pro-only) since the combined results view reuses the already-gated per-skill endpoints and result components with zero new gating code. Dashboard gets a 6th history block; history detail at `/full-test/history/:id`. See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md`.

## 11. Study plan (Learn, Pro-only)

- [x] ✅ Onboarding questionnaire → personalized weekly study plan, replacing Learn's previous drill-mode content — shipped 2026-08-21, `/learn`. Pro-only (free accounts see an upsell card, matching the `LockedFeedback` pattern; the API routes are gated the same way server-side, not just the UI). Questionnaire: test date, target band, self-estimated current band per skill, weekly study time, weakest skill (`client/src/components/OnboardingQuestionnaire.js`). Plan generation is fully rule-based/deterministic — no AI call (`server/src/studyPlan.js`): weakest skill gets the largest share of a weekly session budget derived from study time, with checkpoints pointing to `/full-test`. Static + manual "Retake questionnaire" (upsert via `UNIQUE(user_id)` on `study_plans`, not versioned). The drill-mode pages this replaced didn't disappear — they moved to `/practice/drills/*`, listed in a new "Drill mode" row on the Practice hub (see section 7). See `/Users/mac/.claude/plans/lexical-snuggling-sprout.md`.

## Open questions to resolve with more screenshots

- What exactly does the **Learn** drill-mode UI look like step by step?
- What does the **Stats** page show beyond a single trend line — per-criterion breakdowns? Comparison across sections?
- What's on the **Practice** tab as a standalone page (vs the dashboard's "Practice Sections" grid)?
- What does an actual **Reading/Listening test-taking screen** look like (layout, timer placement, question navigator)?
- What does the **results/feedback screen** look like for Reading/Listening (band conversion table, answer review)?
- What's actually behind the **Premium** paywall vs free?
