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

export { QUESTION_TYPES, getListeningSectionBank, getListeningSection, getListeningSectionWithAnswers };
