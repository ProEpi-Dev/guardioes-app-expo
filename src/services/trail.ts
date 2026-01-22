import { apiClient } from '../utils/api';
import { Trail } from '../types/trail';

export const getTrails = async (): Promise<Trail[]> => {
  const response = await apiClient('/v1/tracks', { method: 'GET' }) as any;

    if (Array.isArray(response)) {
    return response;
  }

  return [];
};