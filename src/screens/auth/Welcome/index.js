import React from 'react'
import { Alert, StatusBar } from 'react-native'

import {
    GradientBackground,
    Touch,
    SnowButton,
    Label,
} from '../../../components/SnowForms'
import { Container, Logo, WelcomeText } from './styles'

import translate from '../../../locales/i18n'
import { terms } from '../../../utils/consts'
import { SafeAreaView } from 'react-native-safe-area-context'

// Logos
const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png')
const verde = '#77bfad'
const azul = '#2E97BE'

const Welcome = ({ navigation }) => {
    const showTerms = () => {
        Alert.alert(
            terms.title,
            terms.text,
            [
                {
                    text: terms.disagree,
                    onPress: () => navigation.navigate('Welcome'),
                    style: 'cancel',
                },
                {
                    text: terms.agree,
                    onPress: () => navigation.navigate('Register'),
                },
            ],
            { cancelable: false }
        )
    }

    let LogoType = GDSLogoBR

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
            <StatusBar backgroundColor={verde} barStyle='light-content' />
            <GradientBackground>
                <Container>
                    <Logo source={LogoType} />
                    <WelcomeText>
                        {translate('initialscreen.welcome')}
                    </WelcomeText>

                    <Touch onPress={() => navigation.navigate('Login')}>
                        <SnowButton>
                            <Label>{translate('initialscreen.login')}</Label>
                        </SnowButton>
                    </Touch>

                    <Touch onPress={() => navigation.navigate('Register')}>
                        <SnowButton>
                            <Label>{translate('initialscreen.signup')}</Label>
                        </SnowButton>
                    </Touch>
                </Container>
            </GradientBackground>
        </>
    )
}

export default Welcome
