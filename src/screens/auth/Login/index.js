import React, { useRef, useState } from 'react';
import { Alert, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import {
  GradientBackground,
  KeyboardScrollView,
  FormSeparator,
  SolidInput,
  Touch,
  TransparentButton,
  GradientButtonContainer,
  GradientButtonLabel,
} from '../../../components/SnowForms';
import {
  Logo,
  WelcomeText,
  LabelVisible,
  SeparatorLine,
  FooterContainer,
  FooterText,
  FooterLink,
} from './styles';
import translate from '../../../locales/i18n';
import { useAuth } from '../../../contexts/AuthContext';
import { colors } from '../../../utils/colors';

// Logos
const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const { login } = useAuth();

  const passwordInput = useRef();

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (email === '' || password === '') {
      Alert.alert(translate('register.fieldNotBlank'));
      return;
    }

    setShowProgressBar(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigation.navigate('FinishProfile');
      } else {
        Alert.alert('Erro', result.error || 'Erro ao fazer login');
        setShowProgressBar(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao fazer login');
      console.error('Erro no login:', error);
      setShowProgressBar(false);
    }
  };

  let LogoType = GDSLogoBR;

  return (
    <>
      <StatusBar
        backgroundColor={colors.gradientSocialLinkEscuro}
        barStyle="light-content"
      />

      <GradientBackground
        colors={[colors.azulClaro, colors.gradientSocialLinkEscuro]}
      >
        <KeyboardScrollView>
          <Logo source={LogoType} />

          <WelcomeText>Bem vindo (a)</WelcomeText>

          <FormSeparator>
            <SolidInput
              placeholder={translate('login.email')}
              keyboardType="email-address"
              returnKeyType="next"
              maxLength={100}
              value={email}
              onChangeText={(text) => setEmail(text)}
              onSubmitEditing={() => passwordInput.current.focus()}
            />
            <SolidInput
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
              <GradientButtonContainer
                colors={[colors.azulClaro, colors.azulEscuro]}
              >
                {showProgressBar ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <GradientButtonLabel>Login</GradientButtonLabel>
                )}
              </GradientButtonContainer>
            </Touch>
          </FormSeparator>

          <TransparentButton
            onPress={() => navigation.navigate('PasswordRecover')}
          >
            <LabelVisible>{translate('login.forgetbutton')}</LabelVisible>
          </TransparentButton>

          <SeparatorLine />

          <FooterContainer>
            <FooterText>Não tem uma conta?</FooterText>
            <TransparentButton
              style={{ width: 'auto', marginTop: 0, height: 'auto' }}
              onPress={() => navigation.navigate('Register')}
            >
              <FooterLink>Cadastre-se</FooterLink>
            </TransparentButton>
          </FooterContainer>
        </KeyboardScrollView>
      </GradientBackground>
    </>
  );
};

export default Login;
