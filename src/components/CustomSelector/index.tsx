import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ViewStyle, TextStyle, StyleProp } from 'react-native';


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

export const CustomSelector: React.FC<CustomSelectorProps> = (props) => {
    const {
        data = [],
        onChange,
        initValue = 'Selecione...',
        disabled = false,
        cancelText = 'Cancelar',

        style,
        selectStyle,
        selectTextStyle,
        initValueTextStyle,
        touchableActiveOpacity = 0.5,
        overlayStyle,
        optionContainerStyle,
        optionStyle,
        optionTextStyle,
        cancelContainerStyle,
        cancelStyle,
        cancelTextStyle,
    } = props;

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(initValue);

    const isInitValue = selectedValue === initValue;

    const handleSelect = (option: Option): void => {
        setSelectedValue(option.label);
        if (onChange) {
            onChange(option);
        }
        setModalVisible(false);
    };

    const handleOpen = (): void => {
        if (!disabled) {
            setModalVisible(true);
        }
    };

    const handleClose = (): void => {
        setModalVisible(false);
    };

    const renderOption = ({ item }: { item: Option }) => (
        <TouchableOpacity style={optionStyle} onPress={() => handleSelect(item)}>
            <Text style={optionTextStyle}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={style}>
            <TouchableOpacity
                style={selectStyle}
                onPress={handleOpen}
                activeOpacity={touchableActiveOpacity}
                disabled={disabled}
            >
                <Text style={isInitValue ? initValueTextStyle : selectTextStyle}>
                    {selectedValue}
                </Text>
            </TouchableOpacity>


            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClose}
            >

                <SafeAreaView style={[styles.modalWrapper, overlayStyle]}>
                    <View style={optionContainerStyle}>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.key?.toString() || item.label}
                            renderItem={renderOption}
                            />
                    </View>

                    <View style={cancelContainerStyle}>
                        <TouchableOpacity style={cancelStyle} onPress={handleClose}>
                            <Text style={cancelTextStyle}>{cancelText}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});