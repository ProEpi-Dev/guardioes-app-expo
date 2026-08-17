import { useEffect, useState, useRef, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getLocations,
  getProfileStatus,
  updateUserProfile,
  getGenders,
} from '../services/finishProfile';

import { useAuth } from '../contexts/AuthContext';
import type { UpdateProfilePayload } from '../types/finishProfile';

import {
  getParticipationExtra,
  putParticipationExtra,
} from '../services/finishProfile';
import { isLocationDescendantOfCountry } from '../utils/locationHierarchy';
import { resolveProfileExtraPayload } from '../utils/profileExtraPayload';

import {
  IdentifierStrategy,
  IdentifierStrategyContext,
} from '../utils/identifierStrategy';

const createProfileSchema = (strategy: IdentifierStrategy) => {
  return z
    .object({
      genderId: z.number().optional(),
      countryLocationId: z.number().optional(),
      locationId: z.number().optional(),
      externalIdentifier: z.string().optional(),
      confirmExternalIdentifier: z.string().optional(),
      phone: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const error = strategy.validate(data.externalIdentifier);
      if (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
          path: ['externalIdentifier'],
        });
      }

      if (data.externalIdentifier !== data.confirmExternalIdentifier) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Os identificadores não conferem.',
          path: ['confirmExternalIdentifier'],
        });
      }
    });
};

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export const useFinishProfile = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [extraValues, setExtraValues] = useState<Record<string, unknown>>({});
  const profileExtraFormRef = useRef<any>(null);

  // Queries
  const {
    data: profileStatus,
    isLoading: statusLoading,
    refetch,
  } = useQuery({
    queryKey: ['profile-status'],
    queryFn: () => getProfileStatus(),
  });

  const { data: profileExtraMe } = useQuery({
    queryKey: ['participation-profile-extra-me'],
    queryFn: () => getParticipationExtra(),
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ['locations', 'countries', 'all-pages'],
    queryFn: async () => {
      const locs = await getLocations();
      return locs.filter((l: any) => l.orgLevel === 'COUNTRY');
    },
  });

  const { data: allLocations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', 'all-active', 'all-pages'],
    queryFn: () => getLocations(),
  });

  const { data: genders = [], isLoading: gendersLoading } = useQuery({
    queryKey: ['genders'],
    queryFn: () => getGenders(),
  });

  const isUnb =
    user?.participation?.context?.name?.toLowerCase().includes('unb') || false;
  const identifierStrategy = useMemo(
    () => new IdentifierStrategyContext(isUnb).getStrategy(),
    [isUnb]
  );

  // Configuração do Form
  const formMethods = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema(identifierStrategy)),
    defaultValues: {
      genderId: undefined,
      countryLocationId: undefined,
      locationId: undefined,
      externalIdentifier: '',
      confirmExternalIdentifier: '',
      phone: '',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedCountryLocationId = watch('countryLocationId');
  const selectedLocationId = watch('locationId');

  // Popular dados iniciais
  useEffect(() => {
    if (!profileStatus) return;
    if (profileStatus.isComplete) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      return;
    }

    if (profileStatus.profile) {
      reset({
        genderId: profileStatus.profile.genderId ?? undefined,
        countryLocationId: profileStatus.profile.countryLocationId ?? undefined,
        locationId: profileStatus.profile.locationId ?? undefined,
        externalIdentifier: profileStatus.profile.externalIdentifier || '',
        confirmExternalIdentifier:
          profileStatus.profile.externalIdentifier || '',
        phone: (profileStatus.profile as any).phone || '',
      });
    }
  }, [profileStatus, reset, navigation]);

  // Regra de hierarquia de localidade
  useEffect(() => {
    if (!selectedLocationId || !selectedCountryLocationId) return;

    const currentLocation = allLocations.find(
      (loc: any) => loc.id === selectedLocationId
    );
    if (!currentLocation) return;

    const isChild = isLocationDescendantOfCountry(
      currentLocation,
      selectedCountryLocationId
    );

    if (!isChild) {
      setValue('locationId', undefined);
    }
  }, [selectedCountryLocationId, selectedLocationId, allLocations, setValue]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await updateUserProfile(data as UpdateProfilePayload);
    },
    onSuccess: () => {
      refetch();
      Alert.alert('Sucesso', 'Perfil completado com sucesso!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] }),
        },
      ]);
    },
    onError: () => {
      Alert.alert('Erro', 'Erro ao atualizar perfil. Tente novamente.');
    },
  });

  const saveProfileExtraMutation = useMutation({
    mutationFn: async () => {
      const me: any = await queryClient.fetchQuery({
        queryKey: ['participation-profile-extra-me'],
        queryFn: () => getParticipationExtra(),
      });

      const resolved = resolveProfileExtraPayload(me, extraValues);

      if ('error' in resolved || !me?.form) {
        throw new Error('Dados extra inválidos');
      }

      await putParticipationExtra({
        formVersionId: me.form.version.id,
        formResponse: resolved.ok,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['participation-profile-extra-me'],
        }),
        queryClient.invalidateQueries({ queryKey: ['profile-status'] }),
      ]);
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível salvar os dados extras.');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const {
      confirmExternalIdentifier: _confirmExternalIdentifier,
      ...payload
    } = data;
    updateProfileMutation.mutate(payload);
  };

  return {
    user,
    navigation,
    formMethods,
    control,
    handleSubmit,
    errors,
    onSubmit,
    profileStatus,
    statusLoading,
    countriesLoading,
    locationsLoading,
    countries,
    allLocations,
    selectedCountryLocationId,
    updateProfileMutation,
    profileExtraMe,
    setExtraValues,
    saveProfileExtraMutation,
    profileExtraFormRef,
    genders,
    gendersLoading,
    identifierStrategy,
  };
};
