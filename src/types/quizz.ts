export interface Quizzes {
  id: number;
  active: boolean;
  title: string;
  score?: number | null;
}

export interface UserQuizzProgress {
  id: number;
  score: number;
}
