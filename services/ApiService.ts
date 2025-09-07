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
  private setupInterceptors() {
    // Intercepteur de requête
    this.instance.interceptors.request.use(
      (config) => {
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
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Met à jour l'URL de base de l'API
   */


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
  // (retiré) healthCheckProtected

  /**
   * Requête GET générique
   */
  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
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
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
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
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
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
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Obtient l'instance Axios directement (pour des cas avancés)
   */
  public getInstance(): AxiosInstance {
    // à supprimer
    return this.instance;
  }
}

// Instance singleton
export const apiService = new ApiService();