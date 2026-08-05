import React from 'react';
import { ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import {
  GradientBackground,
  KeyboardScrollView,
  ButtonBack,
  FormSeparator,
  Touch,
  SolidInput,
  GradientButtonContainer,
  GradientButtonLabel,
} from '../../../components/SnowForms';
import { Logo, PageTitle } from '../Login/styles';
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { usePasswordRecover } from '../../../hooks/usePasswordRecover';
import { colors } from '../../../utils/colors';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');
const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

export function PasswordRecover() {
  const { email, setEmail, loading, handleSubmit, navigation } =
    usePasswordRecover();

  const LogoType = GDSLogoBR;

  return (
    <>
      <GradientBackground colors={[azul, verde]}>
        <KeyboardScrollView>
          <Logo source={LogoType} />
          <PageTitle>{translate('forgetPwd.instruction')}</PageTitle>

          <FormSeparator>
            <SolidInput
              placeholder={translate('login.email')}
              keyboardType="email-address"
              returnKeyType="next"
              maxLength={100}
              value={email}
              onChangeText={(text) => setEmail(text.toLocaleLowerCase())}
              onSubmitEditing={handleSubmit}
            />
          </FormSeparator>

          <FormSeparator>
            <Touch onPress={handleSubmit} disabled={loading}>
              <GradientButtonContainer
                colors={[colors.azulClaro, colors.azulEscuro]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <GradientButtonLabel>
                    {translate('forgetPwd.getLinkButton')}
                  </GradientButtonLabel>
                )}
              </GradientButtonContainer>
            </Touch>
          </FormSeparator>

          <ButtonBack onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={scale(40)} color={branco} />
          </ButtonBack>
        </KeyboardScrollView>
      </GradientBackground>
    </>
  );
}
