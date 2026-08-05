import type { PaginationQuery } from './api';

export type FormVersionAccessType = 'PUBLIC' | 'PRIVATE';

export interface FormVersion {
  id: number;
  formId: number;
  versionNumber: number;
  accessType: FormVersionAccessType;
  definition: any;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos específicos de quiz
  passingScore?: number | null;
  maxAttempts?: number | null;
  timeLimitMinutes?: number | null;
  showFeedback?: boolean;
  randomizeQuestions?: boolean;
}

export interface CreateFormVersionDto {
  accessType: FormVersionAccessType;
  definition: any;
  active?: boolean;
}

export interface UpdateFormVersionDto {
  accessType?: FormVersionAccessType;
  definition?: any;
  active?: boolean;
  // Campos específicos de quiz
  passingScore?: number | null;
  maxAttempts?: number | null;
  timeLimitMinutes?: number | null;
  showFeedback?: boolean;
  randomizeQuestions?: boolean;
}

export interface FormVersionQuery extends PaginationQuery {
  active?: boolean;
}
