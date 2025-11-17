// Configuração da API
export const API_BASE_URL = 'https://devapi.gds.proepi.org.br';

// Cliente HTTP básico
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Erro na requisição',
        data,
      };
    }
    
    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Erro de conexão. Verifique sua internet.',
      data: null,
    };
  }
};

// Cliente HTTP autenticado
export const authenticatedApiClient = async (endpoint, token, options = {}) => {
  return apiClient(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

