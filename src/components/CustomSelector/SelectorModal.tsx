import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Option, CustomSelectorProps } from '../../types/customSelector';
import { styles } from './styles';

type SelectorModalProps = Pick<
  CustomSelectorProps,
  | 'data'
  | 'cancelText'
  | 'overlayStyle'
  | 'optionContainerStyle'
  | 'optionStyle'
  | 'optionTextStyle'
  | 'cancelContainerStyle'
  | 'cancelStyle'
  | 'cancelTextStyle'
> & {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: Option) => void;
};

export const SelectorModal: React.FC<SelectorModalProps> = ({
  visible,
  data = [],
  cancelText,
  onClose,
  onSelect,
  overlayStyle,
  optionContainerStyle,
  optionStyle,
  optionTextStyle,
  cancelContainerStyle,
  cancelStyle,
  cancelTextStyle,
}) => {
  
  const renderItem: ListRenderItem<Option> = ({ item }) => (
    <TouchableOpacity 
      style={[styles.defaultOption, optionStyle]} 
      onPress={() => onSelect(item)}
    >
      <Text style={optionTextStyle}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalWrapper, overlayStyle]}>
        <View style={optionContainerStyle}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.key?.toString() || item.label}
            renderItem={renderItem}
            bounces={false}
          />
        </View>

        <View style={cancelContainerStyle}>
          <TouchableOpacity 
            style={[styles.defaultCancel, cancelStyle]} 
            onPress={onClose}
          >
            <Text style={cancelTextStyle}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};