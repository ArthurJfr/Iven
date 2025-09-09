import { apiService } from './ApiService';
import type { ApiResponse } from '../types/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  active: boolean;
  fname?: string;
  lname?: string;
}

/**
 * Service de gestion des utilisateurs
 */
class UserService {
  private readonly BASE_URL = '/auth/user';

  /**
   * Récupérer un utilisateur par son ID
   */
  async getUserById(userId: number): Promise<ApiResponse<User>> {
    try {
      console.info(`�� Récupération de l'utilisateur ${userId}`);
      
      const response = await apiService.get<User>(`${this.BASE_URL}/${userId}`);
      
      if (response.success) {
        console.info('✅ Utilisateur récupéré avec succès');
      } else {
        console.error('❌ Échec de récupération de l\'utilisateur:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de l\'utilisateur'
      };
    }
  }

  /**
   * Rechercher des utilisateurs par nom d'utilisateur, prénom ou nom
   */
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    try {
      console.info(`🔍 Recherche d'utilisateurs avec la requête: ${query}`);
      
      const response = await apiService.get<User[]>(`${this.BASE_URL}/search?q=${encodeURIComponent(query)}`);
      
      if (response.success) {
        console.info(`✅ ${response.data?.length || 0} utilisateur(s) trouvé(s)`);
      } else {
        console.error('❌ Échec de la recherche d\'utilisateurs:', response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la recherche d\'utilisateurs:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche d\'utilisateurs'
      };
    }
  }
}

export const userService = new UserService();
