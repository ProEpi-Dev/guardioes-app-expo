// Tipos para autenticação

export interface User {
  id?: number;
  email: string;
  name?: string;
  [key: string]: unknown; // Permite propriedades adicionais
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    accessToken?: string;
    user?: User;
    refreshToken?: any;
  };
  id?: number;
  email?: string;
  name?: string;
  [key: string]: unknown; // Permite propriedades adicionais na resposta
}

export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  error?: string;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

export interface Form {
  id: number;
  type: string;
  reference?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Permite propriedades adicionais
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
  [key: string]: unknown; // Permite propriedades adicionais
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  form: Form | null; // Primeiro form disponível
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<LoginResult>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  updateUserLocal: (userData: User) => Promise<void>;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  PasswordRecover: undefined;
  Register: undefined;
  FinishProfile: undefined;
  Home: undefined;
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  contextId: number;
  acceptedLegalDocumentIds: number[];
}
