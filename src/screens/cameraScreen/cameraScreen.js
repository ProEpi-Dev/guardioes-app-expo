import React, { useState, useRef } from 'react';
import { Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Style';

const vermelho = '#f44336'

export default function CameraScreen({ navigation }) {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);
    
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
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
    
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de permissão para salvar fotos na sua galeria.");
            return;
        }

        try {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            Alert.alert("Sucesso", "Foto salva na galeria!");
            navigation.navigate('Home', { photoUri: photo.uri });
        } catch (error) {
            console.error("Erro ao salvar foto: ", error);
            Alert.alert("Erro", "Não foi possível salvar a foto.");
        }
    };

    if (photo) {
        return (
            <SafeAreaView style={styles.container}>
                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.previewButtons}>
                    <Button title="Salvar Foto" onPress={savePhoto} />
                    <Button title="Tirar Outra" onPress={() => setPhoto(null)} color={vermelho} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.cameraButtonContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

