import { Article } from './article';
import { FormField } from './form';

export interface Quizes {
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

export interface UserQuizProgress {
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
  QuizResultScreen: {
    resultData: { score: number; isPassed: boolean };
    userAnswers: Record<string, any>;
    questions: FormField[];
    title: string;
  };
};

export interface LinkedArticle {
  id: number;
  title: string;
  reference: string;
}

export interface QuizCardProps {
  title: string;
  active: boolean;
  score?: number | null;
  onPress: () => void;
  isPassed?: boolean;
  attemptNumber?: number;
  passingScore?: number | null;
  maxAttempts?: number | null;
}

export interface QuizRouteParams {
  quizId: number;
  title: string;
  timeLimitMinutes?: number | null;
  trackProgressId?: number;
  sequenceId?: number;
  isCycleExpired?: boolean;
}

export type QuizStepState = 'answering' | 'feedback';