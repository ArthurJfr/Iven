import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/atoms/Avatar';
import Badge from '../../components/ui/atoms/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { invitationService, UserSearchResult, CreateInvitationRequest } from '../../services/InvitationService';

const { width } = Dimensions.get('window');

export default function AddParticipantModal() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);

  // Debug: Vérifier l'eventId
  console.log('🎯 EventId récupéré:', eventId);
  console.log('🎯 Type de eventId:', typeof eventId);

  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserSearchResult[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Debug: Surveiller les changements d'état
  useEffect(() => {
    console.log('📊 État availableUsers changé:', availableUsers.length);
  }, [availableUsers]);
  
  useEffect(() => {
    console.log('📊 État filteredUsers changé:', filteredUsers.length);
  }, [filteredUsers]);
  
  // Suppression du filtrage local - la recherche se fait maintenant via l'API

  // Rechercher des utilisateurs via l'API
  const searchUsers = async (query: string) => {
    if (query.trim().length < 2) {
      setAvailableUsers([]);
      setFilteredUsers([]);
      return;
    }

    try {
      setSearching(true);
      console.log('🔍 Début de la recherche pour:', query);
      console.log('📋 Paramètres de recherche:', { q: query.trim(), eventId: Number(eventId), excludeParticipants: true });
      
      const response = await invitationService.searchUsers({
        q: query.trim(),
        event_id: Number(eventId),
        excludeParticipants: true
      });

      console.log('📡 Réponse API reçue:', response);

      if (response.success && response.data) {
        console.log('✅ Recherche réussie, utilisateurs trouvés:', response.data.length);
        
        // Filtrer les utilisateurs déjà invités
        const filteredUsers = response.data.filter(user => 
          !selectedUsers.some(selected => selected.id === user.id)
        );
        
        console.log('🔒 Utilisateurs après filtrage des sélectionnés:', filteredUsers.length);
        
        console.log('📝 Mise à jour des états avec', filteredUsers.length, 'utilisateurs');
        setAvailableUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        console.log('✅ États mis à jour');
      } else {
        console.error('❌ Erreur lors de la recherche:', response.error);
        console.error('❌ Détails de la réponse:', response);
        setAvailableUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      setAvailableUsers([]);
      setFilteredUsers([]);
    } finally {
      setSearching(false);
    }
  };

  // Recherche avec debounce
  useEffect(() => {
    console.log('🔍 useEffect déclenché avec searchText:', searchText);
    console.log('🔍 Longueur searchText:', searchText.trim().length);
    
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout déclenché après 500ms');
      if (searchText.trim().length >= 2) {
        console.log('✅ Appel de searchUsers avec:', searchText);
        searchUsers(searchText);
      } else if (searchText.trim() === '') {
        console.log('🗑️ Reset des utilisateurs (recherche vide)');
        setAvailableUsers([]);
        setFilteredUsers([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const toggleUser = (user: UserSearchResult) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const isUserSelected = (userId: number) => {
    return selectedUsers.some(user => user.id === userId);
  };

  const handleSendInvitations = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Sélection requise', 'Veuillez sélectionner au moins un utilisateur à inviter');
      return;
    }

    try {
      setInviting(true);
      
      let successCount = 0;
      let errorCount = 0;

      for (const user of selectedUsers) {
        try {
          const invitationData: CreateInvitationRequest = {
            event_id: Number(eventId),
            user_id: user.id,
            message: invitationMessage.trim() || undefined
          };

          const response = await invitationService.inviteUser(Number(eventId), invitationData);
          
          if (response.success) {
            successCount++;
            console.log(`✅ Invitation envoyée à ${user.username}`);
          } else {
            errorCount++;
            console.error(`❌ Échec de l'invitation à ${user.username}:`, response.error);
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Erreur lors de l'invitation à ${user.username}:`, error);
        }
      }

      // Afficher le résumé
      let message = `${successCount} invitation(s) envoyée(s) avec succès !`;
      if (errorCount > 0) {
        message += `\n${errorCount} échec(s).`;
      }

      Alert.alert(
        successCount > 0 ? 'Succès' : 'Erreur', 
        message, 
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi des invitations:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'envoyer les invitations');
    } finally {
      setInviting(false);
    }
  };

  const getUserDisplayName = (user: UserSearchResult) => {
    if (user.fname && user.lname) {
      return `${user.fname} ${user.lname}`;
    }
    return user.username;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View 
          style={{ 
            flex: 1, 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}
        >
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: theme.border
          }}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{
                padding: spacing[2],
                borderRadius: spacing[2]
              }}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <Text variant="h3" weight="semibold">
              Inviter des participants
            </Text>
            
            <View style={{ width: 40 }} />
          </View>

          {/* Contenu */}
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing[8] }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingHorizontal: spacing[5] }}>
              {/* Recherche */}
              <View style={{ marginBottom: spacing[6] }}>
                <Text variant="body" weight="semibold" style={{ marginBottom: spacing[3] }}>
                  Rechercher des utilisateurs
                </Text>
                <Input
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Nom, email ou nom d'utilisateur..."
                  leftIcon="search-outline"
                  rightIcon={searching ? "sync" : undefined}
                />
                {searchText.trim().length > 0 && searchText.trim().length < 2 && (
                  <Text variant="small" color="secondary" style={{ marginTop: spacing[2] }}>
                    Tapez au moins 2 caractères pour rechercher
                  </Text>
                )}
              </View>

              {/* Message personnalisé */}
              {selectedUsers.length > 0 && (
                <View style={{ marginBottom: spacing[6] }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: spacing[3]
                  }}>
                    <Text variant="body" weight="semibold">
                      Message d'invitation (optionnel)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowMessageInput(!showMessageInput)}
                      style={{
                        padding: spacing[2],
                        borderRadius: spacing[2],
                        backgroundColor: theme.backgroundSecondary
                      }}
                    >
                      <Ionicons 
                        name={showMessageInput ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={theme.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {showMessageInput && (
                    <Input
                      value={invitationMessage}
                      onChangeText={setInvitationMessage}
                      placeholder="Ajoutez un message personnalisé à votre invitation..."
                      multiline
                      numberOfLines={3}
                      inputStyle={{ minHeight: 80 }}
                    />
                  )}
                </View>
              )}

              {/* Utilisateurs sélectionnés */}
              {selectedUsers.length > 0 && (
                <View style={{ marginBottom: spacing[6] }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    Utilisateurs à inviter ({selectedUsers.length})
                  </Text>
                  <View style={layoutStyles.gap2}>
                    {selectedUsers.map(user => (
                      <Card key={`selected-${user.id}`} variant="elevated" padding="small">
                        <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                          <Avatar
                            size="small"
                            fallback={getUserDisplayName(user).charAt(0).toUpperCase()}
                            style={{ marginRight: spacing[3] }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text variant="body" weight="semibold">
                              {getUserDisplayName(user)}
                            </Text>
                            <Text variant="small" color="secondary">
                              @{user.username}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => toggleUser(user)}
                            style={{
                              padding: spacing[2],
                              borderRadius: spacing[2],
                              backgroundColor: theme.error + '15'
                            }}
                          >
                            <Ionicons name="remove-circle-outline" size={20} color={theme.error} />
                          </TouchableOpacity>
                        </View>
                      </Card>
                    ))}
                  </View>
                </View>
              )}

              {/* Liste des utilisateurs disponibles */}
              <View>
                <Text variant="body" weight="semibold" style={{ marginBottom: spacing[3] }}>
                  Utilisateurs disponibles ({filteredUsers.length})
                </Text>
                
                {searching && (
                  <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text variant="body" color="secondary" style={{ marginTop: spacing[3] }}>
                      Recherche en cours...
                    </Text>
                  </View>
                )}
                
                {!searching && filteredUsers.length > 0 && (
                  <View style={layoutStyles.gap3}>
                    {filteredUsers.map(user => (
                      <TouchableOpacity
                        key={user.id}
                        onPress={() => toggleUser(user)}
                      >
                        <Card 
                          variant={isUserSelected(user.id) ? "elevated" : "outlined"} 
                          padding="medium"
                          style={{
                            borderColor: isUserSelected(user.id) ? theme.primary : theme.border,
                            backgroundColor: isUserSelected(user.id) ? theme.primary + '05' : 'transparent'
                          }}
                        >
                          <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                            <Avatar
                              size="medium"
                              fallback={getUserDisplayName(user).charAt(0).toUpperCase()}
                              style={{ marginRight: spacing[4] }}
                            />
                            
                            <View style={{ flex: 1 }}>
                              <Text variant="body" weight="semibold">
                                {getUserDisplayName(user)}
                              </Text>
                              <Text variant="small" color="secondary">
                                @{user.username}
                              </Text>
                              <Text variant="small" color="secondary">
                                {user.email}
                              </Text>
                            </View>
                            
                            {isUserSelected(user.id) && (
                              <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: theme.primary,
                                ...layoutStyles.center
                              }}>
                                <Ionicons name="checkmark" size={16} color="white" />
                              </View>
                            )}
                          </View>
                        </Card>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {!searching && searchText.trim() === '' && (
                  <Card variant="outlined" padding="medium">
                    <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                      <Ionicons name="search-outline" size={32} color={theme.textSecondary} />
                      <Text variant="body" color="secondary" style={{ marginTop: spacing[3], textAlign: 'center' }}>
                        Commencez à taper pour rechercher des utilisateurs
                      </Text>
                    </View>
                  </Card>
                )}
                
                {!searching && searchText.trim() !== '' && filteredUsers.length === 0 && (
                  <Card variant="outlined" padding="medium">
                    <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                      <Ionicons name="search-outline" size={32} color={theme.textSecondary} />
                      <Text variant="body" color="secondary" style={{ marginTop: spacing[3], textAlign: 'center' }}>
                        Aucun utilisateur trouvé pour cette recherche
                      </Text>
                    </View>
                  </Card>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Boutons d'action */}
          <View style={{
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background
          }}>
            <View style={[layoutStyles.row, { gap: spacing[3] }]}>
              <Button
                title="Annuler"
                onPress={() => router.back()}
                variant="secondary"
                style={{ flex: 1 }}
                disabled={inviting}
              />
              <Button
                title={inviting ? 'Envoi...' : `Envoyer (${selectedUsers.length})`}
                onPress={handleSendInvitations}
                style={{ flex: 1 }}
                disabled={selectedUsers.length === 0 || inviting}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 