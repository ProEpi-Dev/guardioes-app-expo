import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface Option {
  label: string;
  key?: string | number;
  value?: any;
  [key: string]: any;
}

export interface CustomSelectorProps {
  data?: Option[];
  onChange?: (option: Option) => void;
  initValue?: string;
  disabled?: boolean;
  cancelText?: string;

  style?: StyleProp<ViewStyle>;
  selectStyle?: StyleProp<ViewStyle>;
  selectTextStyle?: StyleProp<TextStyle>;
  initValueTextStyle?: StyleProp<TextStyle>;
  touchableActiveOpacity?: number;
  overlayStyle?: ViewStyle | ViewStyle[];
  optionContainerStyle?: ViewStyle | ViewStyle[];
  optionStyle?: ViewStyle | ViewStyle[];
  optionTextStyle?: TextStyle | TextStyle[];
  cancelContainerStyle?: ViewStyle | ViewStyle[];
  cancelStyle?: ViewStyle | ViewStyle[];
  cancelTextStyle?: TextStyle | TextStyle[];
}
