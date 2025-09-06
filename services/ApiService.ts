import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from './ApiConfig';
import type { ApiResponse, HealthCheckResponse } from '../types/api';

// Réexportation des types pour faciliter l'import ailleurs
export type { ApiResponse, HealthCheckResponse } from '../types/api';

// Configuration locale pour l'instance
interface LocalApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

class ApiService {
  private instance: AxiosInstance;
  private config: LocalApiConfig;

  constructor() {
    // Configuration depuis le fichier de config
    this.config = {
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.defaultHeaders,
    };

    this.instance = axios.create(this.config);
    this.setupInterceptors();
  }

  /**
   * Configuration des intercepteurs Axios
   */
  private setupInterceptors(): void {
    // Intercepteur de requête
    this.instance.interceptors.request.use(
      (config) => {
        // Ajouter un timestamp pour le debugging
        (config as any).startTime = Date.now();
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Logger le temps de réponse pour le debugging
        const endTime = Date.now();
        const startTime = (response.config as any).startTime || endTime;
        const duration = endTime - startTime;
        console.debug(`✅ API Response [${response.status}] ${response.config.url} - ${duration}ms`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`❌ API Response Error [${status}]:`, message);
        
        // Améliorer le message d'erreur selon le code de statut
        if (status === 401) {
          error.userMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (status === 403) {
          error.userMessage = 'Accès non autorisé.';
        } else if (status === 404) {
          error.userMessage = 'Ressource non trouvée.';
        } else if (status >= 500) {
          error.userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          error.userMessage = message || 'Une erreur est survenue.';
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Met à jour l'URL de base de l'API
   */
  public setBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL;
    this.instance.defaults.baseURL = baseURL;
  }

  /**
   * Ajoute un token d'authentification aux headers
   */
  public setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Supprime le token d'authentification
   */
  public removeAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  /**
   * Requête health check pour vérifier l'état de l'API
   */
  public async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    try {      
      const response = await this.instance.get<HealthCheckResponse>(API_CONFIG.endpoints.health);
      
      return {
        success: true,
        data: response.data,
        message: 'API health check successful'
      };
    } catch (error: any) {
      console.error('💥 Health check failed:', error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Health check failed',
        message: 'API health check failed'
      };
    }
  }
  /**
   * Requête health check protégée (nécessite authentification)
   * Le token Bearer est automatiquement envoyé via les intercepteurs
   */
  public async healthCheckProtected(): Promise<ApiResponse<HealthCheckResponse>> {
    try {
      // Vérifier si un token est présent
      const authHeader = this.instance.defaults.headers.common['Authorization'];
      if (!authHeader) {
        console.warn('⚠️ No auth token found for protected health check');
        return {
          success: false,
          error: 'Authentication token required',
          message: 'Protected health check requires authentication'
        };
      }

      console.info('🔐 Making protected health check with auth token');
      const response = await this.instance.get<HealthCheckResponse>(API_CONFIG.endpoints.health_protected);
      
      return {
        success: true,
        data: response.data,
        message: 'Protected API health check successful'
      };
    } catch (error: any) {
      console.error('💥 Protected health check failed:', error.message);
      
      // Gestion spécifique des erreurs d'authentification
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Unauthorized - Invalid or expired token',
          message: 'Authentication required for protected health check'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Protected health check failed',
        message: 'Protected API health check failed'
      };
    }
  }

  /**
   * Méthode privée pour formater les erreurs de manière cohérente
   */
  private formatError(error: any): string {
    return error.userMessage || error.response?.data?.message || error.message || 'Une erreur est survenue';
  }

  /**
   * Requête GET générique
   */
  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, { params });
      return {
        success: true,
        data: response.data,
        message: 'Données récupérées avec succès'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  /**
   * Requête POST générique
   */
  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data);
      return {
        success: true,
        data: response.data,
        message: 'Opération réussie'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  /**
   * Requête PUT générique
   */
  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data);
      return {
        success: true,
        data: response.data,
        message: 'Mise à jour réussie'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  /**
   * Requête DELETE générique
   */
  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url);
      return {
        success: true,
        data: response.data,
        message: 'Suppression réussie'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  /**
   * Obtient l'instance Axios directement (pour des cas avancés)
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Instance singleton
export const apiService = new ApiService();