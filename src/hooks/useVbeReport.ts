import { useQuery } from '@tanstack/react-query';
import { useParticipation } from '../contexts/ParticipationContext';
import { getReport } from '../services/reports';

export const useVbeReports = () => {
  const { participationId } = useParticipation();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['vbe-report', participationId],
    queryFn: () => getReport(participationId!),
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
