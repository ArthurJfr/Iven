import { apiService } from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse } from '../types/api';
import type { User, AuthResponse, LoginRequest, RegisterRequest, ConfirmAccountRequest } from '../types/auth';

/**
 * Service d'authentification utilisant l'ApiService
 */
class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  
  // Clés de stockage
  private readonly STORAGE_KEYS = {
    AUTH_TOKEN: '@iven_auth_token',
    USER_DATA: '@iven_user_data',
    AUTH_EXPIRES: '@iven_auth_expires'
  };

  /**
   * Initialisation du service - à appeler au démarrage de l'app
   */
  async initialize(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      const expiresAt = await AsyncStorage.getItem(this.STORAGE_KEYS.AUTH_EXPIRES);
      
      if (token && userData && expiresAt) {
        const expiry = new Date(expiresAt);
        const now = new Date();
        
        if (now < expiry) {
          // Session valide - restaurer les données
          this.authToken = token;
          this.currentUser = JSON.parse(userData);
          apiService.setAuthToken(token);
          
          console.info('✅ Session restaurée depuis le stockage');
          return true;
        } else {
          // Session expirée - nettoyer
          await this.clearStoredAuth();
          console.info('⚠️ Session expirée, nettoyage effectué');
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'auth:', error);
      await this.clearStoredAuth();
      return false;
    }
  }

  /**
   * Persister les données d'authentification
   */
  private async persistAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.STORAGE_KEYS.AUTH_TOKEN, authData.token],
        [this.STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user)],
        [this.STORAGE_KEYS.AUTH_EXPIRES, authData.expiresAt]
      ]);
      console.info('💾 Données d\'authentification sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde auth:', error);
    }
  }

  /**
   * Nettoyer les données d'authentification stockées
   */
  private async clearStoredAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.STORAGE_KEYS.AUTH_TOKEN,
        this.STORAGE_KEYS.USER_DATA,
        this.STORAGE_KEYS.AUTH_EXPIRES
      ]);
      console.info('🗑️ Données d\'authentification supprimées');
    } catch (error) {
      console.error('❌ Erreur suppression auth:', error);
    }
  }

  /**
   * Exposer les setters pour le contexte d'authentification
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      apiService.setAuthToken(token);
    } else {
      apiService.removeAuthToken();
    }
  }

  /**
   * Exposer la persistance pour le contexte
   */
  async persistSession(authData: AuthResponse): Promise<void> {
    await this.persistAuthData(authData);
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      console.info('🔐 Tentative d\'inscription...', userData.email);

      const response = await apiService.post<AuthResponse>('/auth/register', {
        username: userData.username,
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        password: userData.password,
      });

      if (response.success && response.data) {
        console.info('✅ Inscription réussie, email de confirmation envoyé');
        return {
          success: true,
          data: response.data,
          message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.'
        };
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription'
      };
    }
  }

  /**
   * Confirmation du compte utilisateur
   */
  async confirmAccount(confirmationData: ConfirmAccountRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      console.info('🔐 Confirmation du compte...', confirmationData.email);

      const response = await apiService.post<AuthResponse>('/auth/confirm', {
        email: confirmationData.email,
        code: confirmationData.code,
      });

      if (response.success && response.data) {
        // Le backend retourne : { message, email, token, user }
        // Transformer en format AuthResponse
        const authData: AuthResponse = {
          token: response.data.token,
          user: {
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            fname: response.data.user.fname || '',
            lname: response.data.user.lname || '',
            active: true, // Maintenant confirmé
            avatar: response.data.user.avatar,
            createdAt: response.data.user.createdAt || new Date().toISOString(),
            updatedAt: response.data.user.updatedAt || new Date().toISOString(),
          },
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72h comme backend
        };

        // Auto-login : sauvegarder les données d'authentification
        this.currentUser = authData.user;
        this.authToken = authData.token;
        apiService.setAuthToken(authData.token);

        // Persister dans le stockage local
        await this.persistAuthData(authData);
        
        console.info('✅ Compte confirmé avec succès + auto-login effectué');
        return {
          success: true,
          data: authData,
          message: 'Compte confirmé avec succès ! Connexion automatique effectuée.'
        };
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la confirmation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la confirmation du compte'
      };
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      console.info('🔐 Tentative de connexion...', credentials.email);

      const response = await apiService.post<AuthResponse>('/auth/login', credentials);

      if (response.success && response.data) {
        // Vérifier le statut du compte
        const isConfirmed = response.data.user.active;
        
        if (isConfirmed) {
          // Compte confirmé - sauvegarder complètement les données d'auth
          this.currentUser = response.data.user;
          this.authToken = response.data.token;
          apiService.setAuthToken(response.data.token);
          
          // Persister la session
          await this.persistAuthData(response.data);
          
          console.info('✅ Connexion réussie, compte confirmé');
          return {
            success: true,
            data: response.data,
            message: 'Connexion réussie !'
          };
        } else {
          // Compte non confirmé - ne pas sauvegarder complètement
          // mais retourner les données pour que l'UI puisse les utiliser
          console.warn('⚠️ Connexion réussie mais compte non confirmé');
          return {
            success: true,
            data: response.data,
            message: 'Identifiants corrects mais compte non confirmé'
          };
        }
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      
      // Analyser le type d'erreur pour un message plus précis
      let errorMessage = error.message || 'Erreur lors de la connexion';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.response?.status === 423) {
        errorMessage = 'Compte temporairement verrouillé';
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives. Veuillez patienter.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Problème de connexion internet';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      console.info('🔐 Déconnexion...');

      // Appel API pour invalidate le token côté serveur
      const response = await apiService.post<void>('/auth/logout');

      // Nettoyer les données locales même si l'API échoue
      this.currentUser = null;
      this.authToken = null;
      apiService.removeAuthToken();
      
      // Nettoyer le stockage persistant
      await this.clearStoredAuth();
      
      console.info('✅ Déconnexion réussie');
      return {
        success: true,
        message: 'Déconnexion réussie'
      };
    } catch (error: any) {
      console.error('⚠️ Erreur lors de la déconnexion (nettoyage local effectué):', error);
      
      // Nettoyer quand même les données locales
      this.currentUser = null;
      this.authToken = null;
      apiService.removeAuthToken();
      
      // Nettoyer le stockage persistant
      await this.clearStoredAuth();
      
      return {
        success: true,
        message: 'Déconnexion effectuée'
      };
    }
  }

  /**
   * Rafraîchissement du token d'authentification
   */
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      console.info('🔄 Rafraîchissement du token...');

      const response = await apiService.post<AuthResponse>('/auth/refresh');

      if (response.success && response.data) {
        this.authToken = response.data.token;
        apiService.setAuthToken(response.data.token);
        
        console.info('✅ Token rafraîchi');
        return response;
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du rafraîchissement du token'
      };
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      console.info('🔐 Demande de réinitialisation...', email);

      const response = await apiService.post<void>('/auth/forgot-password', { email });

      if (response.success) {
        console.info('✅ Email de réinitialisation envoyé');
        return {
          success: true,
          message: 'Un email de réinitialisation a été envoyé.'
        };
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors de la demande:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la demande de réinitialisation'
      };
    }
  }

  /**
   * Renvoyer le code de confirmation
   */
  async resendConfirmationCode(email: string): Promise<ApiResponse<void>> {
    try {
      console.info('📧 Renvoi du code de confirmation...', email);

      const response = await apiService.post<void>('/auth/resend-confirmation', { email });

      if (response.success) {
        console.info('✅ Code de confirmation renvoyé');
        return {
          success: true,
          message: 'Un nouveau code de confirmation a été envoyé.'
        };
      }

      return response;
    } catch (error: any) {
      console.error('❌ Erreur lors du renvoi:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du renvoi du code'
      };
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Obtenir le token actuel
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!(this.currentUser && this.authToken);
  }

  /**
   * Vérifier si le compte est confirmé
   */
  isAccountConfirmed(): boolean {
    return this.currentUser?.active ?? false;
  }


}

// Instance singleton
export const authService = new AuthService();