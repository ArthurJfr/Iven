import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/AuthService';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingToken: boolean; // Nouveau : pour indiquer si on vérifie le token
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(false); // Nouveau état

  const isAuthenticated = !!(user && authService.getAuthToken());

  const initialize = async () => {
    try {
      setIsLoading(true);
      setIsCheckingToken(true); // Commencer la vérification du token
      const sessionRestored = await authService.initialize();
      
      if (sessionRestored) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erreur initialisation AuthContext:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsCheckingToken(false); // Terminer la vérification du token
    }
  };

  const login = async (userData: User, token: string) => {
    // Mettre à jour authService aussi pour maintenir la synchronisation
    authService.setCurrentUser(userData);
    authService.setAuthToken(token);
    
    // Persister la session
    const authData = {
      token,
      user: userData,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    };
    
    // Utiliser la méthode privée de persistance (on va l'exposer)
    await authService.persistSession(authData);
    
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('❌ Erreur logout AuthContext:', error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isCheckingToken, // Inclure le nouvel état
    login,
    logout,
    updateUser,
    initialize
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;