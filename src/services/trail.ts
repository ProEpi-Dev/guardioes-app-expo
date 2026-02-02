import { apiClient } from '../utils/api';
import { Section, TrackCycle } from '../types/trail';
import { getQuizDetails, getUserSubmissions } from './quiz';

export const getTrackCycles = async (): Promise<TrackCycle[]> => {
  const response = await apiClient('/v1/track-cycles', { method: 'GET' }) as any;
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

export const getTrackCycleDetails = async (id: number): Promise<TrackCycle | null> => {
  try {
    const response = await apiClient(`/v1/track-cycles/${id}`, { method: 'GET' }) as any;
    return response;
  } catch (error) {
    console.error('Erro ao buscar detalhes do ciclo', error);
    return null;
  }
};

export const enrichTrailWithProgress = async (trailData: any, participationId: number) => {
  const userSubmissions = await getUserSubmissions(participationId);

  const sectionsPromises = (trailData.section || []).map(async (section: any) => {
    
    const sequencePromises = (section.sequence || []).map(async (seqItem: any) => {
      if (!seqItem.form) return seqItem;

      try {
        const quizDefinition = await getQuizDetails(seqItem.form.id);
        const targetId = String(seqItem.form.id);
        const targetTitle = seqItem.form.title?.trim().toLowerCase();

        const submission = userSubmissions.find((s: any) => {
          if (s.formId && String(s.formId) === targetId) return true;
          if (s.formVersion?.formId && String(s.formVersion.formId) === targetId) return true;
          if (s.formVersion?.form?.id && String(s.formVersion.form.id) === targetId) return true;
          const subTitle = s.formVersion?.form?.title?.trim().toLowerCase();
          return subTitle && targetTitle && subTitle === targetTitle;
        });

        return {
          ...seqItem,
          maxAttempts: quizDefinition?.maxAttempts,
          passingScore: quizDefinition?.passingScore,
          timeLimitMinutes: quizDefinition?.timeLimitMinutes,
          score: submission?.score,
          isPassed: submission?.isPassed,
          attemptNumber: submission?.attemptNumber,
          form: {
            ...seqItem.form,
            title: seqItem.form.title
          }
        };
      } catch (err) {
        return seqItem;
      }
    });

    const resolvedSequence = await Promise.all(sequencePromises);
    return { ...section, sequence: resolvedSequence };
  });

  return Promise.all(sectionsPromises);
};

export const getTrackProgress = async (participationId: number, cycleId: number) => {
    // Retorna qualquer resposta (pode ser 1, null, ou objeto)
    return await apiClient(`/v1/track-progress/participation/${participationId}/cycle/${cycleId}`, { method: 'GET' });
};

export const startTrackProgress = async (participationId: number, trackCycleId: number) => {
    return await apiClient('/v1/track-progress/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationId, trackCycleId })
    });
};

// NOVA FUNÇÃO: Combina a trilha completa (cycleDetails) com o progresso (progressData)
export const mergeTrailWithProgress = (trailFullData: any, progressData: any): Section[] => {
    // Se não tiver a estrutura da trilha, retorna vazio
    if (!trailFullData || !trailFullData.section) return [];

    const lockedMap = progressData?.sequence_locked || {};
    const progressList = progressData?.sequence_progress || [];

    // Mapeia usando a trilha COMPLETA (que tem os títulos) como base
    return trailFullData.section.map((section: any) => ({
        ...section,
        sequence: (section.sequence || []).map((seq: any) => {
            const isLocked = lockedMap[String(seq.id)];
            const progressItem = progressList.find((p: any) => p.sequence_id === seq.id);
            
            return {
                ...seq, // Mantém títulos, ids, form, content originais da trilha
                isLocked: isLocked !== undefined ? isLocked : true,
                progressStatus: progressItem?.status || 'not_started',
            };
        })
    }));
};