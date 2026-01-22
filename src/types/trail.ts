export type RootTrailParamList = {
  Home: undefined;
};

export interface Trail {
  id: number;
  name: string;
  description: string;
  contextId?: string | null;
  active: boolean;
}