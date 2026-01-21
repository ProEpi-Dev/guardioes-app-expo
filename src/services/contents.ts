import { apiClient } from '../utils/api';

export const getContentById = async (id: number | string) => {
  const response: any = await apiClient(`/v1/contents/${id}`, { method: 'GET' });
  return response.data || response;
};