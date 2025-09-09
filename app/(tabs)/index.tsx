import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useEventContext } from '../../contexts/EventContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Header from '../../components/ui/organisms/Header';
import Avatar from '../../components/ui/atoms/Avatar';
import { EventCard } from '../../components/features/events';
import { HomeStats, HomeActions, HomeUpcomingEvents, HomeSettings } from '../../components/features/home';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/EventService';
import { taskService } from '../../services/TaskService';
import { Event } from '../../types/events';
import { Task } from '../../types/tasks';
import { useNotifications } from '../../hooks/useNotifications';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { events, setEvents } = useEventContext(); // Utiliser le contexte des événements
  const themedStyles = createThemedStyles(theme);

  // Utiliser le contexte d'authentification
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    eventsThisMonth: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Charger les données en parallèle
      await Promise.all([
        loadUserEvents(),
        loadUserTasks(),
        calculateStats()
      ]);
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Charger les événements de l'utilisateur
  const loadUserEvents = async () => {
    if (!user?.id) return;
    
    try {
      const response = await eventService.getEventsByParticipantId(Number(user.id));
      if (response.success && response.data) {
        // Filtrer les événements à venir (ce mois)
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        const eventsThisMonth = response.data.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
        });
        
        // Ajouter les participants à chaque événement avant de les stocker
        const eventsWithParticipants = await Promise.all(eventsThisMonth.map(async (event) => {
          const participantsResponse = await eventService.getEventParticipants(event.id);
          return {
            ...event,
            participants: participantsResponse.success ? participantsResponse.data.participants : []
          };
        }));

        setUpcomingEvents(eventsWithParticipants.slice(0, 2)); // Garder seulement 2 événements
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des événements:', error);
    }
  };

  // Charger les tâches de l'utilisateur
  const loadUserTasks = async () => {
    if (!user?.id) return;
    
    try {
      const response = await taskService.getTasksByParticipantId(Number(user.id));
      if (response.success && response.data) {
        setUserTasks(response.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des tâches:', error);
    }
  };

  // Calculer les statistiques
  const calculateStats = async () => {
    if (!user?.id) return;
    
    try {
      // Événements ce mois
      const eventsResponse = await eventService.getEventsByParticipantId(Number(user.id));
      const eventsThisMonth = eventsResponse.success && eventsResponse.data ? 
        eventsResponse.data.filter(event => {
          const eventDate = new Date(event.start_date);
          const now = new Date();
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
        }).length : 0;

      // Tâches en attente (non validées)
      const tasksResponse = await taskService.getTasksByParticipantId(Number(user.id));
      const pendingTasks = tasksResponse.success && tasksResponse.data ? 
        tasksResponse.data.filter(task => !task.validated_by).length : 0;

      // Tâches validées (terminées)
      const completedTasks = tasksResponse.success && tasksResponse.data ? 
        tasksResponse.data.filter(task => task.validated_by).length : 0;

      setStats({
        eventsThisMonth,
        pendingTasks,
        completedTasks
      });
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    if (user?.id) {
      onRefresh();
    }
  }, [user?.id]);

  // Ajouter le hook des notifications
  const { notificationCount, refreshNotifications } = useNotifications();

  // Fallback si pas d'utilisateur connecté
  if (!user) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <Text variant="body" color="secondary">
            Aucun utilisateur connecté
          </Text>
        </View>
      </SafeAreaView>
    );
  }



  const quickActions = [
    {
      title: 'Créer un événement',
      subtitle: 'Organisez quelque chose',
      icon: 'add-circle',
      color: theme.primary,
route: '/modals/create-event'
    },
    {
      title: 'Mes tâches',
      subtitle: `${stats.pendingTasks} en attente`,
      icon: 'checkmark-done',
      color: '#FF9500',
      route: '/tasks'
    },
  ];

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header
        title="Accueil"
        rightAction={{
          icon: "notifications-outline",
          onPress: () => router.push('/notifications'),
          notificationCount: notificationCount // Ajouter le nombre de notifications
        }}
      />

      <ScrollView 
        style={[layoutStyles.container]} 
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Section de bienvenue avec avatar */}
        <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[4] }}>
          <View style={[layoutStyles.row, { alignItems: 'center' }]}>
            <Avatar
              size="large"
              source={undefined}
              fallbackIcon="person"
              style={{ marginRight: spacing[4] }}
            />
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="secondary" style={{ marginBottom: spacing[1] }}>
                Bonjour,
              </Text>
              <Text variant="h2" weight="bold">
                {user.fname} {user.lname} 👋
              </Text>
              <View style={[layoutStyles.row, { alignItems: 'center', marginTop: spacing[1] }]}>
                <Text variant="caption" color="secondary">
                  @{user.username}
                </Text>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: user.active ? '#34C759' : '#FF9500',
                  marginLeft: spacing[2]
                }} />
                <Text variant="caption" color="secondary" style={{ marginLeft: spacing[1] }}>
                  {user.active ? 'Vérifié' : 'En attente'}
                </Text>
              </View>
            </View>
          </View>

          {/* Statistiques rapides */}
        </View>
        <HomeStats stats={stats} compact={true} />

        {/* Actions rapides */}
        <HomeActions
          actions={quickActions.map(action => ({
            title: action.title,
            subtitle: action.subtitle,
            icon: action.icon,
            color: action.color,
            route: action.route.toString()
          }))}
          onActionPress={(route) => {
            router.push(route);
          }}
          compact={false}
        />

        {/* Prochains événements */}
        <HomeUpcomingEvents
          events={upcomingEvents}
          onEventPress={(event) => router.push(`/events/${event.id}`)}
          onViewAllPress={() => router.push('/events')}
          onCreateEventPress={() => router.push('/modals/create-event')}
          compact={false}
        />

                {/* Section paramètres et outils */}
        <HomeSettings
          onProfilePress={() => router.push('/profile')}
          onLogoutPress={logout}
          userEmail={user.email}
          compact={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

  
