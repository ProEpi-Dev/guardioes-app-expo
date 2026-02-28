import { apiClient } from '../utils/api';
import { Section, TrackCycle } from '../types/trail';
import { getQuizDetails, getUserSubmissions } from './quiz';

export const getTrackCycles = async (): Promise<TrackCycle[]> => {
  const response = await apiClient('/v1/track-cycles', { method: 'GET' }) as any;
  if (Array.isArray(response)) {
    // console.log(response)
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

export const mergeTrailWithProgress = async (trailFullData: any, progressData: any, submissions: any[] = []): Promise<Section[]> => {
    if (!trailFullData || !trailFullData.section) return [];

    const lockedMap = progressData?.sequence_locked || {};
    const progressList = progressData?.sequence_progress || [];

    const sectionsPromises = trailFullData.section.map(async (section: any) => {
        const sequencePromises = (section.sequence || []).map(async (seq: any) => {
            const isLocked = lockedMap[String(seq.id)];
            const progressItem = progressList.find((p: any) => p.sequence_id === seq.id);
            
            const isQuiz = !!seq.form;
            
            let passingScore = null;
            let maxAttempts = null;
            let timeLimitMinutes = null;

            // 1. Busca assíncrona dos detalhes do quiz
            if (isQuiz) {
                try {
                    const quizDetails = await getQuizDetails(seq.form.id);
                    passingScore = quizDetails?.passingScore ?? quizDetails?.latestVersion?.passingScore ?? null;
                    maxAttempts = quizDetails?.maxAttempts ?? quizDetails?.latestVersion?.maxAttempts ?? null;
                    timeLimitMinutes = quizDetails?.timeLimitMinutes ?? quizDetails?.latestVersion?.timeLimitMinutes ?? null;
                } catch (err) {
                    console.warn(`Falha ao buscar detalhes do quiz ${seq.form.id}:`, err);
                }
            }

            // 2. Busca a nota real e tentativa nas submissões
            let realScore = null;
            let attemptNumber = 0;
            let isPassed = false;
            let quizSubmissionId = null;

            if (isQuiz) {
                // CORREÇÃO: Pega todas as tentativas, da mais nova para a mais velha
                const formSubmissions = submissions
                    .filter((s: any) => s.formVersion?.form?.id === seq.form.id)
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                
                // CORREÇÃO: Prioriza sempre a tentativa que foi aprovada!
                const passedSub = formSubmissions.find((s: any) => s.isPassed);
                // Se não tem nenhuma aprovada, aí sim mostra a mais recente
                const quizSub = passedSub || formSubmissions[0];
                
                if (quizSub) {
                    realScore = quizSub.score;
                    attemptNumber = quizSub.attemptNumber || 0; 
                    isPassed = quizSub.isPassed; 
                    quizSubmissionId = quizSub.id; // Guarda o ID para a autocorreção que fizemos antes
                }
            } else {
                // Se for artigo, a aprovação é o status concluído do progressItem
                isPassed = progressItem?.status === 'completed';
            }

            // CORREÇÃO: Garante a bolinha verde (completed) na interface se o quiz estiver aprovado
            let progressStatus = progressItem?.status || 'not_started';
            const rawBackendStatus = progressItem?.status || 'not_started';
            if (isQuiz) {
                if (realScore === null) {
                    progressStatus = 'not_started';
                } else if (isPassed) {
                    progressStatus = 'completed';
                }
            }

            return {
                ...seq,
                isLocked: isLocked !== undefined ? isLocked : true,
                progressStatus: progressStatus,
                rawBackendStatus: rawBackendStatus,
                score: realScore, 
                isPassed: isPassed,
                attemptNumber: attemptNumber,
                passingScore,
                maxAttempts,
                quizSubmissionId
            };
        });

        // Aguarda todas as sequencias desta seção serem resolvidas
        const resolvedSequence = await Promise.all(sequencePromises);
        return { ...section, sequence: resolvedSequence };
    });

    // Aguarda todas as seções serem resolvidas
    return Promise.all(sectionsPromises);
};

export const checkMandatoryCompliance = async (participationId: number): Promise<{ is_compliant: boolean; mandatory_slug?: string }> => {
    try {
        const response = await apiClient(`/v1/track-progress/mandatory-compliance?participationId=${participationId}`, { 
            method: 'GET' 
        }) as any;
        return response;
    } catch (error) {
        console.error('Erro ao verificar conformidade obrigatória', error);
        return { is_compliant: true }; 
    }
};