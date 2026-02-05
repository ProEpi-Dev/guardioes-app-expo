// src/screens/auth/PasswordRecover/index.tsx
import React, { useState } from 'react';
import { StatusBar, ActivityIndicator, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  GradientBackground,
  KeyboardScrollView,
  ButtonBack,
  FormSeparator,
  SnowInput,
  Touch,
  SnowButton,
  Label,
} from '../../../components/SnowForms';
import { Logo, PageTitle } from '../Login/styles';
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { RootStackParamList } from '../../../types/auth';
import { forgotPassword } from '../../../services/passwordRecover';


type Props = NativeStackScreenProps<RootStackParamList, 'PasswordRecover'>;

const GDSLogoBR = require('../../../../assets/gds-pt-branca.png');
const GDSLogoES = require('../../../../assets/gds-es-branca.png');
const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

export function PasswordRecover({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      
      // Pop-up solicitado
      Alert.alert(
        "Sucesso",
        "Verifique o seu email para recuperar a senha",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      // Como o endpoint sempre retorna sucesso para o usuário, 
      // cairemos aqui apenas em erros de rede/servidor.
      Alert.alert("Erro", "Ocorreu uma falha ao processar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const LogoType = translate('lang.code') === 'es' ? GDSLogoES : GDSLogoBR;

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
      <StatusBar backgroundColor={verde} barStyle='light-content' />
      <GradientBackground colors={[azul, verde]}>
        <KeyboardScrollView>
          <Logo source={LogoType} />
          <PageTitle>Digite o E-Mail que cadastrado para receber o link de redefinição de senha</PageTitle>

          <FormSeparator>
            <SnowInput
              placeholder={translate('login.email')}
              keyboardType='email-address'
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </FormSeparator>

          <FormSeparator>
            <Touch onPress={handleSubmit} disabled={loading}>
              <SnowButton>
                {loading ? (
                  <ActivityIndicator size="small" color="#32323b" />
                ) : (
                  <Label>Receber código</Label>
                )}
              </SnowButton>
            </Touch>
          </FormSeparator>

          <ButtonBack onPress={() => navigation.goBack()}>
            <Feather name='chevron-left' size={scale(40)} color={branco} />
          </ButtonBack>
        </KeyboardScrollView>
      </GradientBackground>
    </>
  );
}