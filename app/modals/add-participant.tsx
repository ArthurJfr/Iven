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

const { width } = Dimensions.get('window');

interface User {
  id: number;
  username: string;
  email: string;
  fname?: string;
  lname?: string;
}

export default function AddParticipantModal() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

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

    // Charger la liste des utilisateurs disponibles
    loadAvailableUsers();
  }, []);

  useEffect(() => {
    // Filtrer les utilisateurs selon la recherche
    if (searchText.trim() === '') {
      setFilteredUsers(availableUsers);
    } else {
      const filtered = availableUsers.filter(user => 
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        (user.fname && user.fname.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.lname && user.lname.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, availableUsers]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par un vrai appel API pour récupérer tous les utilisateurs
      // Pour l'instant, on utilise des données mockées
      const mockUsers: User[] = [
        { id: 1, username: 'alice_martin', email: 'alice@example.com', fname: 'Alice', lname: 'Martin' },
        { id: 2, username: 'bob_dupont', email: 'bob@example.com', fname: 'Bob', lname: 'Dupont' },
        { id: 3, username: 'claire_leblanc', email: 'claire@example.com', fname: 'Claire', lname: 'Leblanc' },
        { id: 4, username: 'david_leroy', email: 'david@example.com', fname: 'David', lname: 'Leroy' },
        { id: 5, username: 'emma_roux', email: 'emma@example.com', fname: 'Emma', lname: 'Roux' },
      ];
      
      setAvailableUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      Alert.alert('Erreur', 'Impossible de charger la liste des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (user: User) => {
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

  const handleAddParticipants = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Sélection requise', 'Veuillez sélectionner au moins un participant');
      return;
    }

    try {
      setSearching(true);
      
      // TODO: Remplacer par de vrais appels API
      // Pour chaque utilisateur sélectionné, l'ajouter à l'événement
      for (const user of selectedUsers) {
        console.log(`Ajout du participant ${user.username} à l'événement ${eventId}`);
        // await eventService.addParticipant(Number(eventId), user.id, 'participant');
      }

      Alert.alert(
        'Succès', 
        `${selectedUsers.length} participant(s) ajouté(s) avec succès !`, 
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout des participants:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'ajouter les participants');
    } finally {
      setSearching(false);
    }
  };

  const getUserDisplayName = (user: User) => {
    if (user.fname && user.lname) {
      return `${user.fname} ${user.lname}`;
    }
    return user.username;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: spacing[3] }}>
            Chargement des utilisateurs...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              Ajouter des participants
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
                />
              </View>

              {/* Utilisateurs sélectionnés */}
              {selectedUsers.length > 0 && (
                <View style={{ marginBottom: spacing[6] }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    Participants sélectionnés ({selectedUsers.length})
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
                
                {filteredUsers.length > 0 ? (
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
                ) : (
                  <Card variant="outlined" padding="medium">
                    <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                      <Ionicons name="search-outline" size={32} color={theme.textSecondary} />
                      <Text variant="body" color="secondary" style={{ marginTop: spacing[3], textAlign: 'center' }}>
                        {searchText.trim() === '' 
                          ? 'Aucun utilisateur disponible' 
                          : 'Aucun utilisateur trouvé pour cette recherche'
                        }
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
              />
              <Button
                title={`Ajouter (${selectedUsers.length})`}
                onPress={handleAddParticipants}
                style={{ flex: 1 }}
                disabled={selectedUsers.length === 0 || searching}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 