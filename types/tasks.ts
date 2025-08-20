// Types pour les tâches - ADAPTÉS À VOTRE SCHÉMA DE BASE DE DONNÉES

export interface Task {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  title: string; // VARCHAR(255) NOT NULL
  description?: string; // TEXT
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number; // INT - ID de l'utilisateur assigné
  event_id: number; // INT NOT NULL - ID de l'événement
  due_date?: string; // DATETIME - Date d'échéance
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Types pour les requêtes API
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  event_id: number;
  due_date?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// Types pour les réponses API
export interface CreateTaskResponse {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: number;
  event_id: number;
  due_date?: string;
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
export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

// Types pour les filtres et recherche
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: number;
  event_id?: number;
  due_date_from?: string;
  due_date_to?: string;
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