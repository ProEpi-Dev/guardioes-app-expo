import React from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
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
  CustomSelector
} from '../../../components/SnowForms';
import { Logo, PageTitle } from '../Login/styles';
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { RootStackParamList } from '../../../types/auth';
import { useRegister } from '../../../hooks/useRegister';
import { LegalCheckOption } from '../../../components/LegalCheckOption';

const GDSLogoBR = require('../../../../assets/gds-pt-branca.png');
const GDSLogoES = require('../../../../assets/gds-es-branca.png');
const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
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

  const LogoType = translate('lang.code') === 'es' ? GDSLogoES : GDSLogoBR;

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
      <StatusBar backgroundColor={verde} barStyle='light-content' />
      <GradientBackground colors={[azul, verde]}>
        <KeyboardScrollView>
          <Logo source={LogoType} />
          <PageTitle>{translate('register.title')}</PageTitle>

          <FormSeparator>
            <SnowInput
              placeholder={translate('register.name')}
              keyboardType='default'
              returnKeyType='next'
              maxLength={100}
              value={name}
              onChangeText={setName}
              onSubmitEditing={() => nameInput.current?.focus()}
            />
            <SnowInput
              placeholder={translate('login.email')}
              keyboardType='email-address'
              returnKeyType='next'
              maxLength={100}
              value={email}
              onChangeText={setEmail}
            />
            <CustomSelector
              data={contexts}
              placeholder={isLoadingData ? "Carregando..." : "Selecione o Contexto"}
              initValue={null}
              onChange={(option: any) => setSelectedContextId(option.value)}
            />
            <SnowInput
              placeholder={translate('login.password')}
              secureTextEntry
              maxLength={100}
              ref={passwordInput}
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
            />
            <SnowInput
              placeholder={translate('changePwd.confirmPwd')}
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
              <SnowButton>
                {isRegistering ? (
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