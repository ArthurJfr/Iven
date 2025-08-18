/**
 * Configuration centralisée pour l'API
 * Modifiez ces valeurs selon votre environnement
 */

export const API_CONFIG = {
  // URL de base de votre API
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://51.75.124.73:3000/api',
  // ip pc fix 192.168.1.177
  //ip mac Realtimes 192.168.12.88
  //ip prod 51.75.124.73

  // Timeout pour les requêtes (en millisecondes)
  timeout: 10000,
  
  // Version de l'API
  version: 'v1',
  
  // Headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration de retry
  retry: {
    attempts: 3,
    delay: 1000, // 1 seconde
  },
  
  // Endpoints spécifiques
  endpoints: {
    health: '/health',
    health_protected: '/health/protected',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
    },
    events: {
      list: '/events',
      create: '/events',
      detail: (id: string) => `/events/${id}`,
      update: (id: string) => `/events/${id}`,
      delete: (id: string) => `/events/${id}`,
    },
    users: {
      profile: '/users/profile',
      update: '/users/profile',
      list: '/users',
    },
    media: {
      upload: '/media/upload',
      list: '/media',
      delete: (id: string) => `/media/${id}`,
    },
  },
};

/**
 * Configurations par environnement
 */
export const ENVIRONMENT_CONFIGS = {
  development: {
    ...API_CONFIG,
    baseURL: 'http://localhost:3000/api',
    timeout: 15000, // Plus de temps en dev
  },
  
  staging: {
    ...API_CONFIG,
    baseURL: 'https://api-staging.votre-domaine.com/api',
    timeout: 8000,
  },
  
  production: {
    ...API_CONFIG,
    baseURL: 'https://api.votre-domaine.com/api',
    timeout: 5000, // Plus strict en prod
  },
};

/**
 * Fonction pour obtenir la configuration selon l'environnement
 */
export function getApiConfig(environment: 'development' | 'staging' | 'production' = 'development') {
  return ENVIRONMENT_CONFIGS[environment];
}