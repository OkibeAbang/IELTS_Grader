/**
 * Structural guidance for practicing a single essay section in isolation.
 *
 * The official IELTS band descriptors (rubric.js) are written to judge a
 * complete response — e.g. Task Response asks whether a position is
 * "maintained throughout" and ideas are "extended", which is only fully
 * knowable once the whole essay exists. Section practice can't honestly
 * produce a certified band the way full-essay grading does, so this file
 * supplies what a section is structurally supposed to accomplish, which the
 * grading prompt uses to give a provisional, criterion-anchored estimate
 * instead of pretending the partial input is a full essay.
 */

const SECTION_LABELS = {
  introduction: "Introduction",
  main_body: "Main Body Paragraph",
  conclusion: "Conclusion",
};

const GUIDANCE = {
  task1: {
    introduction:
      "Should paraphrase the question/task in the writer's own words (not copy it) and, for Academic Task 1, briefly state what the graph/chart/diagram/process shows overall. It should NOT yet give specific data or numbers.",
    main_body:
      "Should describe and compare specific data, trends, or stages from the visual, grouping related information logically (e.g. by category or time period) and using accurate data-description language (increased, fluctuated, peaked, etc.). It should reference an overview/key features rather than listing every number mechanically.",
    conclusion:
      "Task 1 responses do not require a separate concluding paragraph; if included, it should briefly restate the overall trend or key feature without introducing new data.",
  },
  task2: {
    introduction:
      "Should paraphrase the essay question in the writer's own words (not copy it) and clearly state the writer's position or preview the essay's structure/main ideas. It should NOT yet develop supporting arguments in depth.",
    main_body:
      "Should open with a clear topic sentence stating one main idea, then develop and support that idea with explanation and a relevant, specific example, staying focused on a single point rather than drifting across several unrelated ideas.",
    conclusion:
      "Should restate the writer's position/summarize the main arguments in different words (not copy earlier sentences) and NOT introduce new arguments or evidence at this late stage.",
  },
};

const TYPICAL_WORD_RANGE = {
  introduction: "40-60 words",
  main_body: "80-140 words",
  conclusion: "40-60 words",
};

function getSectionGuidance(taskType, section) {
  return GUIDANCE[taskType][section];
}

export { SECTION_LABELS, TYPICAL_WORD_RANGE, getSectionGuidance };
