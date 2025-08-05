import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../../styles';
import Text from '../../../../components/ui/atoms/Text';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Header from '../../../../components/ui/organisms/Header';
import Badge from '../../../../components/ui/atoms/Badge';
import { Event } from '../../../../types/events';
import eventsData from '../../../../data/events.json';
import categoriesData from '../../../../data/categories.json';

interface EventParticipant {
  id: number;
  name: string;
  status: 'accepted' | 'pending' | 'declined';
}

interface EnrichedEvent extends Event {
  participantsList: EventParticipant[];
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  type: string;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [event, setEvent] = useState<EnrichedEvent | null>(null);

  function convertDateFormat(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  useEffect(() => {
    const foundEvent = eventsData.find(e => e.id === id);
    if (foundEvent) {
      const enrichedEvent: EnrichedEvent = {
        ...foundEvent,
        date: convertDateFormat(foundEvent.date),
        status: foundEvent.status as "upcoming" | "ongoing" | "completed" | "cancelled",
        participantsList: [
          { id: 1, name: foundEvent.organizer, status: "accepted" },
          { id: 2, name: "Marie Dubois", status: "pending" },
          { id: 3, name: "Pierre Martin", status: "accepted" },
          { id: 4, name: "Sophie Bernard", status: "declined" },
          { id: 5, name: "Antoine Leroy", status: "accepted" },
          { id: 6, name: "Camille Rousseau", status: "pending" }
        ],
        budget: {
          total: Math.floor(foundEvent.participants * 25),
          spent: Math.floor(foundEvent.participants * 15),
          remaining: Math.floor(foundEvent.participants * 10)
        }
      };
      setEvent(enrichedEvent);
    }
  }, [id]);

  const getCategoryColor = (category: string): string => {
    const cat = categoriesData.find(c => c.name.toLowerCase() === category?.toLowerCase());
    return cat?.color || theme.primary;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming': return { text: 'À venir', color: theme.primary, icon: 'time-outline' };
      case 'ongoing': return { text: 'En cours', color: theme.warning, icon: 'play-circle-outline' };
      case 'completed': return { text: 'Terminé', color: theme.success, icon: 'checkmark-circle-outline' };
      case 'cancelled': return { text: 'Annulé', color: theme.error, icon: 'close-circle-outline' };
      default: return { text: status, color: theme.textSecondary, icon: 'help-circle-outline' };
    }
  };

  const getParticipantStatusColor = (status: string): string => {
    switch (status) {
      case 'accepted': return theme.success;
      case 'pending': return theme.warning;
      case 'declined': return theme.error;
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
      count: '3 en cours'
    },
    { 
      title: 'Budget', 
      icon: 'wallet-outline', 
      route: `/events/${id}/budget`, 
      color: '#10B981',
      description: 'Suivre les dépenses',
      count: `${event?.budget.spent || 0}€ / ${event?.budget.total || 0}€`
    },
    { 
      title: 'Chat', 
      icon: 'chatbubble-outline', 
      route: `/events/${id}/chat`, 
      color: '#F59E0B',
      description: 'Discussion en temps réel',
      count: '2 nouveaux messages'
    },
  ];

  // Actions secondaires
  const secondaryActions = [
    { title: 'Médias', icon: 'images-outline', route: `/events/${id}/media`, color: '#8B5CF6' },
    { title: 'Gérer', icon: 'settings-outline', route: `/events/${id}/manage`, color: '#6B7280' },
  ];

  if (!event) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
        <Header title="Événement" showBack />
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <Text variant="body" color="secondary">Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(event.status);

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header
        title={event.title}
        showBack
        rightAction={{
          icon: "ellipsis-horizontal",
          onPress: () => router.push(`/events/${id}/manage`)
        }}
      />

      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing[5] }}>
          {/* Section Informations avec titre */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Informations
            </Text>
            <TouchableOpacity>
              <Text variant="caption" color="primary">
                Modifier
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card unique avec toutes les informations */}
          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4] }]}>
              <Badge 
                text={event.category || 'Événement'} 
                color={getCategoryColor(event.category || '')}
              />
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name={statusConfig.icon as any} size={16} color={statusConfig.color} />
                <Text variant="caption" style={{ color: statusConfig.color, marginLeft: spacing[1] }}>
                  {statusConfig.text}
                </Text>
              </View>

            </View>
                      {/* Description */}
          <Text variant="body" color="secondary" style={{ lineHeight: 22, marginBottom: spacing[4] }}>
            {event.description}
          </Text>
            <View style={[layoutStyles.gap4]}>
              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Date</Text>
                </View>
                <Text variant="body" weight="semibold">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Heure</Text>
                </View>
                <Text variant="body" weight="semibold">{event.time}</Text>
              </View>

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Lieu</Text>
                </View>
                <Text variant="body" weight="semibold" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Organisateur</Text>
                </View>
                <Text variant="body" weight="semibold">{event.organizer}</Text>
              </View>

              <View style={[layoutStyles.rowBetween]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
                  <Text variant="body" style={{ marginLeft: spacing[2] }}>Participants</Text>
                </View>
                <Text variant="body" weight="semibold">
                  {event.participants}/{event.maxParticipants}
                </Text>
              </View>
            </View>
          </Card>

          {/* Section Prochaines tâches - MODIFIÉE */}
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

          {/* Liste des 3 prochaines tâches */}
          <View style={[layoutStyles.gap3, { marginBottom: spacing[8] }]}>
            {/* Tâche 1 - Priorité haute */}
            <TouchableOpacity onPress={() => router.push(`/events/${id}/tasks`)}>
              <Card variant="elevated" padding="medium">
                <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                  <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.error + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[3]
                    }}>
                      <Ionicons name="alert-circle-outline" size={20} color={theme.error} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                        Confirmer le traiteur
                      </Text>
                      <Text variant="small" color="secondary">
                        À faire avant le {new Date(Date.parse(event.date) - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </Text>
                      <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[1] }]}>
                        <View style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.error,
                          marginRight: spacing[1]
                        }} />
                        <Text variant="small" style={{ color: theme.error }}>
                          Priorité haute
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            {/* Tâche 2 - Priorité moyenne */}
            <TouchableOpacity onPress={() => router.push(`/events/${id}/tasks`)}>
              <Card variant="elevated" padding="medium">
                <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                  <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.warning + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[3]
                    }}>
                      <Ionicons name="musical-notes-outline" size={20} color={theme.warning} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                        Réserver le DJ
                      </Text>
                      <Text variant="small" color="secondary">
                        À faire avant le {new Date(Date.parse(event.date) - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </Text>
                      <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[1] }]}>
                        <View style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.warning,
                          marginRight: spacing[1]
                        }} />
                        <Text variant="small" style={{ color: theme.warning }}>
                          Priorité moyenne
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            {/* Tâche 3 - Priorité basse */}
            <TouchableOpacity onPress={() => router.push(`/events/${id}/tasks`)}>
              <Card variant="elevated" padding="medium">
                <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                  <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.success + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[3]
                    }}>
                      <Ionicons name="camera-outline" size={20} color={theme.success} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                        Préparer les décorations
                      </Text>
                      <Text variant="small" color="secondary">
                        À faire avant le {new Date(Date.parse(event.date) - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </Text>
                      <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[1] }]}>
                        <View style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.success,
                          marginRight: spacing[1]
                        }} />
                        <Text variant="small" style={{ color: theme.success }}>
                          Priorité basse
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          {/* Section Media - SIMPLIFIÉE */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Médias
            </Text>
            <TouchableOpacity onPress={() => router.push(`/events/${id}/media`)}>
              <Text variant="caption" color="primary">
                Voir plus
              </Text>
            </TouchableOpacity>
          </View>

          <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[6] }}>
            {/* Grid des 3 derniers médias */}
            <View style={[layoutStyles.row, layoutStyles.gap3, { marginBottom: spacing[4] }]}>
              <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={() => router.push(`/events/${id}/media`)}
              >
                <View style={{
                  aspectRatio: 1,
                  borderRadius: 8,
                  backgroundColor: theme.primaryLight,
                  ...layoutStyles.center,
                  overflow: 'hidden'
                }}>
                  <Ionicons name="image" size={32} color={theme.primary} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={() => router.push(`/events/${id}/media`)}
              >
                <View style={{
                  aspectRatio: 1,
                  borderRadius: 8,
                  backgroundColor: theme.warning + '20',
                  ...layoutStyles.center,
                  overflow: 'hidden'
                }}>
                  <Ionicons name="videocam" size={32} color={theme.warning} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={() => router.push(`/events/${id}/media`)}
              >
                <View style={{
                  aspectRatio: 1,
                  borderRadius: 8,
                  backgroundColor: theme.success + '20',
                  ...layoutStyles.center,
                  overflow: 'hidden'
                }}>
                  <Ionicons name="image" size={32} color={theme.success} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Stats photos et vidéos seulement */}
            <View style={[layoutStyles.gap3]}>
              <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="images-outline" size={16} color={theme.textSecondary} />
                  <Text variant="small" color="secondary" style={{ marginLeft: spacing[1] }}>
                    8 photos
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/events/${id}/media`)}>
                  <Text variant="small" color="primary">Parcourir</Text>
                </TouchableOpacity>
              </View>

              <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <Ionicons name="videocam-outline" size={16} color={theme.textSecondary} />
                  <Text variant="small" color="secondary" style={{ marginLeft: spacing[1] }}>
                    3 vidéos
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/events/${id}/media`)}>
                  <Text variant="small" color="primary">Regarder</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton d'ajout de média - MODIFIÉ */}
            <TouchableOpacity 
              onPress={() => router.push('/modals/media-upload')}
              style={{
                marginTop: spacing[4],
                paddingVertical: spacing[3],
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
                borderStyle: 'dashed',
                ...layoutStyles.center
              }}
            >
              <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
                <Text variant="body" color="primary" style={{ marginLeft: spacing[2] }}>
                  Ajouter des médias
                </Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Section Gestion - actions restantes intégrées */}
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Gestion
            </Text>
            <TouchableOpacity onPress={() => router.push(`/events/${id}/manage`)}>
              <Text variant="caption" color="primary">
                Tout gérer
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
            <TouchableOpacity onPress={() => router.push(`/events/${id}/manage`)}>
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