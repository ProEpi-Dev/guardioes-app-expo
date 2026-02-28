import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DropdownOption } from '../types/finishProfile';
import { getGenders, getLocations, getProfileStatus, updateUserProfile } from '../services/finishProfile';
import { useParticipation } from '../contexts/ParticipationContext';
import { useAuth } from '../contexts/AuthContext'; // 1. Importe o useAuth

export const useFinishProfile = () => {
  const { participationId } = useParticipation();
  const { user } = useAuth(); // 2. Pegue o usuário do contexto
  const navigation = useNavigation<any>();

  // Estados do Formulário
  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [externalIdentifier, setExternalIdentifier] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Dados das Listas
  const [genders, setGenders] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierInputRef = useRef<any>(null);

  useEffect(() => {
    // Carrega se tiver participationId ou se tiver apenas o usuário logado (para casos de pré-participação)
    if (participationId || user) {
       loadInitialData();
    }
  }, [participationId, user]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // 3. Preenche nome e email direto do AuthContext (Sem chamada de API errada)
      if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
      }

      // 1. Verificar Status do Perfil
      const statusData = await getProfileStatus();

      if (statusData?.isComplete) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        return;
      }

      // Preencher dados existentes do perfil (se houver)
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

      const formattedGenders = rawGenders
        .filter((g: any) => g.active)
        .map((g: any) => ({ key: g.id, label: g.name, value: g.id }));

      const formattedLocations = rawLocations
        .filter((l: any) => l.active)
        .map((l: any) => ({ key: l.id, label: l.name, value: l.id }));

      setGenders(formattedGenders);
      setLocations(formattedLocations);

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      
      // Proteção contra token inválido/usuário não encontrado
      if (error?.status === 404) {
         return; // Ignora ou redireciona para login se crítico
      }

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