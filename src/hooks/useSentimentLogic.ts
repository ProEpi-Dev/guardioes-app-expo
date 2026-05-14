import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { useParticipation } from '../contexts/ParticipationContext';
import { useUserLocationQuery } from './useUserLocationQuery';
import { useSentimentMap } from './useSentimentMap';
import { getLatestSignalForm } from '../services/forms';
import { createReport } from '../services/reports';
import { checkMandatoryCompliance } from '../services/trail';
import { useFocusEffect } from '@react-navigation/native';
import { getReportStreaks } from '../services/streaks';

export const useSentimentLogic = () => {
  // Hooks Externos
  const { contextId, participationId } = useParticipation();
  const { location, refetch: refetchLocation } = useUserLocationQuery();
  const { mapPoints, loadingPoints, refreshPoints } = useSentimentMap();

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [currentStreakCount, setCurrentStreakCount] = useState(0);

  // Estado de conformidade (inicia true para não bloquear durante o carregamento)
  const [isCompliant, setIsCompliant] = useState(true);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'force_compliance_update',
      (status) => {
        setIsCompliant(status);
        lastComplianceCheck.current = 0; // Zera o timer para a próxima busca no servidor ser imediata
      }
    );
    return () => subscription.remove();
  }, []);

  // Estados Locais
  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [currentFormVersionId, setCurrentFormVersionId] = useState<
    number | null
  >(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Estados de Loading
  const [loadingForm, setLoadingForm] = useState(false);
  const [sending, setSending] = useState(false);

  const lastComplianceCheck = useRef<number>(0);
  const CACHE_DURATION = 60 * 1000;

  const getLocation = async () => {
    if (location) return location;
    const { data } = await refetchLocation();
    return data ?? null;
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
          console.error('Erro no compliance:', err);
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

  const checkHasReportedToday = async () => {
    if (!contextId || !participationId)
      return { hasReported: false, streak: 0 };

    // Pega a data local de hoje no formato YYYY-MM-DD
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const todayLocal = new Date(Date.now() - tzOffset)
      .toISOString()
      .split('T')[0];

    try {
      const data = await getReportStreaks({
        contextId,
        participationId,
        startDate: todayLocal,
        endDate: todayLocal,
      });
      const hasReported = data?.reportedDays && data.reportedDays.length > 0;
      return { hasReported, streak: data?.currentStreak || 0 };
    } catch (e) {
      console.error('Erro ao verificar ofensiva:', e);
      return { hasReported: false, streak: 0 };
    }
  };

  // 1. Fluxo do Sentimento Positivo
  const handlePositiveSentiment = async () => {
    if (!participationId) return Alert.alert('Aguarde', 'Carregando perfil...');

    try {
      setSending(true);
      const status = await checkHasReportedToday();

      if (status.hasReported) {
        Alert.alert(
          'Tudo certo por hoje! ✨',
          'Você já registrou seu estado de saúde!'
        );
        return;
      }

      let latestForm;
      if (contextId) {
        latestForm = await getLatestSignalForm(contextId);
      }
      const versionId = latestForm.latestVersion?.id;
      const loc = await getLocation();

      if (versionId) {
        await createReport({
          participationId,
          formVersionId: versionId,
          reportType: 'POSITIVE',
          // reportType: contextId === 4 ? 'NEGATIVE' : 'POSITIVE',
          formResponse: {},
          occurrenceLocation: loc
            ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
            : null,
        });

        DeviceEventEmitter.emit('report_created');

        setCurrentStreakCount(status.streak + 1);
        setShowSuccessAnimation(true);
        setTimeout(refreshPoints, 500);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao registrar sentimento.');
    } finally {
      setSending(false);
    }
  };

  // 2. Fluxo do Sentimento Negativo
  const handleNegativeSentiment = async () => {
    setLoadingForm(true);
    setShowForm(true);

    try {
      let latestForm;
      if (contextId) {
        latestForm = await getLatestSignalForm(contextId);
      }
      const version = latestForm.latestVersion;

      if (version?.definition) {
        setFormDefinition(version.definition);
        setCurrentFormVersionId(version.id);
        setFormTitle(latestForm.title);
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
        'Acesso Bloqueado',
        'Conclua sua trilha obrigatória para poder registrar seu estado de saúde.'
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
    if (!formValues._isValid)
      return Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
    if (!currentFormVersionId || !participationId) return;

    setSending(true);
    try {
      const status = await checkHasReportedToday();

      const { _isValid, mapPoint, ...cleanData } = formValues;
      const loc = await getLocation();

      if (mapPoint) {
        cleanData.geo_location = {
          latitude: mapPoint.latitude,
          longitude: mapPoint.longitude,
        };
      }

      await createReport({
        participationId,
        formVersionId: currentFormVersionId,
        reportType: 'NEGATIVE',
        // reportType: contextId === 4 ? 'POSITIVE' : 'NEGATIVE',
        formResponse: cleanData,
        occurrenceLocation: loc
          ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
          : null,
      });

      DeviceEventEmitter.emit('report_created');

      setShowForm(false);
      setFormValues({});
      setTimeout(refreshPoints, 500);

      if (!status.hasReported) {
        setCurrentStreakCount(status.streak + 1);
        setShowSuccessAnimation(true);
      } else {
        Alert.alert(
          'Obrigado por participar!',
          'Seu registro de sintomas foi enviado.'
        );
      }
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
    formTitle,
    loadingForm,
    sending,
    onFeelingSelected,
    setFormValues,
    handleSubmitForm,
    isCompliant,
    showSuccessAnimation,
    setShowSuccessAnimation,
    currentStreakCount,
  };
};
