import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      margin: 7
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    textTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    bemButton: {
        backgroundColor: '#2E97BE',
        borderBottomLeftRadius: 18,
        borderTopLeftRadius: 18,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 2,
        alignItems: 'center'
    },
    malButton: {
        backgroundColor: '#dd821a',
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
    }
});