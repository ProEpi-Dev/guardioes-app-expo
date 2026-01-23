import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { enrichTrailWithProgress } from '../services/trail';

export const useTrailContent = (rawTrail: any, participationId: number | null) => {
  const trailData = Array.isArray(rawTrail) ? rawTrail[0] : rawTrail;
  
  const [enrichedSections, setEnrichedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!trailData) return;

    if (!participationId) {
      setEnrichedSections(trailData.section || []);
      setLoading(false);
      return;
    }

    try {
      const sections = await enrichTrailWithProgress(trailData, participationId);
      setEnrichedSections(sections);
    } catch (error) {
      setEnrichedSections(trailData.section || []);
    } finally {
      setLoading(false);
    }
  }, [trailData, participationId]);

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [fetchProgress])
  );

  return {
    trailData,
    enrichedSections,
    loading
  };
};