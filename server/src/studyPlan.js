const SKILLS = ["listening", "reading", "writing", "speaking"];

const SKILL_LABELS = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

const SKILL_PATHS = {
  listening: { drill: "/practice/drills/listening", full: "/listening" },
  reading: { drill: "/practice/drills/reading", full: "/reading" },
  writing: { drill: "/practice/drills/writing", full: "/essay-grader" },
  speaking: { drill: "/practice/drills/speaking", full: "/speaking" },
};

function computeWeeksUntilTest(testDate) {
  if (!testDate) return null;
  const diffMs = new Date(testDate).getTime() - Date.now();
  if (Number.isNaN(diffMs)) return null;
  return Math.max(0, Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

function urgencyBucket(weeksUntilTest) {
  if (weeksUntilTest === null) return "steady_build";
  if (weeksUntilTest < 2) return "final_push";
  if (weeksUntilTest <= 6) return "focused_sprint";
  return "steady_build";
}

// Roughly one session per 45-60 minutes of weekly study time, clamped to a
// realistic weekly range regardless of how much/little time was reported.
function computeSessionsPerWeek(weeklyHours) {
  if (!weeklyHours || weeklyHours <= 0) return 3;
  const raw = Math.round((weeklyHours * 60) / 50);
  return Math.min(10, Math.max(2, raw));
}

function effectiveWeakestSkill(weakestSkill, currentBands) {
  if (weakestSkill && SKILLS.includes(weakestSkill)) return weakestSkill;
  const known = SKILLS.filter((s) => typeof currentBands?.[s] === "number");
  if (known.length === 0) return null;
  return known.reduce((min, s) => (currentBands[s] < currentBands[min] ? s : min), known[0]);
}

// Weakest skill (if any) gets ~40% of the week's sessions; the rest split
// evenly across the remaining three. No weakest skill -> an even 4-way split.
function allocateSessions(sessionsPerWeek, weakest) {
  if (!weakest) {
    const each = Math.max(1, Math.round(sessionsPerWeek / 4));
    return Object.fromEntries(SKILLS.map((s) => [s, each]));
  }

  const weakestCount = Math.max(2, Math.round(sessionsPerWeek * 0.4));
  const remaining = Math.max(0, sessionsPerWeek - weakestCount);
  const others = SKILLS.filter((s) => s !== weakest);
  const base = Math.floor(remaining / others.length);
  let extra = remaining - base * others.length;

  const allocation = { [weakest]: weakestCount };
  for (const s of others) {
    allocation[s] = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
  }
  return allocation;
}

function buildFocus(allocation, weakest) {
  return SKILLS.map((skill) => {
    const isWeakest = skill === weakest;
    const rationale = isWeakest
      ? "Your weakest skill — the biggest opportunity for improvement, so it gets the most time."
      : weakest
      ? `A lighter maintenance schedule while you focus most of your time on ${SKILL_LABELS[weakest]}.`
      : "An even split across all four skills.";
    return {
      skill,
      label: SKILL_LABELS[skill],
      sessionsPerWeek: allocation[skill],
      rationale,
      links: [
        { label: `${SKILL_LABELS[skill]} Drill`, to: SKILL_PATHS[skill].drill },
        { label: `Full ${SKILL_LABELS[skill]} Practice`, to: SKILL_PATHS[skill].full },
      ],
    };
  });
}

function buildCheckpoints(weeksUntilTest) {
  const checkpoints = [{ label: "Take a Full Test now to establish your baseline", to: "/full-test" }];
  if (weeksUntilTest === null || weeksUntilTest >= 4) {
    checkpoints.push({ label: "Retake the Full Test in a few weeks to track your progress", to: "/full-test" });
  }
  return checkpoints;
}

function buildSummary({ weeksUntilTest, urgency, targetBand, currentBands, weakest }) {
  const knownBands = SKILLS.filter((s) => typeof currentBands?.[s] === "number").map((s) => currentBands[s]);
  const avgCurrent = knownBands.length ? knownBands.reduce((a, b) => a + b, 0) / knownBands.length : null;
  const gap = avgCurrent !== null && targetBand ? Math.round((targetBand - avgCurrent) * 2) / 2 : null;

  let timeline;
  if (weeksUntilTest === null) {
    timeline = "You haven't set a test date yet, so this is a steady, balanced plan you can follow at your own pace.";
  } else if (urgency === "final_push") {
    timeline = "Your test is less than 2 weeks away — this is a final push, focused on your weakest area.";
  } else if (urgency === "focused_sprint") {
    timeline = `You have about ${weeksUntilTest} weeks until your test — a focused sprint.`;
  } else {
    timeline = `You have about ${weeksUntilTest} weeks until your test — plenty of time for steady, consistent practice.`;
  }

  let gapText = "";
  if (gap !== null) {
    gapText =
      gap > 0
        ? ` You're aiming to move from roughly Band ${avgCurrent.toFixed(1)} to Band ${targetBand} — a ${gap.toFixed(1)}-band improvement.`
        : " You're already at or above your target band on average — focus on consistency and your weakest skill to lock it in.";
  }

  const focusText = weakest ? ` Most of your time should go to ${SKILL_LABELS[weakest]}.` : "";

  return `${timeline}${gapText}${focusText}`;
}

function generateStudyPlan({ testDate, targetBand, currentBands = {}, weeklyHours, weakestSkill }) {
  const weeksUntilTest = computeWeeksUntilTest(testDate);
  const urgency = urgencyBucket(weeksUntilTest);
  const sessionsPerWeek = computeSessionsPerWeek(weeklyHours);
  const weakest = effectiveWeakestSkill(weakestSkill, currentBands);
  const allocation = allocateSessions(sessionsPerWeek, weakest);

  return {
    urgency,
    weeksUntilTest,
    sessionsPerWeek,
    weakestSkill: weakest,
    focus: buildFocus(allocation, weakest),
    checkpoints: buildCheckpoints(weeksUntilTest),
    summary: buildSummary({ weeksUntilTest, urgency, targetBand, currentBands, weakest }),
  };
}

export { generateStudyPlan, SKILLS };
