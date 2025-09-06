// Types pour l'authentification - ADAPTÉS À VOS ROUTES API
import type { User } from './users';
import type { ApiResponse } from './api';

// Réexporter User pour la compatibilité avec les imports existants
export type { User };

// Types pour les réponses d'authentification selon vos routes
export interface RegisterResponse {
  message: string;
  userId: number;
}

export interface ConfirmAccountResponse {
  message: string;
  email: string;
  token: string;
  user: User;
}

export interface ConfirmAccountError {
  message: string;
  error: string;
}

export interface ResendConfirmationResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginNotActivatedResponse {
  message: string;
  code: string;
  user: Omit<User, 'id' | 'password' | 'active'> & { active: number };
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// Type pour la vérification de token JWT
export interface VerifyTokenResponse {
  message: string;
  isConnected: boolean;
  user?: User; // Présent seulement si isConnected = true
}

// Requêtes d'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
}

export interface ConfirmAccountRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

// États d'authentification
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCheckingToken: boolean; // Nouveau : pour indiquer si on vérifie le token
}

// Actions pour le contexte d'authentification
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: User }
  | { type: 'AUTH_CHECK_TOKEN_START' }
  | { type: 'AUTH_CHECK_TOKEN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_CHECK_TOKEN_FAILURE' };

// Types pour la validation
export interface ValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
  };
  password: {
    required: boolean;
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
}

// Types pour les erreurs spécifiques selon vos routes
export interface AuthErrorCodes {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS';
  ACCOUNT_NOT_CONFIRMED: 'ACCOUNT_NOT_CONFIRMED';
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED';
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS';
  INVALID_CONFIRMATION_CODE: 'INVALID_CONFIRMATION_CODE';
  CONFIRMATION_CODE_EXPIRED: 'CONFIRMATION_CODE_EXPIRED';
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK';
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND';
  TOKEN_EXPIRED: 'TOKEN_EXPIRED';
  TOKEN_INVALID: 'TOKEN_INVALID';
}

// Configuration des sessions
export interface SessionConfig {
  tokenDuration: number; // en minutes
  refreshThreshold: number; // en minutes
  maxInactivity: number; // en minutes
  rememberMeDuration: number; // en jours
}