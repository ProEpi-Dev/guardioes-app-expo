// Tipos para formulários dinâmicos

export type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date';

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
}

