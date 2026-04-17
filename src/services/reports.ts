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
