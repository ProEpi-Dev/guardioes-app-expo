export type RootTrailParamList = {
  Home: undefined;
  Accordion: { cycleId: number; title: string; isCycleExpired: boolean; };
  Article: { article: TrailContentData };
  QuizzInfoScreen: { 
      quizId: number; 
      title: string; 
      currentAttempt: number; 
      linkedArticle?: any; 
      maxAttempts?: number | null; 
      timeLimitMinutes?: number | null; 
  };
  QuizzQuestionsScreen: { quizId: number; title: string; timeLimitMinutes?: number | null };
  QuizResultScreen: {
    resultData: { score: number; isPassed: boolean };
    userAnswers: Record<string, any>;
    questions: any[];
    title: string;
  };
};

export interface Trail {
  id: number;
  name: string;
  slug: string;
  description: string;
  contextId?: number | null;
  controlPeriod: boolean;
  startDate: string | null;
  endDate: string | null;
  showAfterCompletion: boolean;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  section: Section[];
}

export interface Section {
  id: number;
  trackId: number;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  sequence: Sequence[];
}

export interface Sequence {
  rawBackendStatus: string;
  quizSubmissionId: number;
  id: number;
  sectionId: number;
  contentId: number | null;
  formId: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  content?: TrailContentData | null;
  form?: TrailForm | null;
  
  score?: number | null;
  isPassed?: boolean;
  attemptNumber?: number;
  passingScore?: number | null;
  maxAttempts?: number | null;
  timeLimitMinutes?: number | null;
  isLocked?: boolean;
  progressStatus?: 'not_started' | 'in_progress' | 'completed';
}

export interface TrailContentData {
  id: number;
  title: string;
  reference: string;
  content: string;
  active: boolean;
  summary: string;
  slug: string;
  authorId: number;
  contextId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail_url?: string | null;
}

export interface TrailForm {
  id: number;
  contextId: number;
  title: string;
  reference: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface TrackCycle {
  id: number;
  track_id: number;
  context_id: number;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date: string;
  active: boolean;
  track: Trail;
  progress_percentage?: number;
  user_status?: string;
  isExpired?: boolean;
  isClosed?: boolean;
  mandatory_slug?: string | null;
  isMandatoryLock?: boolean;
  isUpcoming?: boolean; 
  displayStartDate?: string;
  displayEndDate?: string | null;
}