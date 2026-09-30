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
