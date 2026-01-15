export interface Quizzes {
  id: number;
  active: boolean;
  title: string;
  latestVersion?: {
    id: number;
    versionNumber: number;
  };
  score?: number | null;
  isPassed?: boolean;    
  attemptNumber?: number;
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