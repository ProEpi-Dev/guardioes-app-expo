import type { FormType } from './form';
import type { FormVersion } from './form-version';

export interface ParticipationProfileExtraMeResponse {
  form: {
    id: number;
    title: string;
    reference: string | null;
    type: FormType;
    version: FormVersion;
  } | null;
  submission: {
    formVersionId: number;
    response: Record<string, unknown>;
    updatedAt: string;
  } | null;
}

export interface SaveParticipationProfileExtraDto {
  formVersionId: number;
  formResponse: Record<string, unknown>;
}
