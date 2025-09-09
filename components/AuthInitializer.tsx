import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { invitationService, type Invitation } from '../services/InvitationService';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../styles';
import Spinner from './ui/atoms/Spinner';
import Text from './ui/atoms/Text';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Composant d'initialisation de l'authentification
 * Gère l'auto-login au démarrage et la navigation initiale
 */
export default function AuthInitializer({ children }: AuthInitializerProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, isCheckingToken } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Cacher le splash quand l'UI est prête (hook toujours déclaré)
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      const inTabsGroup = segments[0] === '(tabs)';
      
      // Ajouter un délai pour éviter les redirections trop rapides
      const navigationTimeout = setTimeout(() => {
        if (isAuthenticated && inAuthGroup) {
          // Utilisateur connecté mais sur une page d'auth → rediriger vers l'app
          router.replace('/(tabs)');
        } else if (!isAuthenticated && inTabsGroup) {
          // Utilisateur non connecté mais sur l'app → rediriger vers login
          router.replace('/(auth)/login');
        }
      }, 200); // Délai plus long pour stabilité

      return () => clearTimeout(navigationTimeout);
    }
  }, [isAuthenticated, isLoading, segments]);

  // Récupérer les invitations quand l'utilisateur est connecté
  useEffect(() => {
    const loadInvitations = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const response = await invitationService.getUserInvitations();
          
          if (response.success && response.data) {
            setInvitations(response.data);
            
            // Vérifier s'il y a des invitations en attente
            const pendingInvitations = response.data.filter(inv => inv.status === 'pending');
          } else {
            setInvitations([]);
          }
        } catch (error) {
          console.error('❌ Erreur lors de la récupération des invitations:', error);
          setInvitations([]);
        }
      }
    };

    loadInvitations();
  }, [isAuthenticated, isLoading]);

  // Afficher un écran de chargement pendant l'initialisation
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Spinner size="large" color={theme.primary} />
        <Text 
          variant="body" 
          color="secondary" 
          style={styles.loadingText}
        >
          {isCheckingToken ? 'Vérification de la connexion...' : 'Chargement...'}
        </Text>
        {isCheckingToken && (
          <Text 
            variant="caption" 
            color="tertiary" 
            style={styles.checkingText}
          >
            Vérification du token JWT en cours...
          </Text>
        )}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  loadingText: {
    marginTop: spacing[4],
    textAlign: 'center',
  },
  checkingText: {
    marginTop: spacing[2],
    textAlign: 'center',
    opacity: 0.7,
  },
});