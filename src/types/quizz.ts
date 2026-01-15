import { Article } from './article';

export interface Quizzes {
  id: number;
  active: boolean;
  title: string;
  latestVersion?: {
    id: number;
    versionNumber: number;
    passingScore?: number | null;
    maxAttempts?: number | null; 
    timeLimitMinutes?: number | null;
  };
  score?: number | null;
  isPassed?: boolean;    
  attemptNumber?: number;
  linkedArticle?: LinkedArticle | null; 
  passingScore?: number | null;
  maxAttempts?: number | null; 
  timeLimitMinutes?: number | null;
}

export interface UserQuizzProgress {
  id: number;
  formId: number;
  formVersionId: number;
  participationId: number;
  score: number;
  isPassed: boolean;
  attemptNumber: number;
  active: boolean; 
}

export type QuizStackParamList = {
  Home: undefined;
  QuizzInfoScreen: { 
      quizId: number; 
      title: string; 
      currentAttempt: number; 
  };
  Article: { article: Article }; 
  QuizzQuestionsScreen: { quizId: number; title: string; };
};

export interface LinkedArticle {
  id: number;
  title: string;
  reference: string;
}
