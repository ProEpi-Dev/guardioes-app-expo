import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import {
  GradientBackground,
  KeyboardScrollView,
  FormSeparator,
  Touch,
  GradientButtonContainer,
  GradientButtonLabel,
} from '../../../components/SnowForms';
import translate from '../../../locales/i18n';
import { Logo, PageTitle } from '../Login/styles';
import { scale } from '../../../utils/scalling';
import { colors } from '../../../utils/colors';
import { apiClient } from '../../../utils/api';

const verde = '#77bfad';
const azul = '#2E97BE';

export function EmailConfirmation() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { email } = route.params || { email: 'seu_email@provedor.com' };
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await apiClient('/v1/auth/request-email-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      Alert.alert(
        translate('register.resendemail.title'),
        translate('register.resendemail.body', { email })
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o e-mail no momento.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground colors={[azul, verde]}>
      <KeyboardScrollView>
        <Logo
          source={require('../../../../assets/logo_gds_completa_branca.png')}
        />

        <PageTitle>{translate('register.confirmemail.title')}</PageTitle>

        <FormSeparator>
          <Text
            style={{
              color: '#fff',
              fontSize: scale(16),
              textAlign: 'center',
              marginBottom: scale(20),
              paddingHorizontal: scale(20),
            }}
          >
            {translate('register.activationMessage', { email })}
          </Text>
        </FormSeparator>

        <FormSeparator>
          <Touch onPress={handleResend} disabled={loading}>
            <GradientButtonContainer
              colors={[colors.azulClaro, colors.azulEscuro]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <GradientButtonLabel>
                  {translate('getToken.title')}
                </GradientButtonLabel>
              )}
            </GradientButtonContainer>
          </Touch>
        </FormSeparator>

        <FormSeparator>
          <Touch onPress={() => navigation.navigate('Login')}>
            <GradientButtonContainer
              colors={[colors.azulClaro, colors.azulEscuro]}
            >
              <GradientButtonLabel>
                {translate('getToken.backButton')}
              </GradientButtonLabel>
            </GradientButtonContainer>
          </Touch>
        </FormSeparator>
      </KeyboardScrollView>
    </GradientBackground>
  );
}
