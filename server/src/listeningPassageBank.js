/**
 * Static practice section bank, same convention as promptBank.js,
 * speakingQuestionBank.js, and readingPassageBank.js. Original scripted
 * dialogues written to match the structure and question types of genuine
 * IELTS Listening Section 1 (a short, everyday transactional conversation
 * with form-completion questions), not reproductions of any real exam.
 * `script` is served to the client as-is (unlike the answer-bearing
 * question fields) since the browser needs the text to synthesize speech —
 * see the trade-off noted in the implementation plan.
 */

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  SHORT_ANSWER: "short_answer",
};

const LISTENING_SECTIONS = [
  {
    id: "ls-01",
    title: "Joining the Riverside Pottery Studio",
    part: 1,
    estimatedMinutes: 10,
    script: [
      { speaker: "Receptionist", line: "Riverside Pottery Studio, good morning. How can I help you today?" },
      { speaker: "Daniel", line: "Hi there, I'd like to sign up for one of your beginner pottery classes, please." },
      { speaker: "Receptionist", line: "Of course! Can I take your name first?" },
      { speaker: "Daniel", line: "It's Daniel Whitfield. That's W-H-I-T-F-I-E-L-D." },
      { speaker: "Receptionist", line: "Great, thanks Daniel. And could I get a contact phone number?" },
      { speaker: "Daniel", line: "Sure, it's 0114 496 2273." },
      {
        speaker: "Receptionist",
        line: "Perfect. Now, we currently have two beginner sessions running — one on Tuesday evenings and one on Thursday afternoons. The Tuesday class is actually full at the moment, so I'd recommend the Thursday one instead.",
      },
      { speaker: "Daniel", line: "Thursday's fine for me actually, so that works out well." },
      {
        speaker: "Receptionist",
        line: "Great. That class runs from two till four in the afternoon, and it's held in Studio 3, which is on the second floor.",
      },
      { speaker: "Daniel", line: "Got it. And how much does the course cost?" },
      {
        speaker: "Receptionist",
        line: "The full six-week course is thirty-two pounds, but that doesn't include clay, which is an extra four pounds fifty per session.",
      },
      { speaker: "Daniel", line: "Okay, that sounds reasonable." },
      { speaker: "Receptionist", line: "Wonderful. Lastly, could I get an email address so I can send you a confirmation?" },
      { speaker: "Daniel", line: "Yes, it's daniel dot whitfield at mailbox dot com." },
      { speaker: "Receptionist", line: "Perfect, I'll get that confirmation sent over. We look forward to seeing you on Thursday!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's surname?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Whitfield",
        acceptableAnswers: ["Whitfield"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's phone number?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "0114 496 2273",
        acceptableAnswers: ["0114 496 2273", "01144962273", "0114-496-2273"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which day is Daniel's pottery class on?",
        options: [
          { key: "A", text: "Tuesday" },
          { key: "B", text: "Thursday" },
          { key: "C", text: "Saturday" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the class start?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "2pm",
        acceptableAnswers: ["2pm", "2 pm", "2:00pm", "2:00 pm", "two pm", "2 o'clock"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Which studio is the class held in?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Studio 3",
        acceptableAnswers: ["Studio 3", "Studio Three"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which floor is Studio 3 on?",
        options: [
          { key: "A", text: "Ground floor" },
          { key: "B", text: "First floor" },
          { key: "C", text: "Second floor" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does the full course cost?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£32",
        acceptableAnswers: ["£32", "32 pounds", "thirty-two pounds", "32"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much extra does clay cost per session?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£4.50",
        acceptableAnswers: ["£4.50", "4.50", "four pounds fifty", "£4.50 per session"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many weeks does the course run for?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "six weeks",
        acceptableAnswers: ["six weeks", "6 weeks"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Why did the receptionist recommend the Thursday class instead of Tuesday?",
        options: [
          { key: "A", text: "It's cheaper" },
          { key: "B", text: "The Tuesday class is full" },
          { key: "C", text: "Thursday has a better teacher" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's email address?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "daniel.whitfield@mailbox.com",
        acceptableAnswers: ["daniel.whitfield@mailbox.com"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What will the receptionist send to confirm the booking?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a confirmation",
        acceptableAnswers: ["a confirmation", "confirmation", "confirmation email"],
      },
    ],
  },
  {
    id: "ls-02",
    title: "Welcome to Overton Community Leisure Centre",
    part: 2,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Guide",
        line: "Hi everyone, and welcome to Overton Community Leisure Centre. My name's Priya, and I'll be showing you around and getting you settled in before you start using the facilities on your own. This should only take about ten minutes, so let's get straight into it.",
      },
      {
        speaker: "Guide",
        line: "We're a three-storey building. Down here on the ground floor, you've got reception, where you're standing now, the main gym floor, and the changing rooms. On the first floor we have our twenty-five metre swimming pool, and up on the second floor there are two studios used for classes — Studio 1 and Studio 2.",
      },
      {
        speaker: "Guide",
        line: "In terms of opening hours, we're open every weekday from six in the morning until ten at night. On weekends, we open a little later, at eight, and close earlier too, at six in the evening.",
      },
      {
        speaker: "Guide",
        line: "Now, for the changing rooms — you'll need a coin or a token for the lockers, but if you don't have one, just come to reception and we'll lend you a key instead. That does require a five-pound deposit, which you get back in full when you return the key.",
      },
      {
        speaker: "Guide",
        line: "Moving on to classes — we run a full timetable of group sessions in the two studios. Studio 1 is mainly used for our spin cycling classes, and Studio 2 is where we hold yoga and Pilates. All classes need to be booked in advance through our app, and spaces are limited to twenty people per session.",
      },
      {
        speaker: "Guide",
        line: "One thing to flag: our most popular class by far is the Saturday morning spin class, so if you want a place in that one, I'd recommend booking at least three days ahead, since it does fill up quickly.",
      },
      {
        speaker: "Guide",
        line: "Let's talk membership. We have three tiers. The Basic membership is thirty pounds a month and covers gym and pool access only. The Standard membership is forty-five pounds a month and adds unlimited classes on top of that. And then there's Premium, at sixty pounds a month, which includes everything in Standard plus one free personal training session every month.",
      },
      {
        speaker: "Guide",
        line: "A quick word on safety. Please don't bring glass bottles anywhere onto the gym floor or poolside — we do provide free water fountains on every level instead. And out of respect for other members' privacy, photography isn't permitted anywhere inside the changing rooms.",
      },
      {
        speaker: "Guide",
        line: "You'll each be issued a photo ID badge today, which you'll need to swipe at the turnstile every time you enter, even if a member of staff already recognises you — it's simply how we keep our attendance records accurate.",
      },
      {
        speaker: "Guide",
        line: "Finally, I want to mention an event coming up. On the fourteenth of next month, we're holding an open evening to mark the centre's tenth anniversary, with free taster classes running in both studios and a barbecue out on the terrace. All members are welcome, and you're each allowed to bring one guest along for free.",
      },
      {
        speaker: "Guide",
        line: "That's everything for now. If any questions come up once you're settled in, just ask any member of staff wearing a blue polo shirt, and we'll be happy to help. Thanks for listening, and enjoy the centre!",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which floor is the swimming pool on?",
        options: [
          { key: "A", text: "Ground floor" },
          { key: "B", text: "First floor" },
          { key: "C", text: "Second floor" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the centre open on weekdays?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "6am",
        acceptableAnswers: ["6am", "6 am", "six am", "6:00am", "six o'clock"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much is the deposit for a locker key from reception?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£5",
        acceptableAnswers: ["£5", "5 pounds", "five pounds", "£5.00"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which class is held in Studio 2?",
        options: [
          { key: "A", text: "Spin cycling" },
          { key: "B", text: "Yoga and Pilates" },
          { key: "C", text: "Personal training" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the maximum number of people allowed per class?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "20",
        acceptableAnswers: ["20", "twenty", "20 people"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How far in advance does the guide recommend booking the Saturday spin class?",
        options: [
          { key: "A", text: "At least one day ahead" },
          { key: "B", text: "At least three days ahead" },
          { key: "C", text: "At least a week ahead" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does the Standard membership cost per month?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£45",
        acceptableAnswers: ["£45", "45 pounds", "forty-five pounds"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does the Premium membership include one of every month?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "personal training session",
        acceptableAnswers: ["personal training session", "a personal training session", "personal training"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What is not permitted in the changing rooms?",
        options: [
          { key: "A", text: "Glass bottles" },
          { key: "B", text: "Photography" },
          { key: "C", text: "Personal lockers" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What must members swipe at the turnstile every time they enter?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "photo ID badge",
        acceptableAnswers: ["photo ID badge", "ID badge", "their photo ID badge"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the leisure centre celebrating at next month's open evening?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "tenth anniversary",
        acceptableAnswers: ["tenth anniversary", "its tenth anniversary", "10th anniversary"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many guests is each member allowed to bring to the open evening for free?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "one",
        acceptableAnswers: ["one", "1", "one guest"],
      },
    ],
  },
  {
    id: "ls-03",
    title: "Urban Heat Islands",
    part: 4,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Lecturer",
        line: "Good morning, everyone. Today I want to talk about a phenomenon called the urban heat island effect, which is something you'll come across again if you go on to study urban planning or climate science in more depth.",
      },
      {
        speaker: "Lecturer",
        line: "In simple terms, an urban heat island is an urban area that is significantly warmer than the rural areas surrounding it, purely as a result of human activity and construction, rather than anything to do with latitude or season.",
      },
      {
        speaker: "Lecturer",
        line: "And the difference is often larger than people expect. Measurements taken in cities such as London, Tokyo and New York have recorded air temperature differences of up to seven degrees Celsius between the city centre and nearby countryside, on an otherwise identical day, and that gap tends to be most pronounced at night rather than during the day.",
      },
      {
        speaker: "Lecturer",
        line: "So what actually causes this? There are three main contributing factors. The first is building materials. Concrete, asphalt and dark roofing materials all absorb far more solar radiation during the day than natural surfaces like soil or grass, and they then release that stored heat slowly overnight, which is exactly why the effect is strongest after dark.",
      },
      {
        speaker: "Lecturer",
        line: "The second factor is simply a lack of vegetation. Trees and plants cool the air around them through a process called evapotranspiration, essentially releasing water vapour that has a cooling effect, similar to sweating. Cities generally have far less greenery per square kilometre than rural areas, so this natural cooling mechanism is largely absent.",
      },
      {
        speaker: "Lecturer",
        line: "And the third factor is what's known as waste heat — heat generated directly by human activity. Vehicle engines, air conditioning units, and industrial machinery all release heat directly into the surrounding air as a by-product, and in a dense city this adds up to a measurable contribution to the overall temperature.",
      },
      {
        speaker: "Lecturer",
        line: "Now, this isn't just an interesting curiosity — it has real consequences. The most immediate is a rise in energy demand, since hotter cities require significantly more electricity for air conditioning, which, in something of a vicious cycle, generates yet more waste heat.",
      },
      {
        speaker: "Lecturer",
        line: "There are also direct health consequences. During heatwaves, the urban heat island effect can make already-dangerous temperatures considerably worse in city centres specifically, and research consistently shows that heat-related deaths during major heatwaves are concentrated disproportionately in the most built-up parts of a city, rather than being spread evenly across a region.",
      },
      {
        speaker: "Lecturer",
        line: "So, what can be done to mitigate this? One widely studied approach is the installation of what are called green roofs — rooftops partly or fully covered with vegetation, which both absorb less heat than a standard dark roof and provide a small amount of natural cooling through evapotranspiration, just like a park or a garden would.",
      },
      {
        speaker: "Lecturer",
        line: "A second approach is the use of reflective, or 'cool', pavement materials, which are lighter in colour and reflect far more sunlight than standard dark asphalt, reducing how much heat the road surface absorbs and later releases.",
      },
      {
        speaker: "Lecturer",
        line: "And the third, arguably simplest, strategy is expanding the urban tree canopy — simply planting significantly more trees along streets and in public spaces. The city of Melbourne, for example, has committed to doubling its tree canopy cover by the year 2040 specifically as a heat-mitigation measure, alongside its other environmental goals.",
      },
      {
        speaker: "Lecturer",
        line: "For next week's seminar, I'd like you to read the paper I've uploaded on Melbourne's urban forest strategy, and come prepared to discuss whether you think tree planting alone is a sufficient response, or whether it needs to be combined with the other measures we've discussed today.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to the lecturer, an urban heat island is caused mainly by:",
        options: [
          { key: "A", text: "A city's latitude and season" },
          { key: "B", text: "Human activity and construction" },
          { key: "C", text: "Natural variation in rainfall" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the largest temperature difference mentioned between city centres and nearby countryside?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "7 degrees Celsius",
        acceptableAnswers: ["7 degrees Celsius", "seven degrees Celsius", "7°C", "7 degrees"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "When is the urban heat island effect generally strongest?",
        options: [
          { key: "A", text: "During the middle of the day" },
          { key: "B", text: "Overnight" },
          { key: "C", text: "At sunrise" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What process allows trees and plants to cool the air around them?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "evapotranspiration",
        acceptableAnswers: ["evapotranspiration"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which of the following is given as an example of 'waste heat'?",
        options: [
          { key: "A", text: "Heat released by vehicle engines and air conditioning units" },
          { key: "B", text: "Heat absorbed by dark roofing materials" },
          { key: "C", text: "Heat lost through a lack of vegetation" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What kind of demand rises as a direct result of hotter cities needing more air conditioning?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "energy demand",
        acceptableAnswers: ["energy demand", "demand for energy", "electricity demand"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "During major heatwaves, where are heat-related deaths most concentrated?",
        options: [
          { key: "A", text: "Evenly spread across an entire region" },
          { key: "B", text: "In the most built-up parts of a city" },
          { key: "C", text: "Mainly in surrounding rural areas" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What term is used for rooftops partly or fully covered with vegetation?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "green roofs",
        acceptableAnswers: ["green roofs", "green roof"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What term does the lecturer use for lighter-coloured, more reflective road materials?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "cool pavement",
        acceptableAnswers: ["cool pavement", "cool pavements", "cool, pavement materials", "reflective pavement"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What has the city of Melbourne committed to doing by 2040?",
        options: [
          { key: "A", text: "Banning dark asphalt on all new roads" },
          { key: "B", text: "Doubling its tree canopy cover" },
          { key: "C", text: "Replacing all rooftops with green roofs" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What reading has the lecturer uploaded for next week's seminar?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Melbourne's urban forest strategy",
        acceptableAnswers: ["Melbourne's urban forest strategy", "urban forest strategy", "Melbourne urban forest strategy"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many main contributing factors to urban heat islands does the lecturer describe?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "three",
        acceptableAnswers: ["three", "3"],
      },
    ],
  },
];

function toPublicQuestion({ correctAnswer, acceptableAnswers, ...rest }) {
  return rest;
}

function toPublicSection(section) {
  return {
    ...section,
    questionCount: section.questions.length,
    questions: section.questions.map(toPublicQuestion),
  };
}

function getListeningSectionBank() {
  return LISTENING_SECTIONS.map(toPublicSection);
}

function getListeningSection(id) {
  const section = LISTENING_SECTIONS.find((s) => s.id === id);
  return section ? toPublicSection(section) : undefined;
}

// Server-internal only — carries correctAnswer/acceptableAnswers. Used
// exclusively by scoreListening.js; never route this directly to a response.
function getListeningSectionWithAnswers(id) {
  return LISTENING_SECTIONS.find((s) => s.id === id);
}

// Server-internal only, same reason — used by scoreListeningFullTest to
// score every section in the bank as one continuous test.
function getAllListeningSectionsWithAnswers() {
  return LISTENING_SECTIONS;
}

export {
  QUESTION_TYPES,
  getListeningSectionBank,
  getListeningSection,
  getListeningSectionWithAnswers,
  getAllListeningSectionsWithAnswers,
};
