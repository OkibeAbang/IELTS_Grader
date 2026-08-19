/**
 * Static practice passage bank, same convention as promptBank.js and
 * speakingQuestionBank.js. Original passages written to match the
 * structure and question types of genuine IELTS Academic Reading papers,
 * not reproductions of any real exam.
 */

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE_NOT_GIVEN: "true_false_not_given",
  SHORT_ANSWER: "short_answer",
};

const READING_PASSAGES = [
  {
    id: "rp-01",
    title: "Bringing Back the Beaver",
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "For nearly 400 years, the Eurasian beaver (Castor fiber) was absent from the rivers and wetlands of Britain. Once found in almost every county, the species was hunted to extinction by the 16th century, prized for its dense, waterproof fur, its meat, and castoreum, a musky secretion once used in perfumes and medicine. Across the rest of Europe the story was similar: by the start of the 20th century, only a handful of isolated populations survived, scattered across Norway, Germany, France and Russia, and the total European population is thought to have fallen below 1,200 individuals. Yet today, thanks to decades of legal protection and deliberate reintroduction programmes, beavers number in the hundreds of thousands and have been returned to more than 25 European countries, including, since 2009, parts of Scotland and England.",
      },
      {
        label: "B",
        text: 'The renewed interest in beavers has little to do with sentiment and everything to do with what ecologists call "ecosystem engineering." Unlike most animals, beavers physically reshape the landscapes they inhabit. By felling trees and building dams across streams, they create ponds and wetlands that would not otherwise exist, and they maintain these structures continuously, repairing breaches within hours of them appearing. These engineered wetlands raise the local water table, slow the passage of water through a catchment, and create a shifting mosaic of pools, channels and wet woodland. Research conducted at a reintroduction trial site in Devon, in south-west England, found that the number of distinct wetland habitat types on one small stream rose from just one to more than a dozen within five years of beavers being introduced there. Amphibians, wetland birds, aquatic invertebrates and even fish have all been shown to benefit from the increased structural complexity that beaver dams provide, and some conservationists now regard the beaver as a "keystone species" — one whose influence on its environment is disproportionately large relative to its numbers.',
      },
      {
        label: "C",
        text: "Beyond biodiversity, beaver dams appear to deliver two further benefits that have caught the attention of policymakers: flood reduction and water purification. Because a series of dams slows the flow of water downstream, catchments with established beaver populations tend to release rainfall much more gradually after storms, which can lower peak flood flows in nearby towns and villages. A widely cited study of the Devon trial site recorded a reduction in peak flow of around 30 percent during major storm events, compared with a similar nearby stream without beavers. The ponds also act as settling basins, trapping sediment, agricultural fertiliser run-off and other pollutants before they reach rivers further downstream; one monitoring project found that water leaving a beaver wetland carried significantly lower concentrations of nitrogen and phosphorus than the water entering it. For water companies and flood authorities facing rising costs from more frequent extreme weather, such findings have made beaver reintroduction an increasingly attractive, low-cost complement to conventional, engineered flood defences.",
      },
      {
        label: "D",
        text: "Not everyone welcomes the beaver's return, however. Farmers whose land borders reintroduction sites have raised concerns about dams that flood pasture or arable fields, and about burrows that can undermine flood banks and irrigation channels. Fruit growers and foresters, meanwhile, point out that beavers will readily fell young or ornamental trees, sometimes causing considerable damage to commercial plantations in a single night. In parts of Scotland, disputes over crop flooding became sufficiently heated in the early 2010s that a small number of animals were shot under licence, a practice that drew strong criticism from wildlife groups and highlighted how divisive the issue had become. These tensions point to a broader challenge for reintroduction programmes generally: a species that provides clear benefits at a landscape scale can still impose real, localised costs on individual landowners, and managing that imbalance fairly is rarely straightforward.",
      },
      {
        label: "E",
        text: "In response, wildlife agencies across Britain and continental Europe have developed a range of management tools intended to let beaver populations recover while limiting conflict with landowners. These include wrapping the trunks of especially valuable trees in wire mesh, installing devices that regulate water levels within dams without removing them entirely, and, where necessary, licensed trapping and translocation of individual animals to less sensitive sites nearby. Compensation schemes for farmers affected by flooding are also being trialled in some regions, alongside advisory services that help landowners plan for beaver activity before it occurs. Scientists monitoring these programmes stress that long-term success will depend less on the beaver's own remarkable resilience, which is by now well established, and more on whether governments and local communities can agree on durable rules for sharing a landscape that, for several centuries, humans had entirely to themselves.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph A, why were beavers originally hunted to extinction in Britain?",
        options: [
          { key: "A", text: "Their dams caused flooding of farmland" },
          { key: "B", text: "They were valued for their fur, meat and castoreum" },
          { key: "C", text: "They competed with livestock for grazing land" },
          { key: "D", text: "They damaged commercial fishing stocks" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: 'What does the writer mean by describing the beaver as a "keystone species" in paragraph B?',
        options: [
          { key: "A", text: "It is the most numerous species in its habitat" },
          { key: "B", text: "It was the first species reintroduced to Britain" },
          { key: "C", text: "Its effect on the ecosystem is much greater than its population size would suggest" },
          { key: "D", text: "It can only survive in ecosystems with rocky riverbeds" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What is the main reason flood and water authorities have become interested in beavers, according to paragraph C?",
        options: [
          { key: "A", text: "They eliminate the need for engineered flood defences entirely" },
          { key: "B", text: "They provide a low-cost way to reduce flood peaks and improve water quality" },
          { key: "C", text: "They increase the amount of water available for irrigation" },
          { key: "D", text: "They reduce the cost of dredging rivers" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which of the following is mentioned in paragraph E as a way of reducing conflict with landowners?",
        options: [
          { key: "A", text: "Banning beaver reintroduction until compensation laws are passed" },
          { key: "B", text: "Removing all dams built near farmland" },
          { key: "C", text: "Wrapping valuable trees in wire mesh" },
          { key: "D", text: "Restricting beavers to fenced nature reserves" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "By the early 20th century, the European beaver population had grown to over a million.",
        correctAnswer: "FALSE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Beaver dams at the Devon trial site increased the variety of wetland habitats found along the stream.",
        correctAnswer: "TRUE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "All conservationists agree that beavers should be classified as a keystone species.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "No farmer has ever been permitted to kill a beaver legally in Scotland.",
        correctAnswer: "FALSE",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What substance taken from beavers was historically used in perfumes and medicine?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "castoreum",
        acceptableAnswers: ["castoreum"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In which English county was the beaver reintroduction trial site mentioned in the passage located?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Devon",
        acceptableAnswers: ["Devon"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By approximately what percentage did peak flow reduce during major storms at the trial site?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "30 percent",
        acceptableAnswers: ["30 percent", "30%", "around 30 percent", "30 per cent"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What kind of scheme is being trialled to help farmers affected by beaver-related flooding?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "compensation scheme",
        acceptableAnswers: ["compensation scheme", "compensation schemes", "compensation"],
      },
    ],
  },
];

function toPublicQuestion({ correctAnswer, acceptableAnswers, ...rest }) {
  return rest;
}

function toPublicPassage(passage) {
  return {
    ...passage,
    questionCount: passage.questions.length,
    questions: passage.questions.map(toPublicQuestion),
  };
}

function getReadingPassageBank() {
  return READING_PASSAGES.map(toPublicPassage);
}

function getReadingPassage(id) {
  const passage = READING_PASSAGES.find((p) => p.id === id);
  return passage ? toPublicPassage(passage) : undefined;
}

// Server-internal only — carries correctAnswer/acceptableAnswers. Used
// exclusively by scoreReading.js; never route this directly to a response.
function getReadingPassageWithAnswers(id) {
  return READING_PASSAGES.find((p) => p.id === id);
}

export { QUESTION_TYPES, getReadingPassageBank, getReadingPassage, getReadingPassageWithAnswers };
