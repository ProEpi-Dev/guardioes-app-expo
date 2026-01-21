export interface SentimentModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  sending: boolean;
  formDefinition: any;
  onFormChange: (val: any) => void;
  onSubmit: () => void;
}