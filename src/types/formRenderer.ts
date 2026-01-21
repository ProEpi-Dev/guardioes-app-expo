import { StyleProp, ViewStyle } from "react-native";
import { FormBuilderDefinition, FormField } from "./form";

export interface FieldFactoryProps {
  field: FormField;
  value: any;
  error?: string;
  readOnly: boolean;
  onChange: (value: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface FormRendererProps {
  definition: FormBuilderDefinition;
  initialValues?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  readOnly?: boolean;
}