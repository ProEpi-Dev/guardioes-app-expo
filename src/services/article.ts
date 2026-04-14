import { apiClient } from '../utils/api';
import { Article, ContentType } from '../types/article';

export const getArticles = async (): Promise<Article[]> => {
  const response = (await apiClient('/v1/contents?page=1&pageSize=20', {
    method: 'GET',
  })) as any;

  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

export const getContentById = async (id: number | string) => {
  const response: any = await apiClient(`/v1/contents/${id}`, {
    method: 'GET',
  });
  return response.data || response;
};

export const getContentTypes = async (): Promise<ContentType[]> => {
  const response = (await apiClient('/v1/content-types', {
    method: 'GET',
  })) as any;

  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};
