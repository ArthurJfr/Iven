import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/organisms/Header';
import Badge from '../../components/ui/atoms/Badge';
import Avatar from '../../components/ui/atoms/Avatar';
import { EventParticipantWithDetails } from '../../types/events';
import { User } from '../../services/UserService';
import { userService } from '../../services/UserService';
import { useAuth } from '../../contexts/AuthContext';

export default function ParticipantDetailsModal() {
  const router = useRouter();
  const { eventId, participantId } = useLocalSearchParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);
  
  const [participant, setParticipant] = useState<EventParticipantWithDetails | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Récupérer les détails du participant et de l'utilisateur
  const fetchParticipantDetails = async () => {
    if (!eventId || !participantId || !user?.id) {
      setError('Paramètres manquants');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventIdNum = Number(eventId);
      const participantIdNum = Number(participantId);
      
      console.log('🔍 Récupération des détails du participant:', { eventId: eventIdNum, participantId: participantIdNum });
      
      // 1. Récupérer les détails de l'utilisateur via l'API
      const userResponse = await userService.getUserById(participantIdNum);
      if (!userResponse.success || !userResponse.data) {
        throw new Error(userResponse.error || 'Impossible de récupérer les détails de l\'utilisateur');
      }
      
      setUserDetails(userResponse.data);
      
      // 2. Construire l'objet participant avec les données de l'utilisateur
      const participantData: EventParticipantWithDetails = {
        id: participantIdNum,
        event_id: eventIdNum,
        user_id: participantIdNum,
        role: 'participant', // TODO: Récupérer le vrai rôle depuis l'API des participants
        joined_at: new Date().toISOString(), // TODO: Récupérer la vraie date depuis l'API
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: userResponse.data.username,
        email: userResponse.data.email,
        fname: userResponse.data.fname || '',
        lname: userResponse.data.lname || ''
      };
      
      setParticipant(participantData);
      setIsCurrentUser(participantData.user_id === user.id);
      
      // TODO: Vérifier si l'utilisateur actuel est le propriétaire de l'événement
      setIsOwner(true); // Temporaire
      
      console.log('✅ Détails récupérés:', { participant: participantData, user: userResponse.data });
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des détails:', error);
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantDetails();
  }, [eventId, participantId, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchParticipantDetails();
    setRefreshing(false);
  };

  const getRoleColor = (role: string): string => {
    return role === 'owner' ? theme.primary : theme.textSecondary;
  };

  const getRoleIcon = (role: string): string => {
    return role === 'owner' ? 'star' : 'person';
  };

  const getRoleLabel = (role: string): string => {
    return role === 'owner' ? 'Propriétaire' : 'Participant';
  };

  const handleRemoveParticipant = () => {
    if (!isOwner) {
      Alert.alert('Accès refusé', 'Seul le propriétaire peut retirer des participants.');
      return;
    }

    if (isCurrentUser) {
      Alert.alert('Action impossible', 'Vous ne pouvez pas vous retirer vous-même.');
      return;
    }

    Alert.alert(
      'Retirer le participant',
      `Êtes-vous sûr de vouloir retirer ${participant?.fname} ${participant?.lname} de cet événement ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: () => removeParticipant()
        }
      ]
    );
  };

  const removeParticipant = async () => {
    try {
      // TODO: Appel API pour retirer le participant
      console.log('Retrait du participant:', participant?.user_id);
      
      Alert.alert('Succès', 'Participant retiré avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de retirer le participant');
    }
  };

  const handleChangeRole = () => {
    if (!isOwner) {
      Alert.alert('Accès refusé', 'Seul le propriétaire peut modifier les rôles.');
      return;
    }

    Alert.alert(
      'Changer le rôle',
      'Fonctionnalité à implémenter',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: spacing[3] }}>
            Chargement des détails...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !participant || !userDetails) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.error} />
          <Text variant="body" color="error" style={{ marginTop: spacing[3], textAlign: 'center' }}>
            {error || 'Utilisateur non trouvé'}
          </Text>
          <Button 
            title="Réessayer" 
            onPress={fetchParticipantDetails}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        title="Détails du participant"
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView 
        style={{ flex: 1, paddingTop: spacing[8] }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: spacing[5] }}>
          {/* En-tête du participant */}
          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[6] }}>
            <View style={[layoutStyles.center, { marginBottom: spacing[4] }]}>
              {/* <Avatar
                size="xlarge"
                fallback={userDetails.fname && userDetails.lname ? 
                  `${userDetails.fname.charAt(0)}${userDetails.lname.charAt(0)}` : 
                  userDetails.username.charAt(0).toUpperCase()
                }
                style={{ marginBottom: spacing[4] }}
              /> */}
              
              <Text variant="h2" weight="bold" style={{ marginBottom: spacing[2] }}>
                {userDetails.fname && userDetails.lname ? 
                  `${userDetails.fname} ${userDetails.lname}` : 
                  userDetails.username
                }
              </Text>
              
              <Text variant="body" color="secondary" style={{ marginBottom: spacing[3] }}>
                @{userDetails.username}
              </Text>
              
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons 
                  name={getRoleIcon(participant.role) as any} 
                  size={16} 
                  color={getRoleColor(participant.role)} 
                />
                <Text 
                  variant="caption" 
                  style={{ 
                    color: getRoleColor(participant.role), 
                    marginLeft: spacing[1] 
                  }}
                >
                  {getRoleLabel(participant.role)}
                </Text>
              </View>
              
              {isCurrentUser && (
                <Badge 
                  text="Vous" 
                  color={theme.success}
                  style={{ marginTop: spacing[3] }}
                />
              )}
            </View>
          </Card>

          {/* Informations de contact */}
          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
              Informations de contact
            </Text>
            
            <View style={layoutStyles.gap4}>
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                <Text variant="body" style={{ marginLeft: spacing[3] }}>
                  {userDetails.email}
                </Text>
              </View>
              
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                <Text variant="body" style={{ marginLeft: spacing[3] }}>
                  @{userDetails.username}
                </Text>
              </View>
              
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="shield-outline" size={20} color={theme.textSecondary} />
                <Text variant="body" style={{ marginLeft: spacing[3] }}>
                  Statut: {userDetails.active ? 'Actif' : 'Inactif'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Informations de participation */}
          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
              Participation à l'événement
            </Text>
            
            <View style={layoutStyles.gap4}>
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                <Text variant="body" style={{ marginLeft: spacing[3] }}>
                  A rejoint le
                </Text>
                <Text variant="body" weight="semibold" style={{ marginLeft: spacing[2] }}>
                  {new Date(participant.joined_at).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                <Text variant="body" style={{ marginLeft: spacing[3] }}>
                  À
                </Text>
                <Text variant="body" weight="semibold" style={{ marginLeft: spacing[2] }}>
                  {new Date(participant.joined_at).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
          </Card>

          {/* Actions */}
          {isOwner && !isCurrentUser && (
            <View style={{ marginBottom: spacing[6] }}>
              <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
                Actions
              </Text>
              
              <View style={layoutStyles.gap3}>
                <Button
                  title="Changer le rôle"
                  onPress={handleChangeRole}
                  variant="outline"
                />
                
                <Button
                  title="Retirer du participant"
                  onPress={handleRemoveParticipant}
                  variant="secondary"
                  style={{ backgroundColor: theme.error + '15' }}
                />
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
