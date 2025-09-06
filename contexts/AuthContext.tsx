import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/AuthService';
import type { User } from '../types/auth';

interface AuthContextType {
  // État de l'authentification
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingToken: boolean;
  
  // Actions d'authentification
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  initialize: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // État local
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  // État calculé
  const isAuthenticated = !!(user && authService.getAuthToken());

  /**
   * Initialise le contexte d'authentification au démarrage de l'application
   */
  const initialize = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setIsCheckingToken(true);
      
      console.info('🔄 Initialisation du contexte d\'authentification...');
      const sessionRestored = await authService.initialize();
      
      if (sessionRestored) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          console.info('✅ Session restaurée:', currentUser.email);
        }
      } else {
        setUser(null);
        console.info('ℹ️ Aucune session à restaurer');
      }
    } catch (error) {
      console.error('❌ Erreur initialisation AuthContext:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsCheckingToken(false);
    }
  }, []);

  /**
   * Connecte un utilisateur et persiste la session
   */
  const login = useCallback(async (userData: User, token: string): Promise<void> => {
    try {
      console.info('🔐 Connexion de l\'utilisateur:', userData.email);
      
      // Synchroniser avec le service d'authentification
      authService.setCurrentUser(userData);
      authService.setAuthToken(token);
      
      // Préparer les données de session
      const authData = {
        token,
        user: userData,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
      };
      
      // Persister la session
      await authService.persistSession(authData);
      
      // Mettre à jour l'état local
      setUser(userData);
      
      console.info('✅ Utilisateur connecté avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      throw error;
    }
  }, []);

  /**
   * Déconnecte l'utilisateur et nettoie la session
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.info('🔐 Déconnexion de l\'utilisateur...');
      await authService.logout();
      setUser(null);
      console.info('✅ Utilisateur déconnecté avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Force la déconnexion locale même en cas d'erreur
      setUser(null);
    }
  }, []);

  /**
   * Met à jour les données utilisateur
   */
  const updateUser = useCallback((userData: User): void => {
    console.info('🔄 Mise à jour des données utilisateur:', userData.email);
    authService.setCurrentUser(userData);
    setUser(userData);
  }, []);

  // Initialisation au montage du composant
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Mémorisation de la valeur du contexte pour éviter les re-renders inutiles
  const contextValue: AuthContextType = React.useMemo(() => ({
    // État
    user,
    isAuthenticated,
    isLoading,
    isCheckingToken,
    
    // Actions
    login,
    logout,
    updateUser,
    initialize
  }), [user, isAuthenticated, isLoading, isCheckingToken, login, logout, updateUser, initialize]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      'useAuth doit être utilisé à l\'intérieur d\'un AuthProvider. ' +
      'Assurez-vous que votre composant est enveloppé dans <AuthProvider>.'
    );
  }
  
  return context;
}

export default AuthContext;