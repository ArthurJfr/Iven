import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useEventContext } from '../../../contexts/EventContext';
import Card from '../../../components/ui/Card';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { eventService } from '../../../services/EventService';
import { Event } from '../../../types/events';
import { RefreshControl } from 'react-native';  
import Header from '../../../components/ui/organisms/Header';
import { spacing } from '../../../styles';
import { EventList, EventFilters, EventStats } from '../../../components/features/events';

export default function EventsListScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { events, setEvents } = useEventContext(); // Utiliser le contexte
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Toutes');

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

  // Fonction de gestion des changements de filtre optimisée
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // Événements filtrés selon le filtre actif
  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'À venir':
        return events.filter(event => new Date(event.start_date) > new Date());
      case 'En cours':
        return events.filter(event => {
          const now = new Date();
          const start = new Date(event.start_date);
          const end = new Date(event.end_date);
          return now >= start && now <= end;
        });
      case 'Terminés':
        return events.filter(event => new Date(event.end_date) < new Date());
      default:
        return events;
    }
  }, [events, activeFilter]);

  // Filtres disponibles avec compteurs
  const filters = useMemo(() => [
    { key: 'Toutes', label: 'Toutes', icon: 'apps-outline', count: events.length },
    { key: 'À venir', label: 'À venir', icon: 'time-outline', count: events.filter(e => new Date(e.start_date) > new Date()).length },

    { key: 'Terminés', label: 'Terminés', icon: 'checkmark-circle-outline', count: events.filter(e => new Date(e.end_date) < new Date()).length }
  ], [events]);

  // Fonction de gestion des clics sur les événements optimisée
  const handleEventPress = useCallback((event: Event) => {
    router.push(`/events/${event.id}`);
  }, [router]);

  // Fonction de rafraîchissement (pull-to-refresh) optimisée
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserEvents();
    setRefreshing(false);
  }, []);

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
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: spacing[8] }}>
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
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: spacing[8] }}>
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

        {/* Contenu principal avec composants optimisés */}
        <View style={{ flex: 1, paddingTop: spacing[8] }}>
          {/* Statistiques des événements */}
          
          {/* Filtres des événements */}
          <EventFilters
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            compact={false}
          />
          
          {/* Liste des événements optimisée */}
          <EventList 
            style={{ paddingTop: spacing[8] }}
            events={filteredEvents}
            onEventPress={handleEventPress}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            loading={loading}
            compact={true}
            showLocation={true}
            showParticipants={true}
          />
        </View>
      </View>
    </ProtectedRoute>
  );
}

