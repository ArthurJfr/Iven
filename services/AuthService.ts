import { apiService } from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse } from '../types/api';
import type { User, LoginRequest, RegisterRequest, ConfirmAccountRequest, VerifyTokenResponse } from '../types/auth';
import { API_CONFIG } from './ApiConfig';

// Type pour la réponse d'authentification locale
interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

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
      // Tentative de réparation des données corrompues
      await this.repairStoredAuth();
      
      const token = await AsyncStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
      
      // Si pas de token stocké, pas d'authentification
      if (!token) {
        console.info('ℹ️ Aucun token d\'authentification trouvé');
        return false;
      }

      // Récupérer les données utilisateur stockées localement en premier
      const storedUserData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      let localUser: User | null = null;
      
      if (storedUserData) {
        try {
          localUser = JSON.parse(storedUserData);
          if (localUser) {
            console.info('📱 Données utilisateur locales récupérées:', localUser.email);
          }
        } catch (parseError) {
          console.warn('⚠️ Erreur parsing données utilisateur locales:', parseError);
        }
      }

      // Vérifier la validité du token avec l'API
      console.info('🔐 Vérification du token JWT...');
      const verificationResult = await this.verifyToken(token);
      
      if (verificationResult.success && verificationResult.data?.isConnected) {
        // Token valide - restaurer la session avec les données de l'API
        this.authToken = token;
        
        // Vérifier si l'API retourne tous les champs nécessaires
        const apiUser = verificationResult.data.user!;
        const hasAllRequiredFields = apiUser.fname && apiUser.lname && apiUser.active !== undefined;
        
        if (hasAllRequiredFields) {
          // L'API retourne tous les champs - utiliser directement
          this.currentUser = apiUser;
          console.info('✅ API retourne tous les champs nécessaires');
        } else {
          // L'API ne retourne pas tous les champs - fusionner avec les données locales
          console.warn('⚠️ API ne retourne pas tous les champs, fusion avec données locales...');
          
          if (localUser) {
            // Fusionner : API en priorité, données locales en complément
            this.currentUser = {
              ...localUser,           // Données locales (incluant fname, lname, active)
              ...apiUser,             // Données API (id, username, email)
              updated_at: new Date().toISOString() // Marquer comme mis à jour
            };
            console.info('✅ Données fusionnées API + locales');
          } else {
            // Pas de données locales - utiliser l'API même incomplète
            this.currentUser = apiUser;
            console.warn('⚠️ Utilisation des données API incomplètes (pas de données locales)');
          }
        }
        
        apiService.setAuthToken(token);
        
        // Log de débogage pour voir les données finales
        console.log('🔍 Données utilisateur finales après fusion:', {
          id: this.currentUser.id,
          email: this.currentUser.email,
          username: this.currentUser.username,
          fname: this.currentUser.fname,
          lname: this.currentUser.lname,
          active: this.currentUser.active,
          source: hasAllRequiredFields ? 'API complète' : 'Fusion API+locales'
        });
        
        // IMPORTANT: Synchroniser le stockage local avec les données finales
        try {
          const updatedAuthData = {
            token,
            user: this.currentUser,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
          };
          await this.persistAuthData(updatedAuthData);
          console.info('💾 Stockage local synchronisé avec les données finales');
        } catch (syncError) {
          console.warn('⚠️ Erreur synchronisation stockage local:', syncError);
          // Continuer même si la synchronisation échoue
        }
        
        console.info('✅ Token JWT valide, session restaurée');
        return true;
      } else {
        // Token invalide ou expiré - nettoyer
        console.warn('⚠️ Token JWT invalide ou expiré, nettoyage effectué');
        await this.clearStoredAuth();
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'auth:', error);
      
      // En cas d'erreur réseau, essayer de restaurer avec les données locales
      try {
        const storedUserData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA);
        const token = await AsyncStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
        
        if (storedUserData && token) {
          const localUser = JSON.parse(storedUserData);
          this.currentUser = localUser;
          this.authToken = token;
          apiService.setAuthToken(token);
          
          console.info('📱 Session restaurée depuis le stockage local (erreur réseau)');
          return true;
        }
      } catch (fallbackError) {
        console.warn('⚠️ Échec de la restauration depuis le stockage local:', fallbackError);
      }
      
      await this.clearStoredAuth();
      return false;
    }
  }

  /**
   * Vérifier la validité d'un token JWT avec l'API
   */
  async verifyToken(token: string): Promise<ApiResponse<VerifyTokenResponse>> {
    try {
      console.info('🔍 Vérification du token JWT...');
      
      // Configurer temporairement le token pour cette requête
      apiService.setAuthToken(token);
      
      const response = await apiService.get<VerifyTokenResponse>(API_CONFIG.endpoints.auth.verify_token);
      
      if (response.success && response.data) {
        console.info('✅ Token JWT vérifié:', response.data.message);
        return response;
      } else {
        console.warn('⚠️ Token JWT invalide:', response.error);
        return response;
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la vérification du token:', error);
      
      // Analyser le type d'erreur
      let errorMessage = 'Erreur lors de la vérification du token';
      
      if (error.response?.status === 401) {
        errorMessage = 'Token expiré ou invalide';
      } else if (error.response?.status === 400) {
        errorMessage = 'Aucun token fourni';
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
   * Valider les données d'authentification avant sauvegarde
   */
  private validateAuthData(authData: AuthResponse): boolean {
    // Vérification du token
    if (!authData.token || typeof authData.token !== 'string' || authData.token.trim() === '') {
      console.warn('⚠️ Token invalide ou manquant');
      return false;
    }

    // Vérification des données utilisateur
    if (!authData.user || typeof authData.user !== 'object') {
      console.warn('⚠️ Données utilisateur manquantes ou invalides');
      return false;
    }

    // Log de débogage pour voir les données reçues
    console.log('🔍 Validation des données utilisateur:', {
      id: authData.user.id,
      email: authData.user.email,
      username: authData.user.username,
      fname: authData.user.fname,
      lname: authData.user.lname,
      fnameType: typeof authData.user.fname,
      lnameType: typeof authData.user.lname
    });

    // Vérification des champs obligatoires de l'utilisateur
    const requiredFields = ['id', 'email', 'username', 'fname', 'lname'];
    for (const field of requiredFields) {
      const value = authData.user[field as keyof User];
      // Accepter les chaînes vides comme valeurs valides
      if (value === undefined || value === null) {
        console.warn(`⚠️ Champ utilisateur manquant: ${field}`);
        return false;
      }
      // Vérifier que la valeur n'est pas undefined ou null, mais accepter les chaînes vides
      if (typeof value === 'string' && value.trim() === '') {
        console.info(`ℹ️ Champ ${field} est une chaîne vide (valide)`);
      } else if (typeof value === 'number' && value === 0) {
        console.info(`ℹ️ Champ ${field} est 0 (valide)`);
      } else if (value) {
        console.info(`✅ Champ ${field} valide: ${value}`);
      }
    }

    // Vérification de la date d'expiration (optionnelle)
    if (authData.expiresAt && typeof authData.expiresAt !== 'string') {
      console.warn('⚠️ Format de date d\'expiration invalide');
      return false;
    }

    if (authData.expiresAt) {
      const expiry = new Date(authData.expiresAt);
      if (isNaN(expiry.getTime())) {
        console.warn('⚠️ Format de date d\'expiration invalide');
        return false;
      }
    }

    console.log('✅ Validation des données d\'authentification réussie');
    return true;
  }

  /**
   * Persister les données d'authentification
   */
  private async persistAuthData(authData: AuthResponse): Promise<void> {
    try {
      // Validation des données avant sauvegarde
      if (!this.validateAuthData(authData)) {
        console.error('❌ Données d\'authentification invalides, sauvegarde annulée');
        return;
      }

      // Nettoyage et préparation des données
      const token = authData.token.trim();
      const userData = JSON.stringify(authData.user);
      const expiresAt = authData.expiresAt || '';

      // Vérifier que expiresAt n'est pas undefined avant de sauvegarder
      if (expiresAt === undefined) {
        console.warn('⚠️ expiresAt est undefined, utilisation d\'une chaîne vide');
      }

      await AsyncStorage.multiSet([
        [this.STORAGE_KEYS.AUTH_TOKEN, token],
        [this.STORAGE_KEYS.USER_DATA, userData],
        [this.STORAGE_KEYS.AUTH_EXPIRES, expiresAt]
      ]);
      console.info('💾 Données d\'authentification sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde auth:', error);
      // En cas d'erreur, nettoyer le stockage pour éviter la corruption
      await this.clearStoredAuth();
    }
  }

  /**
   * Nettoyer et réparer les données AsyncStorage corrompues
   */
  async repairStoredAuth(): Promise<void> {
    try {
      console.info('🔧 Tentative de réparation des données AsyncStorage...');
      
      // Récupérer toutes les clés d'authentification
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => key.startsWith('@iven_'));
      
      if (authKeys.length === 0) {
        console.info('ℹ️ Aucune donnée d\'authentification trouvée');
        return;
      }

      // Vérifier chaque clé et nettoyer si nécessaire
      for (const key of authKeys) {
        const value = await AsyncStorage.getItem(key);
        
        if (value === null || value === undefined || value === '') {
          console.warn(`⚠️ Clé corrompue détectée: ${key}, suppression...`);
          await AsyncStorage.removeItem(key);
        }
      }

      console.info('✅ Réparation des données AsyncStorage terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la réparation:', error);
      // En cas d'erreur, nettoyer complètement
      await this.clearStoredAuth();
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
            active: 1, // Maintenant confirmé (1 = actif)
            avatar_url: response.data.user.avatar_url,
            created_at: response.data.user.created_at || new Date().toISOString(),
            updated_at: response.data.user.updated_at || new Date().toISOString(),
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
        const isConfirmed = response.data.user.active === 1;
        
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
   * Synchroniser le stockage local avec les données utilisateur actuelles
   */
  async syncLocalStorage(): Promise<boolean> {
    try {
      if (!this.currentUser || !this.authToken) {
        console.warn('⚠️ Impossible de synchroniser: utilisateur ou token manquant');
        return false;
      }

      const authData = {
        token: this.authToken,
        user: this.currentUser,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
      };

      await this.persistAuthData(authData);
      console.info('💾 Stockage local synchronisé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur synchronisation stockage local:', error);
      return false;
    }
  }

  /**
   * Restaurer la session depuis le stockage local (fallback)
   */
  async restoreFromLocalStorage(): Promise<boolean> {
    try {
      console.info('📱 Tentative de restauration depuis le stockage local...');
      
      const token = await AsyncStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
      const storedUserData = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      
      if (!token || !storedUserData) {
        console.info('ℹ️ Aucune donnée locale disponible pour la restauration');
        return false;
      }
      
      const localUser = JSON.parse(storedUserData);
      
      // Vérifier que les données utilisateur sont valides
      if (!localUser || !localUser.email || !localUser.fname || !localUser.lname) {
        console.warn('⚠️ Données utilisateur locales incomplètes');
        return false;
      }
      
      // Restaurer la session
      this.currentUser = localUser;
      this.authToken = token;
      apiService.setAuthToken(token);
      
      console.info('✅ Session restaurée depuis le stockage local:', localUser.email);
      return true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la restauration locale:', error);
      return false;
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
    return this.currentUser?.active === 1;
  }


}

// Instance singleton
export const authService = new AuthService();