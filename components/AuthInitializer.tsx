import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
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

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      const inTabsGroup = segments[0] === '(tabs)';
      
      console.log('🧭 Navigation check:', { 
        isAuthenticated, 
        inAuthGroup, 
        inTabsGroup, 
        currentSegment: segments[0],
        user: isAuthenticated ? 'Connecté' : 'Non connecté',
        serviceUser: authService.getCurrentUser()?.email || 'Null',
        serviceToken: authService.getAuthToken() ? 'Présent' : 'Absent'
      });
      
      // Ajouter un délai pour éviter les redirections trop rapides
      const navigationTimeout = setTimeout(() => {
        if (isAuthenticated && inAuthGroup) {
          // Utilisateur connecté mais sur une page d'auth → rediriger vers l'app
          console.log('🔀 Redirection vers l\'app (utilisateur connecté)');
          router.replace('/(tabs)');
        } else if (!isAuthenticated && inTabsGroup) {
          // Utilisateur non connecté mais sur l'app → rediriger vers login
          console.log('🔀 Redirection vers login (utilisateur non connecté)');
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
          console.log('📨 Récupération des invitations...');
          const response = await invitationService.getUserInvitations();
          
          if (response.success && response.data) {
            setInvitations(response.data);
            
            // Vérifier s'il y a des invitations en attente
            const pendingInvitations = response.data.filter(inv => inv.status === 'pending');
            if (pendingInvitations.length > 0) {
              console.log(`📨 ${pendingInvitations.length} invitation(s) en attente`);
            } else {
              console.log('📨 Aucune invitation en attente');
            }
          } else {
            console.log('📨 Aucune invitation trouvée ou erreur:', response.message);
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