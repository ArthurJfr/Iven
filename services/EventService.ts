import { apiService } from './ApiService';
import type { ApiResponse } from '../types/api';

// Types adaptés à votre structure de base de données actuelle
export interface CreateEventRequest {
  title: string;
  description?: string;
  start_date: string; // Format MySQL DATETIME: YYYY-MM-DD HH:MM:SS
  end_date: string;   // Format MySQL DATETIME: YYYY-MM-DD HH:MM:SS
  location?: string;
  owner_id: number;
}

export interface Event {
  id: number;
  owner_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Service de gestion des événements
 */
class EventService {
  private readonly BASE_URL = '/event';

  /**
   * Créer un nouvel événement
   */
  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    try {
      console.info('📅 Création d\'événement:', eventData);
      
      // Validation des données avant envoi
      if (!this.validateEventData(eventData)) {
        return {
          success: false,
          error: 'Données d\'événement invalides'
        };
      }

      // Appel à l'API backend - endpoint corrigé
      const response = await apiService.post<Event>(`${this.BASE_URL}/create`, eventData);
      
      if (response.success) {
        console.info('✅ Événement créé avec succès');
      } else {
        console.error('❌ Échec de création de l\'événement:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création de l\'événement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de l\'événement'
      };
    }
  }

  /**
   * Récupérer un événement par son ID
   */
  async getEventById(eventId: number): Promise<ApiResponse<Event>> {
    try {
      console.info(` Récupération de l'événement ${eventId}`);
      
      const response = await apiService.get<Event>(`${this.BASE_URL}/${eventId}`);
      
      if (response.success) {
        console.info('✅ Événement récupéré avec succès');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération de l\'événement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de l\'événement'
      };
    }
  }

  /**
   * Récupérer tous les événements d'un propriétaire
   */
  async getEventsByOwnerId(ownerId: number): Promise<ApiResponse<Event[]>> {
    try {
      console.info(`📅 Récupération des événements du propriétaire ${ownerId}`);
      
      const response = await apiService.get<Event[]>(`${this.BASE_URL}/owner/${ownerId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} événements récupérés`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des événements'
      };
    }
  }

  /**
   * Récupérer tous les événements d'un participant
   */
  async getEventsByParticipantId(participantId: number): Promise<ApiResponse<Event[]>> {
    try {
      console.info(`📅 Récupération des événements du participant ${participantId}`);
      
      const response = await apiService.get<Event[]>(`${this.BASE_URL}/participant/${participantId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} événements récupérés`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des événements'
      };
    }
  }

  /**
   * Mettre à jour un événement
   */
  async updateEvent(eventId: number, eventData: Partial<CreateEventRequest>): Promise<ApiResponse<Event>> {
    try {
      console.info(`📝 Mise à jour de l'événement ${eventId}:`, eventData);
      
      const response = await apiService.put<Event>(`${this.BASE_URL}/${eventId}`, eventData);
      
      if (response.success) {
        console.info('✅ Événement mis à jour avec succès');
      } else {
        console.error('❌ Échec de la mise à jour de l\'événement:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de l\'événement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour de l\'événement'
      };
    }
  }

  /**
   * Supprimer un événement
   */
  async deleteEvent(eventId: number): Promise<ApiResponse<{ message: string; eventId: number }>> {
    try {
      console.info(`🗑️ Suppression de l'événement ${eventId}`);
      
      const response = await apiService.delete<{ message: string; eventId: number }>(`${this.BASE_URL}/${eventId}`);
      
      if (response.success) {
        console.info('✅ Événement supprimé avec succès');
      } else {
        console.error('❌ Échec de la suppression de l\'événement:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de l\'événement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression de l\'événement'
      };
    }
  }

  /**
   * Récupérer les participants d'un événement
   */
  async getEventParticipants(eventId: number): Promise<ApiResponse<any>> {
    try {
      console.info(`👥 Récupération des participants de l'événement ${eventId}`);
      
      const response = await apiService.get<any>(`${this.BASE_URL}/${eventId}/participants`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.participants?.length || 0} participants récupérés`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des participants:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des participants'
      };
    }
  }

  /**
   * Ajouter un participant à un événement
   */
  async addParticipant(eventId: number, userId: number, role: 'owner' | 'participant' = 'participant'): Promise<ApiResponse<any>> {
    try {
      console.info(`➕ Ajout du participant ${userId} à l'événement ${eventId} avec le rôle ${role}`);
      
      const response = await apiService.post<any>(`${this.BASE_URL}/${eventId}/participants`, {
        userId,
        role
      });
      
      if (response.success) {
        console.info('✅ Participant ajouté avec succès');
      } else {
        console.error('❌ Échec de l\'ajout du participant:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout du participant:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout du participant'
      };
    }
  }

  /**
   * Retirer un participant d'un événement
   */
  async removeParticipant(eventId: number, userId: number): Promise<ApiResponse<any>> {
    try {
      console.info(`➖ Retrait du participant ${userId} de l'événement ${eventId}`);
      
      const response = await apiService.delete<any>(`${this.BASE_URL}/${eventId}/participants/${userId}`);
      
      if (response.success) {
        console.info('✅ Participant retiré avec succès');
      } else {
        console.error('❌ Échec du retrait du participant:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors du retrait du participant:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du retrait du participant'
      };
    }
  }

  /**
   * Valider les données d'un événement avant envoi
   */
  private validateEventData(eventData: CreateEventRequest): boolean {
    // Vérification des champs obligatoires
    if (!eventData.title || !eventData.start_date || !eventData.end_date || !eventData.owner_id) {
      console.warn('⚠️ Champs obligatoires manquants:', eventData);
      return false;
    }

    // Vérification du format des dates
    const startDate = new Date(eventData.start_date);
    const endDate = new Date(eventData.end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('⚠️ Format de date invalide:', { start_date: eventData.start_date, end_date: eventData.end_date });
      return false;
    }

    // Vérification que la date de fin est postérieure à la date de début
    if (endDate <= startDate) {
      console.warn('⚠️ Date de fin doit être postérieure à la date de début');
      return false;
    }

    // Vérification du format MySQL DATETIME
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!dateTimeRegex.test(eventData.start_date) || !dateTimeRegex.test(eventData.end_date)) {
      console.warn('⚠️ Format DATETIME MySQL invalide:', { start_date: eventData.start_date, end_date: eventData.end_date });
      return false;
    }

    return true;
  }

  /**
   * Formater une date en format MySQL DATETIME
   */
  static formatToMySQLDateTime(date: Date, time?: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (time) {
      // Si une heure est spécifiée, l'utiliser
      return `${year}-${month}-${day} ${time}`;
    } else {
      // Sinon, utiliser minuit
      return `${year}-${month}-${day} 00:00:00`;
    }
  }

  /**
   * Parser une date au format français (DD/MM/YYYY) vers un objet Date
   */
  static parseFrenchDate(frenchDate: string): Date | null {
    try {
      if (frenchDate.includes('/')) {
        const [day, month, year] = frenchDate.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (isNaN(date.getTime())) {
          return null;
        }
        
        return date;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ Erreur parsing date française:', frenchDate, error);
      return null;
    }
  }
}

// Instance singleton
export const eventService = new EventService();
