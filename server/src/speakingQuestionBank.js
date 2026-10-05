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
  {
    id: "st-08",
    topic: "Food & Rules in Society",
    isNew: false,
    part1: {
      questions: [
        "What kind of food from other countries have you tried?",
        "Do you prefer trying new dishes or eating familiar food?",
        "Is cooking something you enjoy doing, or do you prefer eating out?",
        "Has the range of food available in your country changed much in recent years?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a rule or law in your country that you think is particularly beneficial.",
        bulletPoints: [
          "what the rule or law is",
          "when it was introduced",
          "who it affects most",
          "and explain why you think it is beneficial",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Should students have more say in deciding the rules at their school?",
        "Why do some people choose to become lawyers or work in the legal profession?",
        "Do you think laws should ever change to match changes in public opinion?",
        "How do rules in the workplace differ from rules in a school?",
      ],
    },
  },
  {
    id: "st-09",
    topic: "Public Transport & Recognising Achievement",
    isNew: false,
    part1: {
      questions: [
        "How often do you use public transport?",
        "What kind of public transport is most common where you live?",
        "Do you prefer travelling by public transport or by car? Why?",
        "Has public transport in your area changed much in recent years?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a person you know who has achieved something impressive.",
        bulletPoints: [
          "who this person is",
          "what they achieved",
          "how they achieved it",
          "and explain why you find this achievement impressive",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Should schools reward students for good behaviour as well as good grades?",
        "Do you think top athletes and celebrities are paid fairly compared with other professions?",
        "Why do some achievements receive much more public recognition than others?",
        "Is it healthy for children to be strongly encouraged to compete with one another?",
      ],
    },
  },
  {
    id: "st-10",
    topic: "Weather & Unexpected Journeys",
    isNew: false,
    part1: {
      questions: [
        "What's the weather usually like where you live?",
        "Do you prefer hot weather or cold weather?",
        "Does the weather affect what you do on a typical day?",
        "Has the climate in your country changed much over the years?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a journey that took longer than you expected.",
        bulletPoints: [
          "where you were going",
          "how you were travelling",
          "why it took longer than expected",
          "and explain how you felt about it",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Why do people often underestimate how long a journey will take?",
        "Do you think most people will drive electric cars in the future?",
        "What are the advantages and disadvantages of owning a car in a big city?",
        "How might transport change in your country over the next twenty years?",
      ],
    },
  },
  {
    id: "st-11",
    topic: "Cafés & Scenic Places",
    isNew: true,
    part1: {
      questions: [
        "How often do you go to cafés?",
        "Do you prefer eating out or eating at home?",
        "What kind of food do you enjoy most?",
        "Has the range of cafés and restaurants where you live changed much recently?",
      ],
    },
    part2: {
      cueCard: {
        topic: "Describe a place with a beautiful view that you have visited.",
        bulletPoints: [
          "where this place is",
          "when you visited it",
          "what the view was like",
          "and explain why you found it beautiful",
        ],
        prepSeconds: 60,
        speakSeconds: 120,
      },
    },
    part3: {
      questions: [
        "Why do you think certain places become popular tourist attractions?",
        "Do you think the beauty industry has a positive or negative influence on society?",
        "How do beauty standards differ between cultures?",
        "Should natural scenic areas be protected from further tourism development?",
      ],
    },
  },
];

/**
 * Rough estimate of total speaking time for a topic, from its actual question
 * counts and Part 2's fixed prep/speak timers — not a fixed number, since it's
 * meant to reflect what the topic actually asks for.
 */
function estimateMinutes(topic) {
  const part1Seconds = topic.part1.questions.length * 40;
  const part2Seconds = topic.part2.cueCard.prepSeconds + topic.part2.cueCard.speakSeconds;
  const part3Seconds = topic.part3.questions.length * 45;
  return Math.round((part1Seconds + part2Seconds + part3Seconds) / 60);
}

function getSpeakingTopicBank() {
  return SPEAKING_TOPICS.map((t) => ({
    id: t.id,
    topic: t.topic,
    estimatedMinutes: estimateMinutes(t),
    isNew: t.isNew,
  }));
}

function getSpeakingTopic(id) {
  return SPEAKING_TOPICS.find((t) => t.id === id);
}

export { SPEAKING_TOPICS, getSpeakingTopicBank, getSpeakingTopic };
