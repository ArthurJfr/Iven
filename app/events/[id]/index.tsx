import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../components/ui/Card';
import { useTheme } from '../../../contexts/ThemeContext';
import { themedStyles } from '../../../styles/global';
import eventsData from '../../../data/events.json';

const { width } = Dimensions.get('window');

// Interfaces pour le typage TypeScript
interface EventParticipant {
  id: number;
  name: string;
  status: 'accepted' | 'pending' | 'declined';
}

interface EventTask {
  id: number;
  title: string;
  completed: boolean;
}

interface EventBudget {
  total: number;
  spent: number;
  remaining: number;
}

interface EnrichedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: string;
  description: string;
  organizer: string;
  category: string;
  type: string;
  latitude: number;
  longitude: number;
  // Propriétés enrichies
  participantsList: EventParticipant[];
  tasks: EventTask[];
  budget: EventBudget;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const [event, setEvent] = useState<EnrichedEvent | null>(null);

  useEffect(() => {
    // Trouver l'événement correspondant à l'ID
    const foundEvent = eventsData.find(e => e.id === id);
    if (foundEvent) {
      // Enrichir les données avec des informations supplémentaires pour l'affichage
      const enrichedEvent: EnrichedEvent = {
        ...foundEvent,
        participantsList: [
          { id: 1, name: foundEvent.organizer, status: "accepted" },
          { id: 2, name: "Participant 1", status: "pending" },
          { id: 3, name: "Participant 2", status: "accepted" }
        ],
        tasks: [
          { id: 1, title: "Préparer l'événement", completed: false },
          { id: 2, title: "Confirmer le lieu", completed: true }
        ],
        budget: {
          total: Math.floor(foundEvent.participants * 10), // Budget basé sur le nb de participants
          spent: Math.floor(foundEvent.participants * 6),
          remaining: Math.floor(foundEvent.participants * 4)
        }
      };
      setEvent(enrichedEvent);
    }
  }, [id]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'accepted': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'upcoming': return '🔜 À venir';
      case 'ongoing': return '🔄 En cours';
      case 'completed': return '✅ Terminé';
      case 'cancelled': return '❌ Annulé';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'anniversaire': return '🎂';
      case 'entreprise': return '🏢';
      case 'formation': return '📚';
      case 'vacances': return '🏖️';
      case 'loisirs': return '🎮';
      case 'sport': return '⚽';
      case 'voyage': return '✈️';
      case 'fête': return '🎉';
      default: return '📅';
    }
  };

  // Afficher un loader si l'événement n'est pas encore chargé
  if (!event) {
    return (
      <View style={[localStyles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.textMd, { color: theme.text }]}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={localStyles.scrollContainer}>
      <View style={[localStyles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.titleSm, localStyles.centerText, { color: theme.text }]}>
          {getCategoryIcon(event.category)} {event.title}
        </Text>
        <Text style={[styles.textSm, localStyles.description, { color: theme.text }]}>
          {event.description}
        </Text>
        <View style={localStyles.statusContainer}>
          <Text style={[styles.textXs, localStyles.statusText, { color: theme.text }]}>
            {getStatusText(event.status)}
          </Text>
          <Text style={[styles.textXs, localStyles.typeText, { 
            color: event.type === 'pro' ? '#3B82F6' : '#10B981' 
          }]}>
            {event.type === 'pro' ? '💼 Professionnel' : '👥 Personnel'}
          </Text>
        </View>
      </View>

      <View style={localStyles.content}>
        <Card style={localStyles.section}>
          <Text style={[styles.subtitle, localStyles.centerText, { color: theme.text }]}>
            Détails de l'événement
          </Text>
          <View style={localStyles.detailRow}>
            <Text style={[styles.textSm, localStyles.label]}>📅 Date :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.date}
            </Text>
          </View>
          <View style={localStyles.detailRow}>
            <Text style={[styles.textSm, localStyles.label]}>🕐 Heure :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.time}
            </Text>
          </View>
          <View style={localStyles.detailRow}>
            <Text style={[styles.textSm, localStyles.label]}>📍 Lieu :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.location}
            </Text>
          </View>
          <View style={localStyles.detailRow}>
            <Text style={[styles.textSm, localStyles.label]}>👨‍💼 Organisateur :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.organizer}
            </Text>
          </View>
          <View style={localStyles.detailRow}>
            <Text style={[styles.textSm, localStyles.label]}>👥 Participants :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.participants}/{event.maxParticipants}
            </Text>
          </View>
        </Card>

        <Card style={localStyles.section}>
          <Text style={[styles.subtitle, localStyles.centerText, { color: theme.text }]}>
            Participants récents
          </Text>
          {event.participantsList.map((participant: EventParticipant) => (
            <View key={participant.id} style={localStyles.participantRow}>
              <Text style={[styles.textSm, localStyles.participantName, { color: theme.text }]}>
                {participant.name}
              </Text>
              <View style={[localStyles.statusBadge, { backgroundColor: getStatusColor(participant.status) }]}>
                <Text style={localStyles.statusBadgeText}>
                  {participant.status === 'accepted' ? 'Accepté' : 
                   participant.status === 'pending' ? 'En attente' : 'Refusé'}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        <Card style={localStyles.section}>
          <Text style={[styles.subtitle, localStyles.centerText, { color: theme.text }]}>
            💰 Budget estimé
          </Text>
          <View style={localStyles.budgetRow}>
            <Text style={[styles.textSm, localStyles.label]}>Total :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: theme.text }]}>
              {event.budget.total}€
            </Text>
          </View>
          <View style={localStyles.budgetRow}>
            <Text style={[styles.textSm, localStyles.label]}>Dépensé :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: '#EF4444' }]}>
              {event.budget.spent}€
            </Text>
          </View>
          <View style={localStyles.budgetRow}>
            <Text style={[styles.textSm, localStyles.label]}>Restant :</Text>
            <Text style={[styles.textSm, localStyles.value, { color: '#10B981' }]}>
              {event.budget.remaining}€
            </Text>
          </View>
        </Card>

        <View style={localStyles.actionGrid}>
          <TouchableOpacity 
            style={[localStyles.actionCard, { backgroundColor: theme.background }]}
            onPress={() => router.push(`/events/${id}/tasks`)}
          >
            <Ionicons name="checkbox-outline" size={24} color={theme.text} />
            <Text style={[styles.textSm, localStyles.actionText, { color: theme.text }]}>
              Tâches
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[localStyles.actionCard, { backgroundColor: theme.background }]}
            onPress={() => router.push(`/events/${id}/budget`)}
          >
            <Ionicons name="wallet-outline" size={24} color={theme.text} />
            <Text style={[styles.textSm, localStyles.actionText, { color: theme.text }]}>
              Budget
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[localStyles.actionCard, { backgroundColor: theme.background }]}
            onPress={() => router.push(`/events/${id}/media`)}
          >
            <Ionicons name="images-outline" size={24} color={theme.text} />
            <Text style={[styles.textSm, localStyles.actionText, { color: theme.text }]}>
              Médias
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[localStyles.actionCard, { backgroundColor: theme.background }]}
            onPress={() => router.push(`/events/${id}/chat`)}
          >
            <Ionicons name="chatbubble-outline" size={24} color={theme.text} />
            <Text style={[styles.textSm, localStyles.actionText, { color: theme.text }]}>
              Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[localStyles.actionCard, { backgroundColor: theme.background }]}
            onPress={() => router.push(`/events/${id}/manage`)}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
            <Text style={[styles.textSm, localStyles.actionText, { color: theme.text }]}>
              Gérer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = {
  scrollContainer: {
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    padding: 16,
  },
  centerText: {
    textAlign: 'center' as const,
  },
  description: {
    lineHeight: 22,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  statusText: {
    fontWeight: '500' as const,
  },
  typeText: {
    fontWeight: '600' as const,
  },
  section: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    color: '#6B7280',
    fontWeight: '500' as const,
    flex: 1,
  },
  value: {
    fontWeight: '500' as const,
    textAlign: 'right' as const,
    flex: 1,
  },
  participantRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  participantName: {
    fontWeight: '500' as const,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center' as const,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500' as const,
  },
  budgetRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-around' as const,
    paddingVertical: 16,
    gap: 12,
  },
  actionCard: {
    width: (width - 48) / 2,
    minWidth: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '500' as const,
    marginTop: 8,
    textAlign: 'center' as const,
  },
}; 