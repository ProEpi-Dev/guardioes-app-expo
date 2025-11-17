import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Armazenar token
export const storeToken = async (token: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Erro ao armazenar token:', error);
    return false;
  }
};

// Recuperar token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

// Remover token
export const removeToken = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao remover token:', error);
    return false;
  }
};

// Armazenar dados do usuário
export const storeUser = async (userData: User): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Erro ao armazenar dados do usuário:', error);
    return false;
  }
};

// Recuperar dados do usuário
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? (JSON.parse(userData) as User) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error);
    return null;
  }
};

// Remover dados do usuário
export const removeUser = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao remover dados do usuário:', error);
    return false;
  }
};

// Limpar todos os dados de autenticação
export const clearAuthData = async (): Promise<void> => {
  await Promise.all([removeToken(), removeUser()]);
};

