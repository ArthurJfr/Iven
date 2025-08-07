// Types pour l'authentification

export interface User {
  id: string;
  email: string;
  username: string;
  fname: string;
  lname: string;
  avatar?: string;
  active: boolean;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresAt: string;
}

// Requêtes d'authentification
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
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
}

// Actions pour le contexte d'authentification
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: User };

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

// Types pour les erreurs spécifiques
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