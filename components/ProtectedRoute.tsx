import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { layoutStyles, spacing } from '../styles';
import Text from './ui/atoms/Text';
import Button from './ui/Button';
import { Ionicons } from '@expo/vector-icons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireConfirmed?: boolean;
  fallbackRoute?: string;
  showFallback?: boolean;
}

/**
 * Composant de protection des routes
 * Vérifie l'authentification et redirige si nécessaire
 */
export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireConfirmed = false,
  fallbackRoute = '/(auth)/login',
  showFallback = true
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Attendre le chargement
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContent}>
          <Ionicons name="hourglass-outline" size={48} color={theme.textSecondary} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Vérification...
          </Text>
        </View>
      </View>
    );
  }

  // Vérifier l'authentification
  if (requireAuth && !isAuthenticated) {
    if (!showFallback) {
      // Redirection silencieuse
      router.replace(fallbackRoute);
      return null;
    }

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="lock-closed" size={48} color={theme.primary} />
          </View>
          
          <Text variant="h2" weight="bold" style={[styles.title, { color: theme.text }]}>
            Connexion requise
          </Text>
          
          <Text variant="body" color="secondary" style={styles.message}>
            Vous devez être connecté pour accéder à cette page.
          </Text>
          
          <View style={styles.actions}>
            <Button
              title="Se connecter"
              onPress={() => router.replace(fallbackRoute)}
              style={styles.primaryButton}
            />
            
            <Button
              title="Retour"
              variant="outline"
              onPress={() => router.back()}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </View>
    );
  }

  // Vérifier la confirmation du compte
  if (requireConfirmed && user && !user.active) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.warning + '15' }]}>
            <Ionicons name="mail-unread" size={48} color={theme.warning} />
          </View>
          
          <Text variant="h2" weight="bold" style={[styles.title, { color: theme.text }]}>
            Compte non activé
          </Text>
          
          <Text variant="body" color="secondary" style={styles.message}>
            Votre compte ({user.email}) n'est pas encore activé. Veuillez confirmer votre adresse email.
          </Text>
          
          <View style={styles.actions}>
            <Button
              title="Activer mon compte"
              onPress={() => router.push({
                pathname: '/(auth)/confirm-account',
                params: { email: user.email, fromRoute: 'true' }
              })}
              style={styles.primaryButton}
            />
            
            <Button
              title="Retour"
              variant="outline"
              onPress={() => router.back()}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </View>
    );
  }

  // Accès autorisé
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing[3],
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: spacing[3],
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});