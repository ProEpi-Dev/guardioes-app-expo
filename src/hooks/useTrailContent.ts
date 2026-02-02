import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { enrichTrailWithProgress, getTrackCycleDetails } from '../services/trail';

export const useTrailContent = (cycleId: number, participationId: number | null) => {
  const [trailData, setTrailData] = useState<any>(null);
  const [enrichedSections, setEnrichedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDataAndProgress = useCallback(async () => {
    if (!cycleId) return;
    
    setLoading(true);

    try {
      // 1. Busca os detalhes do ciclo (que inclui sections)
      const cycleDetail = await getTrackCycleDetails(cycleId);
      
      if (!cycleDetail || !cycleDetail.track) {
        setLoading(false);
        return;
      }

      const currentTrailData = cycleDetail.track;
      setTrailData(currentTrailData);

      // 2. Se não tiver participação, retorna as seções cruas
      if (!participationId) {
        setEnrichedSections(currentTrailData.section || []);
        setLoading(false);
        return;
      }

      // 3. Se tiver participação, enriquece com o progresso
      try {
        const sections = await enrichTrailWithProgress(currentTrailData, participationId);
        setEnrichedSections(sections);
      } catch (error) {
        console.error("Erro ao enriquecer progresso", error);
        setEnrichedSections(currentTrailData.section || []);
      }

    } catch (error) {
      console.error("Erro geral no useTrailContent", error);
    } finally {
      setLoading(false);
    }
  }, [cycleId, participationId]);

  useFocusEffect(
    useCallback(() => {
      fetchDataAndProgress();
    }, [fetchDataAndProgress])
  );

  return {
    trailData,
    enrichedSections,
    loading
  };
};