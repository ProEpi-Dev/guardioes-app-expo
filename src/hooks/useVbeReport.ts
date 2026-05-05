import { useQuery } from '@tanstack/react-query';
import { useParticipation } from '../contexts/ParticipationContext';
import { getReports } from '../services/reports';
import { useMemo } from 'react';

export const useVbeReports = () => {
  const { participationId, contextId } = useParticipation();

  const {
    data: reports,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['vbe-report', participationId],
    queryFn: () => getReports(participationId!, contextId!),
    enabled: !!participationId,
  });

  const filterOptions = useMemo(() => {
    if (!reports) return ['Todos'];
    const labels = reports.map(
      (report) => report.integrationSummary?.externalSignalStageLabel
    );
    const validLabels = labels.filter((label): label is string => !!label);
    const uniqueLabels = Array.from(new Set(validLabels));
    return ['Todos', ...uniqueLabels];
  }, [reports]);

  return {
    report: reports,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    filterOptions,
  };
};
