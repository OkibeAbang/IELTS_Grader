/**
 * Static practice passage bank, same convention as promptBank.js and
 * speakingQuestionBank.js. Original passages written to match the
 * structure and question types of genuine IELTS Academic Reading papers,
 * not reproductions of any real exam.
 */

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE_NOT_GIVEN: "true_false_not_given",
  // Distinct from TRUE_FALSE_NOT_GIVEN, not interchangeable with it: T/F/NG
  // tests factual claims made in the passage; Y/N/NG tests whether the
  // writer's own stated opinions/claims match a given statement. Real IELTS
  // treats these as different question types (usually T/F/NG on descriptive
  // passages, Y/N/NG on argumentative ones).
  YES_NO_NOT_GIVEN: "yes_no_not_given",
  SHORT_ANSWER: "short_answer",
};

const READING_PASSAGES = [
  {
    id: "rp-01",
    title: "Bringing Back the Beaver",
    part: 1,
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
  {
    id: "rp-02",
    title: "The Return of the Repair Café",
    part: 2,
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "On a wet Saturday morning in a church hall in Amsterdam in October 2009, a former journalist named Martine Postma set up six folding tables, invited a handful of volunteers with a talent for fixing things, and asked local residents to bring in whatever household items they had given up on: toasters that no longer toasted, lamps that had gone dark, jeans with failed zips, laptops that would not start. Within a few hours nearly all of the forty broken items brought in that day had been repaired, free of charge, by volunteers working alongside their owners rather than simply handing back a finished job. Postma called the event a Repair Café, and, expecting it to be a one-off, was surprised when people began asking when the next one would be held. Fifteen years later, the concept she founded operates in more than 3,000 locations across at least 35 countries, run almost entirely by unpaid volunteers and funded through small donations and local grants.",
      },
      {
        label: "B",
        text: "The environmental case for repair cafés has grown more urgent as the scale of electronic waste has become clearer. Global e-waste is now estimated to exceed 60 million tonnes a year, a figure that has roughly doubled in the past decade and is rising faster than any other domestic waste stream. Campaigners argue that much of this waste is unnecessary, pointing to manufacturing practices that make some devices deliberately difficult or uneconomical to fix: batteries sealed inside casings rather than user-replaceable, proprietary screws that require specialist tools, and repair manuals that are simply never published. Repair cafés position themselves as a direct, practical response to this trend, extending the working life of ordinary household items and, their advocates argue, doing more in a single afternoon to embed the principles of a circular economy — where materials are reused and repaired rather than discarded — than years of public information campaigns about recycling.",
      },
      {
        label: "C",
        text: "Equally important to many volunteers, however, is the social function these events serve. A typical repair café draws a mix of retired electricians, engineers, seamstresses and hobbyists, many of whom say the appeal lies as much in passing on a skill as in the repair itself. Visitors are actively encouraged to sit alongside the volunteer working on their item, tools in hand, rather than dropping it off and returning later, and organisers report that this exchange — a retired appliance repairer talking a teenager through rewiring a plug, for instance — has become as central to the model as the repairs themselves. Researchers studying the phenomenon have noted that repair cafés tend to attract a wider social mix than most community volunteering schemes, and several local councils in the Netherlands and Belgium now part-fund them explicitly as a means of reducing isolation among older residents, rather than purely as an environmental initiative.",
      },
      {
        label: "D",
        text: "The model is not without its difficulties. Volunteers report that certain categories of item have become steadily harder to repair: smartphones and laptops in particular, where components are often glued rather than screwed together, and where a single cracked screen can be uneconomical to replace even when a volunteer is willing to try. Spare parts for older appliances are frequently unavailable at any price, forcing volunteers to salvage components from other broken donations or to turn visitors away empty-handed. Volunteer numbers have also proved harder to sustain in some areas than founders originally hoped; a survey of repair café organisers in the United Kingdom found that around one in six groups that had started between 2015 and 2020 had since folded, most citing an ageing volunteer base and difficulty recruiting younger replacements as the primary reason.",
      },
      {
        label: "E",
        text: "Policymakers have begun to respond to some of these pressures. The European Union's 'right to repair' directive, which came into force in 2024, now obliges manufacturers of certain appliances to make spare parts and repair information available to independent repairers, not solely to authorised dealers, for a minimum number of years after a product's release. A small number of manufacturers have gone further voluntarily, publishing free repair manuals or introducing modular designs that allow a battery or screen to be replaced with basic tools. Whether such measures will be enough to offset the underlying trend towards sealed, disposable electronics remains an open question, but for the volunteers who staff repair cafés each week, the answer matters less than the immediate, tangible satisfaction of watching someone walk out with a lamp that lights up again.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph A, how did Martine Postma initially regard the first Repair Café event?",
        options: [
          { key: "A", text: "As the launch of an international movement" },
          { key: "B", text: "As a single, non-recurring event" },
          { key: "C", text: "As a way of promoting her journalism" },
          { key: "D", text: "As a fundraising event for a local charity" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "In paragraph B, what does the writer suggest about some manufacturers' design choices?",
        options: [
          { key: "A", text: "They are intended to reduce production costs above all else" },
          { key: "B", text: "They make items more difficult to repair than necessary" },
          { key: "C", text: "They are primarily driven by new safety regulations" },
          { key: "D", text: "They have improved significantly over the last decade" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Why do some local councils in the Netherlands and Belgium help fund repair cafés, according to paragraph C?",
        options: [
          { key: "A", text: "To reduce the amount they spend on landfill sites" },
          { key: "B", text: "To create paid employment for skilled tradespeople" },
          { key: "C", text: "To help address loneliness among older residents" },
          { key: "D", text: "To meet European Union recycling targets" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What does the UK survey mentioned in paragraph D suggest about repair cafés?",
        options: [
          { key: "A", text: "Most have closed due to a lack of donated items" },
          { key: "B", text: "A significant minority have shut down due to volunteer shortages" },
          { key: "C", text: "They are more common in the UK than in mainland Europe" },
          { key: "D", text: "They now focus mainly on repairing smartphones and laptops" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The first Repair Café was held in a purpose-built workshop.",
        correctAnswer: "FALSE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Global e-waste has been growing faster than other types of household waste.",
        correctAnswer: "TRUE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Every repair café volunteer is a retired professional tradesperson.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "All manufacturers are now required to publish free repair manuals.",
        correctAnswer: "FALSE",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what year was the first Repair Café held?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "2009",
        acceptableAnswers: ["2009"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Approximately how many tonnes of e-waste are now generated globally each year?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "60 million tonnes",
        acceptableAnswers: ["60 million tonnes", "60 million", "over 60 million tonnes"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What term is used in paragraph B for an economic model where materials are reused and repaired rather than discarded?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "circular economy",
        acceptableAnswers: ["circular economy", "a circular economy"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what year did the European Union's 'right to repair' directive take effect?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "2024",
        acceptableAnswers: ["2024"],
      },
    ],
  },
  {
    id: "rp-03",
    title: "Reassessing the Bystander Effect",
    part: 3,
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "Few findings in social psychology have entered popular consciousness as thoroughly as the bystander effect: the notion that an individual in trouble is, counterintuitively, less likely to receive help the more witnesses are present. The idea gained its cultural foothold following the 1964 murder of Kitty Genovese in New York, widely reported at the time as having been witnessed by dozens of neighbours who did nothing to intervene, though later journalistic reviews found this account exaggerated the number of witnesses and misrepresented what they had actually seen and heard. Independently of the accuracy of that particular case, the psychologists John Darley and Bibb Latané went on to formalise the underlying idea in a series of laboratory experiments beginning in 1968, coining the term 'diffusion of responsibility' to describe their central finding: that as the number of bystanders to an emergency increases, each individual feels less personal obligation to act, on the assumption that someone else will.",
      },
      {
        label: "B",
        text: "The classic experimental paradigm that followed was elegantly simple. Participants, usually seated alone in a room, were led to believe they were taking part in a discussion via intercom with either one, two, or five other participants. At a scripted moment, one 'participant' — in reality a recording — would appear to suffer a medical emergency. Darley and Latané measured how quickly, and how often, real participants left the room to seek help. The results were strikingly consistent: when participants believed themselves to be the sole witness, the overwhelming majority responded within a minute; when they believed four other people were also listening in, response rates dropped sharply and some participants failed to respond at all before the experiment was halted. Variations on this design — including staged emergencies involving smoke filling a room, or a nearby actor pretending to collapse — produced comparable results across hundreds of subsequent studies, embedding the phenomenon firmly within psychology's experimental canon.",
      },
      {
        label: "C",
        text: "More recently, however, a body of research using real-world evidence has begun to complicate this picture considerably. In a widely discussed 2019 study, the psychologist Richard Philpot and colleagues analysed security camera footage of 219 actual public conflicts and emergencies captured across three countries, rather than relying on staged laboratory scenarios. Their central finding ran directly counter to the classic paradigm: in 90 percent of the recorded incidents, at least one bystander intervened to help the victim, and — crucially — the likelihood of intervention did not decrease as the number of bystanders present increased. If anything, larger crowds were slightly more likely to produce an intervention, not less, since a greater number of onlookers meant a greater chance that at least one of them would act.",
      },
      {
        label: "D",
        text: "How can this apparent contradiction be reconciled? Several explanations have been proposed. One is methodological: laboratory studies typically present participants with ambiguous, non-visible emergencies — a colleague apparently choking, heard only through an intercom — whereas real street conflicts are immediate, visually unambiguous, and often physically dangerous in ways that may override the more deliberative, socially mediated hesitation that diffusion of responsibility describes. A second explanation concerns anonymity: laboratory participants know they are being studied yet remain isolated from one another, with no lasting social consequence for inaction, whereas bystanders to a real emergency are frequently known to each other, or to the victim, and must live afterwards with the reputational cost of having stood by. A third, more provocative possibility is that decades of research built almost entirely on staged, low-stakes laboratory scenarios may simply have limited applicability to how people behave when something is genuinely, visibly at stake.",
      },
      {
        label: "E",
        text: "None of this means the original experiments were poorly conducted, or that diffusion of responsibility never operates; ambiguous, low-urgency situations — a suspicious package left unattended, a stranger who appears merely unwell rather than in acute danger — may still produce exactly the hesitation Darley and Latané described. What the newer evidence does suggest is that a finding treated for half a century as a near-universal law of human behaviour may in fact be highly dependent on the artificial conditions under which it was first observed, and that public safety campaigns built on the assumption that crowds are reliably unhelpful may be starting from a flawed premise. Some researchers now argue for a more cautious framing: that people are considerably more likely to help one another, even in large crowds, than eighty years of popular psychology has led the public to believe.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What does the writer say about press coverage of the Kitty Genovese case in paragraph A?",
        options: [
          { key: "A", text: "It was later found to have understated the number of witnesses" },
          { key: "B", text: "It accurately described what witnesses had seen and heard" },
          { key: "C", text: "It exaggerated aspects of what actually occurred" },
          { key: "D", text: "It was based on Darley and Latané's original research" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "In the classic experiments described in paragraph B, what happened to response rates as the number of believed bystanders increased?",
        options: [
          { key: "A", text: "They remained essentially unchanged" },
          { key: "B", text: "They increased slightly" },
          { key: "C", text: "They dropped sharply" },
          { key: "D", text: "They became impossible to measure" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What was the central finding of Philpot's 2019 study, described in paragraph C?",
        options: [
          { key: "A", text: "Bystanders rarely intervened in real public conflicts" },
          { key: "B", text: "Intervention rates did not fall as crowd size increased" },
          { key: "C", text: "Security cameras were an unreliable source of evidence" },
          { key: "D", text: "Real emergencies are rarer than laboratory studies suggest" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph D, how do laboratory emergencies typically differ from real street conflicts?",
        options: [
          { key: "A", text: "Laboratory emergencies are usually more visually direct and immediate" },
          { key: "B", text: "Laboratory emergencies are typically more ambiguous and less visible" },
          { key: "C", text: "Real conflicts rarely involve any physical danger" },
          { key: "D", text: "Real conflicts are usually witnessed by complete strangers only" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Darley and Latané were the first psychologists to use the phrase 'diffusion of responsibility'.",
        correctAnswer: "TRUE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The Philpot study relied on participants' own written accounts of emergencies they had witnessed.",
        correctAnswer: "FALSE",
      },
      {
        id: "q7",
        // Yes/No/Not Given, not True/False/Not Given: this tests the
        // writer's own stated opinion ("the writer believes..."), not a
        // factual claim made in the passage.
        type: QUESTION_TYPES.YES_NO_NOT_GIVEN,
        prompt: "The writer believes the original bystander experiments were carried out incompetently.",
        correctAnswer: "NO",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Every researcher in the field now agrees that diffusion of responsibility does not exist.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what year did Darley and Latané begin their laboratory experiments?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "1968",
        acceptableAnswers: ["1968"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many real public conflicts did Philpot and colleagues analyse using security camera footage?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "219",
        acceptableAnswers: ["219", "219 incidents", "219 conflicts"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what percentage of the incidents Philpot analysed did at least one bystander intervene?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "90 percent",
        acceptableAnswers: ["90 percent", "90%", "90 per cent"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "According to paragraph D, what may bystanders to a real emergency have to live with afterwards if they fail to act?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "reputational cost",
        acceptableAnswers: ["reputational cost", "the reputational cost", "a reputational cost"],
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

// Server-internal only, same reason — used by scoreReadingFullTest to score
// every passage in the bank as one continuous test.
function getAllReadingPassagesWithAnswers() {
  return READING_PASSAGES;
}

export {
  QUESTION_TYPES,
  getReadingPassageBank,
  getReadingPassage,
  getReadingPassageWithAnswers,
  getAllReadingPassagesWithAnswers,
};
