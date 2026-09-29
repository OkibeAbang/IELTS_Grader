/**
 * IELTS Speaking band descriptors (bands 4-9) — an original paraphrase.
 *
 * Rewritten 2026-09-29 from an earlier version that was too close to the
 * official British Council / IDP / Cambridge wording to safely rely on
 * commercially (the official band descriptors are copyrighted text; the
 * underlying 4-criteria/band-4-9 assessment *system* isn't, but the specific
 * sentences describing each band are). This version aims to capture the same
 * substantive judgment at each band level in genuinely different wording —
 * still worth a lawyer's sign-off before relying on it commercially, but a
 * much safer starting point than a near-verbatim copy. Bands 5 and 7 for
 * Pronunciation are still defined relative to bands 4/6 and 6/8 — that's a
 * structural feature of how the real assessment scale is built at those two
 * bands, not wording borrowed from the official text.
 *
 * Bands below 4 are omitted, matching the same convention as rubric.js for
 * Writing.
 */

const SPEAKING_CRITERIA = {
  fluency_coherence: {
    9: "Speaks fluently, with repetition or self-correction rare enough to barely notice; any hesitation comes from thinking about content, not searching for words or grammar; ties ideas together with fully natural cohesive language and develops topics in complete, appropriate depth.",
    8: "Speaks fluently with only occasional repetition or self-correction; hesitation is mostly about content rather than language, and topics are developed coherently and appropriately.",
    7: "Can speak at length without visible strain or losing the thread; some hesitation over language, repetition, or self-correction may appear; uses a range of connectives and discourse markers with a reasonable degree of flexibility.",
    6: "Willing to talk at length, though coherence can slip occasionally due to repetition, self-correction, or hesitation; a range of connectives and discourse markers is used, but not always to great effect.",
    5: "Generally keeps the conversation flowing, but leans on repetition, self-correction, or slowing down to manage it; certain connectives or discourse markers may be overused; simple ideas come out fluently, but more complex ones disrupt the flow.",
    4: "Struggles to respond without noticeable pauses and may speak slowly, repeating and self-correcting often; basic sentences are linked using the same simple connectives repeatedly, and coherence can break down at points.",
  },
  lexical_resource: {
    9: "Vocabulary is fully flexible and precise across any topic, with idiomatic language used naturally and accurately.",
    8: "Draws readily on a wide, flexible vocabulary to convey precise meaning; less common and idiomatic language is used skilfully, with only occasional inaccuracies, and paraphrasing is handled effectively when needed.",
    7: "Uses vocabulary flexibly enough to discuss a variety of topics, including some less common and idiomatic language with a sense of style and collocation, even if word choice is occasionally slightly off; paraphrases effectively.",
    6: "Has enough vocabulary to discuss topics at length and get the meaning across, even when word choice isn't quite right; paraphrasing generally succeeds.",
    5: "Can talk about both familiar and unfamiliar topics, though vocabulary lacks flexibility; paraphrasing is attempted but doesn't always come off.",
    4: "Manages familiar topics fine but can only convey basic meaning on unfamiliar ones, with frequent word-choice errors; paraphrasing is rarely attempted.",
  },
  grammar_accuracy: {
    9: "Uses a full range of grammatical structures naturally and appropriately, with an accuracy level broken only by the occasional slip typical of native speech.",
    8: "Uses a wide range of structures flexibly, with the majority of sentences error-free and only very occasional slips or basic mistakes.",
    7: "Handles a range of complex structures with some flexibility, producing error-free sentences frequently, although some grammatical mistakes still turn up.",
    6: "Mixes simple and complex structures but with limited flexibility; complex structures often contain mistakes, though these rarely block understanding.",
    5: "Basic sentences are reasonably accurate; complex structures are attempted occasionally but usually contain errors that can make understanding a little harder.",
    4: "Produces basic and occasionally correct simple sentences, but subordinate structures are rare; errors are frequent enough to risk real misunderstanding.",
  },
  pronunciation: {
    9: "Commands a full range of pronunciation features with precision and subtlety, sustained across the whole test; understanding the speaker requires no effort at all.",
    8: "Uses a wide range of pronunciation features consistently, with only occasional lapses; easy to understand throughout, and any accent barely affects clarity.",
    7: "Combines everything expected at band 6 with some, but not all, of what's expected at band 8.",
    6: "Shows a range of pronunciation features, but control is mixed — used effectively at times but not consistently; generally easy to understand, though individual mispronunciations reduce clarity now and then.",
    5: "Combines everything expected at band 4 with some, but not all, of what's expected at band 6.",
    4: "Pronunciation features are limited in range; control is attempted but lapses often, and frequent mispronunciations make the speaker somewhat difficult to follow.",
  },
};

const CRITERION_LABELS = {
  fluency_coherence: "Fluency & Coherence",
  lexical_resource: "Lexical Resource",
  grammar_accuracy: "Grammatical Range & Accuracy",
  pronunciation: "Pronunciation",
};

/**
 * Renders the full band descriptor table as plain text, suitable for
 * embedding directly in the LLM system prompt.
 */
function renderSpeakingRubricText() {
  const bands = [9, 8, 7, 6, 5, 4];

  return Object.entries(SPEAKING_CRITERIA)
    .map(([key, byBand]) => {
      const label = CRITERION_LABELS[key];
      const lines = bands.map((b) => `  Band ${b}: ${byBand[b]}`).join("\n");
      return `### ${label}\n${lines}`;
    })
    .join("\n\n");
}

export { SPEAKING_CRITERIA, CRITERION_LABELS, renderSpeakingRubricText };
