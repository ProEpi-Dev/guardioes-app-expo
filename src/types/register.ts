export interface LegalDocument {
  id: number;
  title: string;
  content: string;
  isRequired: boolean;
}

export interface ContextOption {
  label: string;
  value: number;
  key: string;
}