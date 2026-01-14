import React, { useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { useAuth } from '../../../contexts/AuthContext';
import { useParticipation } from '../../../contexts/ParticipationContext';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { useSentimentMap } from '../../../hooks/useSentimentMap';
import { SentimentModal } from '../../../components/SentimentModal';
import { apiClient } from '../../../utils/api';

export function MapaSentimento() {
  const { form } = useAuth();
  const { participationId } = useParticipation();
  const { location, refreshLocation } = useUserLocation();
  const { mapPoints, loadingPoints, refreshPoints } = useSentimentMap();

  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [currentFormVersionId, setCurrentFormVersionId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [sending, setSending] = useState(false);

  const loadFormDefinition = async () => {
    if (!form?.id) return Alert.alert('Erro', 'Formulário indisponível');
    
    setLoadingForm(true);
    setShowForm(true);
    
    try {
      const response: any = await apiClient(`/v1/forms/${form.id}/versions?page=1&pageSize=1&active=true`, { method: 'GET' });
      const version = response.data?.[0];
      
      if (version?.definition) {
        setFormDefinition(version.definition);
        setCurrentFormVersionId(version.id);
      } else {
        Alert.alert('Erro', 'Definição não encontrada.');
        setShowForm(false);
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar formulário.');
      setShowForm(false);
    } finally {
      setLoadingForm(false);
    }
  };

  const sendReport = async (type: 'POSITIVE' | 'NEGATIVE', data: any = {}, versionId: number) => {
    if (!participationId) return Alert.alert('Erro', 'Usuário não identificado.');
    
    const loc = location || await refreshLocation(); 
    
    const payload = {
      participationId,
      formVersionId: versionId,
      reportType: type,
      formResponse: data,
      occurrenceLocation: loc ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude } : null
    };

    await apiClient('/v1/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // 5. Handlers de Eventos
  const handleFeelingSelected = async (feeling: 'good' | 'bad') => {
    if (!participationId) return Alert.alert('Aguarde', 'Carregando perfil...');

    if (feeling === 'good') {
      try {
         const resp: any = await apiClient(`/v1/forms/${form?.id}/versions?page=1&pageSize=1&active=true`, { method: 'GET' });
         const versionId = resp.data?.[0]?.id;
         
         if (versionId) {
            await sendReport('POSITIVE', {}, versionId); 
            Alert.alert('Sucesso', 'Sentimento registrado!');
            setTimeout(refreshPoints, 500);
         }
      } catch (e) {
        Alert.alert('Erro', 'Falha ao registrar.');
      }
    } else {
      await loadFormDefinition();
    }
  };

  const handleSubmitForm = async () => {
    if (!formValues._isValid) return Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
    if (!currentFormVersionId) return;

    setSending(true);
    try {
      const { _isValid, ...cleanData } = formValues;
      await sendReport('NEGATIVE', cleanData, currentFormVersionId);
      
      Alert.alert('Sucesso', 'Formulário enviado!');
      setShowForm(false);
      setFormValues({});
      setTimeout(refreshPoints, 500);
    } catch (e) {
      Alert.alert('Erro', 'Falha no envio.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      
      <MapWithFeeling 
        onFeelingSelected={handleFeelingSelected} 
        points={mapPoints}
        loading={loadingPoints}
      />

      <SentimentModal 
        visible={showForm}
        onClose={() => setShowForm(false)}
        loading={loadingForm}
        sending={sending}
        formDefinition={formDefinition}
        onFormChange={setFormValues}
        onSubmit={handleSubmitForm}
      />
    </>
  );
}