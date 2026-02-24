import React from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import { 
  ButtonBack, 
  CustomSelector, 
  DarkButton, 
  DarkButtonLabel, 
  FormSeparator, 
  GradientBackground, 
  KeyboardScrollView, 
  Label, 
  SnowButton, 
  SnowInput, 
  SolidInput, 
  SolidSelector, 
  Touch, 
  UserEmail, 
  UserInfoCard,
  UserName
} from '../../../components/SnowForms';
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { PageTitle } from '../Login/styles';
import { Logo } from './styles';
import { useFinishProfile } from '../../../hooks/useFinishProfile';
import { colors } from '../../../utils/colors';
import { BackButtonContainer, BackButtonText } from '../Register/styles';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

export function FinishProfile() {
  const insets = useSafeAreaInsets();
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

  const LogoType = GDSLogoBR;

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
      <GradientBackground colors={[colors.gradientSocialLinkEscuro, colors.azulClaro]}>
        <KeyboardScrollView>
          <View style={{ height: insets.top + 40, width: '100%' }} />
          <Logo source={LogoType} />
          <PageTitle>Finalize seu perfil</PageTitle> 

          <FormSeparator>

            <UserInfoCard>
              <UserName>{name}</UserName>
              <UserEmail>{email}</UserEmail>
            </UserInfoCard>

            <SolidSelector
              data={genders}
              placeholder={isLoading ? "Carregando..." : "Selecione o Gênero"}
              initValue={selectedGenderId}
              onChange={(option: any) => setSelectedGenderId(option.value)}
            />

            {/* <CustomSelector
              data={genders}
              placeholder="Selecione o Gênero"
              initValue={selectedGenderId}
              onChange={(option: any) => setSelectedGenderId(option.value)}
            /> */}

            <SolidSelector
              data={locations}
              placeholder={isLoading ? "Carregando..." : "Selecione a Localidade"}
              initValue={selectedLocationId}
              onChange={(option: any) => setSelectedLocationId(option.value)}
            />
            {/* <CustomSelector
              data={locations}
              placeholder="Selecione a Localidade"
              initValue={selectedLocationId}
              onChange={(option: any) => setSelectedLocationId(option.value)}
            /> */}

            <SolidInput
              placeholder="Identificador"
              secureTextEntry
              maxLength={100}
              ref={identifierInputRef}
              value={externalIdentifier}
              onChangeText={setExternalIdentifier}
            />

            {/* <SnowInput
              placeholder="Identificador (Matrícula, CPF...)"
              keyboardType='default'
              returnKeyType='done'
              maxLength={20}
              value={externalIdentifier}
              onChangeText={setExternalIdentifier}
              ref={identifierInputRef}
              onSubmitEditing={handleSubmit}
            /> */}
            
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              width: '80%',}}
            >
              <AntDesign name="info-circle" size={24} color="#fff" />
              <Text style={{ 
                color: branco, 
                fontSize: scale(12), 
                marginLeft: scale(5), 
                marginTop: scale(5),
                opacity: 0.9 
              }}>
                Insira seu número de matrícula, CPF ou outro identificador
              </Text>
            </View>

          </FormSeparator>

          <FormSeparator>
            <Touch onPress={handleSubmit} disabled={isSubmitting}>
              <DarkButton>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <DarkButtonLabel>{translate('register.signupButton')}</DarkButtonLabel>
                )}
              </DarkButton>
            </Touch>
          </FormSeparator>

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
    </>
  );
}