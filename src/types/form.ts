// Tipos para formulários dinâmicos

export type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'radio'
  | 'multiselect'
  | 'date'
  | 'mapPoint'
  | 'location';

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FieldOption {
  label: string;
  value: string | number;
  feedback?: string;
}

export interface FieldCondition {
  fieldId: string;
  operator: ConditionOperator;
  value: any;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[];
  min?: number;
  max?: number;
  maxLength?: number;
  conditions?: FieldCondition[];
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface FormBuilderDefinition {
  fields: FormField[];
  title?: string;
  description?: string;
}

export interface FormVersion {
  id: number;
  form_id: number;
  version_number: number;
  definition: FormBuilderDefinition;
  accessType?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  participationId: number;
  passingScore?: number | null;
}

export type FormType = 'signal' | 'quiz' | 'profile_extra';

export interface ParentLocation {
  id: number;
  name: string;
  parent?: ParentLocation; // Recursivo até 3 níveis
}

export interface Location {
  id: number;
  parentId: number | null;
  parent?: ParentLocation; // Hierarquia até 3 níveis
  name: string;
  orgLevel: 'COUNTRY' | 'STATE_DISTRICT' | 'CITY_COUNCIL';
  latitude: number | null;
  longitude: number | null;
  polygons: any | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
