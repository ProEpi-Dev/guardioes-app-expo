import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DropdownOption } from '../types/finishProfile';
import { getGenders, getLocations, getNameEmail, getProfileStatus, updateUserProfile } from '../services/finishProfile';
import { useParticipation } from '../contexts/ParticipationContext';

export const useFinishProfile = () => {
  const { participationId } = useParticipation();
  const navigation = useNavigation<any>();

  // Estados do Formulário
  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [externalIdentifier, setExternalIdentifier] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Dados das Listas (Formatados)
  const [genders, setGenders] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierInputRef = useRef<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // 1. Verificar Status do Perfil
      const statusData = await getProfileStatus();
      if (participationId) {
          const {name, email} = await getNameEmail(participationId);
          setName(name);
          setEmail(email);
      }

      if (statusData?.isComplete) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        return;
      }

      // Preencher dados existentes
      if (statusData?.profile) {
        if (statusData.profile.genderId) setSelectedGenderId(statusData.profile.genderId);
        if (statusData.profile.locationId) setSelectedLocationId(statusData.profile.locationId);
        if (statusData.profile.externalIdentifier) setExternalIdentifier(statusData.profile.externalIdentifier);
      }

      // 2. Buscar Listas (Gêneros e Locais)
      const [rawGenders, rawLocations] = await Promise.all([
        getGenders(),
        getLocations()
      ]);

      // 3. Transformar dados para o Dropdown (API -> { label, value })
      const formattedGenders = rawGenders
        .filter((g: any) => g.active)
        .map((g: any) => ({ key: g.id, label: g.name, value: g.id }));

      const formattedLocations = rawLocations
        .filter((l: any) => l.active)
        .map((l: any) => ({ key: l.id, label: l.name, value: l.id }));

      setGenders(formattedGenders);
      setLocations(formattedLocations);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Falha ao carregar informações. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedGenderId || !selectedLocationId || !externalIdentifier.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);

      await updateUserProfile({
        genderId: selectedGenderId,
        locationId: selectedLocationId,
        externalIdentifier: externalIdentifier.trim()
      });

      Alert.alert('Sucesso', 'Perfil completado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
      ]);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};