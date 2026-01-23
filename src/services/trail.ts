import { apiClient } from '../utils/api';
import { Trail } from '../types/trail';
import { getQuizDetails, getUserSubmissions } from './quiz';

export const getTrails = async (): Promise<Trail[]> => {
  const response = await apiClient('/v1/tracks', { method: 'GET' }) as any;

    if (Array.isArray(response)) {
    return response;
  }

  return [];
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