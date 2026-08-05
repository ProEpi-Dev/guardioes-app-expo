import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { apiClient, updateAuthToken, initializeAuthToken } from '../utils/api';
import * as authStorage from '../services/authStorage';
import {
  User,
  RegisterData,
  LoginResponse,
  LoginResult,
  AuthContextType,
  ApiError,
  Form,
  PaginatedResponse,
} from '../types/auth';
import axios from 'axios';

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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const storedToken = await initializeAuthToken();
      const storedUser = await authStorage.getUser();
      const storedRefreshToken = await authStorage.getRefreshToken();

      if (storedToken && storedUser && storedRefreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/auth/refresh`,
            {
              refreshToken: storedRefreshToken,
            }
          );

          const responseData = refreshResponse.data;

          const newToken =
            responseData.token ||
            responseData.accessToken ||
            responseData.data?.token ||
            responseData.data?.accessToken;

          const newRefreshToken =
            responseData.refreshToken || responseData.data?.refreshToken;

          if (newToken) {
            await updateAuthToken(newToken);
            if (newRefreshToken) {
              await authStorage.storeRefreshToken(newRefreshToken);
            }
            setToken(newToken);
            setUser(storedUser);
            setIsAuthenticated(true);
            await fetchForms();
          } else {
            throw new Error(
              'Token não recebido da API durante a renovação proativa.'
            );
          }
        } catch (refreshError: any) {
          console.warn(
            'Erro na renovação proativa do token ao abrir o app:',
            refreshError
          );

          if (refreshError.response && refreshError.response.status === 401) {
            await authStorage.clearAuthData();
            await updateAuthToken(null);
            setIsAuthenticated(false);
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
            await fetchForms();
          }
        }
      } else {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro grave ao verificar estado de autenticação:', error);
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const response = (await apiClient('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })) as unknown as LoginResponse;

      const authToken =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken;

      const userData =
        response.user ||
        response.data?.user ||
        (response.id
          ? {
              id: response.id,
              email: response.email || email,
              name: response.name,
            }
          : null);

      if (!authToken) {
        console.warn('Estrutura da resposta da API:', response);
        throw new Error(
          'Token não recebido da API. Verifique a estrutura da resposta.'
        );
      }

      const participation =
        response.participation ?? response.data?.participation ?? null;

      const finalUserData: User = {
        ...(userData || { email }),
        participation,
      };

      const refreshToken = response.refreshToken || response.data?.refreshToken;

      await authStorage.storeToken(authToken);
      if (refreshToken) {
        await authStorage.storeRefreshToken(refreshToken);
      }
      await authStorage.storeUser(finalUserData);

      await updateAuthToken(authToken);

      setToken(authToken);
      setUser(finalUserData);
      setIsAuthenticated(true);

      await fetchForms();

      return { success: true, data: response };
    } catch (error) {
      console.error('Erro no login:', error);

      const apiError = error as ApiError;
      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      if (apiError.status === 401) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (apiError.status === 403) {
        errorMessage = 'Cadastro não confirmado.';
      } else if (apiError.status === 0) {
        errorMessage =
          apiError.message || 'Erro de conexão. Verifique sua internet.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      return { success: false, error: errorMessage, status: apiError.status };
    }
  };

  const register = async (data: RegisterData): Promise<LoginResult> => {
    try {
      const response = (await apiClient('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      })) as unknown as LoginResponse;

      const authToken =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken;

      const userData =
        response.user ||
        response.data?.user ||
        (response.id
          ? {
              id: response.id,
              email: response.email || data.email,
              name: response.name || data.name,
            }
          : null);

      if (authToken) {
        const participation =
          response.participation ?? response.data?.participation ?? null;

        const finalUserData: User = {
          ...(userData || { email: data.email, name: data.name }),
          participation,
        };

        const refreshToken =
          response.refreshToken || response.data?.refreshToken;

        await authStorage.storeToken(authToken);
        if (refreshToken) {
          await authStorage.storeRefreshToken(refreshToken);
        }
        await authStorage.storeUser(finalUserData);
        await updateAuthToken(authToken);

        setToken(authToken);
        setUser(finalUserData);
        setIsAuthenticated(true);

        await fetchForms();

        return { success: true, data: response };
      }

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
      const currentRefreshToken = await authStorage.getRefreshToken();

      if (currentRefreshToken) {
        try {
          await axios.post(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/auth/logout`,
            {
              refreshToken: currentRefreshToken,
            }
          );
        } catch (e) {
          console.warn('Erro ao avisar o servidor do logout', e);
        }
      }

      await authStorage.clearAuthData();
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
      const response = (await apiClient(
        '/v1/forms?page=1&pageSize=10&active=true',
        {
          method: 'GET',
        }
      )) as unknown as PaginatedResponse<Form>;

      if (response.data && response.data.length > 0) {
        const firstForm = response.data[0];
        setForm(firstForm);
      } else {
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
