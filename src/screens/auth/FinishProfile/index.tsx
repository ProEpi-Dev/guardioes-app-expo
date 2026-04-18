import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';

import {
  DarkButton,
  DarkButtonLabel,
  FormSeparator,
  GradientBackground,
  KeyboardScrollView,
  SolidInput,
  SolidSelector,
  Touch,
  UserInfoCard,
  UserName,
  UserEmail,
} from '../../../components/SnowForms';
// import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { PageTitle, Logo } from './styles';
import { BackButtonContainer, BackButtonText } from '../Register/styles';
import { colors } from '../../../utils/colors';

import { useFinishProfile } from '../../../hooks/useFinishProfile';

import ProfileExtraFormSection from '../../../components/ProfileExtraFormSection';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#ffffff';

const DEFAULT_PROFILE_FIELD_REQUIREMENTS = {
  gender: true,
  country: false,
  location: true,
  externalIdentifier: true,
  phone: false,
};

export function FinishProfile() {
  const insets = useSafeAreaInsets();
  const {
    user,
    navigation,
    control,
    handleSubmit,
    errors,
    onSubmit,
    profileStatus,
    statusLoading,
    countries,
    allLocations,
    selectedCountryLocationId,
    updateProfileMutation,
    profileExtraMe,
    setExtraValues,
    saveProfileExtraMutation,
    profileExtraFormRef,
    genders,
  } = useFinishProfile();

  const formattedCountries = useMemo(() => {
    return countries.map((c: any) => ({
      key: c.id,
      label: c.name,
      value: c.id,
    }));
  }, [countries]);

  const formattedGenders = useMemo(() => {
    return genders
      .filter((g: any) => g.active !== false)
      .map((g: any) => ({
        key: g.id,
        label: g.name,
        value: g.id,
      }));
  }, [genders]);

  const profileReq =
    profileStatus?.profileFieldRequirements ??
    DEFAULT_PROFILE_FIELD_REQUIREMENTS;

  const locationsByCountry = useMemo(() => {
    if (profileReq.country && selectedCountryLocationId) {
      const filtered = allLocations.filter(
        (loc: any) => loc.parentId === selectedCountryLocationId
      );
      return filtered.map((l: any) => ({
        key: l.id,
        label: l.name,
        value: l.id,
      }));
    }
    return profileReq.country
      ? []
      : allLocations.map((l: any) => ({
          key: l.id,
          label: l.name,
          value: l.id,
        }));
  }, [allLocations, profileReq.country, selectedCountryLocationId]);

  if (statusLoading || !profileStatus) {
    return (
      <GradientBackground colors={[azul, verde]}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={branco} />
          <Text style={{ color: branco, marginTop: 10 }}>
            Verificando perfil...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground
      colors={[colors.gradientSocialLinkEscuro, colors.azulClaro]}
    >
      <KeyboardScrollView>
        <View style={{ height: insets.top + 40, width: '100%' }} />
        <Logo source={GDSLogoBR} />
        <PageTitle>Finalize seu perfil</PageTitle>

        <FormSeparator>
          <UserInfoCard>
            <UserName>{user?.name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfoCard>

          {/* GÊNERO */}
          <Controller
            control={control}
            name="genderId"
            render={({ field: { onChange, value } }) => (
              <SolidSelector
                data={formattedGenders}
                placeholder="Selecione o Gênero"
                initValue={value}
                onChange={(option: any) => onChange(option.value)}
              />
            )}
          />
          {errors.genderId && (
            <Text style={{ color: '#ff6b6b' }}>Campo obrigatório</Text>
          )}

          {/* PAÍS */}
          {profileReq.country && (
            <Controller
              control={control}
              name="countryLocationId"
              render={({ field: { onChange, value } }) => (
                <SolidSelector
                  data={formattedCountries}
                  placeholder="Selecione o País"
                  initValue={value}
                  onChange={(option: any) => onChange(option.value)}
                />
              )}
            />
          )}

          {/* LOCALIDADE */}
          <Controller
            control={control}
            name="locationId"
            render={({ field: { onChange, value } }) => (
              <SolidSelector
                data={locationsByCountry}
                placeholder="Selecione a Localidade"
                initValue={value}
                onChange={(option: any) => onChange(option.value)}
              />
            )}
          />

          {/* IDENTIFICADOR */}
          <Controller
            control={control}
            name="externalIdentifier"
            render={({ field: { onChange, value } }) => (
              <SolidInput
                placeholder="Identificador (Matrícula, CPF...)"
                maxLength={100}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* TELEFONE */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <SolidInput
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
              marginTop: scale(10),
            }}
          >
            <AntDesign name="info-circle" size={24} color="#fff" />
            <Text
              style={{
                color: branco,
                fontSize: scale(12),
                marginLeft: scale(5),
                opacity: 0.9,
              }}
            >
              Preencha corretamente suas informações para liberar acesso.
            </Text>
          </View>
        </FormSeparator>

        <FormSeparator>
          <Touch
            onPress={handleSubmit(onSubmit)}
            disabled={updateProfileMutation.isPending}
          >
            <DarkButton>
              {updateProfileMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <DarkButtonLabel>Atualizar Perfil</DarkButtonLabel>
              )}
            </DarkButton>
          </Touch>
        </FormSeparator>

        {/* PROFILE EXTRA SECTION */}
        {profileExtraMe?.[0]?.form && (
          <FormSeparator>
            <Text
              style={{
                color: branco,
                fontSize: scale(16),
                marginBottom: scale(10),
                fontWeight: 'bold',
              }}
            >
              Informações Adicionais
            </Text>

            <ProfileExtraFormSection
              ref={profileExtraFormRef}
              onValuesChange={setExtraValues}
              participantCountryLocationId={
                selectedCountryLocationId ??
                profileStatus?.profile?.countryLocationId ??
                null
              }
            />

            <Touch
              onPress={() => saveProfileExtraMutation.mutate()}
              disabled={saveProfileExtraMutation.isPending}
            >
              <DarkButton
                style={{
                  marginTop: scale(15),
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: branco,
                }}
              >
                {saveProfileExtraMutation.isPending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <DarkButtonLabel style={{ color: branco }}>
                    Salvar Dados Extras
                  </DarkButtonLabel>
                )}
              </DarkButton>
            </Touch>
          </FormSeparator>
        )}

        <BackButtonContainer onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={branco} />
          <BackButtonText>Voltar</BackButtonText>
        </BackButtonContainer>

        <View style={{ height: insets.bottom + 20, width: '100%' }} />
      </KeyboardScrollView>
    </GradientBackground>
  );
}
