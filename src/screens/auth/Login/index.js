import React, { useRef, useState } from 'react'
import { Alert, Keyboard, StatusBar, ActivityIndicator } from 'react-native'
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
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../contexts/AuthContext'

// Logos
const GDSLogoBR = require('../../../../assets/gds-pt-branca.png')
const GDSLogoES = require('../../../../assets/gds-es-branca.png')
const verde = '#77bfad'
const azul = '#2E97BE'
const branco = '#ffffff'

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showProgressBar, setShowProgressBar] = useState(false)
    const { login } = useAuth()

    const passwordInput = useRef()

    const handleLogin = async () => {
        Keyboard.dismiss()

        if (email === '' || password === '') {
            Alert.alert(translate('register.fieldNotBlank'))
            return
        }

        setShowProgressBar(true)

        try {
            const result = await login(email, password)
            
            if (result.success) {
                // Login bem-sucedido - a navegação será gerenciada automaticamente
                // pelo RootNavigator baseado no estado de autenticação
                // Não precisa fazer navigation.navigate manualmente
            } else {
                Alert.alert('Erro', result.error || 'Erro ao fazer login')
                setShowProgressBar(false)
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro inesperado ao fazer login')
            console.error('Erro no login:', error)
            setShowProgressBar(false)
        }
    }

    let LogoType = GDSLogoBR

    if (translate('lang.code') === 'es') {
        LogoType = GDSLogoES
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
            <StatusBar backgroundColor={verde} barStyle='light-content' />
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
                        <Touch onPress={() => handleLogin()} disabled={showProgressBar}>
                            <SnowButton>
                                {showProgressBar ? (
                                    <ActivityIndicator size="small" color="#32323b" />
                                ) : (
                                    <Label>{translate('login.loginbutton')}</Label>
                                )}
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
                            color={branco}
                        />
                    </ButtonBack>
                </KeyboardScrollView>
            </GradientBackground>
        </>
    )
}

export default Login