import { apiClient } from "../utils/api";

interface ProfileStatus {
  isComplete: boolean;
  profile?: {
    genderId?: number;
    locationId?: number;
    externalIdentifier?: string;
  };
}

export const getProfileStatus = async (): Promise<ProfileStatus | null> => {
  try {
    const response = await apiClient('/v1/users/me/profile-status', { method: 'GET' }) as any;
    return response; 
  } catch (error) {
    console.error('Erro ao buscar status', error);
    return null;
  }
};

export const getGenders = async (): Promise<any[]> => {
  const response = await apiClient('/v1/genders', { method: 'GET' }) as any;
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

export const getLocations = async (): Promise<any[]> => {
  const response = await apiClient('/v1/locations', { method: 'GET' }) as any;
  if (response && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const updateUserProfile = async (payload: { genderId: number, locationId: number, externalIdentifier: string }) => {
  return await apiClient('/v1/users/me/profile', { 
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
        'Content-Type': 'application/json'
    }
  });
};