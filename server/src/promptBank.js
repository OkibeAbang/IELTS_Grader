/**
 * Static practice question bank.
 *
 * These are original practice questions written to match the structure,
 * phrasing conventions, and common topic range of genuine IELTS Writing
 * questions (education, environment, technology, health, crime, work,
 * government, globalization, etc.) — they are NOT reproductions of specific
 * real exam papers, since IELTS doesn't publish an official archive and most
 * "past questions" circulating online are unverifiable test-taker recollections.
 * Treat this as a practice bank, not a verbatim past-paper archive.
 */

const TASK2_PROMPTS = [
  {
    id: "t2-01",
    subtype: "opinion",
    text: "Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?",
  },
  {
    id: "t2-02",
    subtype: "discussion",
    text: "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternative ways to reduce crime. Discuss both views and give your own opinion.",
  },
  {
    id: "t2-03",
    subtype: "problem_solution",
    text: "In many cities around the world, traffic congestion has become a serious problem. What are the causes of this problem, and what measures could be taken to solve it?",
  },
  {
    id: "t2-04",
    subtype: "advantage_disadvantage",
    text: "More and more people are choosing to work from home instead of commuting to an office. What are the advantages and disadvantages of this trend?",
  },
  {
    id: "t2-05",
    subtype: "two_part_question",
    text: "Many people believe that social media has a negative effect on both individuals and society. Why do some people hold this view, and do you agree or disagree?",
  },
  {
    id: "t2-06",
    subtype: "opinion",
    text: "Some people think that university education should be free for all students, regardless of their family's income. To what extent do you agree or disagree?",
  },
  {
    id: "t2-07",
    subtype: "discussion",
    text: "Some people believe that children should begin learning a foreign language as soon as they start school, while others think it is better to wait until secondary school. Discuss both views and give your own opinion.",
  },
  {
    id: "t2-08",
    subtype: "problem_solution",
    text: "As the population continues to age in many countries, fewer young people are available to support the elderly. What problems does this cause, and what solutions can be suggested?",
  },
];

const TASK1_PROMPTS = [
  {
    id: "t1-01",
    subtype: "line_graph",
    text: "The graph below shows the number of visitors to three different museums in a European city between 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  },
  {
    id: "t1-02",
    subtype: "bar_chart",
    text: "The chart below shows the percentage of households with internet access in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  },
  {
    id: "t1-03",
    subtype: "pie_chart",
    text: "The pie charts below show the proportion of household spending in a European country in 1970 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  },
  {
    id: "t1-04",
    subtype: "process",
    text: "The diagram below shows the process by which coffee beans are processed, from harvesting to packaging for sale. Summarise the information by selecting and reporting the main features.",
  },
  {
    id: "t1-05",
    subtype: "map",
    text: "The maps below show the layout of a small town in 1990 and the present day. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  },
  {
    id: "t1-06",
    subtype: "table",
    text: "The table below gives information on the average time spent per week on different leisure activities by adults in one country in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  },
  {
    id: "t1-07",
    subtype: "letter",
    text: "You recently bought a piece of equipment for your kitchen, but it did not work properly. Write a letter to the shop manager. In your letter: describe the problem with the equipment, explain what happened when you contacted the shop, say what you would like the manager to do.",
  },
  {
    id: "t1-08",
    subtype: "letter",
    text: "You are currently studying at a college and would like to take some time off next month. Write a letter to your teacher. In your letter: explain why you need time off, say how long you will be away, describe how you will make up for the missed work.",
  },
];

const SUBTYPE_LABELS = {
  opinion: "Opinion",
  discussion: "Discussion",
  problem_solution: "Problem/Solution",
  advantage_disadvantage: "Advantage/Disadvantage",
  two_part_question: "Two-part question",
  line_graph: "Line graph",
  bar_chart: "Bar chart",
  pie_chart: "Pie chart",
  process: "Process diagram",
  map: "Map",
  table: "Table",
  letter: "Letter",
};

function getPromptBank(taskType) {
  return taskType === "task1" ? TASK1_PROMPTS : TASK2_PROMPTS;
}

export { TASK1_PROMPTS, TASK2_PROMPTS, SUBTYPE_LABELS, getPromptBank };
