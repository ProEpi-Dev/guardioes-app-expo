import { apiClient } from '../utils/api';

export interface StreakParams {
  contextId: number;
  participationId: number;
  startDate?: string;
  endDate?: string;
}

export const getReportStreaks = async ({ contextId, participationId, startDate, endDate }: StreakParams) => {
  try {
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `/v1/contexts/${contextId}/report-streaks/${participationId}${queryString ? `?${queryString}` : ''}`;

    const response: any = await apiClient(url, { method: 'GET' });
    return response.data || response;
  } catch (error) {
    console.error('Erro ao buscar dados de sequência:', error);
    throw error;
  }
};