import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { apiClient, updateAuthToken, initializeAuthToken } from '../utils/api';
import * as authStorage from '../services/authStorage';
import { User, RegisterData, LoginResponse, LoginResult, AuthContextType, ApiError, Form, PaginatedResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [form, setForm] = useState<Form | null>(null);

  // Verificar se há token salvo ao iniciar
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      // Inicializar token no axios (busca do storage e atualiza defaults)
      const storedToken = await initializeAuthToken();
      const storedUser = await authStorage.getUser();

      if (storedToken && storedUser) {
        // Verificar se o token tem mais de 5 minutos de validade
        const isValid = authStorage.isTokenValid(storedToken, 5);
        
        if (!isValid) {
          console.log('🔐 [Auth] Token expirando em menos de 5 minutos, fazendo logout');
          // Token está expirando em menos de 5 minutos, fazer logout
          await logout();
          return;
        }

        // Token válido, manter autenticação
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        // Buscar forms se já estiver autenticado
        await fetchForms();
      } else {
        // Não há token ou usuário salvo, garantir que está deslogado
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
      // Em caso de erro, garantir que está deslogado
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await apiClient('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      }) as unknown as LoginResponse;

      // A API pode retornar o token e dados do usuário em diferentes formatos
      // Ajuste conforme a estrutura real da resposta da API
      const authToken = 
        response.token || 
        response.accessToken || 
        response.data?.token ||
        response.data?.accessToken;

      const userData = 
        response.user || 
        response.data?.user || 
        (response.id ? {
          id: response.id,
          email: response.email || email,
          name: response.name,
        } : null);

      if (!authToken) {
        console.warn('Estrutura da resposta da API:', response);
        throw new Error('Token não recebido da API. Verifique a estrutura da resposta.');
      }

      // Se não houver dados do usuário, criar um objeto mínimo
      const finalUserData: User = userData || {
        email: email,
      };

      // Armazenar token e dados do usuário
      await authStorage.storeToken(authToken);
      await authStorage.storeUser(finalUserData);
      
      // Atualizar token no axios interceptor
      await updateAuthToken(authToken);

      // Atualizar estado
      setToken(authToken);
      setUser(finalUserData);
      setIsAuthenticated(true);

      // Buscar forms após login bem-sucedido
      await fetchForms();

      return { success: true, data: response };
    } catch (error) {
      console.error('Erro no login:', error);
      
      const apiError = error as ApiError;
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (apiError.status === 401) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (apiError.status === 0) {
        errorMessage = apiError.message || 'Erro de conexão. Verifique sua internet.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (data: RegisterData): Promise<LoginResult> => {
    try {
      const response = await apiClient('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }) as unknown as LoginResponse;

      // Lógica de Auto-Login: Tenta extrair token e user da resposta do registro
      const authToken = 
        response.token || 
        response.accessToken || 
        response.data?.token ||
        response.data?.accessToken;

      const userData = 
        response.user || 
        response.data?.user || 
        (response.id ? {
          id: response.id,
          email: response.email || data.email,
          name: response.name || data.name,
        } : null);

      // Se a API retornar o token, fazemos o login automático
      if (authToken) {
        const finalUserData: User = userData || {
          email: data.email,
          name: data.name
        };

        await authStorage.storeToken(authToken);
        await authStorage.storeUser(finalUserData);
        await updateAuthToken(authToken);

        setToken(authToken);
        setUser(finalUserData);
        setIsAuthenticated(true);
        
        await fetchForms(); // Busca os dados iniciais

        return { success: true, data: response };
      }

      // Caso a API crie o usuário mas NÃO retorne o token (ex: exige confirmação de email)
      // Retornamos sucesso, mas não autenticamos no app
      return { success: true, data: response };

    } catch (error) {
      console.error('Erro no registro:', error);
      
      const apiError = error as ApiError;
      let errorMessage = 'Erro ao realizar cadastro.';

      if (apiError.status === 409) {
        errorMessage = 'Este email já está em uso.';
      } else if (apiError.status === 400) {
        errorMessage = 'Dados inválidos. Verifique as informações.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authStorage.clearAuthData();
      // Remover token do axios interceptor
      await updateAuthToken(null);
      setToken(null);
      setUser(null);
      setForm(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (userData: User): Promise<void> => {
    try {
      await authStorage.storeUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const fetchForms = async (): Promise<void> => {
    try {
      // O token será adicionado automaticamente pelo interceptor do axios
      const response = await apiClient('/v1/forms?page=1&pageSize=10&active=true', {
        method: 'GET',
      }) as unknown as PaginatedResponse<Form>;

      // Verificar se há itens e guardar o primeiro
      if (response.data && response.data.length > 0) {
        const firstForm = response.data[0];
        setForm(firstForm);
        console.log('Form carregado:', firstForm);
      } else {
        console.log('Nenhum form disponível');
        setForm(null);
      }
    } catch (error) {
      console.error('Erro ao buscar forms:', error);
      setForm(null);
    }
  };

  const updateUserLocal = async (userData: User): Promise<void> => {
    try {
      await authStorage.storeUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados locais do usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    form,
    login,
    register,
    logout,
    updateUser,
    updateUserLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

