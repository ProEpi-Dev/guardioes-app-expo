import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function AlertModal() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
        <Ionicons name="chatbubbles-outline" size={45} color={colors.secundaria} />
        <Text style={styles.textAlert}>Dê os primeiros passos no Guardiões da Saúde</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Trilha')}>
            <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        width: 307,
        paddingVertical: 30,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute',
        top: '20%', 
        zIndex: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    button: {
        backgroundColor: colors.secundaria,
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
    },
    buttonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    textAlert: {
        fontSize: 22,
        textAlign: 'center',
        width: 240,
        paddingVertical: 20,
        color: colors.secundaria,
        fontWeight: '600'
    }
})