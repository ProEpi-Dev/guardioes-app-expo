import axios from 'axios';
import * as authStorage from '../services/authStorage';

// Token em memória (evita buscar do storage a cada requisição)
let currentToken = null;

// Criar instância do axios
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Se for erro de resposta da API
    if (error.response) {
      const { status, data } = error.response;
      throw {
        status,
        message: data?.message || 'Erro na requisição',
        data: data || null,
      };
    }
    
    // Se for erro de rede/conexão
    if (error.request) {
      throw {
        status: 0,
        message: 'Erro de conexão. Verifique sua internet.',
        data: null,
      };
    }
    
    // Outros erros
    throw {
      status: 0,
      message: error.message || 'Erro desconhecido',
      data: null,
    };
  }
);

// Função para atualizar o token nos defaults do axios
export const updateAuthToken = async (token) => {
  // Atualizar token em memória
  currentToken = token;
  
  // Atualizar defaults do axios
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Garantir que está salvo no storage também
    await authStorage.storeToken(token);
  } else {
    // Remover token dos defaults
    delete axiosInstance.defaults.headers.common['Authorization'];
    // Remover do storage
    await authStorage.removeToken();
  }
};

// Função para inicializar o token do storage (chamada uma vez na inicialização)
export const initializeAuthToken = async () => {
  const token = await authStorage.getToken();
  if (token) {
    currentToken = token;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
};

// Cliente HTTP básico (compatível com a API anterior)
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

// Cliente HTTP autenticado (mantido para compatibilidade, mas agora usa os defaults do axios)
export const authenticatedApiClient = async (endpoint, token, options = {}) => {
  // Se um token for fornecido, atualizar nos defaults do axios
  if (token) {
    await updateAuthToken(token);
  }
  
  // O token já está nos defaults do axios
  return apiClient(endpoint, options);
};

