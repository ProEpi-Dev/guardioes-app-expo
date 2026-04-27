import { ReportType } from '../types/report';
import { apiClient } from '../utils/api';

interface ReportPayload {
  participationId: number;
  formVersionId: number;
  reportType: 'POSITIVE' | 'NEGATIVE';
  formResponse: any;
  occurrenceLocation: { latitude: number; longitude: number } | null;
}

export const createReport = async (payload: ReportPayload) => {
  try {
    const response = (await apiClient('/v1/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })) as any;

    return response;
  } catch (error) {
    throw error;
  }
};

export const getReport = async (participationId: number) => {
  try {
    // Como o apiClient já extrai o payload, o response já é o nosso array de dados
    const response = await apiClient(
      `/v1/report-integrations/by-participation/${participationId}`
    );

    return (response as unknown as ReportType[]) ?? null;
  } catch (error) {
    throw error;
  }
};
