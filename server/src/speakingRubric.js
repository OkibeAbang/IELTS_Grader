/**
 * IELTS Speaking band descriptors (public version), bands 4-9.
 * Reconstructed from the publicly published British Council / IDP / Cambridge
 * "IELTS Speaking band descriptors (public version)" document. Wording is a close
 * paraphrase of the official descriptors; for a legally/exam-precise copy, verify
 * against the official PDF before using this for anything beyond a study aid.
 *
 * Bands below 4 are omitted since the vast majority of learners fall in the 4-9
 * range, matching the same convention as rubric.js for Writing.
 */

const SPEAKING_CRITERIA = {
  fluency_coherence: {
    9: "Speaks fluently with only rare repetition or self-correction; any hesitation is content-related rather than to find words or grammar; speaks coherently with fully appropriate cohesive features; develops topics fully and appropriately.",
    8: "Speaks fluently with only occasional repetition or self-correction; hesitation is usually content-related and only rarely to search for language; develops topics coherently and appropriately.",
    7: "Speaks at length without noticeable effort or loss of coherence; may demonstrate language-related hesitation at times, or some repetition and/or self-correction; uses a range of connectives and discourse markers with some flexibility.",
    6: "Is willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation; uses a range of connectives and discourse markers but not always appropriately.",
    5: "Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going; may over-use certain connectives and discourse markers; produces simple speech fluently, but more complex communication causes fluency problems.",
    4: "Cannot respond without noticeable pauses and may speak slowly, with frequent repetition and self-correction; links basic sentences but with repetitious use of simple connectives and some breakdowns in coherence.",
  },
  lexical_resource: {
    9: "Uses vocabulary with full flexibility and precision in all topics; uses idiomatic language naturally and accurately.",
    8: "Uses a wide vocabulary resource readily and flexibly to convey precise meaning; uses less common and idiomatic vocabulary skilfully, with occasional inaccuracies; uses paraphrase effectively as required.",
    7: "Uses vocabulary resource flexibly to discuss a variety of topics; uses some less common and idiomatic vocabulary and shows some awareness of style and collocation, with inappropriate choices at times; uses paraphrase effectively.",
    6: "Has a wide enough vocabulary to discuss topics at length and make meaning clear despite inappropriacies; generally paraphrases successfully.",
    5: "Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility; attempts to use paraphrase but with mixed success.",
    4: "Is able to talk about familiar topics but can only convey basic meaning on unfamiliar topics and makes frequent errors in word choice; rarely attempts paraphrase.",
  },
  grammar_accuracy: {
    9: "Uses a full range of structures naturally and appropriately; produces consistently accurate structures apart from 'slips' characteristic of native-speaker speech.",
    8: "Uses a wide range of structures flexibly; produces a majority of error-free sentences with only very occasional inappropriacies or basic/non-systematic errors.",
    7: "Uses a range of complex structures with some flexibility; frequently produces error-free sentences, though some grammatical mistakes persist.",
    6: "Uses a mix of simple and complex structures, but with limited flexibility; may make frequent mistakes with complex structures, though these rarely cause comprehension problems.",
    5: "Produces basic sentence forms with reasonable accuracy; uses a limited range of more complex structures, but these usually contain errors and may cause some comprehension difficulty.",
    4: "Produces basic sentence forms and some correct simple sentences but subordinate structures are rare; errors are frequent and may lead to misunderstanding.",
  },
  pronunciation: {
    9: "Uses a full range of pronunciation features with precision and subtlety; sustains flexible use of features throughout; is effortless to understand.",
    8: "Uses a wide range of pronunciation features; sustains flexible use of features, with only occasional lapses; is easy to understand throughout; accent has minimal effect on intelligibility.",
    7: "Shows all the positive features of band 6 and some, but not all, of the positive features of band 8.",
    6: "Uses a range of pronunciation features with mixed control; shows some effective use of features but this is not sustained; can generally be understood throughout, though mispronunciation of individual words or sounds reduces clarity at times.",
    5: "Shows all the positive features of band 4 and some, but not all, of the positive features of band 6.",
    4: "Uses a limited range of pronunciation features; attempts to control features but lapses are frequent; mispronunciations are frequent and cause some difficulty for the listener.",
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
