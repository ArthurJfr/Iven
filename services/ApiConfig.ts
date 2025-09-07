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
    // (retiré) health_protected
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      confirm: '/auth/confirm',
      resend_confirmation: '/auth/resend-confirmation-email',
      forgot_password: '/auth/forgot-password',
      logout: '/auth/logout',
      verify_token: '/auth/is-connected', // Nouveau : vérification de token
    },
    events: {
      create: '/event/create',
      update: (id: string) => `/event/${id}`,
      delete: (id: string) => `/event/${id}`,
      get: (id: string) => `/event/${id}`,
      owner: (ownerId: string) => `/event/owner/${ownerId}`,
      participant: (participantId: string) => `/event/participant/${participantId}`,
      participants: {
        list: (eventId: string) => `/event/${eventId}/participants`,
        add: (eventId: string) => `/event/${eventId}/participants`,
        remove: (eventId: string, userId: string) => `/event/${eventId}/participants/${userId}`,
      },
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
    tasks: {
      create: '/task/create',
      update: (id: string) => `/task/${id}`,
      delete: (id: string) => `/task/${id}`,
      get: (id: string) => `/task/${id}`,
      list: '/task',
    },
  },
};

/**
 * Configurations par environnement
 */
export const ENVIRONMENT_CONFIGS = {
  // à supprimer
  development: {
    ...API_CONFIG,
    baseURL: 'http://localhost:3000/api',
    timeout: 15000, // Plus de temps en dev
  },
  
  // à supprimer
  staging: {
    ...API_CONFIG,
    baseURL: 'https://api-staging.votre-domaine.com/api',
    timeout: 8000,
  },
  
  // à supprimer
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