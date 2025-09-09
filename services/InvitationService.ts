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


export interface RespondToInvitationRequest {
  response: 'accepted' | 'declined';
}

export interface UserSearchResult {
  id: number;
  username: string;
  email: string;
  role: string;
  fname?: string;
  lname?: string;
  avatar_url?: string;
  active: boolean;
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
      
      const response = await apiService.get<any>(`${this.BASE_URL}/search/users?${queryParams}`);
      
      console.log('🔍 Réponse brute de l\'API de recherche:', response);
      console.log('🔍 Structure des données:', response.data);
      
      // Vérification plus permissive - si la requête a réussi
      if (response.success && response.data) {
        // Essayons différentes structures possibles
        let users: UserSearchResult[] = [];
        let count = 0;
        
        // Structure 1: { success, data: { users, count } }
        if (response.data.success && response.data.data?.users) {
          users = response.data.data.users;
          count = response.data.data.count || users.length;
        }
        // Structure 2: { users, count } directement
        else if (response.data.users) {
          users = response.data.users;
          count = response.data.count || users.length;
        }
        // Structure 3: array direct
        else if (Array.isArray(response.data)) {
          users = response.data;
          count = users.length;
        }
        
        console.info(`✅ ${count} utilisateur(s) trouvé(s)`);
        return {
          success: true,
          data: users,
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
      
      // Testons d'abord avec /events (au pluriel) comme vous l'avez mentionné
      const endpoint = `/event/${eventId}/invite`;
      console.info(`🔗 Endpoint utilisé: ${endpoint}`);
      console.info(`📦 Données envoyées:`, invitationData);
      
      const response = await apiService.post<{ 
        message: string; 
        invitation: {
          id: number;
          event_id: number;
          invited_user: {
            id: number;
            username: string;
            email: string;
            fname?: string;
            lname?: string;
          };
          message?: string;
          expires_at: string;
        }
      }>(endpoint, invitationData);
      
      if (response.success && response.data?.invitation) {
        console.info('✅ Invitation envoyée avec succès');
        
        // Adapter la réponse de votre API au format attendu
        const adaptedInvitation: Invitation = {
          id: response.data.invitation.id,
          event_id: response.data.invitation.event_id,
          user_id: response.data.invitation.invited_user.id,
          inviter_id: 0, // Non fourni par votre API, valeur par défaut
          message: response.data.invitation.message,
          status: 'pending', // Statut par défaut pour une nouvelle invitation
          created_at: new Date().toISOString(), // Date actuelle
          updated_at: new Date().toISOString(), // Date actuelle
          expires_at: response.data.invitation.expires_at
        };
        
        return {
          success: true,
          data: adaptedInvitation,
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
      
      const response = await apiService.get<{ success: boolean; data: Invitation[]; message: string }>(`${this.BASE_URL}/invitations/user`);
      
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
  async respondToInvitation(invitationId: number, responseData: RespondToInvitationRequest): Promise<ApiResponse<Invitation>> {
    try {
      console.info(`📝 Réponse à l'invitation ${invitationId}: ${responseData.response}`);
      
      const endpoint = `/event/invitations/${invitationId}/respond`;
      console.info(`🔗 Endpoint utilisé: ${endpoint}`);
      console.info(`📦 Données envoyées:`, responseData);
      
      const response = await apiService.put<{ 
        message: string; 
        // Pour invitation acceptée
        event?: {
          id: number;
          title: string;
          start_date: string;
          end_date: string;
          location?: string;
        };
        // Pour invitation refusée
        invitation_id?: number;
      }>(endpoint, responseData);
      
      if (response.success && response.data) {
        console.info(`✅ Réponse à l'invitation enregistrée: ${responseData.response}`);
        
        // Créer une invitation adaptée avec le nouveau statut
        const adaptedInvitation: Invitation = {
          id: invitationId,
          event_id: response.data.event?.id || 0, // Si acceptée, on a l'event_id
          user_id: 0, // Non fourni par votre API, valeur par défaut
          inviter_id: 0, // Non fourni par votre API, valeur par défaut
          message: undefined,
          status: responseData.response === 'accepted' ? 'accepted' : 'declined',
          created_at: new Date().toISOString(), // Non fourni, valeur par défaut
          updated_at: new Date().toISOString(), // Date actuelle
          expires_at: new Date().toISOString() // Non fourni, valeur par défaut
        };
        
        return {
          success: true,
          data: adaptedInvitation,
          message: response.data.message || 'Réponse enregistrée',
          // Ajouter les infos de l'événement si invitation acceptée
          ...(response.data.event && { event: response.data.event })
        };
      } else {
        console.error('❌ Échec de la réponse à l\'invitation:', response.error);
        return {
          success: false,
          data: undefined,
          error: response.error || 'Format de réponse incorrect'
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
