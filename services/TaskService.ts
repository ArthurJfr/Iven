import { apiService } from './ApiService';
import type { ApiResponse } from '../types/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/tasks';

/**
 * Service de gestion des tâches
 */
class TaskService {
  private readonly BASE_URL = '/task';

  /**
   * Créer une nouvelle tâche
   */
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      console.info('✅ Création de tâche:', taskData);
      
      const response = await apiService.post<Task>(`${this.BASE_URL}/create`, taskData);
      
      if (response.success) {
        console.info('✅ Tâche créée avec succès');
      } else {
        console.error('❌ Échec de création de la tâche:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création de la tâche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de la tâche'
      };
    }
  }

  /**
   * Récupérer une tâche par son ID
   */
  async getTaskById(taskId: number): Promise<ApiResponse<Task>> {
    try {
      console.info(`📋 Récupération de la tâche ${taskId}`);
      
      const response = await apiService.get<Task>(`${this.BASE_URL}/${taskId}`);
      
      if (response.success) {
        console.info('✅ Tâche récupérée avec succès');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération de la tâche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de la tâche'
      };
    }
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(taskId: number, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      console.info(`📝 Mise à jour de la tâche ${taskId}:`, taskData);
      
      const response = await apiService.put<Task>(`${this.BASE_URL}/${taskId}`, taskData);
      
      if (response.success) {
        console.info('✅ Tâche mise à jour avec succès');
      } else {
        console.error('❌ Échec de la mise à jour de la tâche:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de la tâche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour de la tâche'
      };
    }
  }

  /**
   * Supprimer une tâche
   */
  async deleteTask(taskId: number): Promise<ApiResponse<{ message: string; taskId: number }>> {
    try {
      console.info(`🗑️ Suppression de la tâche ${taskId}`);
      
      const response = await apiService.delete<{ message: string; taskId: number }>(`${this.BASE_URL}/${taskId}`);
      
      if (response.success) {
        console.info('✅ Tâche supprimée avec succès');
      } else {
        console.error('❌ Échec de la suppression de la tâche:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de la tâche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression de la tâche'
      };
    }
  }

  /**
   * Récupérer toutes les tâches d'un événement
   */
  async getTasksByEventId(eventId: number): Promise<ApiResponse<Task[]>> {
    try {
      console.info(`📋 Récupération des tâches de l'événement ${eventId}`);
      
      const response = await apiService.get<Task[]>(`${this.BASE_URL}/event/${eventId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} tâches récupérées`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tâches'
      };
    }
  }

  /**
   * Récupérer toutes les tâches d'un propriétaire
   */
  async getTasksByOwnerId(ownerId: number): Promise<ApiResponse<Task[]>> {
    try {
      console.info(`📋 Récupération des tâches du propriétaire ${ownerId}`);
      
      const response = await apiService.get<Task[]>(`${this.BASE_URL}/owner/${ownerId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} tâches récupérées`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tâches'
      };
    }
  }

  /**
   * Récupérer toutes les tâches d'un participant
   */
  async getTasksByParticipantId(participantId: number): Promise<ApiResponse<Task[]>> {
    try {
      console.info(`📋 Récupération des tâches du participant ${participantId}`);
      
      const response = await apiService.get<Task[]>(`${this.BASE_URL}/participant/${participantId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} tâches récupérées`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tâches'
      };
    }
  }

  /**
   * Formater une date pour l'affichage
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('⚠️ Erreur formatage date:', dateString, error);
      return dateString;
    }
  }

  /**
   * Formater une date et heure pour l'affichage
   */
  static formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('⚠️ Erreur formatage date/heure:', dateString, error);
      return dateString;
    }
  }

  /**
   * Obtenir le statut de validation d'une tâche
   */
  static getValidationStatus(validatedBy: number | null): 'pending' | 'validated' {
    return validatedBy ? 'validated' : 'pending';
  }

  /**
   * Obtenir l'icône de statut de validation
   */
  static getValidationIcon(validatedBy: number | null): string {
    return validatedBy ? 'checkmark-circle' : 'ellipse-outline';
  }

  /**
   * Obtenir la couleur de statut de validation
   */
  static getValidationColor(validatedBy: number | null): string {
    return validatedBy ? '#34C759' : '#FF9500';
  }

  /**
   * Obtenir le texte de statut de validation
   */
  static getValidationText(validatedBy: number | null): string {
    return validatedBy ? 'Validée' : 'En attente';
  }

  /**
   * Valider une tâche
   */
  async validateTask(taskId: number): Promise<ApiResponse<Task>> {
    try {
      console.info(`✅ Validation de la tâche ${taskId}`);
      
      const response = await apiService.post<Task>(`${this.BASE_URL}/${taskId}/validate`);
      
      if (response.success) {
        console.info('✅ Tâche validée avec succès');
      } else {
        console.error('❌ Échec de la validation de la tâche:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la validation de la tâche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la validation de la tâche'
      };
    }
  }

  /**
   * Annuler la validation d'une tâche
   */
  async unvalidateTask(taskId: number): Promise<ApiResponse<Task>> {
    try {
      console.info(`❌ Annulation de la validation de la tâche ${taskId}`);
      
      const response = await apiService.delete<Task>(`${this.BASE_URL}/${taskId}/validate`);
      
      if (response.success) {
        console.info('✅ Validation de la tâche annulée avec succès');
      } else {
        console.error('❌ Échec de l\'annulation de la validation:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'annulation de la validation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'annulation de la validation'
      };
    }
  }

  /**
   * Récupérer les tâches validées par un utilisateur
   */
  async getTasksValidatedByUser(userId: number): Promise<ApiResponse<{ tasks: Task[], count: number }>> {
    try {
      console.info(`📋 Récupération des tâches validées par l'utilisateur ${userId}`);
      
      const response = await apiService.get<{ tasks: Task[], count: number }>(`${this.BASE_URL}/validated-by/${userId}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.count || 0} tâches validées récupérées`);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des tâches validées:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tâches validées'
      };
    }
  }
}

// Instance singleton
export const taskService = new TaskService();

// Exporter aussi la classe pour accéder aux méthodes statiques
export { TaskService };
