import { apiClient } from '../utils/api';

export const getQuizDetails = async (quizId: number) => {
  const response: any = await apiClient(`/v1/forms/${quizId}`, { method: 'GET' });
  const data = response.data || response;
  
  if (!data?.latestVersion?.definition?.fields) {
    throw new Error("Definição do quiz inválida.");
  }
  return data.latestVersion;
};

export const submitQuizAttempt = async (payload: any) => {
  const response: any = await apiClient('/v1/quiz-submissions', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.data || response;
};

export const getActiveQuizzes = async () => {
  const response: any = await apiClient(`/v1/forms?active=true&pageSize=50`, { method: 'GET' });
  const forms = response.data || [];
  return forms.filter((f: any) => f.type === 'quiz');
};

export const getUserSubmissions = async (participationId: number) => {
  const response: any = await apiClient(`/v1/quiz-submissions`, { method: 'GET' });
  const responses = response.data || [];
  return responses.filter((f: any) => f.participationId === participationId);
};

export const getContentQuizMapping = async () => {
  try {
    const response: any = await apiClient(`/v1/content-quiz?pageSize=100`, { method: 'GET' });
    const data = response.data || response || [];
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Erro content-quiz", error);
    return [];
  }
};