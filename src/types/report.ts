export interface ReportType {
  id: number;
  reportId: number;
  externalSignalStageLabel: string;
  status: string;
}

export interface ReportDetailsResponse {
  id: number;
  participationId: number;
  formVersionId: number;
  reportType: string;
  occurrenceLocation: {
    latitude: number;
    longitude: number;
  } | null;
  formResponse: Record<string, any>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTypee {
  id: number;
  createdAt: number;
  previewText: string;
  integrationSummary: {
    status: string;
    externalSignalStageLabel: string;
  } | null;
}
