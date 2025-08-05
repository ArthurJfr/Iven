// Types pour les réponses API génériques
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
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  expiresAt: string;
}

// Types pour le health check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: number;
  services?: {
    database?: 'healthy' | 'unhealthy';
    redis?: 'healthy' | 'unhealthy';
    storage?: 'healthy' | 'unhealthy';
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