import React, { useRef, useState } from 'react'
import { Alert, Keyboard, SafeAreaView, StatusBar } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import {
    GradientBackground,
    KeyboardScrollView,
    ButtonBack,
    FormSeparator,
    SnowInput,
    Touch,
    SnowButton,
    Label,
    TransparentButton,
} from '../../../components/SnowForms'
import { Logo, PageTitle, LabelVisible } from './styles'
import translate from '../../../locales/i18n'
import { scale } from '../../../utils/scalling'

// Logos
const GDSLogoBR = require('../../../../assets/gds-pt-branca.png')
const GDSLogoES = require('../../../../assets/gds-es-branca.png')

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showProgressBar, setShowProgressBar] = useState(false)

    const passwordInput = useRef()

    const handleLogin = async () => {
        Keyboard.dismiss()

        if (email === '' || password === '') {
            Alert.alert(translate('register.fieldNotBlank'))
            return
        }

        setShowProgressBar(true)

        // Simulate API call
        setTimeout(() => {
            setShowProgressBar(false)
            Alert.alert('Sucesso', 'Login realizado com sucesso!')
            navigation.navigate('Home')
        }, 2000)
    }

    let LogoType = GDSLogoBR

    if (translate('lang.code') === 'es') {
        LogoType = GDSLogoES
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#5DD39E' }} />
            <StatusBar backgroundColor='#5DD39E' barStyle='light-content' />
            <GradientBackground>
                <KeyboardScrollView>
                    <Logo source={LogoType} />
                    <PageTitle>{translate('login.title')}</PageTitle>

                    <FormSeparator>
                        <SnowInput
                            placeholder={translate('login.email')}
                            keyboardType='email-address'
                            returnKeyType='next'
                            maxLength={100}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            onSubmitEditing={() =>
                                passwordInput.current.focus()
                            }
                        />
                        <SnowInput
                            placeholder={translate('login.password')}
                            secureTextEntry
                            maxLength={100}
                            ref={passwordInput}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            onSubmitEditing={() => handleLogin()}
                        />
                    </FormSeparator>

                    <FormSeparator>
                        <Touch onPress={() => handleLogin()}>
                            <SnowButton>
                                <Label>{translate('login.loginbutton')}</Label>
                            </SnowButton>
                        </Touch>
                    </FormSeparator>

                    <TransparentButton
                        onPress={() => Alert.alert('Info', 'Funcionalidade de recuperar senha em desenvolvimento')}
                    >
                        <LabelVisible>
                            {translate('login.forgetbutton')}
                        </LabelVisible>
                    </TransparentButton>

                    <ButtonBack onPress={() => navigation.goBack()}>
                        <Feather
                            name='chevron-left'
                            size={scale(40)}
                            color='#ffffff'
                        />
                    </ButtonBack>
                </KeyboardScrollView>
            </GradientBackground>
        </>
    )
}

export default Login