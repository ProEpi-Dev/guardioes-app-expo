import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface CustomStyles {
  dateInput?: StyleProp<ViewStyle>;
  dateText?: StyleProp<TextStyle>;
  placeholderText?: StyleProp<TextStyle>;
}

export interface CustomDatePickerProps {
  date?: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  customStyles?: CustomStyles;
  androidMode?: 'spinner' | 'calendar' | 'default' | 'clock';
}
