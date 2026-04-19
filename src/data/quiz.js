import { QUESTION_GROUPS } from "./quizBank.js";

export const QUIZ = QUESTION_GROUPS.flatMap((group) =>
  group.questions.map((question) => ({
    id: "",
    ...question,
    ...(group.domain === "review" ? { domain: "review" } : {}),
  }))
).map((question, index) => ({
  ...question,
  id: `q${index + 1}`,
}));

export function getQuestionDomain(question) {
  if (question.domain) return String(question.domain);
  return String(Number.parseInt(question.obj, 10));
}

export function shuffle(arr) {
  const copy = arr.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
