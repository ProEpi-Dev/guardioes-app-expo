import { useState } from 'react';
import { Alert } from 'react-native';
import { useParticipation } from '../contexts/ParticipationContext';
import { useUserLocation } from './useUserLocation';
import { useSentimentMap } from './useSentimentMap';
import { getLatestSignalForm } from '../services/forms';
import { createReport } from '../services/reports';

export const useSentimentLogic = () => {
  // Hooks Externos
  const { participationId } = useParticipation();
  const { location, refreshLocation } = useUserLocation();
  const { mapPoints, loadingPoints, refreshPoints } = useSentimentMap();

  // Estados Locais
  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [currentFormVersionId, setCurrentFormVersionId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // Estados de Loading
  const [loadingForm, setLoadingForm] = useState(false);
  const [sending, setSending] = useState(false);

  // Auxiliar para pegar localização atualizada
  const getLocation = async () => {
    return location || await refreshLocation();
  };

  // 1. Fluxo do Sentimento Positivo (Envio Imediato)
  const handlePositiveSentiment = async () => {
    if (!participationId) return Alert.alert('Aguarde', 'Carregando perfil...');

    try {
      const latestForm = await getLatestSignalForm();
      const versionId = latestForm.latestVersion?.id;
      const loc = await getLocation();

      if (versionId) {
        await createReport({
          participationId,
          formVersionId: versionId,
          reportType: 'POSITIVE',
          formResponse: {},
          occurrenceLocation: loc ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude } : null
        });
        
        Alert.alert('Sucesso', 'Sentimento registrado!');
        setTimeout(refreshPoints, 500);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao registrar sentimento.');
    }
  };

  // 2. Fluxo do Sentimento Negativo (Abrir Modal)
  const handleNegativeSentiment = async () => {
    setLoadingForm(true);
    setShowForm(true);
    
    try {
      const latestForm = await getLatestSignalForm();
      const version = latestForm.latestVersion;

      if (version?.definition) {
        setFormDefinition(version.definition);
        setCurrentFormVersionId(version.id);
      } else {
        throw new Error('Definição ausente');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao carregar formulário.');
      setShowForm(false);
    } finally {
      setLoadingForm(false);
    }
  };

  // 3. Decisor (Handler Principal)
  const onFeelingSelected = (feeling: 'good' | 'bad') => {
    if (feeling === 'good') {
      handlePositiveSentiment();
    } else {
      handleNegativeSentiment();
    }
  };

  // 4. Envio do Formulário Negativo
  const handleSubmitForm = async () => {
    if (!formValues._isValid) return Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
    if (!currentFormVersionId || !participationId) return;

    setSending(true);
    try {
      const { _isValid, ...cleanData } = formValues;
      const loc = await getLocation();

      await createReport({
        participationId,
        formVersionId: currentFormVersionId,
        reportType: 'NEGATIVE',
        formResponse: cleanData,
        occurrenceLocation: loc ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude } : null
      });
      
      Alert.alert('Sucesso', 'Formulário enviado!');
      setShowForm(false);
      setFormValues({});
      setTimeout(refreshPoints, 500);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha no envio.');
    } finally {
      setSending(false);
    }
  };

  return {
    // Dados do Mapa
    mapPoints,
    loadingPoints,
    // Dados do Modal
    showForm,
    setShowForm,
    formDefinition,
    loadingForm,
    sending,
    // Ações
    onFeelingSelected,
    setFormValues,
    handleSubmitForm
  };
};