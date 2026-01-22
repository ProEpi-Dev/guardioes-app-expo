export type RootTrailParamList = {
  Home: undefined;
  Accordion: {trail: Trail};
  Article: { article: TrailContentData };
};

export interface Trail {
  id: number;
  name: string;
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