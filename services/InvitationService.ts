import { apiService } from './ApiService';
import type { ApiResponse } from '../types/api';

// Types pour les invitations
export interface Invitation {
  id: number;
  event_id: number;
  user_id: number;
  inviter_id: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface CreateInvitationRequest {
  eventId: number;
  userId: number;
  message?: string;
}

export interface InvitationResponse {
  invitation_id: number;
  action: 'accept' | 'decline';
}

export interface UserSearchResult {
  id: number;
  username: string;
  email: string;
  role: string;
  fname?: string;
  lname?: string;
}

export interface UserSearchRequest {
  q: string;
  event_id?: number;
  excludeParticipants?: boolean;
}

/**
 * Service de gestion des invitations aux événements
 */
class InvitationService {
  private readonly BASE_URL = '/event';

  /**
   * Rechercher des utilisateurs pour inviter
   */
  async searchUsers(searchRequest: UserSearchRequest): Promise<ApiResponse<UserSearchResult[]>> {
    try {
      console.info('🔍 Recherche d\'utilisateurs:', searchRequest);
      
      const queryParams = new URLSearchParams({
        q: searchRequest.q,
        ...(searchRequest.event_id && { event_id: searchRequest.event_id.toString() }),
        ...(searchRequest.excludeParticipants !== undefined && { excludeParticipants: searchRequest.excludeParticipants.toString() })
      });
      
      const response = await apiService.get<{ 
        success: boolean;
        data: { users: UserSearchResult[], count: number, searchTerm: string };
        message: string;
      }>(`${this.BASE_URL}/search/users?${queryParams}`);
      
      console.log('🔍 Réponse brute de l\'API:', response);
      
      if (response.data?.success && response.data?.data?.users) {
        console.info(`✅ ${response.data.data.count || 0} utilisateur(s) trouvé(s)`);
        return {
          success: true,
          data: response.data.data.users,
          message: response.data.message || 'Recherche réussie'
        };
      } else {
        console.error('❌ Échec de la recherche d\'utilisateurs:', response.error);
        return {
          success: false,
          data: [],
          error: response.error || 'Format de réponse incorrect'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la recherche d\'utilisateurs:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche d\'utilisateurs'
      };
    }
  }

  /**
   * Inviter un utilisateur à un événement
   */
  async inviteUser(eventId: number, invitationData: CreateInvitationRequest): Promise<ApiResponse<Invitation>> {
    try {
      console.info(`📨 Invitation de l'utilisateur ${invitationData.userId} à l'événement ${eventId}`);
      
      const response = await apiService.post<{ success: boolean; data: Invitation; message: string }>(`${this.BASE_URL}/${eventId}/invite`, invitationData);
      
      if (response.data?.success && response.data?.data) {
        console.info('✅ Invitation envoyée avec succès');
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Invitation envoyée'
        };
      } else {
        console.error('❌ Échec de l\'envoi de l\'invitation:', response.error);
        return {
          success: false,
          data: undefined,
          error: response.error || 'Format de réponse incorrect'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'invitation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'invitation'
      };
    }
  }

  /**
   * Récupérer les invitations d'un événement
   */
  async getEventInvitations(eventId: number): Promise<ApiResponse<Invitation[]>> {
    try {
      console.info(`📋 Récupération des invitations de l'événement ${eventId}`);
      
      const response = await apiService.get<{ success: boolean; data: Invitation[]; message: string }>(`${this.BASE_URL}/${eventId}/invitations`);
      
      if (response.data?.success && response.data?.data) {
        console.info(`✅ ${response.data.data.length || 0} invitations récupérées`);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Invitations récupérées'
        };
      } else {
        console.error('❌ Échec de la récupération des invitations:', response.error);
        return {
          success: false,
          data: [],
          error: response.error || 'Format de réponse incorrect'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des invitations:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des invitations'
      };
    }
  }

  /**
   * Récupérer les invitations de l'utilisateur connecté
   */
  async getUserInvitations(): Promise<ApiResponse<Invitation[]>> {
    try {
      console.info('📋 Récupération des invitations de l\'utilisateur');
      
      const response = await apiService.get<{ user_id: number; invitations: Invitation[] }>(`${this.BASE_URL}/invitations/user`);
      
      console.log('📨 Réponse brute getUserInvitations:', response);
      
      if (response.data?.invitations) {
        console.info(`✅ ${response.data.invitations.length || 0} invitations récupérées`);
        return {
          success: true,
          data: response.data.invitations,
          message: `${response.data.invitations.length || 0} invitation(s) trouvée(s)`
        };
      } else {
        console.log('📨 Aucune invitation trouvée ou format incorrect');
        return {
          success: true,
          data: [],
          message: 'Aucune invitation trouvée'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des invitations:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des invitations'
      };
    }
  }

  /**
   * Répondre à une invitation (accepter/refuser)
   */
  async respondToInvitation(invitationId: number, response: InvitationResponse): Promise<ApiResponse<Invitation>> {
    try {
      console.info(`📝 Réponse à l'invitation ${invitationId}:`, response.action);
      
      const apiResponse = await apiService.put<{ success: boolean; data: Invitation; message: string }>(`${this.BASE_URL}/invitations/${invitationId}/respond`, response);
      
      if (apiResponse.data?.success && apiResponse.data?.data) {
        console.info('✅ Réponse à l\'invitation envoyée avec succès');
        return {
          success: true,
          data: apiResponse.data.data,
          message: apiResponse.data.message || 'Réponse envoyée'
        };
      } else {
        console.error('❌ Échec de l\'envoi de la réponse:', apiResponse.error);
        return {
          success: false,
          data: undefined,
          error: apiResponse.error || 'Format de réponse incorrect'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la réponse à l\'invitation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la réponse à l\'invitation'
      };
    }
  }

  /**
   * Annuler une invitation
   */
  async cancelInvitation(invitationId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      console.info(`❌ Annulation de l'invitation ${invitationId}`);
      
      const response = await apiService.delete<{ success: boolean; data: { message: string }; message: string }>(`${this.BASE_URL}/invitations/${invitationId}`);
      
      if (response.data?.success && response.data?.data) {
        console.info('✅ Invitation annulée avec succès');
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Invitation annulée'
        };
      } else {
        console.error('❌ Échec de l\'annulation de l\'invitation:', response.error);
        return {
          success: false,
          data: { message: '' },
          error: response.error || 'Format de réponse incorrect'
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'annulation de l\'invitation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'annulation de l\'invitation'
      };
    }
  }

  /**
   * Vérifier si un utilisateur est déjà invité
   */
  async isUserInvited(eventId: number, userId: number): Promise<boolean> {
    try {
      const response = await this.getEventInvitations(eventId);
      if (response.success && response.data) {
        return response.data.some(invitation => 
          invitation.user_id === userId && 
          ['pending', 'accepted'].includes(invitation.status)
        );
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'invitation:', error);
      return false;
    }
  }

  /**
   * Obtenir le statut d'une invitation
   */
  getInvitationStatusText(status: string): string {
    // à supprimer
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'declined':
        return 'Refusée';
      case 'expired':
        return 'Expirée';
      default:
        return 'Inconnu';
    }
  }

  /**
   * Obtenir la couleur du statut d'une invitation
   */
  getInvitationStatusColor(status: string): string {
    // à supprimer
    switch (status) {
      case 'pending':
        return '#f59e0b'; // Orange
      case 'accepted':
        return '#10b981'; // Vert
      case 'declined':
        return '#ef4444'; // Rouge
      case 'expired':
        return '#6b7280'; // Gris
      default:
        return '#6b7280';
    }
  }
}

// Instance singleton
export const invitationService = new InvitationService();

// Exporter aussi la classe pour accéder aux méthodes statiques
export { InvitationService };
