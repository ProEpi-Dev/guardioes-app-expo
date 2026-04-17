import { FormField } from './form';

export interface QuizResultParams {
  resultData: {
    score: number;
    isPassed: boolean;
    totalPoints?: number;
  };
  userAnswers: Record<string, any>;
  questions: FormField[];
  title: string;
}
