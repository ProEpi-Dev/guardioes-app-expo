import { apiClient } from '../utils/api';

export const forgotPassword = async (email: string) => {
  return await apiClient(`/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
};
