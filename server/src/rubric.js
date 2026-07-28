/**
 * IELTS Writing band descriptors (public version), bands 4-9.
 * Reconstructed from the publicly published British Council / IDP / Cambridge
 * "IELTS Writing band descriptors (public version)" document. Wording is a close
 * paraphrase of the official descriptors; for a legally/exam-precise copy, verify
 * against the official PDF before using this for anything beyond a study aid.
 *
 * Bands below 4 are omitted since the vast majority of learners fall in the 4-9
 * range and the README calls out 5-9 as the priority band.
 */

const TASK2_CRITERIA = {
  task_response: {
    9: "Fully addresses all parts of the task; presents a fully developed position in answer to the question with relevant, fully extended and well supported ideas.",
    8: "Sufficiently addresses all parts of the task; presents a well-developed response with relevant, extended and supported ideas.",
    7: "Addresses all parts of the task; presents a clear position throughout; presents, extends and supports main ideas, though there may be a tendency to overgeneralise and/or supporting ideas may lack focus.",
    6: "Addresses all parts of the task although some parts may be more fully covered than others; presents a relevant position although conclusions may become unclear or repetitive; presents relevant main ideas but some may be inadequately developed/unclear.",
    5: "Addresses the task only partially; the format may be inappropriate in places; expresses a position but development is not always clear and there may be no conclusions drawn; presents some main ideas but these are limited and not sufficiently developed; there may be irrelevant detail.",
    4: "Responds to the task only in a minimal way or the answer is tangential; the format may be inappropriate; presents a position but this is unclear; presents some main ideas but these are difficult to identify and may be repetitive, irrelevant or not well supported.",
  },
  coherence_cohesion: {
    9: "Uses cohesion in such a way that it attracts no attention whatsoever; skilfully manages paragraphing.",
    8: "Sequences information and ideas logically; manages all aspects of cohesion well; uses paragraphing sufficiently and appropriately.",
    7: "Logically organises information and ideas; there is clear progression throughout; uses a range of cohesive devices appropriately although there may be some under-/over-use; presents a clear central topic within each paragraph.",
    6: "Arranges information and ideas coherently and there is a clear overall progression; uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical; may not always use referencing clearly or appropriately.",
    5: "Presents information with some organisation but there may be a lack of overall progression; makes inadequate, inaccurate or overuse of cohesive devices; may be repetitive because of a lack of referencing and substitution.",
    4: "Presents information and ideas but these are not arranged coherently and there is no clear progression in the response; uses some basic cohesive devices but these may be inaccurate or repetitive.",
  },
  lexical_resource: {
    9: "Uses a wide range of vocabulary with very natural and sophisticated control of lexical features; rare minor errors occur only as 'slips'.",
    8: "Uses a wide range of vocabulary fluently and flexibly to convey precise meanings; skilfully uses uncommon lexical items but there may be occasional inaccuracies in word choice and collocation; produces rare errors in spelling and/or word formation.",
    7: "Uses a sufficient range of vocabulary to allow some flexibility and precision; uses less common lexical items with some awareness of style and collocation; may produce occasional errors in word choice, spelling and/or word formation.",
    6: "Uses an adequate range of vocabulary for the task; attempts to use less common vocabulary but with some inaccuracy; makes some errors in spelling and/or word formation, but they do not impede communication.",
    5: "Uses a limited range of vocabulary, but this is minimally adequate for the task; may make noticeable errors in spelling and/or word formation that may cause some difficulty for the reader.",
    4: "Uses only basic vocabulary which may be used repetitively or which may be inappropriate for the task; has limited control of word formation and/or spelling; errors may cause strain for the reader.",
  },
  grammar_accuracy: {
    9: "Uses a wide range of structures with full flexibility and accuracy; rare minor errors occur only as 'slips'.",
    8: "Uses a wide range of structures; the majority of sentences are error-free; makes only very occasional errors or inappropriacies.",
    7: "Uses a variety of complex structures; produces frequent error-free sentences; has good control of grammar and punctuation but may make a few errors.",
    6: "Uses a mix of simple and complex sentence forms; makes some errors in grammar and punctuation but they rarely reduce communication.",
    5: "Uses only a limited range of structures; attempts complex sentences but these tend to be less accurate than simple sentences; may make frequent grammatical errors and punctuation may be faulty; errors can cause some difficulty for the reader.",
    4: "Uses only a very limited range of structures with only rare use of subordinate clauses; some structures are accurate but errors predominate, and punctuation is often faulty.",
  },
};

const TASK1_CRITERIA = {
  task_achievement: {
    9: "Fully satisfies all the requirements of the task; clearly presents a fully developed data overview/response with highlighted key features/stages/comparisons, appropriately illustrated.",
    8: "Covers all requirements of the task sufficiently; presents a clear overview of main trends, differences or stages; clearly presents and highlights key features/bullet points, though could be more fully extended.",
    7: "Covers the requirements of the task; (Academic) presents a clear overview of main trends, differences or stages; (General) covers all bullet points; clearly presents and highlights key features but details may be less than fully extended.",
    6: "Addresses the requirements of the task; presents an overview with information appropriately selected; presents and adequately highlights key features/bullet points, but details may be irrelevant, inappropriate or inaccurate.",
    5: "Generally addresses the task requirements; the format may be inappropriate in places; recounts detail mechanically with no clear overview; there may be no data/support to illustrate the description; may confuse main trends/features with details; a summary is attempted but is not sufficiently developed.",
    4: "Attempts to address the task requirements but may misunderstand or fail to cover some aspects; presents data but this is not extended or fully covered; may be inappropriate in format; recounts detail mechanically with no overview.",
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
