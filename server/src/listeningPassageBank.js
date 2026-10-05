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
  // "Choose TWO/THREE letters" — answer is a set (correctAnswers, plural,
  // + chooseCount), not a single correctAnswer. See markingEngine.js's
  // isMultipleSelectCorrect for how this is scored.
  MULTIPLE_SELECT: "multiple_select",
  // Match each prompt to one option from a shared pool (e.g. facility ->
  // floor). Same mechanic as Reading's matching type — see the comment on
  // MATCHING in readingPassageBank.js for the full rationale.
  MATCHING: "matching",
  // Plan/map/diagram labeling. Scored identically to MATCHING (one
  // correctAnswer, a key into the group's optionPool) — kept as its own
  // type string purely for drill-mode/history labels. The section carries
  // a `diagram` field (structured shapes, not an image — see
  // DiagramView.js client-side) rendered once above the labeling
  // questions, the same way `script` is shown once above every question.
  DIAGRAM_LABEL: "diagram_label",
};

const LISTENING_SECTIONS = [
  {
    id: "ls-01",
    title: "Joining the Riverside Pottery Studio",
    // testNumber groups sections into complete tests, the way a real IELTS
    // practice book does: one test = Parts 1-4. Everything authored so far
    // belongs to Test 1; adding a Test 2 means authoring its own Part 1/2/4
    // sections with testNumber: 2 (Part 3 still blocked on multi-speaker TTS).
    testNumber: 1,
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
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO of the following does the receptionist say about the beginner course?",
        chooseCount: 2,
        options: [
          { key: "A", text: "It runs for six weeks" },
          { key: "B", text: "The price includes clay" },
          { key: "C", text: "The Tuesday class is already full" },
          { key: "D", text: "A certificate is given at the end" },
          { key: "E", text: "It is taught by Daniel" },
        ],
        correctAnswers: ["A", "C"],
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
    testNumber: 1,
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
      {
        id: "q13",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Reception",
        correctAnswer: "A",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Main gym floor",
        correctAnswer: "A",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Changing rooms",
        correctAnswer: "A",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Swimming pool",
        correctAnswer: "B",
      },
      {
        id: "q17",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Studios 1 and 2",
        correctAnswer: "C",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-17: Which floor is each of the following found on? Choose the correct floor for each. You may use any floor more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Ground floor" },
          { key: "B", text: "First floor" },
          { key: "C", text: "Second floor" },
        ],
      },
    ],
  },
  {
    id: "ls-03",
    title: "Urban Heat Islands",
    testNumber: 1,
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
        correctAnswer: "urban forest strategy",
        acceptableAnswers: ["urban forest strategy", "Melbourne's urban forest strategy", "Melbourne urban forest strategy"],
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
  {
    id: "ls-04",
    title: "Booking a Car at Lakeside Car Hire",
    testNumber: 2,
    part: 1,
    estimatedMinutes: 10,
    script: [
      { speaker: "Agent", line: "Lakeside Car Hire, good afternoon, this is Marcus speaking." },
      { speaker: "Caller", line: "Hi, I'd like to hire a car for a few days next month, please." },
      { speaker: "Agent", line: "No problem at all. Could I start with your full name?" },
      { speaker: "Caller", line: "Yes, it's Sofia Rendell. That's R-E-N-D-E-L-L." },
      { speaker: "Agent", line: "Thanks, Sofia. And what dates were you looking at?" },
      { speaker: "Caller", line: "I'd need it from the ninth to the thirteenth of October, so five days in total." },
      {
        speaker: "Agent",
        line: "That's fine, we have availability then. We've got two options in the size you'd probably want — a compact hatchback, or a slightly larger estate car, which is better if you've got a lot of luggage.",
      },
      { speaker: "Caller", line: "I'll need the extra space actually, so I'll go with the estate." },
      {
        speaker: "Agent",
        line: "Good choice. That one comes to thirty-eight pounds per day, so with five days that's a hundred and ninety pounds in total, plus a fully refundable deposit of one hundred pounds, which we release back to you after the car is returned undamaged.",
      },
      { speaker: "Caller", line: "That sounds fine. Where would I pick the car up from?" },
      {
        speaker: "Agent",
        line: "You'd collect it from our branch on Birch Grove, just beside the train station — that's our main collection point for weekday bookings.",
      },
      { speaker: "Caller", line: "Great, that's easy for me to get to. What time can I collect it?" },
      {
        speaker: "Agent",
        line: "Our collection desk opens at half past eight in the morning, so any time after that on the ninth would work.",
      },
      { speaker: "Caller", line: "Perfect. Do I need to bring anything with me?" },
      {
        speaker: "Agent",
        line: "Just your driving licence and a credit card in your own name for the deposit — we can't accept a debit card for that part, I'm afraid.",
      },
      { speaker: "Caller", line: "Understood. And is there anything I should know about the fuel?" },
      {
        speaker: "Agent",
        line: "Yes — the car will be given to you with a full tank, and we ask that it's returned full as well. If it isn't, there's a refuelling charge of twenty-five pounds on top of the fuel itself.",
      },
      { speaker: "Caller", line: "Noted, that's straightforward enough. Could I get a confirmation email sent over?" },
      { speaker: "Caller", line: "Yes, it's sofia dot rendell at skymail dot com." },
      { speaker: "Agent", line: "All set — you'll have that confirmation within the hour. Thanks for booking with Lakeside, Sofia!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's surname?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Rendell",
        acceptableAnswers: ["Rendell"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many days does the caller need the car for?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "five days",
        acceptableAnswers: ["five days", "5 days", "five"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which type of car does the caller choose?",
        options: [
          { key: "A", text: "Compact hatchback" },
          { key: "B", text: "Estate car" },
          { key: "C", text: "Small van" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does the chosen car cost per day?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£38",
        acceptableAnswers: ["£38", "38 pounds", "thirty-eight pounds"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much is the refundable deposit?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£100",
        acceptableAnswers: ["£100", "100 pounds", "one hundred pounds"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Where is the collection point located?",
        options: [
          { key: "A", text: "Beside the train station" },
          { key: "B", text: "Inside the airport" },
          { key: "C", text: "In the city centre car park" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the collection desk open?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "8:30am",
        acceptableAnswers: ["8:30am", "8:30 am", "half past eight", "8.30am", "half eight"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What must the caller bring to pay the deposit?",
        options: [
          { key: "A", text: "A debit card" },
          { key: "B", text: "Cash" },
          { key: "C", text: "A credit card in her own name" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What charge applies if the car is not returned with a full tank?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£25",
        acceptableAnswers: ["£25", "25 pounds", "twenty-five pounds"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "On what date does the caller collect the car?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the ninth",
        acceptableAnswers: ["the ninth", "9th", "9th October", "the ninth of October"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's email address?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "sofia.rendell@skymail.com",
        acceptableAnswers: ["sofia.rendell@skymail.com"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What is the total cost for five days of hire, before the deposit?",
        options: [
          { key: "A", text: "£100" },
          { key: "B", text: "£152" },
          { key: "C", text: "£190" },
        ],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: "ls-05",
    title: "Orientation Tour of Brightwater Library",
    testNumber: 2,
    part: 2,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Guide",
        line: "Good morning, and welcome to Brightwater Library. My name's Connor, and before you collect your new membership cards, I just want to give you a quick tour so you know where everything is. It should take about ten minutes.",
      },
      {
        speaker: "Guide",
        line: "We're spread across four floors. The ground floor, where we're standing, holds the main lending collection — fiction and non-fiction — along with the enquiry desk. The first floor is entirely reference and study space, and that's a silent floor, so no conversation is allowed up there at all.",
      },
      {
        speaker: "Guide",
        line: "The second floor is our children's and young adult section, and the top floor, the third floor, houses our local history archive along with a small events room.",
      },
      {
        speaker: "Guide",
        line: "In terms of opening hours, we're open Monday to Friday from nine in the morning until eight in the evening. On Saturdays we close earlier, at five, and we're closed all day Sunday.",
      },
      {
        speaker: "Guide",
        line: "Borrowing limits depend on your membership type. A Standard membership, which is free, allows you to borrow up to eight items at once, for three weeks. Our Plus membership, at fifteen pounds a year, raises that limit to fifteen items, and extends the loan period to four weeks.",
      },
      {
        speaker: "Guide",
        line: "If you return something late, the fine is twenty pence per item per day, though it's capped at a maximum of five pounds per item, so it can never run up indefinitely.",
      },
      {
        speaker: "Guide",
        line: "We also offer free Wi-Fi throughout the building, and there are twelve public computers available on the ground floor, which you can book for up to one hour at a time through the enquiry desk.",
      },
      {
        speaker: "Guide",
        line: "A quick note on food and drink: cold drinks in a sealed bottle are allowed anywhere in the building, but hot drinks and all food are restricted to the ground-floor café area only, mainly to protect the archive materials upstairs.",
      },
      {
        speaker: "Guide",
        line: "We run a regular programme of events in the third-floor events room — currently that includes a weekly book club on Wednesday evenings, and a children's storytelling session every Saturday morning. Both are free, but the storytelling session does need to be booked in advance, since space is limited to twenty children.",
      },
      {
        speaker: "Guide",
        line: "One last thing — we're holding a special exhibition next month on the town's industrial history, running for the whole of November, with several items from our local history archive on public display for the first time in over a decade.",
      },
      {
        speaker: "Guide",
        line: "That covers the essentials. If you have any other questions once you're settled in, just ask a member of staff at the enquiry desk on the ground floor. Thanks for listening, and welcome again to Brightwater!",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which floor is designated as a silent floor?",
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
        prompt: "What is located on the third floor along with the local history archive?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "events room",
        acceptableAnswers: ["events room", "a small events room", "an events room"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the library close on Saturdays?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "5pm",
        acceptableAnswers: ["5pm", "5 pm", "five pm", "5:00pm", "five o'clock"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How many items can a Standard member borrow at once?",
        options: [
          { key: "A", text: "Eight" },
          { key: "B", text: "Twelve" },
          { key: "C", text: "Fifteen" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does Plus membership cost per year?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£15",
        acceptableAnswers: ["£15", "15 pounds", "fifteen pounds"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the maximum fine per item for a late return?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£5",
        acceptableAnswers: ["£5", "5 pounds", "five pounds"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How many public computers are available on the ground floor?",
        options: [
          { key: "A", text: "Eight" },
          { key: "B", text: "Ten" },
          { key: "C", text: "Twelve" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where are hot drinks and food restricted to?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the café area",
        acceptableAnswers: ["the café area", "café area", "the ground-floor café area", "ground floor café"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "On which day does the children's storytelling session take place?",
        options: [
          { key: "A", text: "Wednesday" },
          { key: "B", text: "Friday" },
          { key: "C", text: "Saturday" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many children can attend the storytelling session?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "20",
        acceptableAnswers: ["20", "twenty", "20 children"],
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What topic will next month's special exhibition cover?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "industrial history",
        acceptableAnswers: ["industrial history", "the town's industrial history"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "For how long is the special exhibition running?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "all of November",
        acceptableAnswers: ["all of November", "the whole of November", "November"],
      },
      {
        id: "q13",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        // Matches the fixed floor-name text already drawn on the diagram
        // itself — shown here purely so the post-submit results view has
        // meaningful context, same reasoning as completion_box's prompt.
        prompt: "Ground Floor",
        correctAnswer: "A",
      },
      {
        id: "q14",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "First Floor",
        correctAnswer: "B",
      },
      {
        id: "q15",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "Second Floor",
        correctAnswer: "C",
      },
      {
        id: "q16",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "Third Floor",
        correctAnswer: "D",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions:
          "Questions 13-16: Label the diagram below. Choose the correct description for each floor from the box. Each letter may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "lending collection and enquiry desk" },
          { key: "B", text: "reference and study (silent floor)" },
          { key: "C", text: "children's and young adult section" },
          { key: "D", text: "local history archive and events room" },
          { key: "E", text: "café and vending area" },
        ],
      },
    ],
    diagram: {
      viewBox: "0 0 220 300",
      shapes: [
        { type: "rect", x: 10, y: 10, width: 200, height: 60 },
        { type: "rect", x: 10, y: 80, width: 200, height: 60 },
        { type: "rect", x: 10, y: 150, width: 200, height: 60 },
        { type: "rect", x: 10, y: 220, width: 200, height: 60 },
        { type: "text", x: 20, y: 35, text: "Third Floor" },
        { type: "text", x: 20, y: 105, text: "Second Floor" },
        { type: "text", x: 20, y: 175, text: "First Floor" },
        { type: "text", x: 20, y: 245, text: "Ground Floor" },
        { type: "text", x: 178, y: 45, text: "(16)", bold: true },
        { type: "text", x: 178, y: 115, text: "(15)", bold: true },
        { type: "text", x: 178, y: 185, text: "(14)", bold: true },
        { type: "text", x: 178, y: 255, text: "(13)", bold: true },
      ],
    },
  },
  {
    id: "ls-06",
    title: "Circadian Rhythms and Human Behaviour",
    testNumber: 2,
    part: 4,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Lecturer",
        line: "Good morning. Today's topic is the circadian rhythm — the roughly twenty-four-hour internal clock that governs much more of our biology than most people realise, well beyond just sleep.",
      },
      {
        speaker: "Lecturer",
        line: "The word itself comes from Latin: 'circa', meaning 'around', and 'diem', meaning 'day'. So circadian literally means 'around a day', which is a fitting description, since this internal clock actually runs slightly longer than exactly twenty-four hours if left with no external cues at all.",
      },
      {
        speaker: "Lecturer",
        line: "The master clock controlling this rhythm sits in a tiny region of the brain called the suprachiasmatic nucleus, often abbreviated to the SCN, located in an area called the hypothalamus. This cluster of around twenty thousand neurons receives direct input from the eyes, which is how it stays synchronised to the actual light and dark cycle outside.",
      },
      {
        speaker: "Lecturer",
        line: "The most obvious output of this clock is the sleep-wake cycle, regulated substantially through a hormone called melatonin, which the brain begins releasing in the evening as light levels fall, and suppresses again in the morning once light returns.",
      },
      {
        speaker: "Lecturer",
        line: "But sleep is really just one visible output among many. Body temperature, for instance, follows a clear circadian pattern too, typically reaching its lowest point in the few hours before a person's natural waking time, then rising steadily across the day.",
      },
      {
        speaker: "Lecturer",
        line: "Hormone release generally follows circadian timing as well. Cortisol, often described as the body's primary stress hormone, typically peaks shortly after waking — a spike researchers call the cortisol awakening response — and then gradually declines across the remainder of the day.",
      },
      {
        speaker: "Lecturer",
        line: "Even the digestive system runs on circadian timing to some extent, with digestive efficiency and insulin sensitivity generally higher earlier in the day, which is part of the reasoning some nutrition researchers give for eating larger meals earlier rather than later.",
      },
      {
        speaker: "Lecturer",
        line: "One of the clearest demonstrations of how disruptive it is to override this clock comes from research on shift workers. Long-term night-shift workers, whose sleep-wake pattern runs directly against their circadian rhythm rather than with it, show significantly elevated rates of several health conditions, including cardiovascular disease and metabolic disorders, even when researchers control for other lifestyle factors.",
      },
      {
        speaker: "Lecturer",
        line: "Jet lag is a more temporary, everyday example of the same underlying mismatch — the body's internal clock remains set to the time zone just departed, while the environment has already moved on, and it typically takes roughly one day per time zone crossed for the circadian rhythm to fully re-align.",
      },
      {
        speaker: "Lecturer",
        line: "In recent years, researchers have also studied what's called 'social jet lag' — the mismatch that builds up when someone keeps very different sleep schedules on weekdays versus weekends. Some studies associate a large social jet lag gap, of two hours or more, with worse mood and poorer metabolic health markers, even among people who are not shift workers or long-distance travellers at all.",
      },
      {
        speaker: "Lecturer",
        line: "For your seminar next week, I'd like you to consider whether workplace policies should be adapted to accommodate circadian variation between individuals, given that not everyone's internal clock runs on quite the same schedule.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What Latin word meaning 'day' contributes to the term 'circadian'?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "diem",
        acceptableAnswers: ["diem"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Where in the brain is the master circadian clock located?",
        options: [
          { key: "A", text: "The suprachiasmatic nucleus" },
          { key: "B", text: "The cerebellum" },
          { key: "C", text: "The brainstem" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Approximately how many neurons make up this cluster in the brain?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "20,000",
        acceptableAnswers: ["20,000", "twenty thousand", "20000", "around twenty thousand"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What hormone is released in the evening to help regulate the sleep-wake cycle?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "melatonin",
        acceptableAnswers: ["melatonin"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "When does body temperature typically reach its lowest point?",
        options: [
          { key: "A", text: "In the middle of the afternoon" },
          { key: "B", text: "In the few hours before natural waking time" },
          { key: "C", text: "Immediately after eating a meal" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the spike in cortisol shortly after waking called?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "cortisol awakening response",
        acceptableAnswers: ["cortisol awakening response", "the cortisol awakening response"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to the lecturer, what health conditions are elevated among long-term night-shift workers?",
        options: [
          { key: "A", text: "Cardiovascular disease and metabolic disorders" },
          { key: "B", text: "Vision problems and hearing loss" },
          { key: "C", text: "Joint pain and muscle disorders" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Roughly how long does it take the circadian rhythm to re-align per time zone crossed?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "one day",
        acceptableAnswers: ["one day", "1 day", "roughly one day"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What term is used for the mismatch between weekday and weekend sleep schedules?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "social jet lag",
        acceptableAnswers: ["social jet lag", "social jetlag"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "A large social jet lag gap is associated with which of the following?",
        options: [
          { key: "A", text: "Improved metabolic health" },
          { key: "B", text: "Worse mood and poorer metabolic health markers" },
          { key: "C", text: "No measurable effect on health" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q11",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What size social jet lag gap was associated with worse outcomes in some studies?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "two hours",
        acceptableAnswers: ["two hours", "2 hours", "two hours or more"],
      },
      {
        id: "q12",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does the lecturer want students to consider for next week's seminar?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "workplace policies",
        acceptableAnswers: ["workplace policies", "adapting workplace policies", "whether workplace policies should be adapted"],
      },
    ],
  },
  // Listening Test 3. No `track` field anywhere in this file — real IELTS
  // Listening is identical for Academic and General Training candidates,
  // so unlike Reading, there's nothing to tag.
  {
    id: "ls-07",
    title: "Booking a Canoe Trip at Riverbend Outdoor Centre",
    testNumber: 3,
    part: 1,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      { speaker: "Agent", line: "Riverbend Outdoor Centre, good morning, this is Priya speaking." },
      { speaker: "Caller", line: "Hi, I'd like to book a guided canoe trip for this weekend if possible." },
      { speaker: "Agent", line: "Of course. Could I take your name first?" },
      { speaker: "Caller", line: "It's Thomas Webb. That's W-E-B-B." },
      { speaker: "Agent", line: "Thanks, Thomas. And how many people will be joining you?" },
      { speaker: "Caller", line: "There'll be six of us in total, including myself." },
      {
        speaker: "Agent",
        line: "Great, that works well — our guided trips run in groups of up to eight. We have two options: a two-hour trip along the calm stretch of river, or a half-day trip that includes a stop for lunch at the old mill.",
      },
      { speaker: "Caller", line: "The half-day one sounds better, honestly." },
      {
        speaker: "Agent",
        line: "Good choice. That one runs from ten in the morning until two in the afternoon, and it costs twenty-eight pounds per person, which includes all equipment and a packed lunch.",
      },
      { speaker: "Caller", line: "Perfect. Do we need any previous experience?" },
      {
        speaker: "Agent",
        line: "No experience is necessary at all — a qualified guide stays with the group the whole way and goes through the basics beforehand. You will need to bring your own footwear though, ideally something you don't mind getting wet.",
      },
      { speaker: "Caller", line: "That's fine. Where do we meet?" },
      { speaker: "Agent", line: "You'll meet at the boathouse, which is just past the main car park — look out for the blue gate." },
      { speaker: "Caller", line: "Got it. Is there anything else I need to bring?" },
      {
        speaker: "Agent",
        line: "Just a change of clothes for afterwards, and sun cream if the forecast is good. We provide life jackets and all the paddling equipment.",
      },
      { speaker: "Caller", line: "Great, that all makes sense. Could I pay a deposit now to confirm?" },
      {
        speaker: "Agent",
        line: "Yes, we ask for a ten-pound deposit per person, refundable up to 48 hours before the trip. Could I get your email to send the booking confirmation?",
      },
      { speaker: "Caller", line: "Sure, it's thomas dot webb at skylinemail dot com." },
      { speaker: "Agent", line: "Perfect, that's all booked in. We'll see you and your group on Saturday!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's surname?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Webb",
        acceptableAnswers: ["Webb"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many people will be in the group, including the caller?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "six",
        acceptableAnswers: ["six", "6"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Which trip does the caller choose?",
        options: [
          { key: "A", text: "The two-hour calm river trip" },
          { key: "B", text: "The half-day trip with a lunch stop" },
          { key: "C", text: "A full-day trip" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the half-day trip start?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "10am",
        acceptableAnswers: ["10am", "10 am", "ten am", "ten o'clock", "10:00am"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does the half-day trip cost per person?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£28",
        acceptableAnswers: ["£28", "28 pounds", "twenty-eight pounds"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What must participants bring themselves?",
        options: [
          { key: "A", text: "Life jackets" },
          { key: "B", text: "Paddling equipment" },
          { key: "C", text: "Footwear" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where should the group meet?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the boathouse",
        acceptableAnswers: ["the boathouse", "boathouse"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What colour is the gate near the meeting point?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "blue",
        acceptableAnswers: ["blue"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much is the deposit per person?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£10",
        acceptableAnswers: ["£10", "10 pounds", "ten pounds"],
      },
      {
        id: "q10",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's email address?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "thomas.webb@skylinemail.com",
        acceptableAnswers: ["thomas.webb@skylinemail.com"],
      },
    ],
  },
  {
    id: "ls-08",
    title: "Open Day at Hollow Oak Heritage Farm",
    testNumber: 3,
    part: 2,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Guide",
        line: "Good morning everyone, and welcome to Hollow Oak Heritage Farm's open day. My name's Daniel, and before you head off to explore on your own, I just want to run through the site layout and today's schedule, which should take about five minutes.",
      },
      {
        speaker: "Guide",
        line: "As you can see from the map you've been given, the farm is arranged around a central courtyard. The ticket office, where you're standing now, sits at the main entrance on the south side. Directly opposite, on the north side of the courtyard, is the old barn, which now houses our exhibition on farming through the centuries.",
      },
      {
        speaker: "Guide",
        line: "To the east of the courtyard you'll find the orchard, which is open for visitors to walk through freely today, and just beyond that, further east still, is the duck pond, where feeding is allowed between eleven and twelve only.",
      },
      {
        speaker: "Guide",
        line: "On the west side of the courtyard is the animal paddock, home to our sheep and goats, and next to that, slightly further west, is the picnic area, which has covered seating in case of rain.",
      },
      {
        speaker: "Guide",
        line: "In terms of today's schedule: the sheepdog demonstration takes place at eleven in the animal paddock, and a short talk on traditional hedge-laying runs at half past one over by the orchard.",
      },
      {
        speaker: "Guide",
        line: "The gift shop is located just inside the ticket office and stays open until five, half an hour after the rest of the farm closes.",
      },
      {
        speaker: "Guide",
        line: "One more thing — the car park is completely full today, so if you arrived by car, additional parking is available in the field just across the road, clearly marked with yellow signs.",
      },
      { speaker: "Guide", line: "That covers everything. Enjoy your visit to Hollow Oak!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What time does the sheepdog demonstration take place?",
        options: [
          { key: "A", text: "11am" },
          { key: "B", text: "1:30pm" },
          { key: "C", text: "5pm" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Between what times is duck feeding allowed?",
        options: [
          { key: "A", text: "10am-11am" },
          { key: "B", text: "11am-12pm" },
          { key: "C", text: "12pm-1pm" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "North of the courtyard",
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "East of the courtyard (nearer side)",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "East of the courtyard (further side)",
        correctAnswer: "C",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "West of the courtyard (nearer side)",
        correctAnswer: "D",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.DIAGRAM_LABEL,
        groupId: "g1",
        prompt: "West of the courtyard (further side)",
        correctAnswer: "E",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 13-17: Label the map below. Choose the correct location for each from the box. Each letter may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Barn" },
          { key: "B", text: "Orchard" },
          { key: "C", text: "Duck Pond" },
          { key: "D", text: "Animal Paddock" },
          { key: "E", text: "Picnic Area" },
          { key: "F", text: "Gift Shop" },
          { key: "G", text: "Car Park" },
        ],
      },
    ],
    // Redrawn a second time (2026-10-04) — the first redraw (organic
    // orchard/pond + dashed paths + compass) still read as too sparse and
    // too boxy per direct user feedback. This version adds: a title (real
    // exam diagrams always have one), irregular/notched footprints for the
    // two actual buildings (Barn, Ticket Office — Courtyard/Paddock/Picnic
    // Area stay as plain rects deliberately, since those are open managed
    // land, not structures, so a plain rectangle is the architecturally
    // correct shape for them, not a simplification), several scattered
    // tree icons filling otherwise-empty ground, and wavy ripple-texture
    // lines inside the pond so it reads as water rather than an empty
    // circle outline.
    diagram: {
      viewBox: "0 0 600 400",
      shapes: [
        { type: "text", x: 300, y: 28, text: "Hollow Oak Heritage Farm", bold: true, fontSize: 16, anchor: "middle" },
        { type: "compass", x: 555, y: 65, size: 16 },

        // Dashed paths from the courtyard out to each area, drawn before
        // the shapes so the shapes sit visually on top of them.
        { type: "line", x1: 260, y1: 205, x2: 230, y2: 205, dashed: true },
        { type: "line", x1: 150, y1: 205, x2: 120, y2: 205, dashed: true },
        { type: "line", x1: 340, y1: 205, x2: 368, y2: 200, dashed: true },
        { type: "line", x1: 432, y1: 202, x2: 482, y2: 205, dashed: true },
        { type: "line", x1: 300, y1: 180, x2: 300, y2: 120, dashed: true },
        { type: "line", x1: 300, y1: 230, x2: 300, y2: 300, dashed: true },

        // Barn (north, blank 13) — an irregular, notched footprint rather
        // than a plain box.
        { type: "path", d: "M 260 70 L 340 70 L 340 120 L 310 120 L 310 105 L 260 105 Z" },
        { type: "text", x: 310, y: 112, text: "(13)", bold: true },

        // Courtyard (centre, fixed) and the two open managed areas —
        // plain rects, deliberately, since these are land, not buildings.
        { type: "rect", x: 260, y: 180, width: 80, height: 50 },
        { type: "text", x: 268, y: 208, text: "Courtyard", bold: true },
        { type: "rect", x: 150, y: 180, width: 80, height: 50 },
        { type: "text", x: 190, y: 208, text: "(16)", bold: true, anchor: "middle" },
        { type: "rect", x: 30, y: 180, width: 90, height: 50 },
        { type: "text", x: 75, y: 208, text: "(17)", bold: true, anchor: "middle" },

        // Ticket Office (south, fixed) — also a notched building footprint.
        { type: "path", d: "M 260 300 L 320 300 L 320 315 L 340 315 L 340 350 L 260 350 Z" },
        { type: "text", x: 270, y: 330, text: "Ticket Office", fontSize: 11 },

        // Orchard (east, near, blank 14) — an organic cluster, not a box.
        {
          type: "path",
          d: "M 370 175 C 358 160, 385 148, 405 155 C 425 145, 448 162, 438 182 C 452 198, 436 222, 414 220 C 398 236, 368 225, 370 202 C 356 192, 360 182, 370 175 Z",
          fill: true,
        },
        { type: "text", x: 382, y: 190, text: "Orchard", fontSize: 11 },
        { type: "text", x: 414, y: 220, text: "(14)", bold: true },

        // Duck Pond (east, far, blank 15) — a filled circle with ripple
        // texture inside so it reads as water.
        { type: "circle", cx: 520, cy: 205, r: 38, fill: true },
        { type: "ripple", x: 507, y: 195, width: 18, height: 4 },
        { type: "ripple", x: 525, y: 210, width: 16, height: 4 },
        { type: "ripple", x: 510, y: 222, width: 14, height: 4 },
        { type: "text", x: 497, y: 185, text: "Duck Pond", fontSize: 11 },
        { type: "text", x: 540, y: 232, text: "(15)", bold: true },

        // Trees scattered through the otherwise-empty ground.
        { type: "tree", x: 55, y: 95, size: 9 },
        { type: "tree", x: 90, y: 80, size: 8 },
        { type: "tree", x: 45, y: 135, size: 9 },
        { type: "tree", x: 470, y: 290, size: 9 },
        { type: "tree", x: 510, y: 305, size: 8 },
      ],
    },
  },
  {
    id: "ls-09",
    title: "Planning a Campus Food-Waste Proposal",
    testNumber: 3,
    part: 3,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Priya",
        line: "So I've been looking into our proposal for the campus composting scheme, and I think we need to narrow down what we're actually asking the university to fund.",
      },
      {
        speaker: "Jamal",
        line: "Right, because if we ask for everything at once — new bins, staff training, the awareness campaign — it's going to look expensive and they might just reject the whole thing.",
      },
      {
        speaker: "Priya",
        line: "Exactly. I think the strongest part of our proposal is actually the food-sensor idea — the ones that track how much food gets thrown away in the canteen bins in real time.",
      },
      {
        speaker: "Jamal",
        line: "I agree that's the most interesting bit, but I'm honestly not sure the university will go for it this year. The sensors themselves are still fairly expensive, and nobody on campus has tested them before.",
      },
      {
        speaker: "Priya",
        line: "That's fair, but the compost bins alone probably won't convince them either — lots of universities already have those, so it's nothing new. The sensors are what would actually make our proposal stand out from last year's rejected one.",
      },
      {
        speaker: "Jamal",
        line: "Maybe we pitch it as a two-stage plan then — compost bins this year, sensors next year once we've got some usage data to justify the cost.",
      },
      {
        speaker: "Priya",
        line: "That could work. I also think we should mention the staff training piece, even briefly, because without it, kitchen staff won't actually sort waste correctly, and the whole scheme falls apart at the first stage.",
      },
      { speaker: "Jamal", line: "Good point. What about the awareness campaign — posters, social media, that sort of thing?" },
      {
        speaker: "Priya",
        line: "Honestly, I'd cut that from the proposal entirely. It's the easiest thing to add later informally, and I don't think it needs university funding at all.",
      },
      {
        speaker: "Jamal",
        line: "Agreed, let's drop it. So, final structure: compost bins and staff training funded now, sensors pitched as a future phase.",
      },
      { speaker: "Priya", line: "Sounds right. I'll draft the funding request this week if you can pull together the cost estimates." },
      { speaker: "Jamal", line: "Deal." },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO elements do the students agree to include in this year's funding request?",
        chooseCount: 2,
        options: [
          { key: "A", text: "Compost bins" },
          { key: "B", text: "Staff training" },
          { key: "C", text: "Food sensors" },
          { key: "D", text: "An awareness campaign" },
          { key: "E", text: "Social media posts" },
        ],
        correctAnswers: ["A", "B"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What do the students decide to do with the awareness campaign idea?",
        options: [
          { key: "A", text: "Fund it fully this year" },
          { key: "B", text: "Drop it from the funding request" },
          { key: "C", text: "Delay it until next year" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Thinks the sensors would make the proposal stand out from last year's rejected one",
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Is unsure the university will fund the sensors this year",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Believes the scheme will fail at the first stage without staff training",
        correctAnswer: "A",
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Suggests pitching the plan as two separate stages",
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-6: Who expresses each of the following opinions? Choose A for Priya or B for Jamal. Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Priya" },
          { key: "B", text: "Jamal" },
        ],
      },
    ],
  },
  {
    id: "ls-10",
    title: "Dendrochronology: Dating with Tree Rings",
    testNumber: 3,
    part: 4,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Lecturer",
        line: "Good morning. Today I want to talk about dendrochronology — the science of dating events, environmental change, and archaeological artefacts by analysing the pattern of growth rings in trees.",
      },
      {
        speaker: "Lecturer",
        line: "The basic principle is straightforward: a tree typically adds one visible ring to its trunk every year, and the width of that ring depends heavily on the growing conditions that year — wider rings in good years with plenty of rainfall and warmth, narrower rings in a drought year or otherwise poor year.",
      },
      {
        speaker: "Lecturer",
        line: "Because weather conditions affect trees across a wide area in similar ways, trees growing at the same time in the same region tend to show a similar pattern of wide and narrow rings, almost like a fingerprint for that particular stretch of years.",
      },
      {
        speaker: "Lecturer",
        line: "This allows researchers to do something called cross-dating. If you take a sample from a very old, still-living tree and compare its ring pattern with a sample from, say, a wooden beam in an old building, you can often match overlapping sections of the pattern and work out exactly which years the beam's wood grew through.",
      },
      {
        speaker: "Lecturer",
        line: "By chaining together overlapping patterns from living trees, dead trees, and ancient timber, researchers have built up tree-ring records extending back more than 10,000 years in some regions, particularly using long-lived species such as bristlecone pine.",
      },
      {
        speaker: "Lecturer",
        line: "Dendrochronology has proved especially useful in archaeology for dating wooden structures and artefacts with a precision that radiocarbon dating alone usually cannot match, since radiocarbon dating typically carries an uncertainty range of decades, while tree-ring dating can often pinpoint the exact calendar year a tree was felled.",
      },
      {
        speaker: "Lecturer",
        line: "It has also become an important tool in climate science, since the ring widths themselves serve as an indirect record of historical temperature and rainfall, letting researchers reconstruct climate conditions for periods long before modern weather records began.",
      },
      {
        speaker: "Lecturer",
        line: "There are limitations, of course. The technique depends entirely on having overlapping samples available, and it works far better in regions with a single clear growing season each year — tropical trees, which may grow continuously year-round, often don't produce the same kind of clearly countable annual rings at all.",
      },
      {
        speaker: "Lecturer",
        line: "For your reading this week, I'd like you to look at the case study on how tree-ring dating was used to date the timbers of a shipwreck, and come prepared to discuss how researchers dealt with an incomplete set of overlapping samples.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does dendrochronology study to date events and artefacts?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "growth rings",
        acceptableAnswers: ["growth rings", "tree rings", "tree-ring patterns"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In what kind of year does a tree typically produce a narrower ring?",
        wordLimit: "NO MORE THAN TWO WORDS",
        correctAnswer: "drought year",
        acceptableAnswers: ["drought year", "a drought year", "poor year", "a poor year"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the process called where overlapping ring patterns from different wood samples are matched?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "cross-dating",
        acceptableAnswers: ["cross-dating", "cross dating"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Which long-lived tree species is mentioned as useful for building very old tree-ring records?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "bristlecone pine",
        acceptableAnswers: ["bristlecone pine"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Approximately how far back do some tree-ring records extend?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "10,000 years",
        acceptableAnswers: ["10,000 years", "10000 years", "more than 10,000 years", "ten thousand years"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What dating method is mentioned as usually less precise than tree-ring dating?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "radiocarbon dating",
        acceptableAnswers: ["radiocarbon dating", "radiocarbon"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Besides archaeology, which field also uses dendrochronology to study historical conditions?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "climate science",
        acceptableAnswers: ["climate science"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What kind of trees often fail to produce clearly countable annual rings?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "tropical trees",
        acceptableAnswers: ["tropical trees"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does the case study for this week's reading involve dating?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a shipwreck",
        acceptableAnswers: ["a shipwreck", "shipwreck", "shipwreck timbers"],
      },
    ],
  },
  {
    id: "ls-11",
    title: "Signing Up for a Local Photography Club",
    testNumber: 4,
    part: 1,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      { speaker: "Coordinator", line: "Riverside Photography Club, hello, this is Mark speaking." },
      { speaker: "Caller", line: "Hi, I saw your club advertised at the library and wanted to find out more about joining." },
      { speaker: "Coordinator", line: "Great, happy to help. Could I get your name first?" },
      { speaker: "Caller", line: "It's Amara Johnson. That's J-O-H-N-S-O-N." },
      { speaker: "Coordinator", line: "Thanks, Amara. Have you done much photography before, or would you call yourself a beginner?" },
      { speaker: "Caller", line: "More of a beginner, I think. I've got a decent camera but I don't really know how to use it properly yet." },
      {
        speaker: "Coordinator",
        line: "That's absolutely fine, we have members at every level. We meet every Tuesday evening at the community hall, from seven until nine, and membership is twenty-two pounds a year.",
      },
      { speaker: "Caller", line: "Does that include any equipment, or do I need to bring my own camera?" },
      {
        speaker: "Coordinator",
        line: "You'll need your own camera, but we do have a couple of tripods members can borrow during sessions. We also run a monthly outdoor shoot on a Saturday morning, usually somewhere different each time — last month was the botanical gardens.",
      },
      { speaker: "Caller", line: "That sounds great. Is there anything I should bring to my first session?" },
      {
        speaker: "Coordinator",
        line: "Just your camera and, if you have one, the instruction manual, since the first session is usually a basic settings workshop. We also ask new members to bring a printed photo of their own to share with the group.",
      },
      { speaker: "Caller", line: "No problem, I can do that. How do I actually sign up?" },
      { speaker: "Coordinator", line: "I'll just need your email address to send over the membership form." },
      { speaker: "Caller", line: "Sure, it's amara dot johnson at mailbox dot com." },
      { speaker: "Coordinator", line: "Perfect, I'll send that across today. We'll see you this Tuesday!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's surname?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Johnson",
        acceptableAnswers: ["Johnson"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How would the caller describe her photography experience?",
        options: [
          { key: "A", text: "Advanced" },
          { key: "B", text: "Beginner" },
          { key: "C", text: "Professional" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What day of the week does the club meet?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Tuesday",
        acceptableAnswers: ["Tuesday"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time do sessions start?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "7pm",
        acceptableAnswers: ["7pm", "7 pm", "seven pm", "seven o'clock"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How much does membership cost per year?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "£22",
        acceptableAnswers: ["£22", "22 pounds", "twenty-two pounds"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What equipment can members borrow during sessions?",
        options: [
          { key: "A", text: "Cameras" },
          { key: "B", text: "Tripods" },
          { key: "C", text: "Lenses" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where was last month's outdoor shoot held?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the botanical gardens",
        acceptableAnswers: ["the botanical gardens", "botanical gardens"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What are new members asked to bring to their first session, besides a camera?",
        options: [
          { key: "A", text: "A tripod" },
          { key: "B", text: "A printed photo" },
          { key: "C", text: "A notebook" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the caller's email address?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "amara.johnson@mailbox.com",
        acceptableAnswers: ["amara.johnson@mailbox.com"],
      },
    ],
  },
  {
    id: "ls-12",
    title: "Ten Years with Mountain Rescue",
    testNumber: 4,
    part: 2,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Volunteer",
        line: "Good evening everyone, thanks for having me. I've been asked to talk a little about my ten years as a volunteer with the mountain rescue team, and what the role actually involves day to day.",
      },
      {
        speaker: "Volunteer",
        line: "I first got involved almost by accident — I was a keen hiker myself, and after being helped off a hillside with a sprained ankle one winter, I decided I wanted to give something back rather than just thank the team and move on.",
      },
      {
        speaker: "Volunteer",
        line: "The training was far more demanding than I expected. Before you're allowed on a single real callout, you spend roughly eighteen months training in navigation, first aid, rope rescue techniques, and radio communication, and you're assessed continuously throughout, not just at the end.",
      },
      {
        speaker: "Volunteer",
        line: "People sometimes assume the job is mostly dramatic helicopter rescues, but in reality, the majority of callouts involve walkers who are simply lost or who've underestimated how quickly weather can change on higher ground. Genuine technical rescues, involving ropes or stretchers, make up a much smaller proportion of what we actually do.",
      },
      {
        speaker: "Volunteer",
        line: "One thing that surprised me early on is how much of the role is about reassurance rather than physical rescue. Someone who is cold, frightened, and disoriented often just needs a calm, confident presence beside them before anything else.",
      },
      {
        speaker: "Volunteer",
        line: "We're entirely volunteer-run and unpaid, which means every callout, regardless of time of day or weather, relies on people giving up their own time for free, often at very short notice.",
      },
      {
        speaker: "Volunteer",
        line: "The hardest part for me personally isn't the physical demands, it's the unpredictability — you genuinely never know if a callout will be a twenty-minute job or stretch into an entire night on the hillside.",
      },
      {
        speaker: "Volunteer",
        line: "If I could tell anyone considering volunteering one thing, it would be that it genuinely changes how you see your local hills — you start noticing weather patterns and terrain in a completely different way.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What first motivated the speaker to join the mountain rescue team?",
        options: [
          { key: "A", text: "A childhood interest in rescue work" },
          { key: "B", text: "Being helped after an injury herself" },
          { key: "C", text: "A friend recommended it" },
          { key: "D", text: "She saw a recruitment advert" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How long does initial training typically take before a volunteer can join a real callout?",
        options: [
          { key: "A", text: "Six months" },
          { key: "B", text: "One year" },
          { key: "C", text: "Eighteen months" },
          { key: "D", text: "Two years" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "According to the speaker, what makes up the majority of callouts?",
        options: [
          { key: "A", text: "Technical rope rescues" },
          { key: "B", text: "Helicopter evacuations" },
          { key: "C", text: "Lost or weather-affected walkers" },
          { key: "D", text: "Medical emergencies" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO things does the speaker say about the mountain rescue role?",
        chooseCount: 2,
        options: [
          { key: "A", text: "It is entirely unpaid" },
          { key: "B", text: "Most callouts involve dramatic helicopter rescues" },
          { key: "C", text: "Reassurance is often as important as physical rescue" },
          { key: "D", text: "Training takes less than six months" },
          { key: "E", text: "The team charges a fee for rescues" },
        ],
        correctAnswers: ["A", "C"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many years has the speaker volunteered with the team?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "ten years",
        acceptableAnswers: ["ten years", "10 years"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does the speaker say is the hardest part of the role for her personally?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the unpredictability",
        acceptableAnswers: ["the unpredictability", "unpredictability"],
      },
    ],
  },
  {
    id: "ls-13",
    title: "Improving the Campus Bike-Recycling Scheme",
    testNumber: 4,
    part: 3,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Noah",
        line: "So for our project on the campus bike-recycling scheme, I think we should focus on why so few students actually donate their old bikes when they leave.",
      },
      {
        speaker: "Elena",
        line: "Right, I looked into that a bit. A lot of people just don't know the scheme exists until their final year, which is obviously too late to plan around.",
      },
      {
        speaker: "Noah",
        line: "That matches what I found too. I think better publicity earlier on, like during first-year orientation, would make a real difference.",
      },
      {
        speaker: "Elena",
        line: "I agree publicity matters, but I actually think the bigger issue is convenience. Even students who know about the scheme have to physically drop the bike off at one specific location, which isn't always easy if you don't have transport.",
      },
      {
        speaker: "Noah",
        line: "That's fair. Maybe a pick-up service, even just during the end of the academic year when most people are moving out, would solve that.",
      },
      {
        speaker: "Elena",
        line: "I like that idea. We could also mention in the report that donated bikes are currently repaired entirely by volunteers, which limits how many can be refurbished each year.",
      },
      {
        speaker: "Noah",
        line: "Good point. Should we suggest partnering with the engineering department? Students there might actually want the repair experience.",
      },
      {
        speaker: "Elena",
        line: "That could work well, and it wouldn't cost the scheme anything extra, which makes it an easier recommendation to include.",
      },
      {
        speaker: "Noah",
        line: "Agreed. I'll write up the publicity and pick-up service sections if you cover the volunteer and repair-partnership part.",
      },
      { speaker: "Elena", line: "Deal. Let's compare notes again on Thursday." },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What does Elena identify as a bigger issue affecting donations than awareness?",
        options: [
          { key: "A", text: "Cost of repairs" },
          { key: "B", text: "Lack of convenient drop-off" },
          { key: "C", text: "Lack of storage space" },
          { key: "D", text: "Poor condition of bikes" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO solutions do the students agree are worth including in their report?",
        chooseCount: 2,
        options: [
          { key: "A", text: "A pick-up service at the end of the academic year" },
          { key: "B", text: "Partnering with the engineering department" },
          { key: "C", text: "Charging a small donation fee" },
          { key: "D", text: "Hiring paid repair staff" },
          { key: "E", text: "Removing the scheme entirely" },
        ],
        correctAnswers: ["A", "B"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Believes poor awareness of the scheme is the main reason for low donations",
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Believes convenience is a bigger barrier than awareness",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Suggests a partnership that wouldn't cost the scheme anything extra",
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-5: Who expresses each of the following opinions? Choose A for Noah or B for Elena. Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Noah" },
          { key: "B", text: "Elena" },
        ],
      },
    ],
  },
  {
    id: "ls-14",
    title: "Axolotls and the Science of Regeneration",
    testNumber: 4,
    part: 4,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Lecturer",
        line: "Good morning. Today's lecture looks at one of the more remarkable abilities in the animal kingdom: the capacity of the axolotl, a type of salamander native to a small number of lakes in central Mexico, to regenerate entire limbs, and in some cases even parts of its heart, spinal cord, and brain.",
      },
      {
        speaker: "Lecturer",
        line: "Unlike most vertebrates, which heal an injury by forming scar tissue, an axolotl responds to the loss of a limb by forming what's called a blastema — a mass of unspecialised cells that gathers at the wound site within hours of the injury.",
      },
      {
        speaker: "Lecturer",
        line: "Over the following weeks, cells within this blastema gradually redifferentiate into exactly the tissue types needed — muscle, bone, skin, nerve — eventually reconstructing a fully functional limb, often almost indistinguishable from the original.",
      },
      {
        speaker: "Lecturer",
        line: "What makes this particularly interesting to researchers is that axolotls can repeat this process essentially indefinitely, regenerating the same limb repeatedly without any apparent decline in the quality of the regrowth, something not observed in almost any other vertebrate studied to date.",
      },
      {
        speaker: "Lecturer",
        line: "Researchers have identified that mature axolotl cells appear to temporarily reprogram themselves at the injury site, taking on properties closer to those of embryonic cells, without ever losing track of their original tissue identity, a surprisingly precise balancing act that scientists are still working to fully understand.",
      },
      {
        speaker: "Lecturer",
        line: "There's an obvious medical interest here: if researchers can identify precisely which genetic pathways allow this reprogramming to happen safely, the long-term hope is that similar processes might eventually be triggered, in a controlled way, in human tissue following serious injury.",
      },
      {
        speaker: "Lecturer",
        line: "One significant obstacle is that axolotls are, in the wild, critically endangered, surviving in just one remaining lake system, largely due to water pollution and the introduction of non-native fish species that prey on young axolotls.",
      },
      {
        speaker: "Lecturer",
        line: "Ironically, the species is now far more numerous in laboratories and as pets around the world than it is in its natural habitat, a situation some conservationists describe as deeply troubling despite the scientific value the species continues to provide.",
      },
      {
        speaker: "Lecturer",
        line: "For next week, I'd like you to read the paper comparing axolotl limb regeneration with the more limited regenerative capacity seen in frogs, and come prepared to discuss what factors might explain the difference between the two.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the mass of unspecialised cells that forms at an axolotl's wound site called?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a blastema",
        acceptableAnswers: ["a blastema", "blastema"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Besides limbs, name one other body part an axolotl can regenerate, according to the lecturer.",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "heart",
        acceptableAnswers: ["heart", "spinal cord", "brain"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What do axolotl cells appear to temporarily reprogram themselves to resemble at the injury site?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "embryonic cells",
        acceptableAnswers: ["embryonic cells"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What does the lecturer hope could eventually be safely triggered in human tissue following injury?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "similar processes",
        acceptableAnswers: ["similar processes", "regeneration"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "In how many lake systems do wild axolotls now survive?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "one",
        acceptableAnswers: ["one", "1"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Besides water pollution, what else threatens wild axolotls, according to the lecture?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "non-native fish",
        acceptableAnswers: ["non-native fish", "non-native fish species"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where are axolotls now more numerous than in the wild?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "laboratories",
        acceptableAnswers: ["laboratories", "labs"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What animal will next week's reading compare axolotl regeneration against?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "frogs",
        acceptableAnswers: ["frogs"],
      },
    ],
  },
  {
    id: "ls-15",
    title: "Visiting the Elmworth Farmers Market",
    testNumber: 5,
    part: 1,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      { speaker: "Agent", line: "Elmworth Visitor Information, good afternoon." },
      { speaker: "Caller", line: "Hi, I'm hoping to visit the farmers market this weekend — could you tell me a bit about it?" },
      { speaker: "Agent", line: "Of course! It runs every Saturday from eight in the morning until one in the afternoon, in Market Square, right in the town centre." },
      { speaker: "Caller", line: "Great. Is there parking nearby?" },
      {
        speaker: "Agent",
        line: "There's a car park on Bridge Street, about five minutes' walk away, but it does fill up quickly, so arriving before nine is a good idea if you're driving.",
      },
      { speaker: "Caller", line: "Noted. Roughly how many stalls are there?" },
      {
        speaker: "Agent",
        line: "Around thirty-five stalls on a typical Saturday, selling everything from fresh produce to local cheese, bread, and crafts.",
      },
      { speaker: "Caller", line: "Sounds great. Do any of the stalls take card payments, or is it cash only?" },
      {
        speaker: "Agent",
        line: "Most do take card now, though a handful of the smaller stalls are still cash only, so it's worth bringing a little cash just in case.",
      },
      { speaker: "Caller", line: "Good to know. Is there anywhere to sit down and eat?" },
      { speaker: "Agent", line: "Yes, there's a small seating area with about twenty tables set up near the fountain in the middle of the square." },
      { speaker: "Caller", line: "Perfect. One last thing — is the market held rain or shine?" },
      { speaker: "Agent", line: "It runs rain or shine, though a few of the stalls may not open if the weather's especially bad. Most do though." },
      { speaker: "Caller", line: "Great, thanks for all the information." },
      { speaker: "Agent", line: "You're welcome, enjoy your visit!" },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the market open?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "8am",
        acceptableAnswers: ["8am", "8 am", "eight am", "eight o'clock"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time does the market close?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "1pm",
        acceptableAnswers: ["1pm", "1 pm", "one pm", "one o'clock"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where is the market held?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Market Square",
        acceptableAnswers: ["Market Square"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Where is the nearest car park?",
        options: [
          { key: "A", text: "Bridge Street" },
          { key: "B", text: "Market Square" },
          { key: "C", text: "Fountain Street" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "By what time does the agent recommend arriving if driving?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "9am",
        acceptableAnswers: ["9am", "9 am", "nine am", "nine o'clock"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Approximately how many stalls are there on a typical Saturday?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "35",
        acceptableAnswers: ["35", "thirty-five"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How should visitors pay at a handful of the smaller stalls?",
        options: [
          { key: "A", text: "Card only" },
          { key: "B", text: "Cash only" },
          { key: "C", text: "Mobile payment only" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "How many tables are in the seating area?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "20",
        acceptableAnswers: ["20", "twenty"],
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where is the seating area located?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "near the fountain",
        acceptableAnswers: ["near the fountain", "by the fountain"],
      },
    ],
  },
  {
    id: "ls-16",
    title: "Elmworth Children's Reading Festival",
    testNumber: 5,
    part: 2,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Organiser",
        line: "Good morning, and welcome to this year's Elmworth Children's Reading Festival. I'm Hannah, and I'll run through today's workshops and a few book recommendations before you head off to explore.",
      },
      {
        speaker: "Organiser",
        line: "We have four workshops running throughout the day. The storytelling workshop, suitable for ages four to six, runs in the Blue Room and focuses on acting out favourite stories together. The illustration workshop, for ages seven to nine, takes place in the Garden Room, where children create their own book cover.",
      },
      {
        speaker: "Organiser",
        line: "For slightly older children, ages ten to twelve, we have a creative writing workshop in the Library Hall, where participants start a short story they can take home to finish. And for any age, there's a puppet-making workshop running all day in the Courtyard, no booking required.",
      },
      {
        speaker: "Organiser",
        line: "Each of the booked workshops — storytelling, illustration, and creative writing — requires registration at the main desk, and spaces are limited to fifteen children per session.",
      },
      {
        speaker: "Organiser",
        line: "Now, a few book recommendations for different ages. For younger readers, we'd recommend 'The Whispering Wood', a beautifully illustrated picture book about a child exploring an enchanted forest. For middle-grade readers, 'Secrets of Pinehollow' is a mystery adventure that's proven extremely popular this year.",
      },
      {
        speaker: "Organiser",
        line: "And for older children moving toward young adult fiction, 'The Clockmaker's Daughter' — not to be confused with the adult novel of a similar name — is a historical adventure story that's had excellent reviews.",
      },
      {
        speaker: "Organiser",
        line: "All three recommended titles are available to borrow today at a special festival discount, and we'll also have the author of 'Secrets of Pinehollow' available for a signing session at two o'clock in the Library Hall.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Storytelling workshop",
        correctAnswer: "A",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Illustration workshop",
        correctAnswer: "B",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Creative writing workshop",
        correctAnswer: "C",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Puppet-making workshop",
        correctAnswer: "D",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO recommended books are aimed at younger or middle-grade readers rather than older children?",
        chooseCount: 2,
        options: [
          { key: "A", text: "The Whispering Wood" },
          { key: "B", text: "Secrets of Pinehollow" },
          { key: "C", text: "The Clockmaker's Daughter" },
          { key: "D", text: "A title not mentioned in the talk" },
          { key: "E", text: "An adult novel with a similar name" },
        ],
        correctAnswers: ["A", "B"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time is the signing session for the author of 'Secrets of Pinehollow'?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "2pm",
        acceptableAnswers: ["2pm", "2 pm", "two pm", "two o'clock"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "How many children can register per session for the booked workshops?",
        options: [
          { key: "A", text: "10" },
          { key: "B", text: "15" },
          { key: "C", text: "20" },
        ],
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 1-4: Which room is each workshop held in? Choose the correct room, A-D. Each letter may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Blue Room" },
          { key: "B", text: "Garden Room" },
          { key: "C", text: "Library Hall" },
          { key: "D", text: "Courtyard" },
        ],
      },
    ],
  },
  {
    id: "ls-17",
    title: "Designing a Seedling-Growth Experiment",
    testNumber: 5,
    part: 3,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Maya",
        line: "So for our biology project, I think we should test whether the type of light affects how quickly seedlings grow, rather than just testing water amounts like most groups are doing.",
      },
      {
        speaker: "Tom",
        line: "I like that idea, it's more original. Should we use natural sunlight as one of our conditions, or stick to artificial light sources only so we can control it more precisely?",
      },
      {
        speaker: "Maya",
        line: "I think we need at least one natural sunlight group as a baseline, otherwise reviewers might question whether our artificial conditions are realistic at all.",
      },
      {
        speaker: "Tom",
        line: "Fair point. So maybe three groups: natural sunlight, white LED light, and red LED light, since red light is supposed to affect plant growth differently.",
      },
      {
        speaker: "Maya",
        line: "That works. How many seedlings per group do you think we need for the results to actually mean anything?",
      },
      {
        speaker: "Tom",
        line: "I'd say at least ten per group, otherwise one unusually fast or slow seedling could completely skew a small group's average.",
      },
      { speaker: "Maya", line: "Agreed. What should we actually measure — just height, or something else too?" },
      {
        speaker: "Tom",
        line: "I think height alone might miss something important. We should probably measure leaf count as well, since a plant could grow tall but produce very few leaves under poor light.",
      },
      { speaker: "Maya", line: "Good call. How long should we run the experiment for?" },
      {
        speaker: "Tom",
        line: "Three weeks feels about right — long enough to see a real difference, but not so long that we run out of time before the report is due.",
      },
      {
        speaker: "Maya",
        line: "Agreed. I'll set up the natural sunlight and white LED groups if you handle the red LED group and daily measurements.",
      },
      { speaker: "Tom", line: "Deal. Let's check in on progress every few days." },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What does Maya suggest testing instead of water amounts?",
        options: [
          { key: "A", text: "Soil type" },
          { key: "B", text: "Light type" },
          { key: "C", text: "Temperature" },
          { key: "D", text: "Seedling age" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO measurements do the students decide to record?",
        chooseCount: 2,
        options: [
          { key: "A", text: "Height" },
          { key: "B", text: "Leaf count" },
          { key: "C", text: "Root length" },
          { key: "D", text: "Stem thickness" },
          { key: "E", text: "Flower count" },
        ],
        correctAnswers: ["A", "B"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Suggests including natural sunlight as a baseline condition",
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Recommends measuring leaf count in addition to height",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Will handle the red LED light group and daily measurements",
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 3-5: Who makes each of the following points? Choose A for Maya or B for Tom. Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Maya" },
          { key: "B", text: "Tom" },
        ],
      },
    ],
  },
  {
    id: "ls-18",
    title: "Soil Erosion and Regenerative Farming",
    testNumber: 5,
    part: 4,
    isNew: false,
    estimatedMinutes: 10,
    script: [
      {
        speaker: "Lecturer",
        line: "Good morning. Today's lecture covers soil erosion — one of agriculture's oldest problems — and some of the regenerative farming practices now being used to address it.",
      },
      {
        speaker: "Lecturer",
        line: "Soil erosion occurs when topsoil, the nutrient-rich layer essential for plant growth, is worn away faster than natural processes can replace it, typically through the action of wind, rain, or poor agricultural practices.",
      },
      {
        speaker: "Lecturer",
        line: "Globally, it's estimated that it can take anywhere from several hundred to over a thousand years for natural processes to form just a few centimetres of new topsoil, which is why erosion caused by intensive farming over just a few decades can represent an effectively irreversible loss within a human timescale.",
      },
      {
        speaker: "Lecturer",
        line: "One of the main contributing practices historically has been deep ploughing, known as tillage, which breaks up soil structure and leaves it far more exposed to being carried away by wind and rain between growing seasons.",
      },
      {
        speaker: "Lecturer",
        line: "In response, many farmers have adopted what's called no-till or low-till farming, which disturbs the soil as little as possible when planting, leaving previous crop residue on the surface to protect it, rather than ploughing it under.",
      },
      {
        speaker: "Lecturer",
        line: "Cover cropping is another widely adopted technique, where a secondary crop, not intended for harvest, is planted specifically to keep roots in the soil and ground covered during periods when the main crop isn't growing, substantially reducing erosion risk.",
      },
      {
        speaker: "Lecturer",
        line: "Crop rotation, planting different crops in sequence across seasons rather than the same crop repeatedly, is a third major practice, since it prevents the specific nutrient depletion and pest build-up associated with growing one crop continuously in the same soil.",
      },
      {
        speaker: "Lecturer",
        line: "Early results from farms adopting these combined practices have been promising: several long-term studies have recorded measurable increases in soil organic matter within as little as five years, a meaningfully fast timescale for a process that, left to nature alone, would take centuries.",
      },
      {
        speaker: "Lecturer",
        line: "For next week, I'd like you to read the case study on a Midwestern farm that transitioned fully to regenerative practices over a ten-year period, and come prepared to discuss what economic challenges farmers face during that transition.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the nutrient-rich layer essential for plant growth called?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "topsoil",
        acceptableAnswers: ["topsoil"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Besides wind, what else commonly causes soil erosion?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "rain",
        acceptableAnswers: ["rain", "poor agricultural practices"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is deep ploughing also known as?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "tillage",
        acceptableAnswers: ["tillage"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What type of farming disturbs the soil as little as possible when planting?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "no-till farming",
        acceptableAnswers: ["no-till farming", "no-till", "low-till farming"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is planted specifically to keep roots in the soil when the main crop isn't growing?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a cover crop",
        acceptableAnswers: ["a cover crop", "cover crop"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What farming practice involves planting different crops in sequence across seasons?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "crop rotation",
        acceptableAnswers: ["crop rotation"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Within how many years have some studies recorded measurable increases in soil organic matter?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "five years",
        acceptableAnswers: ["five years", "5 years"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What period did the Midwestern farm in next week's case study take to transition to regenerative practices?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "ten years",
        acceptableAnswers: ["ten years", "10 years"],
      },
    ],
  },
  {
    id: "ls-19",
    title: "First Day at Northgate Retail",
    testNumber: 6,
    part: 1,
    isNew: true,
    estimatedMinutes: 10,
    script: [
      { speaker: "Manager", line: "Welcome to your first day, I'm Claire, the store manager. I'll just run through a few things before you start on the shop floor." },
      { speaker: "Employee", line: "Great, thank you." },
      { speaker: "Manager", line: "First things first — could I get your full name for our records?" },
      { speaker: "Employee", line: "It's Daniel Osei. That's O-S-E-I." },
      { speaker: "Manager", line: "Thanks, Daniel. Your staff ID badge will be ready by the end of today, but for now, just wear this temporary visitor pass." },
      { speaker: "Employee", line: "No problem. What time should I arrive each day?" },
      {
        speaker: "Manager",
        line: "Your shift starts at nine, but we ask new staff to arrive at quarter to nine during their first week, just to get settled before the doors open.",
      },
      { speaker: "Employee", line: "Understood. What will I actually be doing today?" },
      {
        speaker: "Manager",
        line: "This morning you'll shadow Priya on the tills to learn the checkout system, and this afternoon you'll help restock the shelves in the homeware section.",
      },
      { speaker: "Employee", line: "Sounds good. Is there a staff room I can leave my things in?" },
      {
        speaker: "Manager",
        line: "Yes, it's just through the door marked 'Staff Only' at the back of the shop, next to the stockroom. There are lockers available, you'll just need to bring your own padlock.",
      },
      { speaker: "Employee", line: "Got it. And what's the uniform?" },
      {
        speaker: "Manager",
        line: "We provide a branded polo shirt, which you'll collect today, but trousers and shoes are your own — just make sure they're plain black.",
      },
      { speaker: "Employee", line: "Okay, that's clear. One last question — who do I speak to if I have any issues once I start?" },
      { speaker: "Manager", line: "Your direct supervisor will be Marcus, he's the deputy manager, and he's usually on the shop floor most of the day." },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the new employee's surname?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Osei",
        acceptableAnswers: ["Osei"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What should the new employee wear for now, before their staff ID badge is ready?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a visitor pass",
        acceptableAnswers: ["a visitor pass", "visitor pass", "a temporary visitor pass"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What time should new staff arrive during their first week?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "8:45am",
        acceptableAnswers: ["8:45am", "8:45 am", "quarter to nine", "8.45am"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What will the employee do this morning?",
        options: [
          { key: "A", text: "Restock shelves" },
          { key: "B", text: "Shadow someone on the tills" },
          { key: "C", text: "Attend a training session" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Which section will the employee help restock this afternoon?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "homeware",
        acceptableAnswers: ["homeware", "homeware section"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Where is the staff room located?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "by the stockroom",
        acceptableAnswers: ["by the stockroom", "next to the stockroom"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What must staff bring themselves to use the lockers?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a padlock",
        acceptableAnswers: ["a padlock", "padlock"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What colour should staff's own trousers and shoes be?",
        options: [
          { key: "A", text: "Black" },
          { key: "B", text: "Navy" },
          { key: "C", text: "Grey" },
        ],
        correctAnswer: "A",
      },
      {
        id: "q9",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the name of the employee's direct supervisor?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "Marcus",
        acceptableAnswers: ["Marcus"],
      },
    ],
  },
  {
    id: "ls-20",
    title: "Joining Elmridge Running Club",
    testNumber: 6,
    part: 2,
    isNew: true,
    estimatedMinutes: 10,
    script: [
      { speaker: "Leader", line: "Good evening everyone, thanks for coming along to find out more about joining Elmridge Running Club." },
      {
        speaker: "Leader",
        line: "We cater for all abilities, from complete beginners to experienced marathon runners, and we meet three times a week — Tuesday and Thursday evenings, plus a longer run on Sunday mornings.",
      },
      {
        speaker: "Leader",
        line: "People join us for all sorts of reasons. Some are training specifically for an upcoming race, others are looking to improve their general fitness, and quite a few simply want the social side of running with a group rather than training alone.",
      },
      {
        speaker: "Leader",
        line: "Membership costs thirty pounds a year, which includes a club running vest, entry to our monthly time trial, and a discount at two local sports shops.",
      },
      {
        speaker: "Leader",
        line: "We also organise a small number of social events throughout the year — nothing too serious, just things like a summer barbecue and an end-of-year awards evening.",
      },
      {
        speaker: "Leader",
        line: "If you're a complete beginner, I'd recommend coming along to our Tuesday session specifically, since that's aimed at a slower pace and is led by one of our qualified coaches.",
      },
      {
        speaker: "Leader",
        line: "Thursday sessions tend to be faster-paced interval training, more suited to people with some running experience already, and Sunday's long run varies in pace depending on who turns up.",
      },
      {
        speaker: "Leader",
        line: "One thing I should mention: we do ask all members to carry some form of ID or emergency contact information whenever running with us, particularly for the longer Sunday routes.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        prompt: "Which TWO of the following does membership include?",
        chooseCount: 2,
        options: [
          { key: "A", text: "A club running vest" },
          { key: "B", text: "Free entry to external races" },
          { key: "C", text: "Entry to the monthly time trial" },
          { key: "D", text: "A free pair of running shoes" },
          { key: "E", text: "Personal coaching sessions" },
        ],
        correctAnswers: ["A", "C"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Recommended for complete beginners",
        correctAnswer: "A",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Faster-paced interval training for more experienced runners",
        correctAnswer: "B",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Pace varies depending on who attends",
        correctAnswer: "C",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "What must members carry while running with the club, especially on Sundays?",
        options: [
          { key: "A", text: "A water bottle" },
          { key: "B", text: "ID or emergency contact information" },
          { key: "C", text: "A mobile phone" },
        ],
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 2-4: Which session does each statement describe? Choose the correct session, A-C. Each letter may be used only once.",
        allowReuse: false,
        optionPool: [
          { key: "A", text: "Tuesday" },
          { key: "B", text: "Thursday" },
          { key: "C", text: "Sunday" },
        ],
      },
    ],
  },
  {
    id: "ls-21",
    title: "Reorganising the Family Bookshop",
    testNumber: 6,
    part: 3,
    isNew: true,
    estimatedMinutes: 10,
    script: [
      { speaker: "Ella", line: "I think we need to rethink how the shop is laid out before the holiday rush starts." },
      { speaker: "Sam", line: "Agreed. What's bothering you most about the current layout?" },
      {
        speaker: "Ella",
        line: "Mainly that the children's section is tucked right at the back, past the till, so parents with prams struggle to get to it easily.",
      },
      { speaker: "Sam", line: "That's a fair point. Should we swap it with the travel section near the front then?" },
      {
        speaker: "Ella",
        line: "I was actually thinking we move children's books to where the travel section currently is, and shift travel further back instead, since travel customers tend to browse longer and don't mind walking a bit further.",
      },
      { speaker: "Sam", line: "Makes sense. What about the local history section? It's barely visited where it is now, tucked in the corner." },
      {
        speaker: "Ella",
        line: "I'd leave that where it is, honestly — it's a small, dedicated group of regulars who already know exactly where to find it, moving it might just confuse them.",
      },
      { speaker: "Sam", line: "Fair enough. And the bestsellers table?" },
      { speaker: "Ella", line: "That should definitely stay right by the entrance, it's working well there and it's the first thing people see." },
      { speaker: "Sam", line: "Agreed. So just children's and travel swapping places, local history and bestsellers staying put." },
      { speaker: "Ella", line: "Exactly. I'll handle relabelling the shelves if you can manage reordering the stock lists." },
      { speaker: "Sam", line: "Deal, let's aim to have it done by the weekend." },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt: "Why does Ella want to move the children's section?",
        options: [
          { key: "A", text: "It gets too much foot traffic" },
          { key: "B", text: "It's difficult for parents with prams to reach" },
          { key: "C", text: "The shelves are too small" },
          { key: "D", text: "It's too close to the till" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Children's section",
        correctAnswer: "A",
      },
      {
        id: "q3",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Travel section",
        correctAnswer: "A",
      },
      {
        id: "q4",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Local history section",
        correctAnswer: "B",
      },
      {
        id: "q5",
        type: QUESTION_TYPES.MATCHING,
        groupId: "g1",
        prompt: "Bestsellers table",
        correctAnswer: "B",
      },
    ],
    questionGroups: [
      {
        id: "g1",
        instructions: "Questions 2-5: Will each section move or stay in its current location? Choose A for Move or B for Stay. Each letter may be used more than once.",
        allowReuse: true,
        optionPool: [
          { key: "A", text: "Move" },
          { key: "B", text: "Stay" },
        ],
      },
    ],
  },
  {
    id: "ls-22",
    title: "Mangrove Forest Restoration",
    testNumber: 6,
    part: 4,
    isNew: true,
    estimatedMinutes: 10,
    script: [
      { speaker: "Lecturer", line: "Good morning. Today's lecture focuses on mangrove forest restoration, an increasingly important area of coastal ecology." },
      {
        speaker: "Lecturer",
        line: "Mangroves are salt-tolerant trees and shrubs that grow along tropical and subtropical coastlines, forming dense forests in the intertidal zone between land and sea.",
      },
      {
        speaker: "Lecturer",
        line: "Globally, it's estimated that roughly a third of the world's mangrove forests have been lost since the 1980s, primarily due to coastal development, aquaculture, particularly shrimp farming, and agricultural conversion.",
      },
      {
        speaker: "Lecturer",
        line: "This loss matters considerably beyond the ecosystems themselves. Mangroves are remarkably effective at storing carbon, in some studies sequestering carbon at a rate several times higher per hectare than tropical rainforest.",
      },
      {
        speaker: "Lecturer",
        line: "They also provide significant coastal protection, with their dense root systems reducing wave energy and helping to prevent erosion, which has made restoration efforts a growing priority following several major coastal storms in the past two decades.",
      },
      {
        speaker: "Lecturer",
        line: "Restoration projects generally follow one of two approaches: active planting of mangrove seedlings, or what's called hydrological restoration, where researchers instead focus on restoring the natural water flow to a degraded site, allowing mangroves to recolonise the area on their own.",
      },
      {
        speaker: "Lecturer",
        line: "Interestingly, hydrological restoration has in many cases proved more successful long-term than active planting, since seedlings planted without the correct water conditions often fail to survive beyond the first few years.",
      },
      {
        speaker: "Lecturer",
        line: "Case studies from Indonesia have shown recovery of over eighty percent canopy cover within fifteen years at sites where hydrological restoration was prioritised, compared to considerably lower survival rates at nearby sites where seedlings alone were planted without addressing underlying water flow problems.",
      },
      {
        speaker: "Lecturer",
        line: "For next week, I'd like you to read the case study on community-led mangrove restoration in the Philippines, and come prepared to discuss what role local communities should play in restoration projects.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What type of trees form dense forests in the intertidal zone?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "mangroves",
        acceptableAnswers: ["mangroves"],
      },
      {
        id: "q2",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Roughly what fraction of the world's mangrove forests have been lost since the 1980s?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "a third",
        acceptableAnswers: ["a third", "one third", "roughly a third"],
      },
      {
        id: "q3",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Besides coastal development, what type of farming is a major cause of mangrove loss?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "aquaculture",
        acceptableAnswers: ["aquaculture", "shrimp farming"],
      },
      {
        id: "q4",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What do mangroves store at a notably high rate compared with tropical rainforest?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "carbon",
        acceptableAnswers: ["carbon"],
      },
      {
        id: "q5",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What do mangrove root systems help reduce, protecting coastlines?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "wave energy",
        acceptableAnswers: ["wave energy", "erosion"],
      },
      {
        id: "q6",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What is the name for the restoration approach that focuses on restoring natural water flow?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "hydrological restoration",
        acceptableAnswers: ["hydrological restoration"],
      },
      {
        id: "q7",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "What percentage of canopy cover was recovered within fifteen years at the Indonesian sites using hydrological restoration?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "80 percent",
        acceptableAnswers: ["80 percent", "over 80 percent", "80%"],
      },
      {
        id: "q8",
        type: QUESTION_TYPES.SHORT_ANSWER,
        prompt: "Which country's community-led restoration project is the subject of next week's reading?",
        wordLimit: "NO MORE THAN THREE WORDS",
        correctAnswer: "the Philippines",
        acceptableAnswers: ["the Philippines", "Philippines"],
      },
    ],
  },
];

function toPublicQuestion({ correctAnswer, acceptableAnswers, correctAnswers, ...rest }) {
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

// Groups the bank into complete tests (one test = its Parts 1-4), which is
// what the Listening practice picker offers — you choose a test and sit all
// of its parts in one go, rather than picking an individual part.
function getListeningTestBank() {
  const byTest = new Map();
  for (const section of LISTENING_SECTIONS) {
    if (!byTest.has(section.testNumber)) byTest.set(section.testNumber, []);
    byTest.get(section.testNumber).push(section);
  }

  return [...byTest.keys()]
    .sort((a, b) => a - b)
    .map((testNumber) => {
      const sections = byTest.get(testNumber).slice().sort((a, b) => a.part - b.part);
      return {
        testNumber,
        sectionIds: sections.map((s) => s.id),
        parts: sections.map((s) => s.part),
        questionCount: sections.reduce((sum, s) => sum + s.questions.length, 0),
        estimatedMinutes: sections.reduce((sum, s) => sum + s.estimatedMinutes, 0),
        // A test is "new" if any of its sections are — individual sections
        // don't get their own picker in Full Test mode, only the test as a
        // whole does, so the flag has to be aggregated up to this level.
        isNew: sections.some((s) => s.isNew),
      };
    });
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
  getListeningTestBank,
  getListeningSection,
  getListeningSectionWithAnswers,
  getAllListeningSectionsWithAnswers,
};
