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
  // "Choose TWO/THREE letters" — answer is a set (correctAnswers, plural,
  // + chooseCount), not a single correctAnswer. See markingEngine.js's
  // isMultipleSelectCorrect for how this is scored.
  MULTIPLE_SELECT: "multiple_select",
  // Covers matching headings/features/sentence-endings/information — all
  // the same mechanic (pick one option from a shared pool, once per
  // prompt), just different content. A matching question is otherwise a
  // completely ordinary single-answer question (one correctAnswer, scored
  // by markingEngine.js's existing fixed-option fallback, no new scoring
  // logic needed) — the only new thing is `groupId`, which points at an
  // entry in the passage's `questionGroups` array so the client can render
  // the shared instructions/option pool once above the group instead of
  // repeating it per question.
  MATCHING: "matching",
  // Summary/table/flow-chart/note/form completion, "choose from a box"
  // style. Scored identically to MATCHING (one correctAnswer, a key into
  // the group's optionPool) — kept as its own type string purely so
  // drill-mode and attempt-history labels can say "Completion" rather than
  // "Matching", since that's what a student is actually practicing. The
  // group holds `layout: "summary"` and a `template` (plain-text segments
  // interleaved with `{ blank: questionId }` markers) so the client renders
  // blanks inline inside prose instead of matching's stacked list.
  COMPLETION_BOX: "completion_box",
  // Same "words from the text" free-recall mechanic as SHORT_ANSWER
  // (word-limit enforced, spelling/number variants accepted) — see
  // markingEngine.js's isCorrect, which treats the two identically. Kept
  // as its own type string only so drill-mode/history labels read
  // "Completion" rather than "Short Answer". Rendered via the same inline
  // `template` mechanism as COMPLETION_BOX, just a text input instead of
  // a dropdown (no optionPool on the group at all — free recall, not a
  // word bank).
  COMPLETION_TEXT: "completion_text",
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
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "According to paragraph C, which TWO of the following benefits of beaver dams are mentioned?",
        chooseCount: 2,
        options: [
          { key: "A", text: "They reduce peak flood flows during major storms" },
          { key: "B", text: "They completely remove the need for engineered flood defences" },
          { key: "C", text: "They trap agricultural pollutants before they reach rivers downstream" },
          { key: "D", text: "They increase the amount of water available for irrigation" },
          { key: "E", text: "They reduce the cost of dredging rivers" },
        ],
        correctAnswers: ["A", "C"],
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
      {
        id: "q13",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph A",
        correctAnswer: "ii",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph B",
        correctAnswer: "iii",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph C",
        correctAnswer: "iv",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph D",
        correctAnswer: "vi",
      },
      {
        id: "q17",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph E",
        correctAnswer: "vii",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-17: The passage has five paragraphs, A-E. Choose the correct heading for each paragraph from the list of headings below. Each heading may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "i", text: "A costly government programme facing public opposition" },
          { key: "ii", text: "From near-extinction to a widespread European recovery" },
          { key: "iii", text: "How one species reshapes its entire habitat" },
          { key: "iv", text: "Unexpected benefits for flood control and clean water" },
          { key: "v", text: "A species with no natural predators left in Europe" },
          { key: "vi", text: "Friction between conservation goals and farming livelihoods" },
          { key: "vii", text: "Finding practical ways to share the landscape" },
        ],
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
      {
        id: "q13",
        type: QUESTION_TYPES.COMPLETION_BOX,
        groupId: "g2",
        // Unused by the inline template rendering itself (the blank's
        // surrounding text comes from the group's own `template`, not
        // this field) — only shown in the post-submit results view, which
        // otherwise has nothing to display beside a bare "13." for a
        // question type whose whole prompt lives in the summary prose.
        prompt: "type of item repaired for free",
        correctAnswer: "A",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.COMPLETION_BOX,
        groupId: "g2",
        prompt: "how Repair Cafés are mainly funded",
        correctAnswer: "B",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.COMPLETION_BOX,
        groupId: "g2",
        prompt: "what many volunteers value as much as the repairs themselves",
        correctAnswer: "C",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.COMPLETION_BOX,
        groupId: "g2",
        prompt: "why spare parts for older appliances can be hard to get",
        correctAnswer: "D",
      },
    ],
    questionGroups: [
      {
        id: "g2",
        layout: "summary",
        instructions: "Questions 13-16: Complete the summary below using words from the box. Each word may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "items" },
          { key: "B", text: "donations" },
          { key: "C", text: "social" },
          { key: "D", text: "unavailable" },
          { key: "E", text: "expensive" },
          { key: "F", text: "environmental" },
          { key: "G", text: "profits" },
          { key: "H", text: "subscriptions" },
        ],
        template: [
          {
            text: "The first Repair Café was held in a church hall in Amsterdam in 2009, where volunteers helped local residents repair broken ",
          },
          { blank: "q13" },
          {
            text: " free of charge. The idea grew rapidly, and today it operates in thousands of locations funded mainly through small ",
          },
          { blank: "q14" },
          { text: " and local grants. Many volunteers value the " },
          { blank: "q15" },
          {
            text: " side of these events just as much as the repairs themselves, since retired tradespeople often pass on practical skills to younger visitors. However, spare parts for older appliances are often ",
          },
          { blank: "q16" },
          { text: ", forcing volunteers to salvage components from other donations." },
        ],
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
      {
        id: "q13",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "The 1964 murder victim whose case popularized the bystander effect",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Kitty Genovese",
        acceptableAnswers: ["Kitty Genovese"],
      },
      {
        id: "q14",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "The term Darley and Latané coined for reduced individual responsibility in groups",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "diffusion of responsibility",
        acceptableAnswers: ["diffusion of responsibility"],
      },
      {
        id: "q15",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "Percentage of real incidents in which at least one bystander intervened, per Philpot's study",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "90",
        acceptableAnswers: ["90", "90%"],
      },
      {
        id: "q16",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "Type of cost bystanders to a real emergency may fear if they fail to act",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "reputational",
        acceptableAnswers: ["reputational"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        layout: "summary",
        instructions: "Questions 13-16: Complete the summary below. Use NO MORE THAN THREE WORDS from the passage for each answer.",
        template: [
          {
            text: "The idea that bystanders are less likely to help as their numbers increase became widely known after the 1964 murder of ",
          },
          { blank: "q13" },
          {
            text: ", although later reviews found media reports had exaggerated the case. The psychologists who studied this effect in the laboratory used the term ",
          },
          { blank: "q14" },
          {
            text: " to describe why individuals feel less obligated to act when others are present. A 2019 study analysing real security camera footage found that at least one bystander intervened in ",
          },
          { blank: "q15" },
          {
            text: " percent of recorded incidents, and that larger crowds were, if anything, slightly more likely to help. One explanation for this is that bystanders in real emergencies fear a lasting ",
          },
          { blank: "q16" },
          { text: " cost if they fail to act, unlike anonymous laboratory participants." },
        ],
      },
    ],
  },
  {
    id: "rp-04",
    title: "The Rise of Vertical Farming",
    part: 1,
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "As the world's urban population continues to grow, and the farmland available on the outskirts of major cities continues to shrink, a small but fast-growing industry has begun proposing an unusual solution: growing crops not outward across open fields but upward, inside stacked, climate-controlled buildings. Known as vertical farming, the approach typically houses crops on shelves rising many metres into the air within a warehouse or purpose-built tower, each layer supplied with its own irrigation, lighting and nutrient system. Unlike a conventional greenhouse, which still relies substantially on natural daylight and outdoor temperatures, a vertical farm is usually a fully sealed environment, with every variable — light intensity, humidity, carbon dioxide concentration, nutrient balance — controlled automatically by computer systems, an approach generally referred to as controlled-environment agriculture, or CEA.",
      },
      {
        label: "B",
        text: "The case for growing food this way rests largely on land and water efficiency. Because crops are stacked in layers rather than spread across a single horizontal plane, a vertical farm can produce, on some estimates, more than one hundred times the yield of an equivalent area of traditional farmland. Water use is reduced even more dramatically: most vertical farms use hydroponic or aeroponic systems, in which nutrient-rich water is either circulated past bare roots or misted directly onto them, rather than soaking into soil, cutting water consumption by up to 95 percent compared with open-field agriculture. Because the growing environment is entirely enclosed, pesticides become largely unnecessary too, since the usual outdoor pests and airborne plant diseases simply have no way of reaching the crop.",
      },
      {
        label: "C",
        text: "A further advantage, proponents argue, is proximity. Because vertical farms do not require open land, they can be built within or immediately alongside the cities whose populations they feed, sometimes in repurposed warehouses or disused industrial buildings. This drastically shortens the distance between harvest and plate; some operators claim their produce can reach a nearby supermarket shelf within hours of being picked, rather than the days or weeks typical of produce shipped from distant agricultural regions. Shorter supply chains of this kind are said to reduce both transport-related carbon emissions and the substantial proportion of fresh produce that is normally lost to spoilage in transit.",
      },
      {
        label: "D",
        text: "Despite this promise, the industry has faced real financial difficulties. Running a vertical farm is energy-intensive: because natural sunlight is largely or entirely absent, crops must be grown under artificial lighting, usually LED arrays tuned to the specific wavelengths plants use for photosynthesis, and this lighting, together with the climate-control systems, can account for the majority of a facility's operating costs. Several prominently funded vertical farming companies have collapsed or scaled back operations sharply in recent years after failing to bring these energy costs down to a level that could compete with conventional agriculture on price, particularly for lower-margin crops. As a result, the produce grown commercially in vertical farms today remains narrow: mostly leafy greens, herbs and salad crops, which grow quickly and command a high enough retail price to offset the cost of production, rather than staple crops such as wheat, rice or potatoes.",
      },
      {
        label: "E",
        text: "Researchers in the field generally argue that vertical farming is best understood not as a wholesale replacement for traditional agriculture, which will remain essential for producing the staple crops that supply most of the world's calories, but as a complementary technology suited to specific crops and specific locations, particularly dense cities with limited surrounding farmland or regions with especially harsh climates. Continued improvements in LED efficiency and renewable energy integration, several industry analysts suggest, may eventually narrow the cost gap enough for vertical farming to expand beyond its current niche, though most agree this remains a matter of years rather than months.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph A, what mainly distinguishes a vertical farm from a conventional greenhouse?",
        options: [
          { key: "A", text: "A vertical farm grows only leafy green crops" },
          { key: "B", text: "A vertical farm is a fully sealed, computer-controlled environment" },
          { key: "C", text: "A vertical farm relies more heavily on natural daylight" },
          { key: "D", text: "A vertical farm must be built outside city limits" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Why is water use significantly reduced in vertical farms, according to paragraph B?",
        options: [
          { key: "A", text: "Crops are watered manually rather than by machine" },
          { key: "B", text: "Rainwater is collected and reused within the building" },
          { key: "C", text: "Hydroponic and aeroponic systems deliver water directly to roots rather than soil" },
          { key: "D", text: "Crops are grown for a shorter period than in open fields" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What advantage of vertical farming is discussed in paragraph C?",
        options: [
          { key: "A", text: "Lower labour costs than traditional farming" },
          { key: "B", text: "Shorter distances between harvest and consumer" },
          { key: "C", text: "A wider variety of crops than open-field farming" },
          { key: "D", text: "Reduced need for artificial lighting" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph D, why do vertical farms mostly grow leafy greens and herbs rather than staple crops?",
        options: [
          { key: "A", text: "These crops grow quickly and are valuable enough to offset high energy costs" },
          { key: "B", text: "Staple crops cannot survive under artificial lighting at all" },
          { key: "C", text: "Consumers prefer leafy greens grown indoors" },
          { key: "D", text: "Staple crops require more water than vertical farms can supply" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Vertical farms generally require the use of pesticides to protect crops from pests.",
        correctAnswer: "FALSE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Some vertical farming companies have failed because energy costs made their produce too expensive to compete with conventional farming.",
        correctAnswer: "TRUE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Every vertical farming company founded so far has been financially profitable.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Researchers generally believe vertical farming will completely replace traditional agriculture within a few years.",
        correctAnswer: "FALSE",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What term is used in paragraph A for growing crops in a fully controlled indoor environment?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "controlled-environment agriculture",
        acceptableAnswers: ["controlled-environment agriculture", "controlled environment agriculture", "CEA"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By what percentage can water use be cut compared with open-field agriculture?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "95 percent",
        acceptableAnswers: ["95 percent", "95%", "up to 95 percent", "95 per cent"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What kind of lighting is typically used to grow crops in vertical farms?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "LED arrays",
        acceptableAnswers: ["LED arrays", "LED", "LED lighting", "LEDs"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "According to paragraph E, what kind of locations is vertical farming considered particularly well suited to?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "dense cities",
        acceptableAnswers: ["dense cities", "dense cities with limited surrounding farmland", "cities"],
      },
      {
        id: "q13",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a mention of a specific percentage reduction in water use",
        correctAnswer: "B",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a reference to produce reaching supermarket shelves within hours of harvest",
        correctAnswer: "C",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "an explanation of why pesticides become largely unnecessary",
        correctAnswer: "B",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a description of the type of crops currently grown profitably in vertical farms",
        correctAnswer: "D",
      },
      {
        id: "q17",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a suggestion that vertical farming should be seen as a complement to traditional agriculture rather than a replacement",
        correctAnswer: "E",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-17: The passage has five paragraphs, A-E. Which paragraph contains the following information? Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "" },
          { key: "B", text: "" },
          { key: "C", text: "" },
          { key: "D", text: "" },
          { key: "E", text: "" },
        ],
      },
    ],
  },
  {
    id: "rp-05",
    title: "The Science of Sleep Debt",
    part: 2,
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "Most adults require somewhere between seven and nine hours of sleep a night to function at their best, yet large-scale surveys in industrialised countries consistently find that a substantial proportion of adults — in some national surveys, more than a third — report averaging six hours or fewer on workdays. Sleep researchers use the term 'sleep debt' to describe the cumulative shortfall that builds up when a person sleeps less than their body requires over consecutive nights, and, crucially, they stress that this debt behaves less like an inconvenience to be shrugged off and more like a physiological deficit that continues to accumulate, with measurable consequences, until it is repaid.",
      },
      {
        label: "B",
        text: "The immediate effects of accumulated sleep debt are well documented and, to most people, unsurprising: slower reaction times, impaired concentration, and a diminished ability to regulate mood. Less widely appreciated is how severe these effects can become. Laboratory studies restricting participants to six hours of sleep a night for two consecutive weeks found that their cognitive performance on attention and reaction-time tasks declined to a level statistically indistinguishable from that of participants who had been kept completely awake for twenty-four hours — despite the six-hour group reporting that they felt only moderately tired, not severely impaired. This gap between subjective feeling and objective performance is, researchers argue, precisely what makes chronic mild sleep restriction so dangerous in contexts such as driving or operating machinery: the person experiencing the deficit consistently underestimates it.",
      },
      {
        label: "C",
        text: "Beyond cognition, a growing body of research has linked chronic sleep debt to longer-term health outcomes. Epidemiological studies tracking large cohorts over many years have found associations between habitually short sleep and elevated risks of obesity, type 2 diabetes, cardiovascular disease and weakened immune function. The proposed mechanisms vary: disrupted sleep appears to alter the balance of hormones that regulate appetite, increasing levels of the hormone that stimulates hunger while suppressing the one that signals fullness, which may partly explain the observed association with weight gain. Sleep is also understood to play a central role in immune regulation, and several controlled studies have found that sleep-deprived participants mount a measurably weaker antibody response to vaccination than well-rested participants given the identical vaccine.",
      },
      {
        label: "D",
        text: "A persistent question is whether sleep debt can genuinely be 'repaid' through catch-up sleep, such as sleeping considerably longer on weekends after a week of insufficient sleep. The evidence here is mixed. Some studies suggest that extended recovery sleep can reverse certain short-term cognitive impairments reasonably well, with attention and reaction times returning close to baseline after one or two nights of substantially longer sleep. However, other research indicates that some physiological effects, particularly those related to metabolic and hormonal regulation, do not appear to fully normalise after a single weekend of recovery sleep, even when overall sleep duration that weekend considerably exceeds the usual recommended range. This has led some researchers to caution that occasional catch-up sleep, however appealing as a strategy, should not be regarded as a substitute for consistently adequate sleep across the whole week.",
      },
      {
        label: "E",
        text: "Given this evidence, sleep scientists generally recommend prioritising consistency over occasional compensation: going to bed and waking at similar times each day, including weekends, rather than alternating between severe weekday sleep restriction and extended weekend recovery. Workplaces and schools, several researchers argue, could likewise do more to accommodate natural variation in sleep needs, particularly given evidence that adolescents' biological sleep timing shifts later during puberty, making conventional early school start times especially poorly matched to teenagers' sleep physiology. Whether such institutional changes will be widely adopted remains uncertain, but the underlying physiological case for treating sleep as a non-negotiable biological requirement, rather than a flexible lifestyle choice, is, researchers argue, now considerably stronger than it was even a decade ago.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How do sleep researchers characterise 'sleep debt', according to paragraph A?",
        options: [
          { key: "A", text: "A minor inconvenience with no lasting effect" },
          { key: "B", text: "A physiological deficit that accumulates until repaid" },
          { key: "C", text: "A condition affecting only a small minority of adults" },
          { key: "D", text: "A problem limited to people who work night shifts" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What did the study described in paragraph B find surprising about participants restricted to six hours of sleep?",
        options: [
          { key: "A", text: "Their cognitive performance improved slightly over two weeks" },
          { key: "B", text: "They felt only moderately tired despite severely impaired performance" },
          { key: "C", text: "They performed better than participants kept awake for 24 hours" },
          { key: "D", text: "They were unable to complete the attention and reaction-time tasks" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph C, what is one proposed explanation for the link between short sleep and weight gain?",
        options: [
          { key: "A", text: "Short sleep directly slows the metabolism of fat" },
          { key: "B", text: "Short sleep alters appetite-regulating hormones" },
          { key: "C", text: "Short sleep reduces the time available for exercise" },
          { key: "D", text: "Short sleep increases cravings for salty food specifically" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What does the research described in paragraph D suggest about catch-up sleep?",
        options: [
          { key: "A", text: "It fully reverses all effects of sleep debt within one night" },
          { key: "B", text: "It may improve some cognitive effects but not fully normalise metabolic effects" },
          { key: "C", text: "It has no measurable benefit of any kind" },
          { key: "D", text: "It is more effective than consistent nightly sleep" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "More than a third of adults in some national surveys report averaging six hours of sleep or fewer on workdays.",
        correctAnswer: "TRUE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Sleep-deprived participants in vaccine studies produced a stronger antibody response than well-rested participants.",
        correctAnswer: "FALSE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "All researchers agree that weekend catch-up sleep is completely ineffective.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Adolescents' biological sleep timing shifts to become later during puberty.",
        correctAnswer: "TRUE",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many hours of sleep do most adults require per night, according to paragraph A?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "seven and nine",
        acceptableAnswers: ["seven and nine", "seven to nine", "seven to nine hours", "7 to 9 hours", "7-9 hours"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "For how many consecutive weeks were participants restricted to six hours of sleep in the study mentioned in paragraph B?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "two weeks",
        acceptableAnswers: ["two weeks", "2 weeks"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is understood to play a central role in regulating the body's response to infection?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "sleep",
        acceptableAnswers: ["sleep"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What do sleep scientists generally recommend prioritising over occasional catch-up sleep?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "consistency",
        acceptableAnswers: ["consistency", "consistent sleep"],
      },
      {
        id: "q13",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Sleep debt is best understood as",
        correctAnswer: "A",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Participants restricted to six hours of sleep for two weeks performed",
        correctAnswer: "B",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Disrupted sleep is thought to alter hormones in a way that",
        correctAnswer: "C",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Even a single weekend of extended recovery sleep",
        correctAnswer: "D",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-16: Complete each sentence with the correct ending, A-F, below. Each letter may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "a physiological deficit that keeps building up until it is repaid" },
          { key: "B", text: "as poorly as people who had stayed awake for a full 24 hours" },
          { key: "C", text: "increases hunger while reducing the sense of feeling full" },
          { key: "D", text: "may not fully reverse certain metabolic and hormonal effects" },
          { key: "E", text: "only affects people who work night shifts" },
          { key: "F", text: "completely eliminates any sleep debt built up during the week" },
        ],
      },
    ],
  },
  {
    id: "rp-06",
    title: "Should Cities Ban Cars? The Debate Over Car-Free Zones",
    part: 3,
    estimatedMinutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "Over the past two decades, a growing number of European cities — among them Oslo, Ghent, and parts of central Paris — have introduced schemes to restrict or entirely eliminate private car access to designated zones, usually historic city centres, replacing road space with pedestrian areas, cycle lanes and expanded public transport. Supporters argue that such schemes are long overdue, pointing to falling air pollution, quieter streets and a resurgence of street-level retail and café culture in the areas affected. Critics, however, argue that these benefits are unevenly distributed, and that car-free policies risk excluding precisely the residents least able to adapt to them.",
      },
      {
        label: "B",
        text: "The empirical case for car-free zones rests substantially on air-quality and public-health data. Oslo's city centre, after removing most on-street parking and restricting through-traffic beginning in 2017, recorded measurable reductions in nitrogen dioxide concentrations within two years, a pollutant strongly associated with respiratory illness. Researchers studying the Ghent scheme, introduced in 2017, found a comparable pattern: traffic volumes in the restricted zone fell by roughly half, while cycling trips rose sharply, and local business associations, who had initially opposed the plan, later reported that footfall in affected streets had not fallen as feared and in some cases had risen. Such findings are frequently cited by advocates as evidence that the anticipated economic harm to local businesses, a common objection raised before these schemes are introduced, tends not to materialise once cyclists and pedestrians are counted alongside the drivers who no longer pass through.",
      },
      {
        label: "C",
        text: "Nonetheless, the distributional concerns raised by critics deserve serious attention rather than dismissal. Residents who rely on a car for reasons unrelated to convenience — tradespeople transporting tools and equipment, people with mobility impairments for whom walking or cycling is not a realistic alternative, and families in outlying neighbourhoods poorly served by public transport — are disproportionately affected by restrictions that assume a level of transport flexibility not everyone actually has. Several cities have responded with targeted exemptions: permits for registered tradespeople, disabled-access vehicles, and residents within the zone itself, alongside investment in frequent, affordable public transport intended to make car ownership less necessary for reaching the zone from further out. Whether such measures adequately offset the burden imposed on affected groups remains genuinely contested, and is not, in this writer's view, a question the available evidence yet answers conclusively.",
      },
      {
        label: "D",
        text: "A further point of contention concerns emergency services and deliveries, which cannot simply be rerouted around a restricted zone the way private car journeys can. Cities that have implemented these schemes successfully have generally done so by retaining dedicated, clearly marked access routes and time-restricted delivery windows — typically early morning, before pedestrian footfall rises — rather than banning vehicle access outright. Where this planning has been inadequate, as critics note occurred in the early stages of at least one scheme, congestion has simply relocated to the boundary streets surrounding the restricted zone rather than disappearing, undermining much of the intended benefit and shifting the burden onto residents of adjacent neighbourhoods who gained none of the zone's advantages.",
      },
      {
        label: "E",
        text: "On balance, the accumulating evidence from schemes now a decade or more old suggests that well-designed car-free zones can deliver genuine environmental and commercial benefits without the severe economic disruption once feared, provided that planners treat the needs of tradespeople, disabled residents and those living just outside the zone's boundary as integral to the design rather than as problems to be solved after the fact. The more troubling cases, on the evidence available, appear to be not the concept itself but its poorly planned implementations — a distinction that is frequently lost in public debate, where 'car-free zones' tend to be discussed as a single uniform policy rather than a design that can be executed well or badly.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph A, what do critics of car-free zones argue?",
        options: [
          { key: "A", text: "That air pollution has not actually fallen in affected areas" },
          { key: "B", text: "That the benefits are unevenly distributed and may exclude some residents" },
          { key: "C", text: "That retail businesses always benefit equally from the schemes" },
          { key: "D", text: "That public transport investment is unnecessary" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What did local business associations in Ghent report after the scheme was introduced, according to paragraph B?",
        options: [
          { key: "A", text: "Footfall fell sharply, as they had originally feared" },
          { key: "B", text: "Footfall did not fall as feared, and in some cases increased" },
          { key: "C", text: "They had never opposed the scheme" },
          { key: "D", text: "Cycling trips fell while traffic volumes rose" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph C, which group is given as an example of residents disproportionately affected by car restrictions?",
        options: [
          { key: "A", text: "People with mobility impairments" },
          { key: "B", text: "Tourists visiting the city centre" },
          { key: "C", text: "Cyclists who commute daily" },
          { key: "D", text: "Local café owners" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph D, what happens when planning for deliveries and emergency access is inadequate?",
        options: [
          { key: "A", text: "Congestion disappears entirely from the city" },
          { key: "B", text: "Congestion relocates to streets surrounding the restricted zone" },
          { key: "C", text: "Emergency services are given unrestricted access at all times" },
          { key: "D", text: "Delivery companies stop serving the city centre altogether" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.YES_NO_NOT_GIVEN,
        prompt: "The writer believes that car-free zones are fundamentally a flawed concept that cannot work well.",
        correctAnswer: "NO",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.YES_NO_NOT_GIVEN,
        prompt: "The writer believes that the distributional concerns raised by critics deserve serious attention.",
        correctAnswer: "YES",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.YES_NO_NOT_GIVEN,
        prompt: "The writer believes that current evidence conclusively proves exemption schemes fully offset the burden on affected groups.",
        correctAnswer: "NO",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.YES_NO_NOT_GIVEN,
        prompt: "The writer believes that public opinion on car-free zones has shifted significantly over the past five years.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what year did Oslo begin restricting through-traffic in its city centre?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "2017",
        acceptableAnswers: ["2017"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By roughly how much did traffic volumes fall in Ghent's restricted zone?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "roughly half",
        acceptableAnswers: ["roughly half", "half", "by half", "about half"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What pollutant is mentioned as being strongly associated with respiratory illness?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "nitrogen dioxide",
        acceptableAnswers: ["nitrogen dioxide", "NO2"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "According to paragraph D, when are time-restricted delivery windows typically scheduled?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "early morning",
        acceptableAnswers: ["early morning", "in the early morning"],
      },
      {
        id: "q13",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Recorded a measurable drop in nitrogen dioxide within two years of its scheme starting",
        correctAnswer: "A",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Removed most of its on-street parking as part of its restrictions",
        correctAnswer: "A",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Saw traffic volumes fall by roughly half after its scheme began",
        correctAnswer: "B",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Had local business associations that initially opposed the scheme",
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-16: Look at the following statements and the list of cities below. Match each statement with the correct city, A or B. Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Oslo" },
          { key: "B", text: "Ghent" },
        ],
      },
    ],
  },
  // --- General Training track begins here ---
  // Real IELTS Listening and Speaking are identical for Academic and GT
  // candidates — only Reading (fully) and Writing Task 1 (chart vs letter)
  // actually differ. So `track` only exists on Reading passages; GT
  // Listening sections/Writing Task 1 letters/Speaking topics added
  // alongside this batch just go straight into their existing banks with
  // no track field at all. Passages with no `track` are implicitly
  // "academic" — existing passages were deliberately left untouched
  // rather than retrofitted with an explicit value.
  //
  // GT Reading Section 1 and Section 2 are each genuinely TWO short,
  // unrelated texts under one section with continuous numbering — modeled
  // here as one passage whose `paragraphs` contains both texts back to
  // back (paragraph labels double as a lightweight "Text 1"/"Text 2" or
  // named-entity divider), rather than inventing a second passage-within-
  // a-passage structure for what the real exam itself treats as one
  // section.
  {
    id: "rp-07",
    title: "City Services and Local Reviews",
    part: 1,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Greenway Bike-Share Scheme: Frequently Asked Questions", text: "" },
      {
        label: "A",
        text: "Greenway Bike-Share lets you unlock a bicycle from any of the 40 docking stations across the city centre using the Greenway app. A valid day pass costs £4.50 and allows unlimited 30-minute rides within a 24-hour period; any single ride lasting longer than 30 minutes is charged an additional £1 for each extra 15 minutes.",
      },
      {
        label: "B",
        text: "Bicycles must be returned to a docking station, not left on the street — a bike returned anywhere else will continue to be charged until it is correctly docked or reported to customer support. Helmets are not provided with the bicycles, and riders are strongly encouraged to bring their own.",
      },
      {
        label: "C",
        text: "Membership is open to anyone aged 16 or over who holds a valid payment card; a parent or guardian may register on behalf of a younger rider, but that rider must always be accompanied by an adult member during any ride. Annual membership costs £65 and includes unlimited 45-minute rides.",
      },
      {
        label: "D",
        text: "Bicycles are serviced and inspected every two weeks, and riders can report a fault directly through the app, which temporarily locks the affected bike until a technician has examined it. The scheme currently operates from 6am to midnight daily, with docking stations locked outside these hours.",
      },
      { label: "Text 2 — Five Café Reviews", text: "" },
      {
        label: "Riverside Café",
        text: "A relaxed spot right on the water with the best view in town, though service can be painfully slow on weekend mornings when it gets busy. The carrot cake alone is worth the wait.",
      },
      {
        label: "The Bookshop Café",
        text: "Tucked inside a secondhand bookshop, this tiny café only has four tables, so arrive early if you want a seat. Staff are happy to let you browse the shelves with your coffee, and there's no pressure to rush.",
      },
      {
        label: "Marlow's",
        text: "A no-nonsense breakfast café popular with tradespeople starting an early shift. Prices are the lowest in the area, but don't expect much beyond the basics — there's no decaf option and the menu rarely changes.",
      },
      {
        label: "Green Leaf Kitchen",
        text: "Entirely plant-based and proud of it, with a menu that changes weekly depending on what's in season locally. It's slightly more expensive than most cafés nearby, but portions are generous.",
      },
      {
        label: "The Corner Table",
        text: "A family-run café that's been open for over twenty years, known for remembering regular customers' usual orders. Wi-fi is free but notoriously unreliable, so it's not the best choice if you need to work.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "A day pass allows unlimited 30-minute rides for a full 24 hours.",
        correctAnswer: "TRUE",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Riders are provided with a free helmet when they unlock a bicycle.",
        correctAnswer: "FALSE",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "A 15-year-old can register for membership without any adult involvement.",
        correctAnswer: "FALSE",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Annual members pay less per ride than day-pass users for rides under 30 minutes.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How often are the bicycles serviced and inspected?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "every two weeks",
        acceptableAnswers: ["every two weeks", "two weeks"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time do the docking stations lock each night?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "midnight",
        acceptableAnswers: ["midnight", "12am", "12 am"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café is best avoided if you need a reliable internet connection.",
        correctAnswer: "E",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café has very limited seating.",
        correctAnswer: "B",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café offers the cheapest prices but a very limited menu.",
        correctAnswer: "C",
      },
      {
        id: "q10",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café changes its menu regularly based on local, seasonal ingredients.",
        correctAnswer: "D",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 7-10: Match each statement with the correct café, A-E.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Riverside Café" },
          { key: "B", text: "The Bookshop Café" },
          { key: "C", text: "Marlow's" },
          { key: "D", text: "Green Leaf Kitchen" },
          { key: "E", text: "The Corner Table" },
        ],
      },
    ],
  },
  {
    id: "rp-08",
    title: "Workplace Advice: Feedback and Resigning",
    part: 2,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Giving Effective Feedback to Colleagues", text: "" },
      {
        label: "A",
        text: "Giving feedback to a colleague is rarely comfortable, but avoiding it altogether tends to cause bigger problems later. Managers who delay addressing a recurring issue often find that by the time they finally raise it, the employee is blindsided, having had no earlier indication that anything was wrong.",
      },
      {
        label: "B",
        text: "The most useful feedback is specific rather than general. Telling someone their report 'needs more detail' gives them very little to act on, whereas pointing to the exact section that was unclear, and explaining what information was missing, gives them something concrete to fix next time.",
      },
      {
        label: "C",
        text: "Timing matters almost as much as content. Feedback delivered immediately after an incident, while it is still fresh for both parties, is generally far more useful than feedback saved up and delivered weeks later in a formal review, by which point the details have faded and the employee may struggle to recall the specific example being referenced.",
      },
      {
        label: "D",
        text: "Finally, feedback works best as a two-way conversation rather than a one-way instruction. Asking an employee how they think something went, before offering your own view, often surfaces useful context the manager wasn't aware of, and makes the employee considerably more receptive to whatever comes next.",
      },
      { label: "Text 2 — How to Resign Professionally", text: "" },
      {
        label: "E",
        text: "Handing in a resignation is rarely simple, but a few basic courtesies make the process smoother for everyone involved. The first rule is to inform your direct manager before telling colleagues, however close you may be to them — hearing the news secondhand can understandably damage trust, even if no harm was intended.",
      },
      {
        label: "F",
        text: "Most contracts specify a minimum notice period, typically between two and four weeks for most roles, though senior positions sometimes require considerably longer. Offering to help identify and train a replacement during this period, even if not strictly required, is widely regarded as good practice.",
      },
      {
        label: "G",
        text: "A resignation letter should remain brief and professional regardless of the actual circumstances behind the decision. Even where there are genuine grievances, a resignation letter is not the appropriate place to air them; a private conversation, or a separate formal complaint if warranted, is a more suitable channel.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "How an employee tends to feel when a recurring problem is only raised much later",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "blindsided",
        acceptableAnswers: ["blindsided"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "The kind of example useful feedback should point to, rather than a vague generalisation",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "specific",
        acceptableAnswers: ["specific"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "The type of review where delayed feedback is often saved up for",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "formal",
        acceptableAnswers: ["formal"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "How asking for an employee's own view first tends to make them feel about what comes next",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "receptive",
        acceptableAnswers: ["receptive"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "Who should you inform before telling your colleagues that you are resigning?",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "direct manager",
        acceptableAnswers: ["direct manager", "manager", "your manager"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "Most notice periods last between two and how many weeks?",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "four",
        acceptableAnswers: ["four", "4"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What tone should a resignation letter keep regardless of the circumstances, alongside being brief?",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "professional",
        acceptableAnswers: ["professional"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        layout: "summary",
        instructions: "Questions 1-4: Complete the notes below. Use ONE WORD ONLY from the passage for each answer.",
        template: [
          { text: "Delaying feedback about a recurring problem often leaves the employee feeling " },
          { blank: "q1" },
          { text: " once it is finally raised. Useful feedback should point to a " },
          { blank: "q2" },
          { text: " example rather than a vague generalisation. Feedback given immediately after an event is more effective than feedback saved for a " },
          { blank: "q3" },
          { text: " review. Asking for the employee's own view first tends to make them more " },
          { blank: "q4" },
          { text: " to what the manager says next." },
        ],
      },
    ],
  },
  {
    id: "rp-09",
    title: "The Unlikely Return of the Vinyl Record",
    part: 3,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 25,
    paragraphs: [
      {
        label: "A",
        text: "For much of the 2000s, the vinyl record looked like a format with no future: sales had collapsed for two decades straight, pressing plants closed one after another, and most music retailers had long since cleared their shelves of anything that needed a turntable to play. Yet over the past fifteen years, vinyl sales have climbed every single year, even as streaming has become by far the dominant way most people actually listen to music — a pairing that, on the surface, makes very little sense.",
      },
      {
        label: "B",
        text: "Part of the explanation is that buying vinyl was never really about convenience in the first place. Fans describe a kind of ritual that streaming cannot replicate: choosing a record, placing it on the turntable, reading the sleeve notes while a side plays through from start to finish, rather than skipping between tracks on a phone. For many buyers, this amounts to a form of intentional listening, a deliberate contrast to the endless, half-attentive background streaming that fills most of a typical day.",
      },
      {
        label: "C",
        text: "Whatever the reasons behind the demand, supply has struggled to keep up with it. Vinyl pressing requires specialised machinery that is expensive to build and slow to operate, and only a small number of pressing plants remain in operation worldwide, many of them running equipment that is decades old. As a result, newer or smaller artists sometimes wait the better part of a year between finishing an album and actually receiving physical copies, well behind the major labels who can pay to secure priority slots.",
      },
      {
        label: "D",
        text: "None of this makes vinyl cheap to produce. Physical records must be manufactured, packaged and shipped, unlike a digital file that can simply be uploaded, and the raw materials involved have themselves become more expensive in recent years. Record labels nevertheless continue to profit handsomely, because collectors are consistently willing to pay a premium price for a physical object they can display and hold, in a way they plainly are not for a digital stream.",
      },
      {
        label: "E",
        text: "Looking ahead, industry figures remain cautiously optimistic rather than triumphant. Many are old enough to remember the format's collapse the first time around, and are reluctant to expand production capacity too aggressively in case demand eventually cools again. Encouragingly for the format's longevity, a significant share of new buyers are young listeners introduced to vinyl by older family members, or who deliberately seek it out as a conscious break from constant digital listening — suggesting the current revival may rest on firmer ground than pure nostalgia.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph A",
        correctAnswer: "ii",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph B",
        correctAnswer: "iii",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph C",
        correctAnswer: "i",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph D",
        correctAnswer: "v",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Paragraph E",
        correctAnswer: "vii",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph B, why do many people choose to buy vinyl despite the convenience of streaming?",
        options: [
          { key: "A", text: "They believe vinyl offers noticeably better sound quality" },
          { key: "B", text: "It is usually cheaper than a streaming subscription over time" },
          { key: "C", text: "It encourages a slower, more deliberate way of listening" },
          { key: "D", text: "Streaming services do not offer the albums they want" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph C, what is the main factor limiting the growth of vinyl production?",
        options: [
          { key: "A", text: "A shortage of raw materials used in pressing records" },
          { key: "B", text: "A lack of demand from smaller and newer artists" },
          { key: "C", text: "A limited number of ageing pressing plants worldwide" },
          { key: "D", text: "Major labels refusing to allow new pressing plants to open" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "How producing a vinyl record compares with distributing music digitally",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "more expensive",
        acceptableAnswers: ["more expensive", "expensive"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "The kind of price collectors are willing to pay for a physical record",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "premium",
        acceptableAnswers: ["premium"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What industry figures are cautious about expanding too quickly",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "production",
        acceptableAnswers: ["production"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "Who many young vinyl buyers are introduced to the format by",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "family members",
        acceptableAnswers: ["family members", "older family members"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 1-5: The passage has five paragraphs, A-E. Choose the correct heading for each paragraph from the list of headings below. Each heading may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "i", text: "A production bottleneck that has not kept pace with renewed interest" },
          { key: "ii", text: "From decline to unexpected revival" },
          { key: "iii", text: "A ritual that streaming cannot replicate" },
          { key: "iv", text: "The environmental cost of physical formats" },
          { key: "v", text: "Why collectors are willing to pay a premium despite the costs" },
          { key: "vi", text: "A format destined to disappear within a decade" },
          { key: "vii", text: "A cautiously optimistic outlook shaped by past mistakes" },
        ],
      },
      {
        id: "g2",
        layout: "summary",
        instructions: "Questions 8-11: Complete the summary below. Use NO MORE THAN TWO WORDS from the passage for each answer.",
        template: [
          { text: "Producing a vinyl record remains considerably " },
          { blank: "q8" },
          { text: " than distributing music digitally, since records must be physically manufactured, packaged and shipped. Despite this, record labels continue to profit because collectors are willing to pay a " },
          { blank: "q9" },
          { text: " price for a physical product. Industry figures remain cautious about expanding " },
          { blank: "q10" },
          { text: " capacity too quickly, having been affected by over-investment once before. Many new vinyl buyers are introduced to the format by older " },
          { blank: "q11" },
          { text: "." },
        ],
      },
    ],
  },
  {
    id: "rp-10",
    title: "Campsites and Community News",
    part: 1,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Five Campsite Descriptions", text: "" },
      {
        label: "Pinewood Camp",
        text: "Set deep in forest, Pinewood is popular with families thanks to its large adventure playground and shallow paddling stream. Pitches are generously spaced, though the nearest shop is a fifteen-minute walk away.",
      },
      {
        label: "Meadow View",
        text: "A small, quiet site with just twelve pitches, ideal for those wanting to escape noise entirely — no music or generators are permitted after 8pm. There's no shop on site, but a farm gate sells fresh eggs and vegetables.",
      },
      {
        label: "Harbourside",
        text: "Right next to the working harbour, this site is popular with anglers and early risers who enjoy watching the fishing boats return each morning. Pitches close to the water can get busy with foot traffic during the day.",
      },
      {
        label: "Oakridge Farm",
        text: "A working farm that welcomes campers alongside its livestock, Oakridge is a favourite for children keen to help feed the animals each morning. The ground can get muddy after rain, so sturdy footwear is recommended.",
      },
      {
        label: "Sunnyfields",
        text: "The largest site on this list, Sunnyfields has a heated outdoor pool, an on-site shop, and a café serving breakfast until eleven. It's also the only site here that accepts late check-in after 10pm.",
      },
      { label: "Text 2 — Woodbridge Residents' Association: Autumn Newsletter", text: "" },
      {
        label: "A",
        text: "The planning committee has approved an extension to the Pinewood Camp site, adding twenty new pitches ahead of next summer. Residents raised concerns about increased traffic during the consultation period, and the council has agreed to review parking restrictions on Mill Lane before work begins.",
      },
      {
        label: "B",
        text: "Kerbside recycling collection will move from fortnightly to weekly starting in November, following a successful trial earlier this year. Garden waste collection, however, will remain fortnightly throughout the winter months, resuming its summer schedule next April.",
      },
      {
        label: "C",
        text: "The annual harvest festival will take place on the village green on the second Saturday of October, weather permitting. Stalls are free for local residents this year, a change from previous years when a small fee applied.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This site offers the chance for children to help care for farm animals.",
        correctAnswer: "D",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This site does not allow noise after a certain time in the evening.",
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This site is the only one offering a heated swimming pool.",
        correctAnswer: "E",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This site is well suited to people who enjoy watching boats.",
        correctAnswer: "C",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The council will review parking restrictions on Mill Lane before the Pinewood Camp extension begins.",
        correctAnswer: "TRUE",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Garden waste collection will switch to a weekly schedule starting in November.",
        correctAnswer: "FALSE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Stall fees at the harvest festival have been removed for local residents this year.",
        correctAnswer: "TRUE",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The harvest festival has been held on the village green every year for the past decade.",
        correctAnswer: "NOT GIVEN",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many new pitches will be added to Pinewood Camp?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "twenty",
        acceptableAnswers: ["twenty", "20"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "On what day of the week will the harvest festival be held?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Saturday",
        acceptableAnswers: ["Saturday"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 1-4: Match each statement with the correct campsite, A-E.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Pinewood Camp" },
          { key: "B", text: "Meadow View" },
          { key: "C", text: "Harbourside" },
          { key: "D", text: "Oakridge Farm" },
          { key: "E", text: "Sunnyfields" },
        ],
      },
    ],
  },
  {
    id: "rp-11",
    title: "Working in Care: Routines and Balance",
    part: 2,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — A Typical Day for a Home Care Worker", text: "" },
      {
        label: "A",
        text: "Most home care workers begin their shift by reviewing each client's care plan, checking for any updates since their previous visit. This typically takes place at the office or, for workers starting directly from home, via a secure app on their phone.",
      },
      {
        label: "B",
        text: "The first home visit of the day usually focuses on helping clients get washed and dressed, along with preparing a simple breakfast if needed. Workers are generally allocated a fixed time slot per visit, often thirty minutes, though this can run over for clients who need extra support that day.",
      },
      {
        label: "C",
        text: "Midway through the day, most workers take a short break before continuing to afternoon visits, which often involve preparing lunch, administering prescribed medication at the correct times, and completing light household tasks such as laundry.",
      },
      {
        label: "D",
        text: "At the end of each visit, workers record detailed notes on what was done and observed, which are later reviewed by a supervisor. Any concerns about a client's health or wellbeing must be reported immediately rather than left until the end of the shift.",
      },
      { label: "Text 2 — Work-Life Balance in Caring Professions", text: "" },
      {
        label: "E",
        text: "Workers in caring professions, including home care and nursing, report some of the highest rates of work-related exhaustion of any occupation, often attributed to the emotionally demanding nature of the work combined with physically taxing schedules.",
      },
      {
        label: "F",
        text: "Experts recommend that care workers build in genuinely protected time away from work, rather than simply reducing hours on paper, since many continue to think about clients' wellbeing even during time off. Employers who actively encourage staff to switch off, rather than merely permitting it, tend to see lower turnover.",
      },
      {
        label: "G",
        text: "Peer support groups, where workers can discuss difficult cases with colleagues who understand the specific pressures of the role, have also been shown to reduce burnout significantly compared with generic wellness programmes not tailored to the profession.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What workers review at the start of a shift for each client",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "plan",
        acceptableAnswers: ["plan", "care plan"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What the first visit of the day typically focuses on helping a client get, besides washed",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "dressed",
        acceptableAnswers: ["dressed"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What workers often administer at the correct times during afternoon visits",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "medication",
        acceptableAnswers: ["medication"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What workers must record at the end of every visit",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "notes",
        acceptableAnswers: ["notes"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What do experts recommend care workers build into their time away from work, not just reduced hours?",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "protected time",
        acceptableAnswers: ["protected time", "genuinely protected time"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What tends to be lower at workplaces that actively encourage staff to switch off?",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "turnover",
        acceptableAnswers: ["turnover", "staff turnover"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What type of group has been shown to reduce burnout more than generic wellness programmes?",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "peer support",
        acceptableAnswers: ["peer support", "peer support groups"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        layout: "summary",
        instructions: "Questions 1-4: Complete the notes below describing a home care worker's typical day. Use ONE WORD ONLY from the passage for each answer.",
        template: [
          { text: "The day usually begins with reviewing each client's care " },
          { blank: "q1" },
          { text: ". The first visit of the day typically focuses on helping a client get washed and " },
          { blank: "q2" },
          { text: ". In the afternoon, workers often administer " },
          { blank: "q3" },
          { text: " at the correct times. At the end of every visit, workers must record detailed " },
          { blank: "q4" },
          { text: " on what was done." },
        ],
      },
    ],
  },
  {
    id: "rp-12",
    title: "Can a Walking Bus Get More Children Moving?",
    part: 3,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 25,
    paragraphs: [
      {
        label: "A",
        text: "Across much of the developed world, rates of childhood physical activity have been falling for decades, with many children now travelling to school by car for even relatively short distances. One response gaining traction in several countries is the 'walking bus' — a supervised group of children who walk a fixed route to school together, picking up additional children at designated stops along the way, much like a conventional bus route but entirely on foot.",
      },
      {
        label: "B",
        text: "'The activity gain is more significant than people often assume,' says Dr. Elena Ruiz, a public health researcher who has studied walking bus schemes in several cities. 'Children who join a walking bus typically accumulate an extra fifteen to twenty minutes of moderate exercise each school day, which adds up considerably over a full school year, and we've recorded measurable improvements in resting heart rate among regular participants.'",
      },
      {
        label: "C",
        text: "Not every school has found the scheme straightforward to introduce, however. 'The biggest challenge isn't persuading children to take part — it's finding enough parent volunteers willing to supervise a route every single morning,' explains David Okafor, headteacher at a primary school that introduced a walking bus two years ago. 'We eventually solved it by rotating responsibility across a larger pool of parents, so no single family is committed every day.'",
      },
      {
        label: "D",
        text: "For Sarah Whitfield, a parent volunteer who helps supervise one route three mornings a week, the appeal extends well beyond exercise. 'It's become a genuine community fixture,' she says. 'The children know each other far better than they would walking to school separately with their own parents, and honestly, so do the parents.'",
      },
      {
        label: "E",
        text: "Despite this enthusiasm, researchers caution against treating the walking bus as a complete solution to childhood inactivity. Schemes depend heavily on sustained volunteer availability and tend to work best in areas where most families already live within a reasonably walkable distance of the school, limiting how widely they can be applied. Even so, with volunteer numbers at participating schools reportedly holding steady or growing since introduction, the model appears to be, at minimum, a genuinely durable addition to efforts to get children moving.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to Dr. Ruiz in paragraph B, what has been recorded among regular walking bus participants?",
        options: [
          { key: "A", text: "Improved exam results" },
          { key: "B", text: "Measurable improvements in resting heart rate" },
          { key: "C", text: "Reduced school absences" },
          { key: "D", text: "Fewer road traffic incidents" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph C, what was the biggest challenge David Okafor's school faced in introducing the scheme?",
        options: [
          { key: "A", text: "Convincing children to take part" },
          { key: "B", text: "Finding enough parent volunteers" },
          { key: "C", text: "Funding the programme" },
          { key: "D", text: "Choosing a safe route" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Believes the scheme has become an important part of community life beyond its exercise benefits",
        correctAnswer: "C",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Solved a volunteer shortage by spreading responsibility across more families",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Has recorded measurable health improvements among children who regularly participate",
        correctAnswer: "A",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "The type of exercise children gain an extra fifteen to twenty minutes of each school day",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "moderate exercise",
        acceptableAnswers: ["moderate exercise", "moderate"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What is usually in short supply when a school tries to introduce the scheme",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "volunteers",
        acceptableAnswers: ["volunteers", "parent volunteers"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "The kind of distance from school an area needs for the scheme to work best",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "walkable",
        acceptableAnswers: ["walkable", "reasonably walkable"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which of the following would be the most suitable title for this passage?",
        options: [
          { key: "A", text: "The Decline of Childhood Fitness: A Global Crisis" },
          { key: "B", text: "Walking Buses: A Promising but Limited Solution to Inactive Commutes" },
          { key: "C", text: "Why Parents Are Abandoning the School Run" },
          { key: "D", text: "The Science Behind Children's Heart Health" },
        ],
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-5: Look at the following statements and the list of people below. Match each statement with the correct person, A-C.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Dr. Elena Ruiz" },
          { key: "B", text: "David Okafor" },
          { key: "C", text: "Sarah Whitfield" },
        ],
      },
      {
        id: "g2",
        layout: "summary",
        instructions: "Questions 6-8: Complete the summary below. Use NO MORE THAN TWO WORDS from the passage for each answer.",
        template: [
          { text: "Children who take part in a walking bus typically gain an extra fifteen to twenty minutes of " },
          { blank: "q6" },
          { text: " each school day. The main obstacle to introducing the scheme is usually a shortage of " },
          { blank: "q7" },
          { text: ". Researchers note that the approach works best in areas that are already reasonably " },
          { blank: "q8" },
          { text: " to the school." },
        ],
      },
    ],
  },
  {
    id: "rp-13",
    title: "Reviews and Local Events",
    part: 1,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Five Film Reviews", text: "" },
      {
        label: "Silver Horizon",
        text: "A slow-burning drama that rewards patience, though the pacing in the middle act will test even dedicated fans of the genre. The central performance is extraordinary, carrying scenes that would otherwise drag.",
      },
      {
        label: "Midnight Run",
        text: "A relentlessly paced action thriller that rarely lets up for breath, though some viewers may find the plot sacrifices coherence for spectacle in its final act. Worth seeing on the biggest screen possible.",
      },
      {
        label: "Paper Lanterns",
        text: "An animated family film that manages to appeal to adults just as much as children, thanks to a genuinely clever script that rewards repeat viewings. The visual style is unlike anything else released this year.",
      },
      {
        label: "Low Tide",
        text: "A modest, low-budget mystery that punches well above its weight, driven almost entirely by sharp dialogue rather than visual spectacle. The twist ending has divided audiences sharply.",
      },
      {
        label: "Fault Lines",
        text: "A documentary examining a decades-old legal case, assembled almost entirely from archive footage with no narration at all, letting the material speak for itself. Essential viewing, if occasionally difficult to sit through.",
      },
      { label: "Text 2 — Four Local Sports Events", text: "" },
      {
        label: "Coastal Marathon",
        text: "Join thousands of runners along our scenic coastal route this spring. Early registration closes March 1st, with discounted entry fees available for groups of five or more runners.",
      },
      {
        label: "Summit Cycling Challenge",
        text: "A gruelling but spectacular mountain route for experienced cyclists only — this is not suitable for beginners. All entrants must submit proof of a completed 50km ride within the last six months.",
      },
      {
        label: "City Fun Run",
        text: "A relaxed, family-friendly 5km route through the city centre, suitable for all ages and fitness levels, including those pushing prams or using wheelchairs. No prior registration needed — just turn up on the day.",
      },
      {
        label: "River Triathlon",
        text: "Combining swimming, cycling and running along the river valley, this event is open to both individual entrants and relay teams of three. Wetsuits are compulsory for the swimming leg regardless of water temperature.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This film's ending has received a mixed reaction from viewers.",
        correctAnswer: "D",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This film contains no narration at all.",
        correctAnswer: "E",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This film is recommended to be watched in a cinema rather than at home.",
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This film appeals to both children and adult viewers.",
        correctAnswer: "C",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g2",
        prompt: "This event does not require participants to register in advance.",
        correctAnswer: "C",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g2",
        prompt: "This event requires entrants to prove recent physical preparation.",
        correctAnswer: "B",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g2",
        prompt: "This event can be entered either individually or as part of a team.",
        correctAnswer: "D",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g2",
        prompt: "This event offers a reduced entry cost for larger groups.",
        correctAnswer: "A",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By what date does early registration close for the Coastal Marathon?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "March 1st",
        acceptableAnswers: ["March 1st", "March 1", "1st March"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is compulsory for the swimming leg of the River Triathlon regardless of water temperature?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "wetsuits",
        acceptableAnswers: ["wetsuits", "a wetsuit", "wetsuit"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 1-4: Match each statement with the correct film, A-E.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Silver Horizon" },
          { key: "B", text: "Midnight Run" },
          { key: "C", text: "Paper Lanterns" },
          { key: "D", text: "Low Tide" },
          { key: "E", text: "Fault Lines" },
        ],
      },
      {
        id: "g2",
        instructions: "Questions 5-8: Match each statement with the correct event, A-D.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Coastal Marathon" },
          { key: "B", text: "Summit Cycling Challenge" },
          { key: "C", text: "City Fun Run" },
          { key: "D", text: "River Triathlon" },
        ],
      },
    ],
  },
  {
    id: "rp-14",
    title: "Redundancy Advice and Workplace Notices",
    part: 2,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — What to Do If You're Made Redundant", text: "" },
      {
        label: "A",
        text: "Being told your position is redundant can feel sudden even when the warning signs were there, and it's worth taking a day or two before making any major decisions, rather than reacting immediately out of shock or anger.",
      },
      {
        label: "B",
        text: "Check your contract and any staff handbook carefully for the exact notice period and redundancy payment you're entitled to, since these figures are sometimes calculated differently from what colleagues assume or what is commonly believed.",
      },
      {
        label: "C",
        text: "Register with the relevant government employment service as early as possible, even if you expect to find new work quickly, since processing times for any benefits you may be entitled to can take several weeks.",
      },
      {
        label: "D",
        text: "Update your professional profile and reach out to former colleagues and contacts well before you expect to need them, rather than waiting until finances become a pressing concern.",
      },
      { label: "Text 2 — Kitchen Staff Dress Code", text: "" },
      {
        label: "E",
        text: "All kitchen staff must wear the provided chef's whites at all times while on shift, laundered fresh for every shift rather than reused from the previous day. Aprons must be removed before entering the staff rest area to avoid cross-contamination.",
      },
      {
        label: "F",
        text: "Closed, non-slip footwear is mandatory in all kitchen areas; trainers and open-toed shoes are not permitted under any circumstances, regardless of how brief the task. Long hair must be tied back and fully contained under a hat or hairnet.",
      },
      {
        label: "G",
        text: "Jewellery, including rings and wristwatches, must be removed before any food preparation begins, with the sole exception of a plain wedding band. Any visible cuts or wounds on hands or arms must be covered with a blue, food-safe plaster.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "How long it's advised to wait before making major decisions after redundancy",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "two",
        acceptableAnswers: ["two", "2"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What type of period to check your contract for, besides the redundancy payment",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "notice",
        acceptableAnswers: ["notice"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What kind of times can take several weeks for employment-service benefits",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "processing",
        acceptableAnswers: ["processing"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g1",
        prompt: "What should become a pressing concern only after your profile is already updated",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "finances",
        acceptableAnswers: ["finances"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What must be removed before entering the staff rest area?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "aprons",
        acceptableAnswers: ["aprons", "apron"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What type of footwear is mandatory in all kitchen areas?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "non-slip footwear",
        acceptableAnswers: ["non-slip footwear", "closed, non-slip footwear", "closed non-slip footwear"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        prompt: "What colour must a plaster be if covering a visible cut on the hands or arms?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "blue",
        acceptableAnswers: ["blue"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        layout: "summary",
        instructions: "Questions 1-4: Complete the notes below. Use ONE WORD ONLY from the passage for each answer.",
        template: [
          { text: "Before making major decisions after redundancy, it is advised to wait a day or " },
          { blank: "q1" },
          { text: " rather than react immediately. It is important to check your contract for the exact " },
          { blank: "q2" },
          { text: " period and redundancy payment owed. Registering with the employment service early is recommended because " },
          { blank: "q3" },
          { text: " times can take several weeks. Updating your professional profile should happen well before " },
          { blank: "q4" },
          { text: " become a pressing concern." },
        ],
      },
    ],
  },
  {
    id: "rp-15",
    title: "What Dental Plaque Reveals About Medieval Women's Lives",
    part: 3,
    track: "general_training",
    isNew: false,
    estimatedMinutes: 25,
    paragraphs: [
      {
        label: "A",
        text: "Archaeologists have increasingly turned to an unlikely source of evidence about the past: dental calculus, the hardened plaque that builds up on teeth during a person's lifetime. Because it forms in layers and is rarely fully cleaned away by ancient dental hygiene, calculus can trap microscopic particles from a person's diet, environment and daily activities, preserving them for centuries after the rest of the body has decayed — a particularly valuable source for groups, such as women, whose lives are often under-documented in written historical records.",
      },
      {
        label: "B",
        text: "One widely discussed finding came from the burial of a woman at a medieval site, where researchers analysing her dental calculus discovered flecks of a rare and expensive blue pigment derived from lapis lazuli, known as ultramarine. At the time, the production of illuminated manuscripts — religious texts decorated with elaborate painted illustrations — was generally assumed to have been dominated almost entirely by monks and other male scribes working in monastery workshops.",
      },
      {
        label: "C",
        text: "The most likely explanation for how the pigment ended up embedded in her teeth is that she was in the habit of shaping the tip of a fine paintbrush with her lips and tongue while working, a common technique among manuscript painters of the period. This provided direct physical evidence that women were personally involved in producing illuminated manuscripts, not merely assumed to be absent from a craft long associated almost exclusively with men.",
      },
      {
        label: "D",
        text: "Beyond this one discovery, dental calculus analysis is increasingly being applied more broadly, to reconstruct ancient diets, identify occupational hazards such as fibres from textile workers who habitually held thread in their teeth, and infer aspects of social status from the specific foods detected. Researchers note that calculus preserves certain microscopic particles that no other part of a skeleton retains, making it a genuinely distinct evidence source rather than simply a supplement to existing techniques.",
      },
      {
        label: "E",
        text: "The method is not without limitations. Dental calculus does not survive equally well at every excavation site, and the small sample sizes available from any single burial currently limit how confidently findings can be generalised to a wider population. Even so, as the technique is applied at a growing number of excavation sites, researchers remain optimistic that it will keep uncovering physical evidence of lives that documentary history alone has largely failed to record.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph B, what had researchers originally assumed about producing illuminated manuscripts?",
        options: [
          { key: "A", text: "It was exclusively done by women" },
          { key: "B", text: "It was dominated by men, often monks" },
          { key: "C", text: "It required no specialised training" },
          { key: "D", text: "It was a minor, low-status task" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph C, how is the pigment thought to have entered the woman's dental calculus?",
        options: [
          { key: "A", text: "She accidentally inhaled pigment dust" },
          { key: "B", text: "She used her mouth to shape a paintbrush tip" },
          { key: "C", text: "She was buried with painting materials" },
          { key: "D", text: "The pigment was part of a burial ritual" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a mention of what makes dental calculus a uniquely useful source of evidence compared to the rest of a skeleton",
        correctAnswer: "D",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a description of the specific discovery that changed assumptions about who created illuminated manuscripts",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "a mention of a limitation facing this research method",
        correctAnswer: "E",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What dental calculus can preserve that were trapped during a person's lifetime",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "microscopic particles",
        acceptableAnswers: ["microscopic particles", "particles"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What the woman was likely doing with a paintbrush that transferred pigment to her teeth",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "shaping",
        acceptableAnswers: ["shaping", "shaping the tip"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What kind of sizes currently limit how broadly the findings can be generalised",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "sample sizes",
        acceptableAnswers: ["sample sizes", "small sample sizes"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-5: The passage has five paragraphs, A-E. Which paragraph contains the following information? Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "" },
          { key: "B", text: "" },
          { key: "C", text: "" },
          { key: "D", text: "" },
          { key: "E", text: "" },
        ],
      },
      {
        id: "g2",
        layout: "summary",
        instructions: "Questions 6-8: Complete the summary below. Use NO MORE THAN TWO WORDS from the passage for each answer.",
        template: [
          { text: "Dental calculus can preserve microscopic " },
          { blank: "q6" },
          { text: " trapped in it during a person's lifetime. The pigment found in the woman's dental calculus was likely transferred there by " },
          { blank: "q7" },
          { text: " a paintbrush. Researchers caution that small " },
          { blank: "q8" },
          { text: " currently limit how broadly the findings can be generalised." },
        ],
      },
    ],
  },
  {
    id: "rp-16",
    title: "Cafés and Town News",
    part: 1,
    track: "general_training",
    isNew: true,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Six Café Reviews", text: "" },
      { label: "Brew & Bean", text: "Exceptional specialty coffee, roasted on site, though the wifi is painfully slow and often drops out entirely during busy periods." },
      { label: "The Garden Table", text: "A relaxed café built around a plant-filled outdoor garden seating area, and one of the few places in town that genuinely welcomes dogs at every table." },
      { label: "Northside Diner", text: "Generous, hearty portions and an all-day breakfast menu, though it doesn't take reservations, so expect to queue at weekends." },
      { label: "Velvet Cup", text: "A calm, quiet space with reliable fast wifi, popular with people working on laptops for hours at a time without being rushed to leave." },
      { label: "Harbor Café", text: "Unbeatable views across the harbour make this a favourite with visitors, though it can get extremely crowded on sunny afternoons." },
      { label: "The Daily Grind", text: "A no-frills spot aimed squarely at commuters — quick service, reliably cheap prices, and a counter rather than table service." },
      { label: "Text 2 — Elmbridge Town Council: Proposed Riverside Redevelopment", text: "" },
      {
        label: "A",
        text: "The council has published plans for a major redevelopment of the riverside area, including a new public library, expanded green space, and improved flood defences. The project is expected to take three years to complete, with construction beginning next spring pending final approval.",
      },
      {
        label: "B",
        text: "A public consultation period will run for six weeks from the date of publication, during which residents can submit feedback either online or in person at the town hall. The council has stated that feedback received after the consultation closes will not be considered.",
      },
      {
        label: "C",
        text: "Funding for the project will come primarily from a national infrastructure grant, with the council contributing an additional ten percent from local reserves. No increase to council tax is planned as a direct result of this project.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café is especially suitable for people who want to work on a laptop.",
        correctAnswer: "D",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café allows dogs.",
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café is known for large food portions.",
        correctAnswer: "C",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café can become very busy because of its view.",
        correctAnswer: "E",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "This café is recommended for commuters wanting a quick, affordable coffee.",
        correctAnswer: "F",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Construction is expected to begin before final approval is granted.",
        correctAnswer: "FALSE",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Feedback submitted after the consultation period closes will still be considered.",
        correctAnswer: "FALSE",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The majority of funding will come from a national infrastructure grant.",
        correctAnswer: "TRUE",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Council tax will increase as a direct result of this project.",
        correctAnswer: "FALSE",
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How long will the public consultation period run for?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "six weeks",
        acceptableAnswers: ["six weeks", "6 weeks"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 1-5: Match each statement with the correct café, A-F.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Brew & Bean" },
          { key: "B", text: "The Garden Table" },
          { key: "C", text: "Northside Diner" },
          { key: "D", text: "Velvet Cup" },
          { key: "E", text: "Harbor Café" },
          { key: "F", text: "The Daily Grind" },
        ],
      },
    ],
  },
  {
    id: "rp-17",
    title: "Starting at Brightfield Training Institute",
    part: 2,
    track: "general_training",
    isNew: true,
    estimatedMinutes: 20,
    paragraphs: [
      { label: "Text 1 — Welcome to Brightfield Training Institute: Orientation Booklet", text: "" },
      {
        label: "A",
        text: "All new students must complete the online induction module before attending their first in-person class; login details are sent by email one week before term begins. Students who have not completed the induction module will not be permitted to attend the first week of classes.",
      },
      {
        label: "B",
        text: "The library is open from eight in the morning until ten at night on weekdays, and from ten until four on weekends. Students can borrow up to eight books at a time for a three-week loan period, renewable once if no one else has requested the item.",
      },
      {
        label: "C",
        text: "Attendance is monitored electronically via ID card swipe at the start of each session. Students with attendance below eighty-five percent in any module risk being withdrawn from their course without a refund.",
      },
      { label: "Text 2 — Hardship Scholarship: Eligibility Notice", text: "" },
      {
        label: "D",
        text: "The Hardship Scholarship covers up to fifty percent of tuition fees for students facing significant financial difficulty. Applicants must have completed at least one full term at the institute before applying, and must demonstrate a minimum attendance record of ninety percent in that term.",
      },
      {
        label: "E",
        text: "Applications must be submitted with supporting financial documentation no later than the fifteenth of each month to be considered for that month's funding round. Incomplete applications will automatically be carried over to the following month's round rather than rejected outright.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Students must complete the online induction module before their first in-person class.",
        correctAnswer: "TRUE",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "The library is open for the same hours on weekdays and weekends.",
        correctAnswer: "FALSE",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Students can renew a borrowed book an unlimited number of times.",
        correctAnswer: "FALSE",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.TRUE_FALSE_NOT_GIVEN,
        prompt: "Attendance below eighty-five percent in a module could result in withdrawal from the course.",
        correctAnswer: "TRUE",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What percentage of tuition fees can the Hardship Scholarship cover at most?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "50 percent",
        acceptableAnswers: ["50 percent", "50%", "fifty percent"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What minimum attendance record must applicants demonstrate?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "90 percent",
        acceptableAnswers: ["90 percent", "90%", "ninety percent"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By what date each month must applications be submitted?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the fifteenth",
        acceptableAnswers: ["the fifteenth", "15th", "the 15th"],
      },
    ],
  },
  {
    id: "rp-18",
    title: "Letting the Land Go Wild: The Rise of Farm Rewilding",
    part: 3,
    track: "general_training",
    isNew: true,
    estimatedMinutes: 25,
    paragraphs: [
      {
        label: "A",
        text: "Across the countryside, a small but growing number of farmers are choosing to stop farming part or all of their land, allowing it instead to revert to a wilder, less managed state — a practice generally known as rewilding. Once a marginal idea, it has moved steadily closer to the agricultural mainstream over the past decade, driven by a mix of economic and environmental pressures.",
      },
      {
        label: "B",
        text: "'It genuinely wasn't a sentimental decision for me,' says James Caldwell, who converted sixty hectares of his family's farm to rewilding three years ago. 'The subsidy schemes that used to make conventional farming on that particular land viable are being phased out, but there's now proper funding available for landowners who restore habitat instead. For that part of the farm, rewilding is simply the better financial option now.'",
      },
      {
        label: "C",
        text: "Dr. Priya Nair, an ecologist who has monitored several rewilded sites, says the speed of ecological recovery has surprised even specialists in the field. 'We've recorded wildflower species returning within a single growing season on some sites, and ground-nesting birds establishing territories within two to three years — considerably faster than most of the models predicted before these projects began.'",
      },
      {
        label: "D",
        text: "Not every neighbouring landowner shares the enthusiasm, however. Robert Hale, who farms an adjoining plot, worries about knock-on effects. 'My concern isn't really about what they do with their own land,' he says, 'it's that wild areas can become a source of pests and weed seeds that then spread onto actively farmed land nearby, and there's currently no requirement for rewilded sites to manage that risk.'",
      },
      {
        label: "E",
        text: "Government policy has begun shifting in response to this growing trend, with several new grant schemes specifically rewarding habitat restoration rather than food production on marginal land. Researchers studying the broader movement remain cautiously optimistic, while acknowledging that reconciling the interests of rewilding farmers with those of their more conventional neighbours remains, for now, an unresolved tension.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph B, why did James Caldwell convert part of his farm to rewilding?",
        options: [
          { key: "A", text: "He was legally required to" },
          { key: "B", text: "New subsidy schemes made it financially viable" },
          { key: "C", text: "His crops repeatedly failed" },
          { key: "D", text: "He inherited the land with existing wild habitat" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to paragraph D, what concern does Robert Hale raise about neighbouring rewilded land?",
        options: [
          { key: "A", text: "Reduced property values" },
          { key: "B", text: "Pests and weed seeds spreading to his farm" },
          { key: "C", text: "Increased flooding risk" },
          { key: "D", text: "Loss of tourism revenue" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Reports that species have returned to converted land faster than expected",
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Converted part of their farm partly because of changes to subsidy schemes",
        correctAnswer: "A",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Is concerned about the effects of rewilding on neighbouring farmland",
        correctAnswer: "C",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What type of government schemes changed, making rewilding more financially viable",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "subsidy",
        acceptableAnswers: ["subsidy", "subsidy schemes"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "How species have returned to rewilded land, according to the ecologist, compared to expectations",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "quickly",
        acceptableAnswers: ["quickly", "faster"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.COMPLETION_TEXT,
        groupId: "g2",
        prompt: "What some neighbouring farmers worry will spread onto their land, besides weed seeds",
        wordLimit: "ONE WORD ONLY",
        correctAnswer: "pests",
        acceptableAnswers: ["pests"],
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-5: Look at the following statements and the list of people below. Match each statement with the correct person, A-C.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "James Caldwell" },
          { key: "B", text: "Dr. Priya Nair" },
          { key: "C", text: "Robert Hale" },
        ],
      },
      {
        id: "g2",
        layout: "summary",
        instructions: "Questions 6-8: Complete the summary below. Use ONE WORD ONLY from the passage for each answer.",
        template: [
          { text: "Many farmers have been able to convert their land because of changes to government " },
          { blank: "q6" },
          { text: " schemes. According to one ecologist, species have returned to rewilded land more " },
          { blank: "q7" },
          { text: " than expected. However, not all neighbouring farmers are supportive, with some raising concerns about " },
          { blank: "q8" },
          { text: " spreading onto their land." },
        ],
      },
    ],
  },
];

function toPublicQuestion({ correctAnswer, acceptableAnswers, correctAnswers, ...rest }) {
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
