// Types unifiés pour les utilisateurs - ADAPTÉS À VOS ROUTES API

export interface User {
  id: number; // INT(11) dans votre DB
  username: string; // VARCHAR(255) NOT NULL
  fname: string; // VARCHAR(255) NOT NULL
  lname: string; // VARCHAR(255) NOT NULL
  email: string; // VARCHAR(255) NOT NULL UNIQUE
  password?: string; // VARCHAR(255) - Généralement omis côté frontend
  active: number; // tinyint(1) - 0 ou 1 selon vos routes
  avatar_url?: string; // VARCHAR(255)
  bio?: string; // TEXT
  phone?: string; // VARCHAR(20)
  timezone?: string; // VARCHAR(50)
  notification_preferences?: object; // JSON field
  reset_token?: string; // VARCHAR(255)
  reset_token_expires?: string; // DATETIME
  confirmation_code?: string; // VARCHAR(6)
  confirmation_code_expires?: string; // DATETIME
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Types pour les requêtes API
export interface CreateUserRequest {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<Omit<User, 'id' | 'password' | 'created_at' | 'updated_at'>> {}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Types pour les réponses API
export interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

export interface UserListResponse {
  success: boolean;
  data?: User[];
  error?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface UpdatePasswordResponse {
  message: string;
}

// Types pour les profils utilisateur
export interface UserProfile extends Omit<User, 'password' | 'reset_token' | 'reset_token_expires' | 'confirmation_code' | 'confirmation_code_expires'> {}

// Types pour les informations publiques d'un utilisateur
export interface PublicUserInfo {
  id: number;
  username: string;
  fname: string;
  lname: string;
  avatar_url?: string;
  bio?: string;
}

// Types pour les filtres et recherche
export interface UserFilters {
  active?: number;
  search?: string;
  role?: string;
}

// Types pour les paramètres de pagination
export interface UserQueryParams {
  page?: number;
  limit?: number;
  sort?: 'username' | 'fname' | 'lname' | 'email' | 'created_at';
  order?: 'asc' | 'desc';
  search?: string;
  filters?: UserFilters;
}

// Types pour les erreurs spécifiques
export interface UserError {
  error: string;
  code?: string;
}

// Types pour les statistiques utilisateur
export interface UserStats {
  totalEvents: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  lastActivity: string;
} 