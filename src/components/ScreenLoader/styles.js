import styled from 'styled-components'
import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scalling'

export const Screen = styled.View`
    flex: 1;
    background-color: transparent;
    align-items: center;
    justify-content: center;
`

export const styles = StyleSheet.create({
    img: {
        width: scale(265),
        height: scale(265),
        marginBottom: scale(40),
        resizeMode: 'contain'
    },
    loadingText: {
        color: '#ffffff',
        fontSize: scale(16),
        marginBottom: scale(20),
        fontFamily: 'System',
        fontWeight: '500'
    },
    loadingSpinner: {
        width: scale(72),
        height: scale(72),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        borderRadius: scale(36),
    },
});