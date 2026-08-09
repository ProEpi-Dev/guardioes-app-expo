import axios from 'axios';
import * as authStorage from '../services/authStorage';
import {
  maintenanceFromResponse,
  setMaintenance,
} from '../services/maintenanceStore';
import { getCurrentLocale } from '../locales/i18n';

// Variáveis de controle
let _currentToken = null;
let isRefreshing = false;
let failedQueue = [];

/**
 * Sem timeout a requisição fica pendurada indefinidamente em rede ruim, e a
 * tela que a disparou nunca sai do estado de carregando.
 */
const REQUEST_TIMEOUT_MS = 20000;

/**
 * A API responde no envelope { error: { code, message } }. Ler `data.message`
 * — como era feito antes — nunca acertava, e todo erro caía no texto genérico
 * de conexão, inclusive os que traziam explicação do backend.
 */
const extractErrorMessage = (error) => {
  const data = error.response?.data;

  return (
    data?.error?.message ||
    data?.message ||
    (error.code === 'ECONNABORTED' ? 'Tempo de conexão esgotado.' : null) ||
    'Erro de conexão.'
  );
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
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
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// O backend resolve os textos de indisponibilidade por Accept-Language, com
// fallback pt. Hoje o i18n do app é fixo em pt, mas enviar o header já deixa
// isso correto para quando o idioma do dispositivo voltar a ser usado.
axiosInstance.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = getCurrentLocale();
  return config;
});

// 2. Adicionar o ÚNICO interceptor de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    // Qualquer resposta bem-sucedida prova que a janela terminou, mesmo que o
    // recheck periódico ainda não tenha rodado.
    setMaintenance(null);
    // Retorna direto os dados da API
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Publica a indisponibilidade assim que ela aparece em qualquer chamada,
    // sem esperar o próximo health check.
    const maintenance = maintenanceFromResponse(
      error.response?.status,
      error.response?.data
    );
    if (maintenance) {
      setMaintenance(maintenance);
    }

    // Se o erro for 401 e a requisição ainda não tiver sido repetida
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Evita loops infinitos se o próprio endpoint de refresh der 401
      if (
        originalRequest.url.includes('/auth/refresh') ||
        originalRequest.url.includes('/auth/login')
      ) {
        return Promise.reject(error);
      }

      // Se já existe um refresh acontecendo, coloca a requisição na fila de espera
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await authStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('Refresh token não encontrado');
        }

        // Faz a chamada de refresh
        const refreshResponse = await axios.post(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/auth/refresh`,
          {
            refreshToken: refreshToken,
          }
        );

        const responseData = refreshResponse.data;

        // Pega o token independentemente do formato em que o backend enviar
        const newToken =
          responseData.token ||
          responseData.accessToken ||
          responseData.data?.token ||
          responseData.data?.accessToken;

        const newRefreshToken =
          responseData.refreshToken || responseData.data?.refreshToken;
        if (!newToken) {
          throw new Error('Token não recebido do servidor durante o refresh');
        }

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
    const apiError = new Error(extractErrorMessage(error));
    apiError.status = error.response?.status || 0;
    apiError.code = error.response?.data?.error?.code || null;
    apiError.data = error.response?.data || null;
    apiError.maintenance = maintenance;
    throw apiError;
  }
);

// --- FUNÇÕES DE UTILIDADE ---

export const updateAuthToken = async (token) => {
  _currentToken = token;
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
    _currentToken = token;
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
      data: body
        ? typeof body === 'string'
          ? JSON.parse(body)
          : body
        : undefined,
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
