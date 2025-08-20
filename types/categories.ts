// Types pour les catégories et médias - ADAPTÉS À VOTRE SCHÉMA DE BASE DE DONNÉES

export interface Category {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  name: string; // VARCHAR(255) NOT NULL
  description?: string; // TEXT
  color: string; // VARCHAR(7) - Code couleur hexadécimal
  icon?: string; // VARCHAR(50) - Nom de l'icône
  event_count: number; // INT - Nombre d'événements dans cette catégorie
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

export interface Media {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  title: string; // VARCHAR(255) NOT NULL
  type: 'image' | 'video' | 'document' | 'audio'; // ENUM
  url: string; // VARCHAR(500) NOT NULL - URL du fichier
  thumbnail?: string; // VARCHAR(500) - URL de la miniature
  event_id: number; // INT NOT NULL - ID de l'événement
  uploaded_by: number; // INT NOT NULL - ID de l'utilisateur
  size?: number; // BIGINT - Taille du fichier en bytes
  mime_type?: string; // VARCHAR(100) - Type MIME du fichier
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Types pour les requêtes API
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CreateMediaRequest {
  title: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  event_id: number;
  uploaded_by: number;
  size?: number;
  mime_type?: string;
}

export interface UpdateMediaRequest extends Partial<CreateMediaRequest> {}

// Types pour les réponses API
export interface CategoryResponse {
  success: boolean;
  data?: Category;
  error?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data?: Category[];
  error?: string;
}

export interface MediaResponse {
  success: boolean;
  data?: Media;
  error?: string;
}

export interface MediaListResponse {
  success: boolean;
  data?: Media[];
  error?: string;
}

// Types pour les filtres et recherche
export interface CategoryFilters {
  search?: string;
  color?: string;
}

export interface MediaFilters {
  type?: 'image' | 'video' | 'document' | 'audio';
  event_id?: number;
  uploaded_by?: number;
  search?: string;
}

// Types pour les paramètres de requête
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  sort?: 'name' | 'created_at' | 'event_count';
  order?: 'asc' | 'desc';
  search?: string;
  filters?: CategoryFilters;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  sort?: 'title' | 'created_at' | 'size';
  order?: 'asc' | 'desc';
  search?: string;
  filters?: MediaFilters;
}

// Types pour les erreurs
export interface CategoryError {
  error: string;
}

export interface MediaError {
  error: string;
}

// Types pour les statistiques
export interface CategoryStats {
  totalCategories: number;
  totalEvents: number;
  mostUsedCategory?: Category;
}

export interface MediaStats {
  totalMedia: number;
  totalSize: number;
  byType: Record<string, number>;
}

// Types pour les listes et réponses
export type MediaType = Media['type']; 