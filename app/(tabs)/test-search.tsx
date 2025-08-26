import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import { invitationService } from '../../services/InvitationService';
import Header from '../../components/ui/organisms/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import { UserSearchResult } from '../../services/InvitationService';

export default function TestSearchScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setError('Tapez au moins 2 caractères');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Test de recherche pour:', searchQuery);
      
      const response = await invitationService.searchUsers({
        q: searchQuery.trim(),
        event_id: 1, // Test avec event_id = 1
        excludeParticipants: true
      });

      console.log('📡 Réponse complète:', response);

      if (response.success && response.data) {
        setSearchResults(response.data);
        console.log('✅ Utilisateurs trouvés:', response.data.length);
      } else {
        setError(response.error || 'Erreur lors de la recherche');
        setSearchResults([]);
        console.error('❌ Erreur de recherche:', response);
      }
    } catch (error) {
      console.error('❌ Exception lors de la recherche:', error);
      setError('Erreur de connexion');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Header title="Test Recherche Utilisateurs" />
        
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: spacing[5] }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
              Test de la recherche d'utilisateurs
            </Text>
            
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tapez un nom d'utilisateur..."
              style={{ marginBottom: spacing[3] }}
            />
            
            <Button
              title={loading ? 'Recherche...' : 'Rechercher'}
              onPress={testSearch}
              disabled={loading || searchQuery.trim().length < 2}
              loading={loading}
              style={{ marginBottom: spacing[4] }}
            />

            {error && (
              <Card variant="outlined" padding="medium" style={{ marginBottom: spacing[4] }}>
                <Text variant="body" color="error" style={{ textAlign: 'center' }}>
                  ❌ {error}
                </Text>
              </Card>
            )}

            {searchResults.length > 0 && (
              <View style={styles.resultsSection}>
                <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
                  Résultats ({searchResults.length})
                </Text>
                
                <View style={styles.resultsList}>
                  {searchResults.map(user => (
                    <Card key={user.id} variant="elevated" padding="medium" style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[1] }}>
                          {user.fname && user.lname ? `${user.fname} ${user.lname}` : user.username}
                        </Text>
                        <Text variant="body" color="secondary" style={{ marginBottom: spacing[1] }}>
                          @{user.username}
                        </Text>
                        <Text variant="small" color="tertiary">
                          {user.email}
                        </Text>
                        <Text variant="small" color="tertiary">
                          Rôle: {user.role}
                        </Text>
                      </View>
                    </Card>
                  ))}
                </View>
              </View>
            )}

            {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && !error && (
              <Card variant="outlined" padding="medium">
                <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                  Aucun utilisateur trouvé pour "{searchQuery}"
                </Text>
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing[4],
  },
  resultsSection: {
    marginTop: spacing[4],
  },
  resultsList: {
    gap: spacing[3],
  },
  userCard: {
    marginBottom: 0,
  },
  userInfo: {
    flex: 1,
  },
});
