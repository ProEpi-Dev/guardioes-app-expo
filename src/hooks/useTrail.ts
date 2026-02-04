import { useCallback, useState } from "react"
import { useFocusEffect } from '@react-navigation/native';
import { TrackCycle } from "../types/trail"
import { getTrackCycles, getTrackProgress } from "../services/trail";
import { useParticipation } from "../contexts/ParticipationContext";

export const useTrails = () => {
    const { contextId, participationId } = useParticipation();
    const [cycles, setCycles] = useState<TrackCycle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCycles = useCallback(async (isRefresh = false) => {
        try{
            if (isRefresh) setIsRefreshing(true);
            else if (cycles.length === 0) setIsLoading(true);

            setError(null);
            
            const data = await getTrackCycles();
            
            // 1. Filtra pelo contexto
            const filteredData = contextId 
                ? data.filter(cycle => cycle.context_id === contextId)
                : [];

            // 2. Busca progresso e calcula status de data/fechamento
            if (participationId && filteredData.length > 0) {
                const cyclesWithProgress = await Promise.all(filteredData.map(async (cycle) => {
                    // Lógica de Data
                    const endDate = cycle.end_date ? new Date(cycle.end_date) : null;
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    
                    // Expira se tiver data final definida e for menor que hoje
                    const isExpired = endDate ? endDate < today : false;
                    
                    // Fechado se o status for 'closed' OU se estiver expirado
                    const isClosed = cycle.status === 'closed' || isExpired;

                    try {
                        const progressResponse: any = await getTrackProgress(participationId, cycle.id);
                        const hasProgress = progressResponse && progressResponse.track_cycle;
                        
                        return {
                            ...cycle,
                            progress_percentage: hasProgress ? (progressResponse.progress_percentage || 0) : 0,
                            user_status: hasProgress ? progressResponse.status : 'not_started',
                            isExpired,
                            isClosed
                        };
                    } catch (err) {
                        return { 
                            ...cycle, 
                            progress_percentage: 0, 
                            user_status: 'not_started',
                            isExpired,
                            isClosed
                        };
                    }
                }));
                setCycles(cyclesWithProgress);
            } else {
                // Mesmo sem usuário logado, calculamos se está fechado para exibição
                setCycles(filteredData.map(c => {
                    const endDate = c.end_date ? new Date(c.end_date) : null;
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const isExpired = endDate ? endDate < today : false;
                    return {
                        ...c,
                        isExpired,
                        isClosed: c.status === 'closed' || isExpired
                    };
                }));
            }

        } catch (err) {
            setError('Não foi possível carregar os ciclos de trilha.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [contextId, participationId]);

    useFocusEffect(
        useCallback(() => {
            fetchCycles();
        }, [fetchCycles])
    );

    const handleRefresh = () => {
        fetchCycles(true); 
    };

    return {
        cycles,
        isLoading,
        isRefreshing,
        error,
        handleRefresh,
    };
}