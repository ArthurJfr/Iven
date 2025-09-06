// Types de base pour les événements - ADAPTÉS À VOTRE SCHÉMA SIMPLIFIÉ
// Import du type ApiResponse depuis le module API
import type { ApiResponse } from './api';
import type { User } from './users';
export interface Event {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  owner_id: number; // INT NOT NULL
  title: string; // VARCHAR(255) NOT NULL
  description?: string; // TEXT
  start_date: string; // DATETIME NOT NULL (format: "YYYY-MM-DD HH:MM:SS")
  end_date: string; // DATETIME NOT NULL (format: "YYYY-MM-DD HH:MM:SS")
  location?: string; // VARCHAR(255)
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string;
  participants: EventParticipantWithDetails[];
 // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Table de liaison event_participants
export interface EventParticipant {
  id: number; // INT PRIMARY KEY AUTO_INCREMENT
  event_id: number; // INT NOT NULL
  user_id: number; // INT NOT NULL
  role: 'owner' | 'participant'; // ENUM('owner', 'participant') NOT NULL DEFAULT 'participant'
  joined_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}

// Participant avec détails utilisateur (pour les réponses API)
export interface EventParticipantWithDetails extends EventParticipant {
  username: string;
  email: string;
  fname: string;
  lname: string;
}

// Types pour les réponses API
export interface EventWithDetails extends Event {
  participants: EventParticipantWithDetails[];
}

// Types pour les requêtes API
export interface CreateEventRequest {
  title: string;
  description?: string;
  start_date: string; // Format MySQL DATETIME: "YYYY-MM-DD HH:MM:SS"
  end_date: string; // Format MySQL DATETIME: "YYYY-MM-DD HH:MM:SS"
  location?: string;
  owner_id: number; // Récupéré depuis le stockage local
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

// Types pour les participants
export interface AddParticipantRequest {
  userId: number; // Correspond à votre route API
  role?: 'owner' | 'participant';
}

export interface UpdateParticipantRequest {
  role?: 'owner' | 'participant';
}

// Types pour les réponses API spécifiques selon vos routes
export interface CreateEventResponse {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  owner_id: number;
}

export interface UpdateEventResponse {
  message: string;
  event: Event & {
    updated_at: string;
  };
}

export interface DeleteEventResponse {
  message: string;
  eventId: number;
}

export interface AddParticipantResponse {
  message: string;
  participant: EventParticipantWithDetails;
}

export interface RemoveParticipantResponse {
  message: string;
  eventId: number;
  userId: number;
}

export interface ParticipantsListResponse {
  event_id: number;
  participants: EventParticipantWithDetails[];
}

// Types pour les listes
export interface EventListResponse extends ApiResponse<Event[]> {}
export interface EventResponse extends ApiResponse<Event> {}
export interface ParticipantListResponse extends ApiResponse<EventParticipant[]> {}

// Types pour les erreurs spécifiques selon vos routes
export interface EventError {
  error: string;
}

export interface ParticipantError {
  error: string;
}