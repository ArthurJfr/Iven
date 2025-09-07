import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useEventContext } from '../../../../contexts/EventContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../../styles';
import Text from '../../../../components/ui/atoms/Text';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Header from '../../../../components/ui/organisms/Header';
import Badge from '../../../../components/ui/atoms/Badge';
import { Event, EventParticipantWithDetails } from '../../../../types/events';
import { Task } from '../../../../types/tasks';
import { eventService } from '../../../../services/EventService';
import { taskService, TaskService } from '../../../../services/TaskService';
import { useAuth } from '../../../../contexts/AuthContext';

interface EnrichedEvent extends Event {
  participants: EventParticipantWithDetails[];
  tasks: Task[];
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { events, getEventById, updateEvent, removeEvent } = useEventContext(); // Utiliser le contexte
  const themedStyles = createThemedStyles(theme);
  
  const [event, setEvent] = useState<EnrichedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'événement et ses données associées
  const fetchEventData = async () => {
    if (!id || !user?.id) {
      setError('ID d\'événement ou utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventId = Number(id);
      console.log('🔍 Récupération des données de l\'événement:', eventId);
      
      // Récupérer l'événement principal
      const eventResponse = await eventService.getEventById(eventId);
      if (!eventResponse.success || !eventResponse.data) {
        throw new Error(eventResponse.error || 'Impossible de récupérer l\'événement');
      }

      // Récupérer les participants
      const participantsResponse = await eventService.getEventParticipants(eventId);
      const participants = participantsResponse.success ? participantsResponse.data?.participants || [] : [];

      // Récupérer les tâches
      const tasksResponse = await taskService.getTasksByEventId(eventId);
      const tasks = tasksResponse.success ? tasksResponse.data || [] : [];

      // Construire l'événement enrichi
      const enrichedEvent: EnrichedEvent = {
        ...eventResponse.data,
        participants,
        tasks
      };

      setEvent(enrichedEvent);
      console.log('✅ Données de l\'événement récupérées:', enrichedEvent);
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des données:', error);
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, user?.id]);

  const getStatusConfig = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { text: 'À venir', color: theme.primary, icon: 'time-outline' };
    } else if (now >= start && now <= end) {
      return { text: 'En cours', color: theme.warning, icon: 'play-circle-outline' };
    } else {
      return { text: 'Terminé', color: theme.success, icon: 'checkmark-circle-outline' };
    }
  };

  const getParticipantStatusColor = (status: string): string => {
    switch (status) {
      case 'owner': return theme.primary;
      case 'participant': return theme.success;
      default: return theme.textSecondary;
    }
  };

  // Actions principales (mises en avant)
  const primaryActions = [
    { 
      title: 'Tâches', 
      icon: 'checkbox-outline', 
      route: `/events/${id}/tasks`, 
      color: '#3B82F6',
      description: 'Gérer les tâches à faire',
             count: `${event?.tasks?.filter(t => !t.validated_by).length || 0} en cours`
    },
    { 
      title: 'Budget', 
      icon: 'wallet-outline', 
      route: `/events/${id}/budget`, 
      color: '#10B981',
      description: 'Suivre les dépenses',
      count: 'Gérer le budget'
    },
    { 
      title: 'Chat', 
      icon: 'chatbubble-outline', 
      route: `/events/${id}/chat`, 
      color: '#F59E0B',
      description: 'Discussion en temps réel',
      count: 'Ouvrir le chat'
    },
  ];

  // Actions secondaires
  const secondaryActions = [
    { title: 'Médias', icon: 'images-outline', route: `/events/${id}/media`, color: '#8B5CF6' },
    { title: 'Gérer', icon: 'settings-outline', route: `/modals/update-event?id=${id}`, color: '#6B7280' },
  ];

  // Affichage du chargement
  if (loading) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
        <Header title="Événement" showBack />
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: 16 }}>
            Chargement de l'événement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Affichage de l'erreur
  if (error || !event) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
        <Header title="Événement" showBack />
        <View style={[layoutStyles.center, { flex: 1, paddingHorizontal: 20 }]}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
          <Text variant="h3" weight="semibold" style={{ color: theme.text, marginTop: 16, textAlign: 'center' }}>
            Erreur de chargement
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 8, textAlign: 'center', marginBottom: 24 }}>
            {error || 'Impossible de charger l\'événement'}
          </Text>
          <Button 
            title="Réessayer" 
            onPress={fetchEventData}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(event.start_date, event.end_date);

  const isOwner = user?.id === event.owner_id;

  const handleDeleteEvent = () => {
    if (!id) return;
    Alert.alert(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await eventService.deleteEvent(Number(id));
              if (response.success) {
                removeEvent(Number(id));
                Alert.alert('Succès', "Événement supprimé", [
                  { text: 'OK', onPress: () => router.replace('/events') }
                ]);
              } else {
                Alert.alert('Erreur', response.error || "Impossible de supprimer l'événement");
              }
            } catch (e) {
              Alert.alert('Erreur', 'Erreur lors de la suppression');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header
        title={event.title}
        showBack
        rightAction={isOwner ? {
          icon: "trash",
          onPress: handleDeleteEvent
        } : undefined}
        onBack={() => router.back()}
      />

      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchEventData} />
        }
      >
        <View style={{ paddingHorizontal: spacing[5] }}>
          {/* Section Informations avec titre */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Informations
            </Text>
            <TouchableOpacity onPress={() => router.push(`/modals/update-event?id=${id}`)}>
              <Text variant="caption" color="primary">
                Modifier
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card unique avec toutes les informations */}
          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4] }]}>
              <Badge 
                text="Événement" 
                color={theme.primary}
              />
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name={statusConfig.icon as any} size={16} color={statusConfig.color} />
                <Text variant="caption" style={{ color: statusConfig.color, marginLeft: spacing[1] }}>
                  {statusConfig.text}
                </Text>
              </View>
            </View>

            {/* Description */}
            {event.description && (
              <Text variant="body" color="secondary" style={{ lineHeight: 22, marginBottom: spacing[4] }}>
                {event.description}
              </Text>
            )}

            <View style={[layoutStyles.gap4]}>
              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Date de début</Text>
                </View>
                                 <Text variant="body" weight="semibold">
                   {TaskService.formatDateTime(event.start_date)}
                 </Text>
              </View>

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Date de fin</Text>
                </View>
                                 <Text variant="body" weight="semibold">
                   {TaskService.formatDateTime(event.end_date)}
                 </Text>
              </View>

              {event.location && (
                <View style={[layoutStyles.rowBetween]}>
                  <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                    <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
                    <Text variant="body" style={{ marginLeft: spacing[2] }}>Lieu</Text>
                  </View>
                  <Text variant="body" weight="semibold" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>
              )}

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Participants</Text>
                </View>
                <Text variant="body" weight="semibold">
                  {event.participants?.length || 0}
                </Text>
              </View>
            </View>
          </Card>

          {/* Section Participants */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Participants
            </Text>
            <TouchableOpacity onPress={() => router.push(`/events/${id}/participants`)}>
              <Text variant="caption" color="primary">
                Voir tous
              </Text>
            </TouchableOpacity>
          </View>

          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            {event.participants && event.participants.length > 0 ? (
              <View style={[layoutStyles.gap3]}>
                {event.participants.slice(0, 5).map((participant) => (
                  <View key={`participant-${participant.user_id}`} style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                    <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                      <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: getParticipantStatusColor(participant.role) + '20',
                        ...layoutStyles.center,
                        marginRight: spacing[2]
                      }}>
                                                 <Ionicons 
                           name={participant.role === 'owner' ? 'star' : 'person'} 
                           size={16} 
                           color={getParticipantStatusColor(participant.role)} 
                         />
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <Text variant="body" weight="semibold">
                          {participant.fname} {participant.lname}
                        </Text>
                        <Text variant="small" color="secondary">
                          {participant.role === 'owner' ? 'Organisateur' : 'Participant'}
                        </Text>
                      </View>
                    </View>
                    
                                         <Badge 
                       text={participant.role === 'owner' ? 'Propriétaire' : 'Participant'} 
                       color={getParticipantStatusColor(participant.role)}
                     />
                  </View>
                ))}
                
                {event.participants.length > 5 && (
                  <TouchableOpacity 
                    style={{ alignItems: 'center', paddingTop: spacing[2] }}
                    onPress={() => router.push(`/events/${id}/participants`)}
                  >
                    <Text variant="small" color="primary">
                      Voir tous les {event.participants.length} participants
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={[layoutStyles.center, { paddingVertical: spacing[4] }]}>
                <Ionicons name="people-outline" size={32} color={theme.textSecondary} />
                <Text variant="body" color="secondary" style={{ marginTop: spacing[2], textAlign: 'center' }}>
                  Aucun participant pour le moment
                </Text>
              </View>
            )}
          </Card>

          {/* Section Prochaines tâches */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Prochaines tâches
            </Text>
            <TouchableOpacity onPress={() => router.push(`/events/${id}/tasks`)}>
              <Text variant="caption" color="primary">
                Voir toutes
              </Text>
            </TouchableOpacity>
          </View>

          {/* Liste des tâches */}
          {event.tasks && event.tasks.length > 0 ? (
            <View style={[layoutStyles.gap3, { marginBottom: spacing[8] }]}>
                             {event.tasks
                 .filter(task => !task.validated_by)
                 .slice(0, 3)
                 .map((task, index) => (
                  <TouchableOpacity key={`task-${task.id}-${index}`} onPress={() => router.push(`/tasks/${task.id}`)}>
                    <Card variant="elevated" padding="medium">
                      <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                        <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                                                     <View style={{
                             width: 40,
                             height: 40,
                             borderRadius: 20,
                             backgroundColor: TaskService.getValidationColor(task.validated_by || null) + '15',
                             ...layoutStyles.center,
                             marginRight: spacing[3]
                           }}>
                             <Ionicons 
                               name={TaskService.getValidationIcon(task.validated_by || null) as any} 
                               size={20} 
                               color={TaskService.getValidationColor(task.validated_by || null)} 
                             />
                           </View>
                          
                          <View style={{ flex: 1 }}>
                            <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                              {task.title}
                            </Text>
                            {task.description && (
                              <Text variant="small" color="secondary" numberOfLines={2}>
                                {task.description}
                              </Text>
                            )}
                            
                            <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[1] }]}>
                              <View style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                                                 backgroundColor: TaskService.getValidationColor(task.validated_by || null),
                                marginRight: spacing[1]
                              }} />
                                                             <Text variant="small" style={{ color: TaskService.getValidationColor(task.validated_by || null) }}>
                                 {task.validated_by ? 'Validé' : 'Non validé'}
                               </Text>
                            </View>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
            </View>
          ) : (
            <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[8] }}>
              <View style={[layoutStyles.center, { paddingVertical: spacing[4] }]}>
                <Ionicons name="checkbox-outline" size={32} color={theme.textSecondary} />
                <Text variant="body" color="secondary" style={{ marginTop: spacing[2], textAlign: 'center' }}>
                  Aucune tâche pour le moment
                </Text>
                <TouchableOpacity 
                  style={{ marginTop: spacing[3] }}
                  onPress={() => router.push(`/modals/create-task?eventId=${id}`)}
                >
                  <Text variant="small" color="primary">
                    Créer une première tâche
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Section Gestion - actions restantes intégrées */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Gestion
            </Text>
            <TouchableOpacity onPress={() => router.push(`/modals/update-event?id=${id}`)}>
              <Text variant="caption" color="primary">
                Modifier
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[layoutStyles.gap4, { marginBottom: spacing[8] }]}>
            {primaryActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(action.route as any)}
              >
                <Card variant="elevated" padding="medium">
                  <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                    <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                      <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: action.color + '15',
                        ...layoutStyles.center,
                        marginRight: spacing[4]
                      }}>
                        <Ionicons name={action.icon as any} size={24} color={action.color} />
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                          {action.title}
                        </Text>
                        <Text variant="small" color="secondary">
                          {action.description}
                        </Text>
                        <Text variant="small" style={{ color: action.color, marginTop: spacing[1] }}>
                          {action.count}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Action "Gérer" intégrée dans la section Gestion */}
            <TouchableOpacity onPress={() => router.push(`/modals/update-event?id=${id}`)}>
              <Card variant="outlined" padding="medium">
                <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                  <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: '#6B7280' + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[4]
                    }}>
                      <Ionicons name="settings-outline" size={24} color="#6B7280" />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                        Paramètres avancés
                      </Text>
                      <Text variant="small" color="secondary">
                        Configuration et permissions
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 