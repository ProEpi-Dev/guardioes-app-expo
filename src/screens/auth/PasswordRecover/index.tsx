import React from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { usePasswordRecover } from '../../../hooks/usePasswordRecover';

const GDSLogoBR = require('../../../../assets/gds-pt-branca.png');
const GDSLogoES = require('../../../../assets/gds-es-branca.png');
const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

export function PasswordRecover() {
  const { 
    email, 
    setEmail, 
    loading, 
    handleSubmit, 
    navigation 
  } = usePasswordRecover();

  const LogoType = translate('lang.code') === 'es' ? GDSLogoES : GDSLogoBR;

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
      <StatusBar backgroundColor={verde} barStyle='light-content' />
      <GradientBackground colors={[azul, verde]}>
        <KeyboardScrollView>
          <Logo source={LogoType} />
          <PageTitle>
            Digite o E-Mail cadastrado para receber o link da redefinição de senha
          </PageTitle>

          <FormSeparator>
            <SnowInput
              placeholder={translate('login.email')}
              keyboardType='email-address'
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={handleSubmit}
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