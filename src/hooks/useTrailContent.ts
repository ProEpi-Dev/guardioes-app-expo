import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  getTrackProgress, 
  startTrackProgress, 
  getTrackCycleDetails, // Certifique-se de importar este
  mergeTrailWithProgress // E a nova função de merge
} from '../services/trail';

export const useTrailContent = (cycleId: number, participationId: number | null) => {
  const [enrichedSections, setEnrichedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailData, setTrailData] = useState<any>(null);

  const loadContent = useCallback(async () => {
    if (!cycleId || !participationId) return;
    
    setLoading(true);

    try {
      // 1. Busca Detalhes (Títulos) e Progresso (Status) em paralelo
      const [cycleResponse, progressResponse] = await Promise.all([
        getTrackCycleDetails(cycleId),
        getTrackProgress(participationId, cycleId)
      ]);

      // Garante que pegamos os dados corretos (tratando Axios response se necessário)
      const cycleDetails = cycleResponse; // getTrackCycleDetails já retorna o objeto tratado
      let currentProgress: any = (progressResponse as any)?.data || progressResponse;

      // 2. Verifica se o progresso existe (se for 1, null ou sem track_cycle)
      const hasNoProgress = !currentProgress || currentProgress === 1 || !currentProgress.track_cycle;

      if (hasNoProgress) {
        console.log('Progresso não iniciado. Iniciando...');
        try {
          // Inicia o progresso
          await startTrackProgress(participationId, cycleId);
          
          // Busca o progresso recém-criado
          const newProgressResponse: any = await getTrackProgress(participationId, cycleId);
          currentProgress = newProgressResponse?.data || newProgressResponse;
        } catch (err) {
          console.error('Erro ao iniciar progresso', err);
        }
      }

      // 3. Faz o Merge: Usa a estrutura rica do CycleDetails + Status do Progress
      if (cycleDetails && cycleDetails.track && currentProgress) {
        const sections = mergeTrailWithProgress(cycleDetails.track, currentProgress);
        
        setEnrichedSections(sections);
        setTrailData(cycleDetails.track);
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
    loading
  };
};