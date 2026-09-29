/**
 * IELTS Writing band descriptors (bands 4-9) — an original paraphrase.
 *
 * Rewritten 2026-09-29 from an earlier version that was too close to the
 * official British Council / IDP / Cambridge wording to safely rely on
 * commercially (the official band descriptors are copyrighted text; the
 * underlying 4-criteria/band-4-9 assessment *system* isn't, but the specific
 * sentences describing each band are). This version aims to capture the same
 * substantive judgment at each band level in genuinely different wording —
 * still worth a lawyer's sign-off before relying on it commercially, but a
 * much safer starting point than a near-verbatim copy.
 *
 * Bands below 4 are omitted since the vast majority of learners fall in the
 * 4-9 range and the README calls out 5-9 as the priority band.
 */

const TASK2_CRITERIA = {
  task_response: {
    9: "Engages with every element of the prompt and puts forward a thoroughly developed argument, with ideas that are extended in depth and consistently backed by strong, relevant support.",
    8: "Covers every part of the prompt adequately and builds a well-developed response, where the main ideas are extended and supported with relevant detail.",
    7: "Deals with all parts of the prompt and maintains a clear stance from start to finish; main ideas are developed and supported, although some generalising may creep in or the supporting detail may occasionally drift off-focus.",
    6: "Touches on every part of the task, though coverage can be uneven between parts; takes a relevant stance, but the closing argument may lose clarity or repeat itself; the main ideas are relevant but not all of them are fully worked out.",
    5: "Only partially responds to what's being asked, and the response's format may not suit the task; a position is stated but how it's developed isn't always clear, and a proper conclusion may be missing; the ideas presented are limited in number and depth, and some off-topic detail may appear.",
    4: "Responds to the task in only a minimal or tangential way, often in an unsuitable format; any position taken is hard to pin down; the main ideas are difficult to identify, may repeat, stray off-topic, or lack real support.",
  },
  coherence_cohesion: {
    9: "Cohesive devices are handled so skilfully that they're invisible to the reader; paragraphing is used with real skill throughout.",
    8: "Ideas and information are sequenced in a logical order; every aspect of cohesion is well managed, and paragraphing is used appropriately throughout.",
    7: "Organises information logically with a clear sense of progression from point to point; a range of cohesive devices is used, though not always with perfect judgement on how much is enough; each paragraph centres on one clear idea.",
    6: "Arranges ideas coherently with an overall sense of progression; cohesive devices are used effectively for the most part, though links within or between sentences can feel mechanical or occasionally break down; pronoun referencing isn't always clear.",
    5: "Shows some organisation, but an overall sense of progression can be missing; cohesive devices may be used inaccurately, too sparingly, or too heavily; repetition can creep in from a lack of pronoun substitution or referencing.",
    4: "Ideas and information aren't arranged coherently and there's no real sense of progression; a few basic cohesive devices appear, but they're often used inaccurately or repeated.",
  },
  lexical_resource: {
    9: "Commands a wide vocabulary with natural, sophisticated control; the very rare error is clearly just a slip rather than a gap in knowledge.",
    8: "Draws on a wide, flexible vocabulary to express precise meaning; less common words and phrases are used skilfully, though word choice or collocation may occasionally be slightly off, and spelling or word-formation slips are rare.",
    7: "Has enough vocabulary to write with some flexibility and precision, including some less-common words used with a degree of awareness of style and collocation; occasional slips in word choice, spelling, or word formation appear.",
    6: "Vocabulary is adequate for the task, with some attempts at less common words that aren't always accurate; spelling or word-formation errors occur but don't get in the way of communication.",
    5: "Vocabulary is limited but just about adequate for the task; spelling and word-formation errors are noticeable enough that they can make the writing harder to follow.",
    4: "Relies on basic vocabulary that's often repeated or doesn't suit the task; control over word formation and spelling is limited, and errors can put real strain on the reader.",
  },
  grammar_accuracy: {
    9: "Uses a wide range of grammatical structures with complete flexibility and accuracy; the odd error is clearly just a slip.",
    8: "Draws on a wide range of structures, the majority of sentences entirely error-free, with only very occasional mistakes or awkward choices.",
    7: "Uses a variety of complex structures and produces error-free sentences frequently; grammar and punctuation are generally well controlled, with only a few errors.",
    6: "Mixes simple and complex sentence forms; grammar and punctuation errors occur but rarely get in the way of communication.",
    5: "Structures are limited in range; attempts at complex sentences tend to be less accurate than the simple ones; grammatical errors and punctuation problems are frequent enough to cause the reader some difficulty.",
    4: "Structures are very limited, with subordinate clauses rarely attempted; some sentences are accurate, but errors are the norm rather than the exception, and punctuation is often faulty.",
  },
};

const TASK1_CRITERIA = {
  task_achievement: {
    9: "Fully meets every requirement of the task, with a clear, fully developed overview that highlights the key features and is illustrated with well-chosen detail.",
    8: "Covers every requirement of the task adequately, with a clear overview of the main trends, differences, or stages; key features or bullet points are clearly highlighted, though they could be developed a little further.",
    7: "Covers what the task requires — a clear overview of trends for Academic tasks, or all bullet points for General Training — and highlights the key features, though the supporting detail isn't always fully developed.",
    6: "Addresses what's required, with an overview built from reasonably well-chosen information; key features or bullet points are adequately highlighted, though some of the supporting detail may be irrelevant, inaccurate, or not quite fitting.",
    5: "Generally addresses the task, though the format chosen may not suit it; detail is recounted mechanically without a clear overview, sometimes with little data to back it up; main trends can get confused with minor details, and any summary attempted stays underdeveloped.",
    4: "Attempts the task but may misread or miss some of what's required; data is presented without being extended or fully covered, often in an unsuitable format, and detail is recounted mechanically with no real overview.",
  },
  coherence_cohesion: TASK2_CRITERIA.coherence_cohesion,
  lexical_resource: TASK2_CRITERIA.lexical_resource,
  grammar_accuracy: TASK2_CRITERIA.grammar_accuracy,
};

const CRITERION_LABELS = {
  task_response: "Task Response",
  task_achievement: "Task Achievement",
  coherence_cohesion: "Coherence & Cohesion",
  lexical_resource: "Lexical Resource",
  grammar_accuracy: "Grammatical Range & Accuracy",
};

const MIN_WORD_COUNT = {
  task1: 150,
  task2: 250,
};

/**
 * Renders the full band descriptor table for a task type as plain text,
 * suitable for embedding directly in the LLM system prompt.
 */
function renderRubricText(taskType) {
  const criteria = taskType === "task1" ? TASK1_CRITERIA : TASK2_CRITERIA;
  const bands = [9, 8, 7, 6, 5, 4];

  return Object.entries(criteria)
    .map(([key, byBand]) => {
      const label = CRITERION_LABELS[key];
      const lines = bands.map((b) => `  Band ${b}: ${byBand[b]}`).join("\n");
      return `### ${label}\n${lines}`;
    })
    .join("\n\n");
}

export {
  TASK1_CRITERIA,
  TASK2_CRITERIA,
  CRITERION_LABELS,
  MIN_WORD_COUNT,
  renderRubricText,
};
