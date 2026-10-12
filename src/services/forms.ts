import { apiClient } from '../utils/api';
import { getCachedSignalForm, setCachedSignalForm } from './offlineCache';
import { isNetworkError, isOnline } from '../utils/reportDate';

const SIGNAL_FORM_TIMEOUT_MS = 8000;

export interface SignalFormResult {
  form: any | null;
  fromCache: boolean;
}

export const loadSignalForm = async (
  contextId: number
): Promise<SignalFormResult> => {
  if (!(await isOnline())) {
    return { form: await getCachedSignalForm(contextId), fromCache: true };
  }

  let response: any;
  try {
    response = await apiClient(
      `/v1/forms?active=true&pageSize=5&type=signal&contextId=${contextId}`,
      { method: 'GET', timeout: SIGNAL_FORM_TIMEOUT_MS }
    );
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await getCachedSignalForm(contextId);
      if (cached) return { form: cached, fromCache: true };
    }
    throw error;
  }

  const forms = response.data || [];

  const signalForms = forms.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const latestForm = signalForms[0];

  if (!latestForm || !latestForm.latestVersion) {
    console.warn('Nenhum formulário do tipo "signal" encontrado.');
    return { form: null, fromCache: false };
  }

  await setCachedSignalForm(contextId, latestForm);
  return { form: latestForm, fromCache: false };
};

export const getLatestSignalForm = async (contextId: number) =>
  (await loadSignalForm(contextId)).form;
