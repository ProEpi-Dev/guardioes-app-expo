import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { useParticipation } from '../contexts/ParticipationContext';
import { useUserLocationQuery } from './useUserLocationQuery';
import { useSentimentMap } from './useSentimentMap';
import { loadSignalForm } from '../services/forms';
import type { ReportPayload } from '../services/reports';
import { checkMandatoryCompliance } from '../services/trail';
import { useFocusEffect } from '@react-navigation/native';
import { getReportStreaks } from '../services/streaks';
import {
  QueueFullError,
  enqueueReport,
  hasPendingPositiveOnDay,
  removeReport,
} from '../services/offlineReportQueue';
import { flushQueue } from '../services/reportSync';
import {
  getCachedCompliance,
  setCachedCompliance,
} from '../services/offlineCache';
import { isOnline, nowReportDate, todayLocalDay } from '../utils/reportDate';

/** Tipos de campo que dependem de internet e somem do formulário offline. */
const ONLINE_ONLY_FIELD_TYPES = ['mapPoint'];

const removeOnlineOnlyFields = (definition: any) => ({
  ...definition,
  fields: (definition?.fields ?? []).filter(
    (field: any) => !ONLINE_ONLY_FIELD_TYPES.includes(field?.type)
  ),
});

type SubmitOutcome =
  | { status: 'sent' }
  | { status: 'queued' }
  | { status: 'rejected'; message: string }
  | { status: 'not_saved' };

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
  const [isOfflineForm, setIsOfflineForm] = useState(false);

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

        if (!(await isOnline())) {
          const cached = await getCachedCompliance(participationId);
          if (isActive && cached !== null) setIsCompliant(cached);
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
            setCachedCompliance(participationId, userIsCompliant);
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

    const todayLocal = todayLocalDay();

    const hasPendingToday = await hasPendingPositiveOnDay(
      participationId,
      todayLocal
    ).catch(() => false);

    if (!(await isOnline())) {
      return { hasReported: hasPendingToday, streak: 0 };
    }

    try {
      const data = await getReportStreaks({
        contextId,
        participationId,
        startDate: todayLocal,
        endDate: todayLocal,
      });
      const hasReported =
        hasPendingToday || (data?.reportedDays && data.reportedDays.length > 0);
      return { hasReported, streak: data?.currentStreak || 0 };
    } catch (e) {
      console.error('Erro ao verificar ofensiva:', e);
      return { hasReported: hasPendingToday, streak: 0 };
    }
  };

  const submitReport = async (
    payload: ReportPayload
  ): Promise<SubmitOutcome> => {
    if (!participationId) return { status: 'not_saved' };

    let queuedId: string;
    try {
      const queued = await enqueueReport(participationId, payload);
      queuedId = queued.id;
    } catch (error) {
      console.error('Erro ao salvar report localmente:', error);
      Alert.alert(
        'Não foi possível salvar',
        error instanceof QueueFullError
          ? 'Há muitos registros aguardando envio. Conecte-se à internet para enviá-los antes de registrar novos.'
          : 'Não há espaço disponível no aparelho para salvar o registro.'
      );
      return { status: 'not_saved' };
    }

    try {
      const result = await flushQueue(participationId);
      if (result.sentIds.includes(queuedId)) return { status: 'sent' };
      if (result.failedIds.includes(queuedId)) {
        await removeReport(queuedId);
        return {
          status: 'rejected',
          message: result.errors[queuedId] ?? 'Falha no envio.',
        };
      }
    } catch (error) {
      console.error('Erro ao sincronizar reports:', error);
    }

    return { status: 'queued' };
  };

  const alertQueued = () =>
    Alert.alert(
      'Registro salvo 📶',
      'Não foi possível enviar agora. Seu registro foi salvo no aparelho e será enviado automaticamente quando a conexão voltar.'
    );

  const buildOccurrenceLocation = (loc: any) =>
    loc
      ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
      : null;

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

      const latestForm = contextId
        ? (await loadSignalForm(contextId)).form
        : null;
      const versionId = latestForm?.latestVersion?.id;

      if (!versionId) {
        Alert.alert(
          'Sem conexão',
          'Conecte-se à internet ao menos uma vez para habilitar o registro offline.'
        );
        return;
      }

      const loc = await getLocation();

      const outcome = await submitReport({
        participationId,
        formVersionId: versionId,
        reportType: 'POSITIVE',
        // reportType: contextId === 4 ? 'NEGATIVE' : 'POSITIVE',
        formResponse: {},
        occurrenceLocation: buildOccurrenceLocation(loc),
        reportDate: nowReportDate(),
      });

      if (outcome.status === 'sent') {
        setCurrentStreakCount(status.streak + 1);
        setShowSuccessAnimation(true);
        setTimeout(refreshPoints, 500);
      } else if (outcome.status === 'queued') {
        alertQueued();
      } else if (outcome.status === 'rejected') {
        Alert.alert('Erro', 'Falha ao registrar sentimento.');
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
      const { form: latestForm, fromCache } = contextId
        ? await loadSignalForm(contextId)
        : { form: null, fromCache: false };
      const version = latestForm?.latestVersion;

      if (!version?.definition) {
        if (fromCache || !(await isOnline())) {
          Alert.alert(
            'Sem conexão',
            'Conecte-se à internet ao menos uma vez para habilitar o registro offline.'
          );
          setShowForm(false);
          return;
        }
        throw new Error('Definição ausente');
      }

      setIsOfflineForm(fromCache);
      setFormDefinition(
        fromCache
          ? removeOnlineOnlyFields(version.definition)
          : version.definition
      );
      setCurrentFormVersionId(version.id);
      setFormTitle(latestForm.title);
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
  const handleSubmitForm = async (refetch?: () => void) => {
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

      const outcome = await submitReport({
        participationId,
        formVersionId: currentFormVersionId,
        reportType: 'NEGATIVE',
        // reportType: contextId === 4 ? 'POSITIVE' : 'NEGATIVE',
        formResponse: cleanData,
        occurrenceLocation: buildOccurrenceLocation(loc),
        reportDate: nowReportDate(),
      });

      if (outcome.status === 'rejected') {
        Alert.alert('Erro', 'Falha no envio.');
        return;
      }
      if (outcome.status === 'not_saved') return;

      setShowForm(false);
      setFormValues({});

      if (outcome.status === 'queued') {
        alertQueued();
        return;
      }

      setTimeout(refreshPoints, 500);
      refetch?.();

      if (!status.hasReported) {
        setCurrentStreakCount(status.streak + 1);
        setShowSuccessAnimation(true);
      } else {
        Alert.alert('Obrigado por participar!', 'Seu registro foi enviado.');
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
    isOfflineForm,
    showSuccessAnimation,
    setShowSuccessAnimation,
    currentStreakCount,
  };
};
