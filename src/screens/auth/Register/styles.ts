import styled from 'styled-components/native'
import { Image, TouchableOpacity } from 'react-native'
import { scale } from '../../../utils/scalling'

export const Logo = styled(Image)`
    height: ${scale(100)}px;
    resize-mode: contain;
    margin-bottom: ${scale(20)}px;
`

export const PageTitle = styled.Text`
    font-family: 'System';
    font-weight: 400;
    font-size: ${scale(18)}px;
    color: #ffffff;
    margin-bottom: ${scale(20)}px;
    text-align: center;
`

// Estilos do novo botão Voltar (alinhado à esquerda)
export const BackButtonContainer = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    margin-left: 10%; /* Alinha com o início do input (que tem 80% e é centralizado) */
    margin-top: ${scale(20)}px;
    margin-bottom: ${scale(20)}px;
    padding: 10px 0px;
`

export const BackButtonText = styled.Text`
    font-family: 'System';
    font-weight: bold;
    font-size: ${scale(15)}px;
    color: #ffffff;
    margin-left: 5px;
`