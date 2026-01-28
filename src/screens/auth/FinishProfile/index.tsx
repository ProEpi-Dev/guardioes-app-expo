import React from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { 
  ButtonBack, 
  CustomSelector, 
  FormSeparator, 
  GradientBackground, 
  KeyboardScrollView, 
  Label, 
  SnowButton, 
  SnowInput, 
  Touch, 
  UserEmail, 
  UserInfoCard,
  UserName
} from '../../../components/SnowForms';
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { PageTitle } from '../Login/styles';
import { Logo } from '../Welcome/styles';
import { useFinishProfile } from '../../../hooks/useFinishProfile';

const GDSLogoBR = require('../../../../assets/gds-pt-branca.png');
const GDSLogoES = require('../../../../assets/gds-es-branca.png');

const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

export function FinishProfile() {
  const {
    selectedGenderId, setSelectedGenderId,
    selectedLocationId, setSelectedLocationId,
    externalIdentifier, setExternalIdentifier,
    genders,
    locations,
    isLoading,
    isSubmitting,
    handleSubmit,
    identifierInputRef,
    navigation,
    name,
    email
  } = useFinishProfile();

  const LogoType = translate('lang.code') === 'es' ? GDSLogoES : GDSLogoBR;

  if (isLoading) {
    return (
      <GradientBackground colors={[azul, verde]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={branco} />
          <Text style={{ color: branco, marginTop: 10 }}>Verificando perfil...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
      <StatusBar backgroundColor={verde} barStyle='light-content' />
      <GradientBackground colors={[azul, verde]}>
        <KeyboardScrollView>
          <Logo source={LogoType} />
          <PageTitle>{translate('Finalizar Perfil')}</PageTitle> 

          <FormSeparator>

            <UserInfoCard>
              <UserName>{name}</UserName>
              <UserEmail>{email}</UserEmail>
            </UserInfoCard>

            <CustomSelector
              data={genders}
              placeholder="Selecione o Gênero"
              initValue={selectedGenderId}
              onChange={(option: any) => setSelectedGenderId(option.value)}
            />

            <CustomSelector
              data={locations}
              placeholder="Selecione a Localidade"
              initValue={selectedLocationId}
              onChange={(option: any) => setSelectedLocationId(option.value)}
            />

            <SnowInput
              placeholder="Identificador (Matrícula, CPF...)"
              keyboardType='default'
              returnKeyType='done'
              maxLength={20}
              value={externalIdentifier}
              onChangeText={setExternalIdentifier}
              ref={identifierInputRef}
              onSubmitEditing={handleSubmit}
            />
            
            <Text style={{ 
              color: branco, 
              fontSize: scale(12), 
              marginLeft: scale(5), 
              marginTop: scale(5),
              opacity: 0.9 
            }}>
              Insira seu número de matrícula, CPF ou outro identificador.
            </Text>
          </FormSeparator>

          <FormSeparator>
            <Touch onPress={handleSubmit} disabled={isSubmitting}>
              <SnowButton>
                {isSubmitting ? (
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