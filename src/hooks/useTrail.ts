import { useCallback, useEffect, useState } from "react"
import { TrackCycle } from "../types/trail"
import { getTrackCycles } from "../services/trail";
import { useParticipation } from "../contexts/ParticipationContext";

export const useTrails = () => {
    const { contextId } = useParticipation();
    const [cycles, setCycles] = useState<TrackCycle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCycles = useCallback(async (isRefresh = false) => {
        try{
            if (isRefresh) setIsRefreshing(true);
            else setIsLoading(true);

            setError(null);
            
            const data = await getTrackCycles();
            
            const filteredData = contextId 
                ? data.filter(cycle => cycle.context_id === contextId)
                : [];

            setCycles(filteredData);
        } catch (err) {
            setError('Não foi possível carregar os ciclos de trilha.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [contextId]);

    useEffect(() => {
        fetchCycles();
    }, [fetchCycles]);

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