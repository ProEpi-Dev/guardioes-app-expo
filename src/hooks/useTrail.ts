import { useCallback, useEffect, useState } from "react"
import { Trail } from "../types/trail"
import { getTrails } from "../services/trail";

export const useTrails = () => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrails = useCallback(async (isRefresh = false) => {
        try{
            if (isRefresh) setIsRefreshing(true);
            else setIsLoading(true);

            setError(null);
            const data = await getTrails();
            setTrails(data);
        } catch (err) {
            setError('Não foi possível carregar as trilhas.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTrails();
    }, [fetchTrails]);

    const handleRefresh = () => {
        fetchTrails(true); 
    };

    return {
        trails,
        isLoading,
        isRefreshing,
        error,
        handleRefresh,
    };
}