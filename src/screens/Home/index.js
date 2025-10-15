import React from 'react'
import { SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native'

import {
    GradientBackground,
    Touch,
    SnowButton,
    Label,
} from '../../components/SnowForms'
import { Container, WelcomeText } from '../auth/Welcome/styles'

const Home = ({ navigation }) => {
    const handleLogout = () => {
        navigation.navigate('Welcome')
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#5DD39E' }} />
            <StatusBar backgroundColor='#5DD39E' barStyle='light-content' />
            <GradientBackground>
                <Container>
                    <WelcomeText>
                        Bem-vindo ao Guardiões da Saúde!
                    </WelcomeText>

                    <Touch onPress={handleLogout}>
                        <SnowButton>
                            <Label>Sair</Label>
                        </SnowButton>
                    </Touch>
                </Container>
            </GradientBackground>
        </>
    )
}

export default Home
