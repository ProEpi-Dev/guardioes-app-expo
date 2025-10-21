import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});