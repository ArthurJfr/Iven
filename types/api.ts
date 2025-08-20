// Types pour les réponses API génériques - ADAPTÉS À VOS ROUTES API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Types pour les métadonnées API
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: ApiMeta;
}

// Types pour l'authentification
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string;
    username: string;
    fname: string;
    lname: string;
    active: number;
    avatar_url?: string;
  };
  expiresAt: string;
}

// Types pour le health check selon vos routes API
export interface HealthCheckResponse {
  status: 'healthy';
  server: {
    status: 'operational';
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
  };
  services: {
    mongodb: {
      status: 'healthy';
      state: 'connected';
      message: string;
    };
    mysql: {
      status: 'healthy';
      message: string;
    };
  };
  performance: {
    responseTime: string;
    memory: {
      used: string;
      total: string;
    };
  };
}

// Health check protégé avec informations utilisateur
export interface ProtectedHealthCheckResponse extends HealthCheckResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    lastLogin: string | null;
  };
  security: {
    authenticated: boolean;
    tokenValid: boolean;
    userAuthorized: boolean;
  };
}

// Types pour les erreurs API
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Types pour les configurations API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

// Types pour les requêtes avec fichiers
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Énumération des codes d'erreur courants
export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

// Types pour les paramètres de requête courants
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Types pour les réponses de messages simples
export interface SimpleMessageResponse {
  message: string;
}

// Types pour les réponses avec ID
export interface IdResponse {
  id: number;
}

// Types pour les réponses de suppression
export interface DeleteResponse {
  message: string;
  id?: number;
}