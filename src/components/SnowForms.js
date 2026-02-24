import styled from 'styled-components'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, TextInput, View, ScrollView, Modal, FlatList, TouchableWithoutFeedback, Text } from 'react-native'
import { scale, percentage } from '../utils/scalling'
import React, { useState, useEffect } from 'react';
import { colors } from '../utils/colors';

export const GradientBackground = styled(LinearGradient).attrs({
    colors: [colors.gradientSocialLinkEscuro, colors.azulClaro],
})`
    flex: 1;
`

export const KeyboardScrollView = styled(ScrollView).attrs({
    contentContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
})``

export const ButtonBack = styled(TouchableOpacity)`
    position: absolute;
    top: 8%;
    left: 3%;
`

export const FormSeparator = styled(View)`
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 0%;
`

export const SnowInput = styled(TextInput).attrs({
    placeholderTextColor: '#ffffff',
    autoCapitalize: 'none',
    multiline: false,
})`
    width: 80%;
    height: ${scale(38)}px;
    border-color: #ffffff;
    border-width: 3px;
    border-radius: ${scale(16)}px;
    font-family: 'System';
    font-weight: 500;
    font-size: ${scale(15)}px;
    color: #ffffff;
    text-align: center;
    margin-top: ${percentage(4)}px;
    padding-bottom: 0;
    padding-top: 0;
`

export const Touch = styled(TouchableOpacity).attrs({
    activeOpacity: 0.5,
})`
    width: 80%;
    margin-top: ${scale(21)}px;
`

export const SnowButton = styled.View`
    height: ${scale(36)}px;
    background-color: #ffffff;
    border-radius: ${scale(14)}px;
    align-items: center;
    justify-content: center;
    shadow-color: #ffffff;
    shadow-opacity: 0.4;
    shadow-radius: 6px;
    shadow-offset: 0px 0px;
    elevation: 3;
`

export const Label = styled.Text`
    font-family: 'System';
    font-weight: 500;
    font-size: ${scale(15)}px;
    color: #32323b;
`

export const TransparentButton = styled(TouchableOpacity).attrs({
    activeOpacity: 0.2,
})`
    width: 80%;
    justify-content: center;
    margin-top: ${scale(10)}px;
    height: ${scale(38)}px;
`
export const SnowSelectContainer = styled(TouchableOpacity)`
    width: ${props => props.fullWidth ? '100%' : '80%'};
    height: ${scale(38)}px;
    border-color: ${props => props.lightMode ? '#348eac' : '#ffffff'};
    border-width: ${props => props.lightMode ? '1px' : '3px'};
    border-radius: ${scale(16)}px;
    margin-top: ${percentage(4)}px;
    align-items: center;
    justify-content: center;
`

export const SnowSelectLabel = styled(Text)`
    font-family: 'System';
    font-weight: 500;
    font-size: ${scale(15)}px;
    color: ${props => props.lightMode ? '#333' : '#ffffff'};
    text-align: center;
`

export const CustomSelector = ({ lightMode = false, data, initValue, onChange, placeholder }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");

    useEffect(() => {
        if (initValue !== null && data && data.length > 0) {
            const item = data.find(i => String(i.value) === String(initValue));
            if (item) setSelectedLabel(item.label);
        }
    }, [initValue, data]);

    const handleSelect = (item) => {
        setSelectedLabel(item.label);
        onChange(item);
        setModalVisible(false);
    };

    return (
        <>
            <SnowSelectContainer 
                lightMode={lightMode} 
                fullWidth={lightMode}
                onPress={() => setModalVisible(true)}
            >
                <SnowSelectLabel lightMode={lightMode} numberOfLines={1}>
                    {selectedLabel || placeholder || "Selecione..."}
                </SnowSelectLabel>
            </SnowSelectContainer>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableWithoutFeedback>
                            <View style={{ 
                                width: '80%', 
                                maxHeight: '50%', 
                                backgroundColor: '#FFF', 
                                borderRadius: 12, 
                                padding: 10,
                                elevation: 5 
                            }}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) => String(item.key || item.value)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text style={{ fontSize: 16, color: '#32323b', textAlign: 'center' }}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity 
                                    style={{ padding: 15, alignItems: 'center', marginTop: 5 }}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export const UserInfoCard = styled.View`
    background-color: #fff;
    width: 80%;
    padding-vertical: ${scale(17)}px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    border-radius: ${scale(15)}px;
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 4px;
`;

export const UserName = styled.Text`
    font-size: ${scale(16)}px;
    font-weight: bold;
    color: #333;
`;

export const UserEmail = styled.Text`
    font-size: ${scale(14)}px;
    color: #666;
`;











export const SolidInput = styled(TextInput).attrs({
    placeholderTextColor: '#A9A9A9',
    autoCapitalize: 'none',
})`
    width: 80%;
    height: ${scale(45)}px;
    background-color: #E2EFEF; /* Fundo claro acinzentado/azulado */
    border-radius: ${scale(12)}px;
    font-family: 'System';
    font-size: ${scale(15)}px;
    color: #333333;
    padding-horizontal: 15px;
    margin-bottom: ${scale(15)}px;
`;

export const DarkButton = styled.View`
    height: ${scale(45)}px;
    background-color: #003344; /* Usando o azulEscuro da sua paleta */
    border-radius: ${scale(12)}px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-opacity: 0.3;
    shadow-radius: 5px;
    shadow-offset: 0px 3px;
`;

export const DarkButtonLabel = styled.Text`
    font-family: 'System';
    font-weight: bold;
    font-size: ${scale(16)}px;
    color: #ffffff;
`;

export const GradientButtonContainer = styled(LinearGradient).attrs({
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
})`
    height: ${scale(45)}px;
    border-radius: ${scale(12)}px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-opacity: 0.3;
    shadow-radius: 5px;
    shadow-offset: 0px 3px;
    width: 100%;
`;

export const GradientButtonLabel = styled.Text`
    font-family: 'System';
    font-weight: bold;
    font-size: ${scale(16)}px;
    color: #ffffff;
`;

import Feather from '@expo/vector-icons/Feather';

// ... (seus outros componentes)

export const SolidSelector = ({ data, initValue, onChange, placeholder }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");

    useEffect(() => {
        if (initValue !== null && data && data.length > 0) {
            const item = data.find(i => String(i.value) === String(initValue) || String(i.key) === String(initValue));
            if (item) setSelectedLabel(item.label);
        }
    }, [initValue, data]);

    const handleSelect = (item) => {
        setSelectedLabel(item.label);
        onChange(item);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity 
                style={{
                    width: '80%', height: scale(45), backgroundColor: '#E2EFEF',
                    borderRadius: scale(12), flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: scale(15)
                }}
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ fontFamily: 'System', fontSize: scale(15), color: selectedLabel ? '#333333' : '#A9A9A9' }}>
                    {selectedLabel || placeholder || "Selecione..."}
                </Text>
                <Feather name="chevron-down" size={20} color="#A9A9A9" />
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableWithoutFeedback>
                            <View style={{ width: '80%', maxHeight: '50%', backgroundColor: '#FFF', borderRadius: 12, padding: 10, elevation: 5 }}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) => String(item.key || item.value)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }} onPress={() => handleSelect(item)}>
                                            <Text style={{ fontSize: 16, color: '#32323b', textAlign: 'center' }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity style={{ padding: 15, alignItems: 'center', marginTop: 5 }} onPress={() => setModalVisible(false)}>
                                    <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};