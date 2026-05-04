import {
  ReportDetailsResponse,
  ReportType,
  ReportTypee,
} from '../types/report';
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

export const getReports = async (
  participationId: number,
  contextId: number
): Promise<ReportTypee[]> => {
  try {
    const response = await apiClient(
      `/v1/reports?page=1&pageSize=100&active=true&participationId=${participationId}&reportType=POSITIVE&view=app&contextId=${contextId}`
    );

    // Garante que se a API retornar um objeto paginado, extraímos o array correspondente
    const responseData = (response as any)?.data || response;
    return (Array.isArray(responseData) ? responseData : []) as ReportTypee[];
  } catch (error) {
    throw error;
  }
};

export const getReportById = async (reportId: number) => {
  try {
    const response = await apiClient(`/v1/reports/${reportId}`);
    return response as unknown as ReportDetailsResponse;
  } catch (error) {
    throw error;
  }
};
