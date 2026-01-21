import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CustomSelectorProps, Option } from '../../types/customSelector';
import { SelectorModal } from './SelectorModal';

export const CustomSelector: React.FC<CustomSelectorProps> = (props) => {
  const {
    data,
    onChange,
    initValue = 'Selecione...',
    disabled = false,
    cancelText = 'Cancelar',
    style,
    selectStyle,
    selectTextStyle,
    initValueTextStyle,
    touchableActiveOpacity = 0.5,
    ...modalStyles
  } = props;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(initValue);

  const isPlaceholder = selectedLabel === initValue;

  const handleOpen = () => {
    if (!disabled) setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSelect = useCallback((option: Option) => {
    setSelectedLabel(option.label);
    if (onChange) {
      onChange(option);
    }
    setModalVisible(false);
  }, [onChange]);

  return (
    <View style={style}>
      <TouchableOpacity
        style={selectStyle}
        onPress={handleOpen}
        activeOpacity={touchableActiveOpacity}
        disabled={disabled}
      >
        <Text style={isPlaceholder ? initValueTextStyle : selectTextStyle}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <SelectorModal
        visible={modalVisible}
        data={data}
        cancelText={cancelText}
        onClose={handleClose}
        onSelect={handleSelect}
        {...modalStyles}
      />
    </View>
  );
};