import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../../styles';
import Text from '../../../../components/ui/atoms/Text';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Header from '../../../../components/ui/organisms/Header';
import Badge from '../../../../components/ui/atoms/Badge';
import Avatar from '../../../../components/ui/atoms/Avatar';
import { EventParticipantWithDetails } from '../../../../types/events';
import { eventService } from '../../../../services/EventService';
import { useAuth } from '../../../../contexts/AuthContext';

export default function EventParticipantsScreen() {
  console.log('🚀 EventParticipantsScreen rendu');
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);
  
  console.log('📱 Paramètres:', { id, userId: user?.id });
  
  const [participants, setParticipants] = useState<EventParticipantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Récupérer les participants de l'événement
  const fetchParticipants = async () => {
    if (!id || !user?.id) {
      setError('ID d\'événement ou utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventId = Number(id);
      console.log('🔍 Récupération des participants de l\'événement:', eventId);
      
      // Récupérer les participants
      const participantsResponse = await eventService.getEventParticipants(eventId);
      if (!participantsResponse.success || !participantsResponse.data) {
        throw new Error(participantsResponse.error || 'Impossible de récupérer les participants');
      }

      const participantsList = participantsResponse.data.participants || [];
      setParticipants(participantsList);
      
      // Vérifier si l'utilisateur actuel est le propriétaire
      const currentUserParticipant = participantsList.find((p: EventParticipantWithDetails) => p.user_id === user.id);
      setIsOwner(currentUserParticipant?.role === 'owner');
      
      console.log('✅ Participants récupérés:', participantsList);
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des participants:', error);
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [id, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchParticipants();
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

  const handleRemoveParticipant = (participantId: number, participantName: string) => {
    if (!isOwner) {
      Alert.alert('Accès refusé', 'Seul le propriétaire peut retirer des participants.');
      return;
    }

    Alert.alert(
      'Retirer le participant',
      `Êtes-vous sûr de vouloir retirer ${participantName} de cet événement ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: () => removeParticipant(participantId)
        }
      ]
    );
  };

  const removeParticipant = async (participantId: number) => {
    try {
      const eventId = Number(id);
      const response = await eventService.removeParticipant(eventId, participantId);
      
      if (response.success) {
        Alert.alert('Succès', 'Participant retiré avec succès');
        // Rafraîchir la liste
        fetchParticipants();
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de retirer le participant');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la suppression');
    }
  };

  const handleAddParticipant = () => {
    if (!isOwner) {
      Alert.alert('Accès refusé', 'Seul le propriétaire peut ajouter des participants.');
      return;
    }
    
    // Navigation vers la modal d'ajout de participant
    router.push(`/modals/add-participant?id=${id}`);
  };

  if (loading) {
    console.log('🔄 État de chargement affiché');
    return (
      <SafeAreaView style={[themedStyles.surface, layoutStyles.center]}>
        <View style={layoutStyles.center}>
          <Ionicons name="people-outline" size={48} color={theme.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: spacing[3] }}>
            Chargement des participants...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    console.log('❌ État d\'erreur affiché:', error);
    return (
      <SafeAreaView style={[themedStyles.surface, layoutStyles.center]}>
        <View style={layoutStyles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.error} />
          <Text variant="body" color="error" style={{ marginTop: spacing[3], textAlign: 'center' }}>
            {error}
          </Text>
          <Button 
            title="Réessayer" 
            onPress={fetchParticipants}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </SafeAreaView>
    );
  }

  console.log('✅ Affichage du contenu principal avec', participants.length, 'participants');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        title="Participants"
        showBack={true}
        onBack={() => router.back()}
        rightAction={isOwner ? {
          icon: 'add',
          onPress: handleAddParticipant
        } : undefined}
      />

      <ScrollView 
        style={{ flex: 1, paddingTop: spacing[8] }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: spacing[5] }}>
          {/* Statistiques */}


          {/* Liste des participants */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Liste des participants
            </Text>
          </View>

          {participants.length > 0 ? (
            <View style={layoutStyles.gap3}>
              {participants.map((participant) => (
                <TouchableOpacity
                  key={`participant-${participant.user_id}`}
                  onPress={() => router.push(`/modals/participant-details?eventId=${id}&participantId=${participant.user_id}`)}
                >
                  <Card variant="elevated" padding="medium">
                    <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                      <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                        {/* Avatar */}
                        <Avatar
                          size="medium"
                          fallback={participant.fname && participant.lname ? 
                            `${participant.fname.charAt(0)}${participant.lname.charAt(0)}` : 
                            participant.username.charAt(0).toUpperCase()
                          }
                          style={{ marginRight: spacing[4] }}
                        />
                        
                        {/* Informations du participant */}
                        <View style={{ flex: 1 }}>
                          <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[1] }]}>
                            <Text variant="body" weight="semibold" numberOfLines={1}>
                              {participant.fname && participant.lname ? 
                                `${participant.fname} ${participant.lname}` : 
                                participant.username
                              }
                            </Text>
                            {participant.user_id === user?.id && (
                              <Badge 
                                text="Vous" 
                                color={theme.success}
                                style={{ marginLeft: spacing[2] }}
                              />
                            )}
                          </View>
                          
                          <Text variant="small" color="secondary" numberOfLines={1}>
                            @{participant.username}
                          </Text>
                          
                          <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[2] }]}>
                            <Ionicons 
                              name={getRoleIcon(participant.role) as any} 
                              size={14} 
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
                        </View>
                      </View>
                      
                      {/* Actions */}
                      {isOwner && participant.role !== 'owner' && (
                        <TouchableOpacity
                          onPress={() => handleRemoveParticipant(participant.user_id, participant.username)}
                          style={{
                            padding: spacing[2],
                            borderRadius: spacing[2],
                            backgroundColor: theme.error + '15'
                          }}
                        >
                          <Ionicons name="remove-circle-outline" size={20} color={theme.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[8] }}>
              <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                <Ionicons name="people-outline" size={48} color={theme.textSecondary} />
                <Text variant="body" color="secondary" style={{ marginTop: spacing[3], textAlign: 'center' }}>
                  Aucun participant pour le moment
                </Text>
                {isOwner && (
                  <TouchableOpacity 
                    style={{ marginTop: spacing[3] }}
                    onPress={handleAddParticipant}
                  >
                    <Text variant="small" color="primary">
                      Inviter des participants
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          )}

          {/* Bouton de retour */}
          <View style={{ marginTop: spacing[6], marginBottom: spacing[8] }}>
            <Button
              title="Retour à l'événement"
              onPress={() => router.back()}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
