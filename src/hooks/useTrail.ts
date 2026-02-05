import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { TrackCycle } from "../types/trail";
import { checkMandatoryCompliance, getTrackCycles, getTrackProgress } from "../services/trail";
import { useParticipation } from "../contexts/ParticipationContext";

export const useTrails = () => {
    const { contextId, participationId } = useParticipation();
    const [cycles, setCycles] = useState<TrackCycle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCompliant, setIsCompliant] = useState<boolean>(true);

    const fetchCycles = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setIsRefreshing(true);
            else if (cycles.length === 0) setIsLoading(true);

            setError(null);
            
            const [data, complianceRaw] = await Promise.all([
                getTrackCycles(),
                participationId 
                ? checkMandatoryCompliance(participationId) 
                : Promise.resolve(null)
            ]);

            const compliance = (complianceRaw as any)?.data || complianceRaw;
            
            let isUserCompliant = true;

            if (compliance && typeof compliance.totalRequired === 'number') {
                isUserCompliant = compliance.completedCount >= compliance.totalRequired;
            } else if (compliance?.is_compliant !== undefined) {
                isUserCompliant = compliance.is_compliant;
            }

            let targetMandatorySlug = null;

            if (!isUserCompliant) {
                if (Array.isArray(compliance?.items)) {
                    const pendingItem = compliance.items.find((item: any) => !item.completed);
                    if (pendingItem) {
                        targetMandatorySlug = pendingItem.mandatorySlug;
                    }
                } else {
                    targetMandatorySlug = compliance?.mandatory_slug || null;
                }
            }

            console.log('Status Compliance:', isUserCompliant); 
            console.log('Slug Alvo:', targetMandatorySlug);

            setIsCompliant(isUserCompliant);
            
            if (!isUserCompliant && !isRefresh) {
                Alert.alert(
                    "Trilha Obrigatória", 
                    "Você possui uma trilha obrigatória pendente. Conclua-a para liberar as demais funcionalidades."
                );
            }

            const filteredData = contextId 
                ? data.filter(cycle => cycle.context_id === contextId)
                : [];

            const processedCycles = await Promise.all(filteredData.map(async (cycle) => {
                const endDate = cycle.end_date ? new Date(cycle.end_date) : null;
                const today = new Date();
                today.setHours(0,0,0,0);
                const isExpired = endDate ? endDate < today : false;
                
                const currentCycleSlug = (cycle as any).mandatory_slug;
                
                const isMandatoryLock = !isUserCompliant && 
                                       !!targetMandatorySlug && 
                                       currentCycleSlug !== targetMandatorySlug;

                const isClosed = cycle.status === 'closed' || isExpired || isMandatoryLock;

                let progressInfo = {
                    progress_percentage: 0,
                    user_status: 'not_started'
                };

                if (participationId) {
                    try {
                        const progressResponse: any = await getTrackProgress(participationId, cycle.id);
                        const pData = progressResponse?.data || progressResponse;
                        if (pData && pData.track_cycle) {
                            progressInfo = {
                                progress_percentage: pData.progress_percentage || 0,
                                user_status: pData.status
                            };
                        }
                    } catch (err) {
                        console.error(`Erro progresso ciclo ${cycle.id}:`, err);
                    }
                }

                return {
                    ...cycle,
                    ...progressInfo,
                    isExpired,
                    isClosed,
                    isMandatoryLock
                };
            }));

            processedCycles.sort((a, b) => {
                const dateA = new Date(a.start_date).getTime();
                const dateB = new Date(b.start_date).getTime();
                return dateA - dateB; 
            });

            setCycles(processedCycles);

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
        isCompliant,
        handleRefresh,
    };
}