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
      await apiClient('/v1/auth/resend-confirmation', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      Alert.alert(
        'Quase lá!',
        `Enviamos um novo e-mail de ativação para o endereço ${email}. Verifique sua caixa de entrada e spam.`
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

        <PageTitle>Quase lá!</PageTitle>

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
            Enviamos um e-mail de ativação para o endereço{' '}
            <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Verifique sua
            caixa de entrada e spam para confirmar seu cadastro.
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
                <GradientButtonLabel>Reenviar confirmação</GradientButtonLabel>
              )}
            </GradientButtonContainer>
          </Touch>
        </FormSeparator>

        <FormSeparator>
          <Touch onPress={() => navigation.navigate('Login')}>
            <GradientButtonContainer
              colors={[colors.azulClaro, colors.azulEscuro]}
            >
              <GradientButtonLabel>Voltar ao Login</GradientButtonLabel>
            </GradientButtonContainer>
          </Touch>
        </FormSeparator>
      </KeyboardScrollView>
    </GradientBackground>
  );
}
