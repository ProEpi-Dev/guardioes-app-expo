import { useQuery } from '@tanstack/react-query';
import { useParticipation } from '../contexts/ParticipationContext';
import { getReports } from '../services/reports';

export const useVbeReports = () => {
  const { participationId, contextId } = useParticipation();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['vbe-report', participationId],
    queryFn: () => getReports(participationId!, contextId!),
    enabled: !!participationId,
  });

  return {
    report: data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};
