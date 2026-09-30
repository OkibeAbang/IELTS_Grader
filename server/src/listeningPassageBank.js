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
    ],
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
