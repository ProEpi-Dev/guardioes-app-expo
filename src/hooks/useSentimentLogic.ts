import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useParticipation } from '../contexts/ParticipationContext';
import { useUserLocation } from './useUserLocation';
import { useSentimentMap } from './useSentimentMap';
import { getLatestSignalForm } from '../services/forms';
import { createReport } from '../services/reports';
import { checkMandatoryCompliance } from '../services/trail';
import { useFocusEffect } from '@react-navigation/native';

export const useSentimentLogic = () => {
  // Hooks Externos
  const { participationId } = useParticipation();
  const { location, refreshLocation } = useUserLocation();
  const { mapPoints, loadingPoints, refreshPoints } = useSentimentMap();
  
  // Estado de conformidade (inicia true para não bloquear durante o carregamento)
  const [isCompliant, setIsCompliant] = useState(true);

  // Estados Locais
  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [currentFormVersionId, setCurrentFormVersionId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // Estados de Loading
  const [loadingForm, setLoadingForm] = useState(false);
  const [sending, setSending] = useState(false);

  const lastComplianceCheck = useRef<number>(0);
  const CACHE_DURATION = 60 * 1000;

  // Auxiliar para pegar localização atualizada
  const getLocation = async () => {
    return location || await refreshLocation();
  };

  // Verificação de Conformidade
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag para evitar atualização de estado se o componente desmontar

      const checkCompliance = async () => {
        if (!participationId) return;

        const now = Date.now();
        if (now - lastComplianceCheck.current < CACHE_DURATION) {
            return;
        }

        try {
          const response: any = await checkMandatoryCompliance(participationId);
          
          if (isActive) {
            const data = response?.data || response;
            let userIsCompliant = true;

            // Verifica a nova estrutura (contadores)
            if (data && typeof data.totalRequired === 'number') {
                userIsCompliant = data.completedCount >= data.totalRequired;
            } 
            // Fallback para a estrutura antiga
            else if (data?.is_compliant !== undefined) {
                userIsCompliant = data.is_compliant;
            }

            // console.log('Compliance Check (Sentiment) [Refreshed]:', userIsCompliant);
            setIsCompliant(userIsCompliant);
            lastComplianceCheck.current = Date.now();
          }
        } catch (err) {
          console.error("Erro no compliance:", err);
          // Em caso de erro, por segurança, não bloqueamos (ou decida sua regra de negócio)
          if (isActive) setIsCompliant(true);
        }
      };

      checkCompliance();

      return () => {
        isActive = false;
      };
    }, [participationId])
  );

  // 1. Fluxo do Sentimento Positivo
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
        
        Alert.alert('Sucesso', 'Obrigado por reportar!');
        setTimeout(refreshPoints, 500);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao registrar sentimento.');
    }
  };

  // 2. Fluxo do Sentimento Negativo
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
    // Bloqueio explícito se isCompliant for false
    if (isCompliant === false) {
        return Alert.alert(
            "Acesso Bloqueado", 
            "Conclua sua trilha obrigatória para poder registrar seu estado de saúde."
        );
    }
    
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
    mapPoints,
    loadingPoints,
    showForm,
    setShowForm,
    formDefinition,
    loadingForm,
    sending,
    onFeelingSelected,
    setFormValues,
    handleSubmitForm,
    isCompliant
  };
};