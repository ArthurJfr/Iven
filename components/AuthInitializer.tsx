import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
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
  const { isAuthenticated, isLoading } = useAuth();

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
          Chargement...
        </Text>
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
});