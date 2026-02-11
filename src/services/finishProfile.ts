import { apiClient } from "../utils/api";

interface ProfileStatus {
  isComplete: boolean;
  profile?: {
    genderId?: number;
    locationId?: number;
    externalIdentifier?: string;
  };
}

export interface UserBasicInfo {
  name: string;
  email: string;
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
  const response = await apiClient('/v1/locations?page=1&pageSize=100&active=true', { method: 'GET' }) as any;
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

export const getNameEmail = async (id: number | string): Promise<UserBasicInfo> => {
  const response: any = await apiClient(`/v1/users/${id}`, { method: 'GET' });
  const userData = response.data || response;

  return {
    name: userData.name,
    email: userData.email
  };
}