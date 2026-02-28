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

// Função para decodificar base64 no React Native (substitui atob)
const base64Decode = (str: string): string => {
  try {
    // No React Native, podemos usar Buffer se disponível, ou fazer decodificação manual
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
    
    // Fallback: usar implementação manual de base64
    // Substituir caracteres base64url para base64 padrão
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Adicionar padding se necessário
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    // Decodificar manualmente
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    let i = 0;
    
    while (i < padded.length) {
      const encoded1 = chars.indexOf(padded.charAt(i++));
      const encoded2 = chars.indexOf(padded.charAt(i++));
      const encoded3 = chars.indexOf(padded.charAt(i++));
      const encoded4 = chars.indexOf(padded.charAt(i++));
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
      if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao decodificar base64:', error);
    throw error;
  }
};

// Decodificar JWT e verificar validade
export const decodeJWT = (token: string): any => {
  try {
    // JWT tem formato: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decodificar payload (base64url)
    const payload = parts[1];
    const decodedString = base64Decode(payload);
    const decoded = JSON.parse(decodedString);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
};

// Verificar se o token tem mais de X minutos de validade
export const isTokenValid = (token: string, minMinutesRemaining: number = 5): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return false;
    }

    // exp está em segundos desde epoch
    const expirationTime = decoded.exp * 1000; // Converter para milissegundos
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    const minutesRemaining = timeRemaining / (1000 * 60);

    // console.log('🔐 [Token] Verificação de validade:', {
    //   expirationTime: new Date(expirationTime).toISOString(),
    //   currentTime: new Date(currentTime).toISOString(),
    //   minutesRemaining: minutesRemaining.toFixed(2),
    //   minRequired: minMinutesRemaining,
    //   isValid: minutesRemaining > minMinutesRemaining,
    // });

    return minutesRemaining > minMinutesRemaining;
  } catch (error) {
    console.error('Erro ao verificar validade do token:', error);
    return false;
  }
};



