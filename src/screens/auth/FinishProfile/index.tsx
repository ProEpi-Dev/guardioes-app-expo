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
import translate from '../../../locales/i18n';
import { scale } from '../../../utils/scalling';
import { PageTitle, Logo } from './styles';
import { BackButtonContainer, BackButtonText } from '../Register/styles';
import { colors } from '../../../utils/colors';

import {
  useFinishProfile,
  DEFAULT_PROFILE_FIELD_REQUIREMENTS,
} from '../../../hooks/useFinishProfile';

import ProfileExtraFormSection from '../../../components/ProfileExtraFormSection';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

const verde = '#77bfad';
const azul = '#2E97BE';
const branco = '#fff';

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
    identifierStrategy,
    isUnb,
    isStudent,
    setIsStudent,
    formMethods,
  } = useFinishProfile();

  const studentOptions = useMemo(
    () => [
      {
        key: 'yes',
        label: translate('finishProfile.identifier.studentSelector.yes'),
        value: true,
      },
      {
        key: 'no',
        label: translate('finishProfile.identifier.studentSelector.no'),
        value: false,
      },
    ],
    []
  );

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

  const isSubmitting =
    updateProfileMutation.isPending || saveProfileExtraMutation.isPending;

  // Função que engloba as duas submissões
  const handleCombinedSubmit = handleSubmit(async (data) => {
    if (profileExtraMe?.form) {
      try {
        await saveProfileExtraMutation.mutateAsync();
      } catch (error) {
        console.log(error);
        return;
      }
    }
    // Salva os dados básicos e finaliza
    onSubmit(data);
  });

  if (statusLoading || !profileStatus) {
    return (
      <GradientBackground colors={[azul, verde]}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>
            {translate('finishProfile.loadingStatus')}
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // Estilo padronizado para as labels (Textos antes dos inputs)
  const labelStyle = {
    color: branco,
    width: '80%' as const,
    textAlign: 'left' as const,
    marginBottom: scale(6),
    fontSize: scale(13),
    fontWeight: '600' as const,
  };

  return (
    <GradientBackground
      colors={[colors.gradientSocialLinkEscuro, colors.azulClaro]}
    >
      <KeyboardScrollView>
        <View style={{ height: insets.top + 40, width: '100%' }} />
        <Logo source={GDSLogoBR} />
        <PageTitle>{translate('finishProfile.title')}</PageTitle>

        <FormSeparator>
          <UserInfoCard>
            <UserName>{user?.name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfoCard>

          {/* GÊNERO */}
          <Text style={labelStyle}>Selecione o seu Gênero:</Text>
          <Controller
            control={control}
            name="genderId"
            render={({ field: { onChange, value } }) => (
              <SolidSelector
                data={formattedGenders}
                placeholder={translate('finishProfile.placeholders.gender')}
                initValue={value}
                onChange={(option: any) => onChange(option.value)}
              />
            )}
          />
          {errors.genderId && (
            <Text style={{ color: '#ff6b6b', width: '80%', marginBottom: 15 }}>
              {translate('finishProfile.errors.required')}
            </Text>
          )}

          {/* PAÍS */}
          {profileReq.country && (
            <>
              <Text style={labelStyle}>Selecione o seu País:</Text>
              <Controller
                control={control}
                name="countryLocationId"
                render={({ field: { onChange, value } }) => (
                  <SolidSelector
                    data={formattedCountries}
                    placeholder={translate(
                      'finishProfile.placeholders.country'
                    )}
                    initValue={value}
                    onChange={(option: any) => onChange(option.value)}
                  />
                )}
              />
            </>
          )}

          {/* LOCALIDADE */}
          <Text style={labelStyle}>Selecione sua Localidade:</Text>
          <Controller
            control={control}
            name="locationId"
            render={({ field: { onChange, value } }) => (
              <SolidSelector
                data={locationsByCountry}
                placeholder={translate('finishProfile.placeholders.location')}
                initValue={value}
                onChange={(option: any) => onChange(option.value)}
              />
            )}
          />

          {/* SELETOR ESTUDANTE UNB */}
          {isUnb && (
            <>
              <Text style={labelStyle}>
                {translate('finishProfile.identifier.studentSelector.label')}
              </Text>
              <SolidSelector
                data={studentOptions}
                placeholder={translate(
                  'finishProfile.identifier.studentSelector.placeholder'
                )}
                initValue={isStudent}
                onChange={(option: any) => setIsStudent(option.value)}
              />
            </>
          )}

          {/* IDENTIFICADOR */}
          {(!isUnb || isStudent !== null) && (
            <>
              <Text style={labelStyle}>{identifierStrategy.label}</Text>
              <Controller
                control={control}
                name="externalIdentifier"
                render={({ field: { onChange, value } }) => (
                  <SolidInput
                    placeholder={identifierStrategy.placeholder}
                    maxLength={100}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.externalIdentifier && (
                <Text
                  style={{
                    color: '#ff6b6b',
                    width: '80%',
                    marginBottom: 15,
                    fontSize: scale(11),
                  }}
                >
                  {String(errors.externalIdentifier.message)}
                </Text>
              )}

              {/* CONFIRMAÇÃO IDENTIFICADOR (Renderiza apenas se o primeiro tiver valor) */}
              {formMethods.watch('externalIdentifier') ? (
                <>
                  <Text style={labelStyle}>
                    {translate('finishProfile.identifier.confirmLabel')}
                  </Text>
                  <Controller
                    control={control}
                    name="confirmExternalIdentifier"
                    render={({ field: { onChange, value } }) => (
                      <SolidInput
                        placeholder={translate(
                          'finishProfile.identifier.confirmPlaceholder'
                        )}
                        maxLength={100}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {errors.confirmExternalIdentifier && (
                    <Text
                      style={{
                        color: '#ff6b6b',
                        width: '80%',
                        marginBottom: 15,
                        fontSize: scale(11),
                      }}
                    >
                      {String(errors.confirmExternalIdentifier.message)}
                    </Text>
                  )}
                </>
              ) : null}
            </>
          )}

          {/* TELEFONE */}
          <Text style={labelStyle}>Digite seu Telefone:</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <SolidInput
                placeholder={translate('finishProfile.placeholders.phone')}
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* PROFILE EXTRA SECTION */}
          {profileExtraMe?.form && (
            <FormSeparator>
              <ProfileExtraFormSection
                ref={profileExtraFormRef}
                onValuesChange={setExtraValues}
                participantCountryLocationId={
                  selectedCountryLocationId ??
                  profileStatus?.profile?.countryLocationId ??
                  null
                }
              />
            </FormSeparator>
          )}

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
                color: '#fff',
                fontSize: scale(12),
                marginLeft: scale(5),
                opacity: 0.9,
              }}
            >
              {translate('finishProfile.infoText')}
            </Text>
          </View>
        </FormSeparator>

        <FormSeparator>
          <Touch onPress={handleCombinedSubmit} disabled={isSubmitting}>
            <DarkButton>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <DarkButtonLabel>
                  {translate('finishProfile.buttons.updateProfile')}
                </DarkButtonLabel>
              )}
            </DarkButton>
          </Touch>
        </FormSeparator>

        <BackButtonContainer
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
          }}
        >
          <Feather name="chevron-left" size={24} color="#fff" />
          <BackButtonText>
            {translate('finishProfile.buttons.back')}
          </BackButtonText>
        </BackButtonContainer>

        <View style={{ height: insets.bottom + 20, width: '100%' }} />
      </KeyboardScrollView>
    </GradientBackground>
  );
}
