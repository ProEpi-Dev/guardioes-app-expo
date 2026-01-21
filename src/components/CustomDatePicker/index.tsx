import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  View,
  StyleSheet,
  Button,
  StyleProp,
  TextStyle,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CustomDatePickerProps } from '../../types/customDatePicker';
import { formatDate } from '../../utils/formatDate';
import { styles } from './styles';

export const CustomDatePicker: React.FC<CustomDatePickerProps> = (props) => {
  const {
    date,
    onDateChange,
    placeholder = 'Selecione uma data...',
    style,
    customStyles = {},
    androidMode = 'spinner',
  } = props;

  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  const [pickerDate, setPickerDate] = useState<Date>(date || new Date());

  const showPicker = (): void => {
    setPickerDate(date || new Date());
    setPickerVisible(true);
  };

  const hidePicker = (): void => {
    setPickerVisible(false);
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      hidePicker();
      if (event.type === 'set' && selectedDate) {
        onDateChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setPickerDate(selectedDate);
      }
    }
  };

  const handleIOSDone = (): void => {
    onDateChange(pickerDate);
    hidePicker();
  };

  const displayText: string = formatDate(date, placeholder);
  
  const textStyle: StyleProp<TextStyle> = date
    ? customStyles.dateText
    : customStyles.placeholderText;

  const renderButton = (): React.ReactElement => (
    <TouchableOpacity
      style={[style, customStyles.dateInput]}
      onPress={showPicker}
    >
      <Text style={textStyle}>{displayText}</Text>
    </TouchableOpacity>
  );

  const renderPicker = (): React.ReactElement | null => {
    if (!isPickerVisible) return null;

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={androidMode}
          onChange={handlePickerChange}
        />
      );
    }

    if (Platform.OS === 'ios') {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isPickerVisible}
          onRequestClose={hidePicker}
        >
          <TouchableOpacity
            style={styles.iosModalOverlay}
            activeOpacity={1}
            onPress={hidePicker}
          >
            <View style={styles.iosModalContent}>
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="inline"
                onChange={handlePickerChange}
              />
              <Button title="Pronto" onPress={handleIOSDone} />
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }

    return null;
  };

  return (
    <>
      {renderButton()}
      {renderPicker()}
    </>
  );
};
