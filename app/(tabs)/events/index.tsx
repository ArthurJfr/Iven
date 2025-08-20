import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { eventService } from '../../../services/EventService';
import { Event } from '../../../types/events';
import { RefreshControl } from 'react-native';  
import Header from '../../../components/ui/organisms/Header';

export default function EventsListScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les événements de l'utilisateur connecté
  const fetchUserEvents = async () => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Récupération des événements pour l\'utilisateur:', user.id);
      
      // Appel à l'API pour récupérer les événements du participant
      const response = await eventService.getEventsByParticipantId(Number(user.id));
      
      if (response.success && response.data) {
        console.log('✅ Événements récupérés:', response.data);
        setEvents(response.data as unknown as Event[]);
      } else {
        console.error('❌ Erreur lors de la récupération des événements:', response.error);
        setError(response.error || 'Impossible de récupérer les événements');
        setEvents([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      setError('Erreur de connexion au serveur');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les événements au montage du composant
  useEffect(() => {
    fetchUserEvents();
  }, [user?.id]);

  // Fonction de rafraîchissement (pull-to-refresh)
  const handleRefresh = () => {
    fetchUserEvents();
  };

  // Affichage du chargement
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, color: theme.textSecondary }}>Chargement des événements...</Text>
        </View>
      </ProtectedRoute>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <Header
            title="Mes Événements"
            rightAction={{
              icon: "add-circle",
              onPress: () => router.push('/modals/create-event')
            }}
          />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginTop: 16, textAlign: 'center' }}>
              Erreur de chargement
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 8, textAlign: 'center', marginBottom: 24 }}>
              {error}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8
              }}
              onPress={handleRefresh}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  // Affichage de la liste vide
  if (events.length === 0) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <Header
            title="Mes Événements"
            rightAction={{
              icon: "add-circle",
              onPress: () => router.push('/modals/create-event')
            }}
          />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginTop: 16, textAlign: 'center' }}>
              Aucun événement
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 8, textAlign: 'center', marginBottom: 24 }}>
              Vous ne participez à aucun événement pour le moment.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8
              }}
              onPress={() => router.push('/modals/create-event')}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Créer un événement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <Header
          title="Mes Événements"
          rightAction={{
            icon: "add-circle",
            onPress: () => router.push('/modals/create-event')
          }}
        />

        {/* Liste des événements */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        >
          {events.map(event => (
            <Card
              key={event.id}
              style={{ marginBottom: 12 }}
              variant="elevated"
              padding="medium"
              onPress={() => router.push(`/events/${event.id}`)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, color: theme.text }}>{event.title}</Text>
                <View style={{
                  backgroundColor: theme.primaryDark,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: '#FFF', fontSize: 12 }}>{event.status || 'upcoming'}</Text>
                </View>
              </View>
              
              {event.description && (
                <Text style={{ color: theme.textSecondary, marginBottom: 8, lineHeight: 20 }}>
                  {event.description}
                </Text>
              )}
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>
                  {event.startDate ? new Date(event.startDate).toLocaleDateString('fr-FR') : 'Date non définie'}
                </Text>
              </View>
              
              {event.location && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>{event.location}</Text>
                </View>
              )}
              
              {event.participants && event.participants.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>
                    {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

