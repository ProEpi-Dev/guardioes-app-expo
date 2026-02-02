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
    return await apiClient(`/v1/track-progress/participation/${participationId}/cycle/${cycleId}`, { method: 'GET' });
};

export const startTrackProgress = async (participationId: number, trackCycleId: number) => {
    return await apiClient('/v1/track-progress/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participationId, trackCycleId })
    });
};

// Atualiza status e contadores (PUT)
export const updateSequenceProgress = async (trackProgressId: number, sequenceId: number, data: { status?: string, timeSpentSeconds?: number, visits_count?: number }) => {
    return await apiClient(`/v1/track-progress/${trackProgressId}/sequence/${sequenceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

// Marca conteúdo como completo (POST)
export const completeContentSequence = async (trackProgressId: number, sequenceId: number) => {
    return await apiClient(`/v1/track-progress/${trackProgressId}/sequence/${sequenceId}/complete-content`, {
        method: 'POST'
    });
};

// Marca quiz como completo (POST)
export const completeQuizSequence = async (trackProgressId: number, sequenceId: number, quizSubmissionId: number) => {
    return await apiClient(`/v1/track-progress/${trackProgressId}/sequence/${sequenceId}/complete-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizSubmissionId })
    });
};

export const mergeTrailWithProgress = (trailFullData: any, progressData: any, submissions: any[] = []): Section[] => {
    if (!trailFullData || !trailFullData.section) return [];

    const lockedMap = progressData?.sequence_locked || {};
    const progressList = progressData?.sequence_progress || [];

    return trailFullData.section.map((section: any) => ({
        ...section,
        sequence: (section.sequence || []).map((seq: any) => {
            const isLocked = lockedMap[String(seq.id)];
            const progressItem = progressList.find((p: any) => p.sequence_id === seq.id);
            
            // Extração de Configurações do Quiz
            const formObj = seq.form || {};
            const versionObj = formObj.latestVersion || {};

            const passingScore = versionObj.passingScore ?? formObj.passingScore ?? null;
            const maxAttempts = versionObj.maxAttempts ?? formObj.maxAttempts ?? null;
            const timeLimitMinutes = versionObj.timeLimitMinutes ?? formObj.timeLimitMinutes ?? null;

            // Busca a nota real nas submissões
            let realScore = null;
            if (seq.form) {
                // Encontra a melhor/última submissão para este formulário
                const quizSub = submissions
                    .filter((s: any) => s.formVersion?.form?.id === seq.form.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                
                if (quizSub) {
                    realScore = quizSub.score;
                }
            }

            return {
                ...seq,
                isLocked: isLocked !== undefined ? isLocked : true,
                progressStatus: progressItem?.status || 'not_started',
                
                score: realScore ?? progressItem?.score, 
                isPassed: progressItem?.is_passed || (progressItem?.status === 'completed' && !!seq.form),
                attemptNumber: progressItem?.attempt_number || 0,
                
                passingScore,
                maxAttempts,
                timeLimitMinutes,
            };
        })
    }));
};