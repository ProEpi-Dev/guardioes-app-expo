import { apiClient } from '../utils/api';

export const getLatestSignalForm = async () => {
  const response: any = await apiClient(`/v1/forms?active=true&pageSize=5&type=signal`, { method: 'GET' });
  const forms = response.data || [];
  
  const signalForms = forms
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latestForm = signalForms[0];

  if (!latestForm || !latestForm.latestVersion) {
    console.warn('Nenhum formulário do tipo "signal" encontrado.');
    return null;
  }

  return latestForm;
};