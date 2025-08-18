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
