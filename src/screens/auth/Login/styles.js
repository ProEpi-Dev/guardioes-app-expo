import styled from 'styled-components'
import { Image, Text } from 'react-native'
import { scale } from '../../../utils/scalling'

export const Logo = styled(Image)`
    height: ${scale(105)}px;
    resize-mode: contain;
`

export const PageTitle = styled.Text`
    font-family: 'System';
    font-weight: 600;
    font-size: ${scale(21)}px;
    color: #ffffff;
    margin-top: 15%;
    margin-bottom: 5%;
    text-align: center;
`

export const LabelVisible = styled.Text`
    font-family: 'System';
    font-weight: 500;
    font-size: ${scale(14)}px;
    text-decoration-line: underline;
    color: #ffffff;
    text-align: center;
`
