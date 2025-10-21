import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#363636ff',
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
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
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