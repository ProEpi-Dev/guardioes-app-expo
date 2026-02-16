import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  getTrackProgress, 
  startTrackProgress, 
  getTrackCycleDetails,
  mergeTrailWithProgress 
} from '../services/trail';
import { getUserSubmissions } from '../services/quiz';

export const useTrailContent = (cycleId: number, participationId: number | null) => {
  const [enrichedSections, setEnrichedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailData, setTrailData] = useState<any>(null);
  const [trackProgressId, setTrackProgressId] = useState<number | null>(null);

  const loadContent = useCallback(async () => {
    if (!cycleId || !participationId) return;
    
    setLoading(true);

    try {
      const [cycleResponse, progressResponse, submissionsResponse] = await Promise.all([
        getTrackCycleDetails(cycleId),
        getTrackProgress(participationId, cycleId),
        getUserSubmissions(participationId)
      ]);

      const cycleDetails = cycleResponse;
      let currentProgress: any = (progressResponse as any)?.data || progressResponse;
      const userSubmissions = Array.isArray(submissionsResponse) ? submissionsResponse : [];

      const hasNoProgress = !currentProgress || currentProgress === 1 || !currentProgress.track_cycle;

      if (hasNoProgress) {
        try {
          await startTrackProgress(participationId, cycleId);
          const newProgressResponse: any = await getTrackProgress(participationId, cycleId);
          currentProgress = newProgressResponse?.data || newProgressResponse;
        } catch (err) {
          console.error('Erro ao iniciar progresso', err);
        }
      }

      if (cycleDetails && cycleDetails.track && currentProgress) {
        const sections = await mergeTrailWithProgress(cycleDetails.track, currentProgress, userSubmissions);

        // console.log('Dados enriquecidos para as seções:', JSON.stringify(sections, null, 2));
        
        setEnrichedSections(sections);
        setTrailData(cycleDetails.track);
        setTrackProgressId(currentProgress.id);
      }

    } catch (e) {
      console.error('Erro no useTrailContent:', e);
    } finally {
      setLoading(false);
    }
  }, [cycleId, participationId]);

  useFocusEffect(
    useCallback(() => {
      loadContent();
    }, [loadContent])
  );

  return {
    trailData,
    enrichedSections,
    loading,
    trackProgressId
  };
};