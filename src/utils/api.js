import axios from 'axios';
import * as authStorage from '../services/authStorage';

// Variáveis de controle
let currentToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Criar a instância PRIMEIRO
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Adicionar o ÚNICO interceptor de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    // Retorna direto os dados da API
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e a requisição ainda não tiver sido repetida
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // Evita loops infinitos se o próprio endpoint de refresh der 401
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // Se já existe um refresh acontecendo, coloca a requisição na fila de espera
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await authStorage.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }

        // Faz a chamada de refresh
        const refreshResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Atualiza os tokens
        await updateAuthToken(newToken);
        await authStorage.storeRefreshToken(newRefreshToken);

        // Processa a fila
        processQueue(null, newToken);

        // Refaz a requisição
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        await authStorage.clearAuthData();
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // O antigo tratamento de erros fica embutido aqui no final (substituindo o segundo interceptor)
    throw {
      status: error.response?.status || 0,
      message: error.response?.data?.message || 'Erro de conexão.',
      data: error.response?.data || null,
    };
  }
);

// --- FUNÇÕES DE UTILIDADE ---

export const updateAuthToken = async (token) => {
  currentToken = token;
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await authStorage.storeToken(token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    await authStorage.removeToken();
  }
};

export const initializeAuthToken = async () => {
  const token = await authStorage.getToken();
  if (token) {
    currentToken = token;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
};

export const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', headers = {}, body, ...restOptions } = options;
  
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      headers,
      data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
      ...restOptions,
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const authenticatedApiClient = async (endpoint, token, options = {}) => {
  if (token) {
    await updateAuthToken(token);
  }
  return apiClient(endpoint, options);
};