import { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TrackCycle } from '../types/trail';
import {
  checkMandatoryCompliance,
  getTrackCycles,
  getTrackProgress,
} from '../services/trail';
import { useParticipation } from '../contexts/ParticipationContext';

export const useTrails = () => {
  const { contextId, participationId } = useParticipation();
  const [cycles, setCycles] = useState<TrackCycle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompliant, setIsCompliant] = useState<boolean>(true);

  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 60 * 1000;

  const fetchCycles = useCallback(
    async (isRefresh = false) => {
      const now = Date.now();
      if (
        !isRefresh &&
        cycles.length > 0 &&
        now - lastFetchTime.current < CACHE_DURATION
      ) {
        return;
      }
      try {
        if (isRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        setError(null);

        const [data, complianceRaw] = await Promise.all([
          getTrackCycles(),
          participationId
            ? checkMandatoryCompliance(participationId)
            : Promise.resolve(null),
        ]);

        const compliance = (complianceRaw as any)?.data || complianceRaw;
        // console.log(compliance);

        let isUserCompliant = true;

        if (compliance && typeof compliance.totalRequired === 'number') {
          isUserCompliant =
            compliance.completedCount >= compliance.totalRequired;
        } else if (compliance?.is_compliant !== undefined) {
          isUserCompliant = compliance.is_compliant;
        }

        let targetMandatorySlugs: string[] = [];

        if (!isUserCompliant) {
          if (Array.isArray(compliance?.items)) {
            const pendingItems = compliance.items.filter(
              (item: any) => !item.completed
            );
            targetMandatorySlugs = pendingItems.map(
              (item: any) => item.mandatorySlug
            );
          } else {
            if (compliance?.mandatory_slug) {
              targetMandatorySlugs = [compliance.mandatory_slug];
            }
          }
        }

        // console.log('Status Compliance:', isUserCompliant);
        // console.log('Slug Alvo:', targetMandatorySlugs);

        setIsCompliant(isUserCompliant);

        // if (!isUserCompliant && !isRefresh) {
        //     Alert.alert(
        //         "Trilha Obrigatória",
        //         "Você possui uma trilha obrigatória pendente. Conclua-a para liberar as demais funcionalidades."
        //     );
        // }

        const filteredData = contextId
          ? data.filter((cycle) => cycle.context_id === contextId)
          : [];

        const processedCycles = await Promise.all(
          filteredData.map(async (cycle) => {
            const getMidnightDate = (dateString: string) => {
              const [year, month, day] = dateString.split('T')[0].split('-');
              return new Date(Number(year), Number(month) - 1, Number(day));
            };

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const cycleStart = getMidnightDate(cycle.start_date);
            const cycleEnd = getMidnightDate(cycle.end_date);

            let isUpcoming = today < cycleStart;
            let isExpired = today > cycleEnd;
            let displayStartDate = cycleStart.toLocaleDateString('pt-BR');
            let displayEndDate: string | null =
              cycleEnd.getFullYear() < 2100
                ? cycleEnd.toLocaleDateString('pt-BR')
                : null;

            if (!isUpcoming && cycle.track) {
              const trackStartDate =
                (cycle.track as any).start_date || cycle.track.startDate;
              const trackEndDate =
                (cycle.track as any).end_date || cycle.track.endDate;

              if (trackStartDate) {
                const trackStart = getMidnightDate(trackStartDate);
                if (today < trackStart) {
                  isUpcoming = true;
                  displayStartDate = trackStart.toLocaleDateString('pt-BR');
                }
              }

              if (trackEndDate) {
                const trackEnd = getMidnightDate(trackEndDate);

                displayEndDate =
                  trackEnd.getFullYear() < 2100
                    ? trackEnd.toLocaleDateString('pt-BR')
                    : null;

                if (today > trackEnd) {
                  isExpired = true;
                }
              }
            }

            const currentCycleSlug = (cycle as any).mandatory_slug;
            const isMandatoryLock =
              !isUserCompliant &&
              targetMandatorySlugs.length > 0 &&
              !targetMandatorySlugs.includes(currentCycleSlug);

            const isClosed =
              cycle.status === 'closed' ||
              isExpired ||
              isMandatoryLock ||
              isUpcoming;

            let progressInfo = {
              progress_percentage: 0,
              user_status: 'not_started',
            };

            if (participationId) {
              try {
                const progressResponse: any = await getTrackProgress(
                  participationId,
                  cycle.id
                );
                const pData = progressResponse?.data || progressResponse;
                if (pData && pData.track_cycle) {
                  progressInfo = {
                    progress_percentage: pData.progress_percentage || 0,
                    user_status: pData.status,
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
              isUpcoming,
              displayStartDate,
              displayEndDate,
              isClosed,
              isMandatoryLock,
            };
          })
        );

        processedCycles.sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return dateA - dateB;
        });

        setCycles(processedCycles);
        lastFetchTime.current = Date.now();
      } catch (err) {
        setError('Não foi possível carregar os ciclos de trilha.');
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [contextId, participationId, cycles.length]
  );

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
};
