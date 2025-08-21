// Types pour les tâches - ADAPTÉS À VOTRE SCHÉMA DE BASE DE DONNÉES RÉEL

export interface Task {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  title: string; // VARCHAR(255) NOT NULL
  description?: string; // TEXT
  owner_id: number; // INT NOT NULL - ID du propriétaire de la tâche
  event_id: number; // INT NOT NULL - ID de l'événement
  validated_by?: number | null; // INT NULL - ID de l'utilisateur qui a validé la tâche
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Types pour les requêtes API
export interface CreateTaskRequest {
  title: string;
  description?: string;
  owner_id: number;
  event_id: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// Types pour les réponses API
export interface CreateTaskResponse {
  id: number;
  title: string;
  description?: string;
  owner_id: number;
  event_id: number;
  validated_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateTaskResponse {
  message: string;
  task: Task;
}

export interface DeleteTaskResponse {
  message: string;
  taskId: number;
}

// Types pour les listes et réponses
export type TaskValidationStatus = 'pending' | 'validated';

// Types pour les filtres et recherche
export interface TaskFilters {
  validation_status?: TaskValidationStatus;
  owner_id?: number;
  event_id?: number;
  validated_by?: number;
}

// Types pour les réponses API génériques
export interface TaskListResponse {
  success: boolean;
  data?: Task[];
  error?: string;
}

export interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
} 