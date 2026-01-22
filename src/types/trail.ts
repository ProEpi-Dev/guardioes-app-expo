export type RootTrailParamList = {
  Home: undefined;
  Accordion: {trail: Trail};
};

export interface Trail {
  id: number;
  name: string;
  description: string;
  contextId?: string | null;
  active: boolean;
}