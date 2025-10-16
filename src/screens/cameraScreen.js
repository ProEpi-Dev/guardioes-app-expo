import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

// Recebemos 'navigation' como prop para poder navegar
export default function CameraScreen({ navigation }) {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);
    
    // Verificações de permissão
    if (!permission) {
        // As permissões da câmera ainda estão carregando
        return <View />;
    }

    if (!permission.granted) {
        // As permissões da câmera não foram concedidas ainda
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Precisamos da sua permissão para acessar a câmera.
                </Text>
                <Button onPress={requestPermission} title="Conceder Permissão" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const newPhoto = await cameraRef.current.takePictureAsync({ quality: 1 });
                setPhoto(newPhoto);
            } catch (error) {
                console.error("Erro ao tirar foto: ", error);
                Alert.alert("Erro", "Não foi possível tirar a foto.");
            }
        }
    };

    const savePhoto = async () => {
        if (!photo) return;
        
        // Solicita permissão para a galeria
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de permissão para salvar fotos na sua galeria.");
            return;
        }

        try {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            Alert.alert("Sucesso", "Foto salva na galeria!");
            // Navega de volta para a Home e passa a URI da foto como parâmetro
            navigation.navigate('Home', { photoUri: photo.uri });
        } catch (error) {
            console.error("Erro ao salvar foto: ", error);
            Alert.alert("Erro", "Não foi possível salvar a foto.");
        }
    };

    if (photo) {
        // Tela de pré-visualização da foto
        return (
            <SafeAreaView style={styles.container}>
                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.previewButtons}>
                    <Button title="Salvar Foto" onPress={savePhoto} />
                    <Button title="Tirar Outra" onPress={() => setPhoto(null)} color="#f44336" />
                </View>
            </SafeAreaView>
        );
    }

    // Tela da Câmera
    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    permissionText: {
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        fontSize: 16,
        paddingHorizontal: 30,
    },
    camera: {
        flex: 1,
    },
    cameraButtonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 40,
    },
    captureButton: {
        borderWidth: 4,
        borderColor: 'white',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    preview: {
        flex: 1,
        resizeMode: 'contain',
    },
    previewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
});
