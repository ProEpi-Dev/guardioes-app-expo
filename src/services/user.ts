import { apiClient } from '../utils/api';

export const updateUser = async (userId: number, data: { name?: string; email?: string; password?: string; active?: boolean }) => {
  return await apiClient(`/v1/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, active: true })
  });
};