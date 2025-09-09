import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/organisms/Header';
import Avatar from '../../components/ui/atoms/Avatar';
import { SearchBar, EmptyState } from '../../components/ui';
import Input from '../../components/ui/Input';
import { invitationService, UserSearchResult } from '../../services/InvitationService';
import { eventService } from '../../services/EventService';
import { User } from '../../types/users';

export default function AddParticipantModal() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Rechercher des utilisateurs
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearching(true);
      console.log('🔍 Recherche d\'utilisateurs:', query);
      
      const response = await invitationService.searchUsers({
        q: query,
        event_id: eventId ? Number(eventId) : undefined,
        excludeParticipants: true
      });
      
      if (response.success && response.data) {
        console.log('✅ Résultats de recherche:', response.data);
        setSearchResults(response.data);
        setHasSearched(true);
      } else {
        console.error('❌ Erreur lors de la recherche:', response.error);
        setSearchResults([]);
        setHasSearched(true);
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la recherche d\'utilisateurs:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  }, [eventId]);

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  // Sélectionner/désélectionner un utilisateur
  const toggleUserSelection = (searchedUser: UserSearchResult) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === searchedUser.id);
      if (isSelected) {
        return prev.filter(u => u.id !== searchedUser.id);
      } else {
        return [...prev, searchedUser];
      }
    });
  };

  // Vérifier si un utilisateur est sélectionné
  const isUserSelected = (userId: number) => {
    return selectedUsers.some(u => u.id === userId);
  };

  // Inviter les participants sélectionnés
  const inviteSelectedParticipants = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Aucune sélection', 'Veuillez sélectionner au moins un utilisateur à inviter.');
      return;
    }

    if (!eventId) {
      Alert.alert('Erreur', 'ID d\'événement manquant.');
      return;
    }

    try {
      setAdding(true);
      const eventIdNum = Number(eventId);
      
      console.log('📧 Envoi d\'invitations pour l\'événement:', eventIdNum);
      
      // Inviter chaque utilisateur sélectionné
      const invitePromises = selectedUsers.map(selectedUser => 
        invitationService.inviteUser(eventIdNum, {
          eventId: eventIdNum, // Ajout de l'eventId dans le body comme votre API l'attend
          userId: selectedUser.id,
          message: invitationMessage.trim() || undefined
        })
      );
      
      const results = await Promise.allSettled(invitePromises);
      
      // Compter les succès et échecs
      const successes = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;
      
      const failures = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      ).length;
      
      if (successes > 0) {
        const message = failures > 0 
          ? `${successes} invitation(s) envoyée(s) avec succès. ${failures} échec(s).`
          : `${successes} invitation(s) envoyée(s) avec succès !`;
          
        Alert.alert('Succès', message, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Erreur', 'Impossible d\'envoyer les invitations. Vérifiez que les utilisateurs ne sont pas déjà invités.');
      }
      
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi des invitations:', error);
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'envoi des invitations');
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Inviter des participants"
        showBack
        onBack={() => router.back()}
        rightAction={selectedUsers.length > 0 && !adding ? {
          icon: 'mail',
          onPress: inviteSelectedParticipants
        } : undefined}
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, paddingHorizontal: spacing[5], paddingTop: spacing[4] }}>
          {/* Barre de recherche */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un utilisateur..."
            onSearch={() => searchUsers(searchQuery)}
            containerStyle={{ marginBottom: spacing[3] }}
          />

          {/* Message d'invitation optionnel */}
          <Input
            label="Message d'invitation (optionnel)"
            placeholder="Ajoutez un message personnalisé..."
            value={invitationMessage}
            onChangeText={setInvitationMessage}
            multiline
            numberOfLines={2}
            containerStyle={{ marginBottom: spacing[4] }}
          />

          {/* Utilisateurs sélectionnés */}
          {selectedUsers.length > 0 && (
            <View style={{ marginBottom: spacing[4] }}>
              <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
                Sélectionnés ({selectedUsers.length})
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: spacing[4] }}
              >
                {selectedUsers.map((selectedUser) => (
                  <TouchableOpacity
                    key={`selected-${selectedUser.id}`}
                    onPress={() => toggleUserSelection(selectedUser)}
                    style={{
                      alignItems: 'center',
                      marginRight: spacing[3],
                      padding: spacing[2],
                      borderRadius: 12,
                      backgroundColor: theme.primary + '15',
                      borderWidth: 1,
                      borderColor: theme.primary,
                      minWidth: 80
                    }}
                  >
                    <Avatar
                      size="small"
                      fallback={selectedUser.fname && selectedUser.lname ? 
                        `${selectedUser.fname.charAt(0)}${selectedUser.lname.charAt(0)}` : 
                        selectedUser.username.charAt(0).toUpperCase()
                      }
                      style={{ marginBottom: spacing[1] }}
                    />
                    <Text variant="caption" style={{ textAlign: 'center' }} numberOfLines={1}>
                      {selectedUser.fname || selectedUser.username}
                    </Text>
                    <View style={{
                      position: 'absolute',
                      top: -spacing[1],
                      right: -spacing[1],
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: theme.error,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Ionicons name="close" size={12} color="white" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Résultats de recherche */}
          <View style={{ flex: 1 }}>
            {searching ? (
              <View style={[layoutStyles.center, { flex: 1 }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text variant="body" color="secondary" style={{ marginTop: spacing[3] }}>
                  Recherche en cours...
                </Text>
              </View>
            ) : hasSearched && searchResults.length === 0 ? (
              <EmptyState
                icon="person-outline"
                title="Aucun utilisateur trouvé"
                description={searchQuery.trim() ? 
                  `Aucun résultat pour "${searchQuery}"` : 
                  "Tapez pour rechercher des utilisateurs"
                }
              />
            ) : searchResults.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
                  Résultats ({searchResults.length})
                </Text>
                <View style={{ gap: spacing[2] }}>
                  {searchResults.map((searchedUser) => {
                    const isSelected = isUserSelected(searchedUser.id);
                    const isCurrentUser = searchedUser.id === user?.id;
                    
                    return (
                      <TouchableOpacity
                        key={`result-${searchedUser.id}`}
                        onPress={() => !isCurrentUser && toggleUserSelection(searchedUser)}
                        disabled={isCurrentUser}
                        style={{ opacity: isCurrentUser ? 0.5 : 1 }}
                      >
                        <Card 
                          variant={isSelected ? "elevated" : "outlined"} 
                          padding="medium"
                          style={{
                            borderColor: isSelected ? theme.primary : theme.border,
                            borderWidth: isSelected ? 2 : 1,
                            backgroundColor: isSelected ? theme.primary + '10' : theme.background
                          }}
                        >
                          <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                            <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                              <Avatar
                                size="medium"
                                fallback={searchedUser.fname && searchedUser.lname ? 
                                  `${searchedUser.fname.charAt(0)}${searchedUser.lname.charAt(0)}` : 
                                  searchedUser.username.charAt(0).toUpperCase()
                                }
                                style={{ marginRight: spacing[3] }}
                              />
                              
                              <View style={{ flex: 1 }}>
                                <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[1] }]}>
                                  <Text variant="body" weight="semibold" numberOfLines={1}>
                                    {searchedUser.fname && searchedUser.lname ? 
                                      `${searchedUser.fname} ${searchedUser.lname}` : 
                                      searchedUser.username
                                    }
                                  </Text>
                                  {isCurrentUser && (
                                    <Text variant="caption" color="secondary" style={{ marginLeft: spacing[2] }}>
                                      (Vous)
                                    </Text>
                                  )}
                                </View>
                                
                                <Text variant="small" color="secondary" numberOfLines={1}>
                                  @{searchedUser.username}
                                </Text>
                                
                                {!searchedUser.active && (
                                  <Text variant="caption" color="warning" style={{ marginTop: spacing[1] }}>
                                    Compte non activé
                                  </Text>
                                )}
                              </View>
                            </View>
                            
                            {!isCurrentUser && (
                              <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: isSelected ? theme.primary : theme.border,
                                backgroundColor: isSelected ? theme.primary : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {isSelected && (
                                  <Ionicons name="checkmark" size={14} color="white" />
                                )}
                              </View>
                            )}
                          </View>
                        </Card>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <EmptyState
                icon="search-outline"
                title="Rechercher des utilisateurs"
                description="Tapez le nom d'utilisateur, prénom ou nom de famille pour trouver des personnes à inviter"
              />
            )}
          </View>

          {/* Bouton d'ajout fixe */}
          {selectedUsers.length > 0 && (
            <View style={{ 
              paddingTop: spacing[4], 
              paddingBottom: spacing[2],
              backgroundColor: theme.background,
              borderTopWidth: 1,
              borderTopColor: theme.border
            }}>
              <Button
                title={adding ? 
                  `Envoi en cours...` : 
                  `Inviter ${selectedUsers.length} participant(s)`
                }
                onPress={inviteSelectedParticipants}
                disabled={adding}
                variant="primary"
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
