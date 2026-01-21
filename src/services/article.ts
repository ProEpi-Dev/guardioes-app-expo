import { apiClient } from '../utils/api';
import { Article } from '../types/article';

export const getArticles = async (): Promise<Article[]> => {
  const response = await apiClient('/v1/contents', { method: 'GET' }) as any;

    if (Array.isArray(response)) {
    return response;
  }

  return [];
};