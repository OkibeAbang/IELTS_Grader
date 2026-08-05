/**
 * Static IELTS Speaking practice topic bank.
 *
 * These are original practice questions written to match the structure and
 * topic range of genuine IELTS Speaking tests (Part 1 short interview
 * questions, Part 2 cue card, Part 3 follow-up discussion linked to the
 * Part 2 topic) — they are NOT reproductions of specific real exam papers.
 * Treat this as a practice bank, not a verbatim past-paper archive.
 */

const SPEAKING_TOPICS = [
  {
    id: "st-01",
    topic: "Hometown & Living Environment",
    part1: {
      questions: [
        "Can you tell me a little about your hometown?",
        "What do you like most about the place where you live?",
        "Has your hometown changed much since you were a child?",
        "Would you like to live there in the future, or somewhere else?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a place you would like to visit in the future.",
        bulletPoints: [
          "where this place is",
          "how you learned about it",
          "what you would do there",
          "and explain why you would like to visit this place",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Why do people like to travel to new places?",
        "Do you think tourism brings more benefits or problems to a place?",
        "How has travel changed in your country over the last 20 years?",
        "Do you think people will travel more or less in the future? Why?",
      ],
    },
  },
  {
    id: "st-02",
    topic: "Work & Study",
    part1: {
      questions: [
        "Do you work or are you a student?",
        "What do you like about your job/studies?",
        "Is it more important to enjoy your job or to earn a high salary?",
        "What skills do you think are important for a job nowadays?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a job you would like to have in the future.",
        bulletPoints: [
          "what the job is",
          "what qualifications or skills it requires",
          "how you would prepare for it",
          "and explain why you would like this job",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "How is the job market changing in your country?",
        "Do you think automation and AI will replace many jobs in the future?",
        "What can governments do to help young people find work?",
        "Is it better to work for a large company or a small one? Why?",
      ],
    },
  },
  {
    id: "st-03",
    topic: "Technology & Communication",
    part1: {
      questions: [
        "How often do you use your smartphone?",
        "What kind of apps do you use most?",
        "Do you prefer texting or calling people?",
        "Has technology made communication easier or more difficult?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a piece of technology that you find useful.",
        bulletPoints: [
          "what it is",
          "how often you use it",
          "how you learned to use it",
          "and explain why you find it useful",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "How has technology changed the way people communicate with each other?",
        "Do you think people are becoming too dependent on technology?",
        "What are the disadvantages of relying on technology in daily life?",
        "How might communication technology change in the next 20 years?",
      ],
    },
  },
  {
    id: "st-04",
    topic: "Environment",
    part1: {
      questions: [
        "Do you think people in your country care about the environment?",
        "What do you do to help protect the environment?",
        "Is recycling common where you live?",
        "What environmental problems are most serious in your country?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe an environmental problem in your local area.",
        bulletPoints: [
          "what the problem is",
          "what causes it",
          "how it affects people's lives",
          "and explain what could be done to solve it",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Whose responsibility is it to protect the environment — individuals or governments?",
        "Do you think environmental problems will get better or worse in the future?",
        "What can schools do to teach children about the environment?",
        "Should companies be punished for polluting the environment?",
      ],
    },
  },
  {
    id: "st-05",
    topic: "Hobbies & Free Time",
    part1: {
      questions: [
        "What do you like to do in your free time?",
        "Did your hobbies change as you got older?",
        "Do you prefer indoor or outdoor activities?",
        "Is it important for people to have hobbies?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a hobby or activity that you enjoy.",
        bulletPoints: [
          "what the activity is",
          "how you started doing it",
          "how much time you spend on it",
          "and explain why you enjoy it",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Why do you think people need hobbies?",
        "Do you think people have less free time now than in the past?",
        "How do hobbies differ between older and younger generations?",
        "Should schools encourage students to have hobbies outside of studying?",
      ],
    },
  },
];

function getSpeakingTopicBank() {
  return SPEAKING_TOPICS.map(({ id, topic }) => ({ id, topic }));
}

function getSpeakingTopic(id) {
  return SPEAKING_TOPICS.find((t) => t.id === id);
}

export { SPEAKING_TOPICS, getSpeakingTopicBank, getSpeakingTopic };
