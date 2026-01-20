import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, 
  Keyboard, 
  StatusBar, 
  ActivityIndicator, 
  TextInput
} from 'react-native';
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
    CustomSelector
} from '../../../components/SnowForms'
import { Logo, PageTitle } from '../Login/styles'
import translate from '../../../locales/i18n'
import { scale } from '../../../utils/scalling'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../contexts/AuthContext'
import { RootStackParamList } from '../../../types/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiClient } from '../../../utils/api';

const GDSLogoBR = require('../../../../assets/gds-pt-branca.png')
const GDSLogoES = require('../../../../assets/gds-es-branca.png')
const verde = '#77bfad'
const azul = '#2E97BE'
const branco = '#ffffff'
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface ContextItem {
    id: number;
    name: string;
}

export function Register({ navigation }: Props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showProgressBar, setShowProgressBar] = useState(false)
    const { register } = useAuth()

    const [contexts, setContexts] = useState<any[]>([])
    const [selectedContextId, setSelectedContextId] = useState<number | null>(null)
    const [isLoadingContexts, setIsLoadingContexts] = useState(false)
    
    const passwordInput = useRef<TextInput>(null)
    const nameInput = useRef<TextInput>(null)
    
    let LogoType = GDSLogoBR
    
    if (translate('lang.code') === 'es') {
        LogoType = GDSLogoES
    }
    
    useEffect(() => {
        fetchContexts();
    }, []);
    
    const fetchContexts = async () => {
        Keyboard.dismiss() 
        setIsLoadingContexts(true);
        try {
            const response = await apiClient('/v1/contexts');
            const json = response.data; 
            
            if (Array.isArray(json)) {
                const options = json.map((ctx: any) => ({
                    label: ctx.name,
                    value: ctx.id,
                    key: String(ctx.id)
                }));
                setContexts(options);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao carregar contextos.");
        } finally {
            setIsLoadingContexts(false);
        }
    };

    const handleRegister = async () => {
        Keyboard.dismiss()

        if (name === '' || email === '' || password === '') {
            Alert.alert(translate('register.fieldNotBlank'))
            return
        }

        if (!selectedContextId) {
            Alert.alert("Atenção", "Selecione um Contexto.");
            return;
        }

        const payload = {
            name: name,
            email: email, 
            password: password,
            contextId: selectedContextId,
            acceptedLegalDocumentIds: [1, 2]
        };

        setShowProgressBar(true)

        try {
            const result = await register(payload);
            
            if (result.success) {
                navigation.navigate('Login') 
            } else {
                Alert.alert('Erro', result.error || 'Erro ao realizar cadastro')
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro inesperado ao realizar cadastro')
            console.error('Erro no registro:', error)
        } finally {
            setShowProgressBar(false)
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
            <StatusBar backgroundColor={verde} barStyle='light-content' />
            <GradientBackground colors={[azul, verde]}>
                <KeyboardScrollView>
                    <Logo source={LogoType} />
                    <PageTitle>{translate('login.title')}</PageTitle>

                    <FormSeparator>
                        <SnowInput
                            placeholder={translate('register.name')}
                            keyboardType='default'
                            returnKeyType='next'
                            maxLength={100}
                            value={name}
                            onChangeText={(text: string) => setName(text)}
                            onSubmitEditing={() =>
                                nameInput.current?.focus()
                            }
                        />
                        <SnowInput
                            placeholder={translate('login.email')}
                            keyboardType='email-address'
                            returnKeyType='next'
                            maxLength={100}
                            value={email}
                            onChangeText={(text: string) => setEmail(text)}
                        />
                        <CustomSelector
                            data={contexts}
                            placeholder={isLoadingContexts ? "Carregando..." : "Selecione o Contexto"}
                            initValue={null} 
                            onChange={(option: any) => setSelectedContextId(option.value)}
                        />
                        <SnowInput
                            placeholder={translate('login.password')}
                            secureTextEntry
                            maxLength={100}
                            ref={passwordInput}
                            value={password}
                            onChangeText={(text: string) => setPassword(text)}
                            onSubmitEditing={handleRegister}
                        />
                    </FormSeparator>

                    <FormSeparator>
                        <Touch onPress={() => handleRegister()} disabled={showProgressBar}>
                            <SnowButton>
                                {showProgressBar ? (
                                    <ActivityIndicator size="small" color="#32323b" />
                                ) : (
                                    <Label>{translate('register.signupButton')}</Label>
                                )}
                            </SnowButton>
                        </Touch>
                    </FormSeparator>

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
    );
}