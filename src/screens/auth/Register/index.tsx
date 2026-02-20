import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  GradientBackground,
  KeyboardScrollView,
  FormSeparator,
  SolidInput,
  Touch,
  DarkButton,
  DarkButtonLabel,
  SolidSelector
} from '../../../components/SnowForms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importando os estilos locais do Register
import { Logo, PageTitle, BackButtonContainer, BackButtonText } from './styles';
import translate from '../../../locales/i18n';
import { RootStackParamList } from '../../../types/auth';
import { useRegister } from '../../../hooks/useRegister';
import { LegalCheckOption } from '../../../components/LegalCheckOption';
import { colors } from '../../../utils/colors';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');
const branco = '#ffffff';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const {
    nameInput,
    passwordInput,
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    setSelectedContextId,
    acceptedDocIds,
    contexts,
    legalDocuments,
    isLoadingData,
    isRegistering,
    toggleDocument,
    handleSubmit
  } = useRegister(navigation);

  return (
    <GradientBackground colors={[colors.gradientSocialLinkEscuro, colors.azulClaro]}>
      <KeyboardScrollView>
        <View style={{ height: insets.top + 40, width: '100%' }} />
        <Logo source={GDSLogoBR} />
        <PageTitle>{translate('register.title')}</PageTitle>

        <FormSeparator>
          <SolidInput
            placeholder={translate('register.name')}
            keyboardType='default'
            returnKeyType='next'
            maxLength={100}
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => nameInput.current?.focus()}
          />
          
          <SolidInput
            placeholder={translate('login.email')}
            keyboardType='email-address'
            returnKeyType='next'
            maxLength={100}
            value={email}
            onChangeText={setEmail}
          />

          <SolidSelector
            data={contexts}
            placeholder={isLoadingData ? "Carregando..." : "Selecione o contexto"}
            initValue={null}
            onChange={(option: any) => setSelectedContextId(option.value)}
          />

          <SolidInput
            placeholder={translate('login.password')}
            secureTextEntry
            maxLength={100}
            ref={passwordInput}
            value={password}
            onChangeText={setPassword}
          />

          <SolidInput
            placeholder={"Confirme sua senha"}
            secureTextEntry
            maxLength={100}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleSubmit}
          />
        </FormSeparator>

        <FormSeparator>
          {legalDocuments.map((doc) => (
            <LegalCheckOption
              key={doc.id}
              label={`Li e aceito: ${doc.title}`}
              isChecked={acceptedDocIds.includes(doc.id)}
              onPress={() => toggleDocument(doc)}
            />
          ))}
        </FormSeparator>

        <FormSeparator>
          <Touch onPress={handleSubmit} disabled={isRegistering}>
            <DarkButton>
              {isRegistering ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <DarkButtonLabel>{translate('register.signupButton')}</DarkButtonLabel>
              )}
            </DarkButton>
          </Touch>
        </FormSeparator>

        {/* Novo botão Voltar posicionado no rodapé */}
        <BackButtonContainer onPress={() => navigation.goBack()}>
          <Feather
            name='chevron-left'
            size={24}
            color={branco}
          />
          <BackButtonText>Voltar</BackButtonText>
        </BackButtonContainer>

        <View style={{ height: insets.bottom + 20, width: '100%' }} />

      </KeyboardScrollView>
    </GradientBackground>
  );
}