import { LinkedArticle } from "./quiz";

export interface QuizInfoRouteParams {
  quizId: number;
  title: string;
  currentAttempt: number;
  linkedArticle?: LinkedArticle | null;
  maxAttempts?: number | null;
  timeLimitMinutes?: number | null;
}