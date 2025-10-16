import React from 'react';
import { SafeAreaView, StatusBar, Text, StyleSheet, Image, View, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Exemplo usando expo-linear-gradient para o fundo

// NOTA: Os componentes customizados foram substituídos por componentes padrão
// para ajudar a isolar o erro de 'String cannot be cast to Boolean'.
// O problema provavelmente está em como alguma propriedade está sendo passada
// para um de seus componentes em SnowForms ou Welcome/styles.

const Home = ({ navigation, route }) => {
    const photoUri = route.params?.photoUri;

    const handleLogout = () => {
        navigation.navigate('Welcome');
    };

    const handleOpenCamera = () => {
        navigation.navigate('Camera');
    };

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#5DD39E' }} />
            <StatusBar backgroundColor='#5DD39E' barStyle='light-content' />

            {/* Substituindo GradientBackground por uma View ou um componente conhecido como expo-linear-gradient */}
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Bem-vindo ao Guardiões da Saúde!
                </Text>

                {/* Área para exibir a foto tirada */}
                <View style={styles.photoContainer}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.photo} />
                    ) : (
                        <Text style={styles.placeholderText}>Sua foto aparecerá aqui!</Text>
                    )}
                </View>
                
                {/* Substituindo Touch e SnowButton por componentes padrão */}
                <TouchableOpacity style={styles.snowButton} onPress={handleOpenCamera}>
                    <Text style={styles.label}>Tirar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.snowButton} onPress={handleLogout}>
                    <Text style={styles.label}>Sair</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

// Estilos recriados para se parecerem com o original, mas usando componentes padrão
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5DD39E', // Cor de fundo sólida como fallback
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    photoContainer: {
        width: '90%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        marginBottom: 20,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    snowButton: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center',
    },
    label: {
        color: '#5DD39E',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default Home;

