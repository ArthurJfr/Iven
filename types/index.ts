// Fichier d'index pour exporter tous les types mis à jour
// Types harmonisés avec vos routes API

// Types API génériques
export * from './api';

// Types d'authentification
export * from './auth';

// Types d'événements
export * from './events';

// Types de tâches
export * from './tasks';

// Types d'utilisateurs
export * from './users';

// Types de catégories et médias
export * from './categories';

// Réexportation des types principaux pour faciliter l'utilisation
export type {
  // Types de base
  User,
  Event,
  Task,
  Category,
  Media,
  
  // Types de réponses API
  ApiResponse,
  HealthCheckResponse,
  ProtectedHealthCheckResponse,
  
  // Types d'authentification
  LoginRequest,
  RegisterRequest,
  ConfirmAccountRequest,
  ForgotPasswordRequest,
  
  // Types d'événements
  CreateEventRequest,
  UpdateEventRequest,
  EventParticipant,
  EventParticipantWithDetails,
  
  // Types de tâches
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  TaskPriority,
  
  // Types d'utilisateurs
  UserProfile,
  PublicUserInfo,
  UpdateUserRequest,
  
  // Types de catégories et médias
  CreateCategoryRequest,
  CreateMediaRequest,
  MediaType,
} from './index';
