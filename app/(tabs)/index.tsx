import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Header from '../../components/ui/organisms/Header';
import Avatar from '../../components/ui/atoms/Avatar';
import Badge from '../../components/ui/atoms/Badge';
import EventCard from '../../components/ui/EventCard';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/EventService';
import { taskService } from '../../services/TaskService';
import { Event } from '../../types/events';
import { Task } from '../../types/tasks';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Utiliser le contexte d'authentification
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    eventsThisMonth: 0,
    pendingTasks: 0,
    totalParticipants: 0
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
        
        setUpcomingEvents(eventsThisMonth.slice(0, 2)); // Garder seulement 2 événements
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

      // Total participants (compter tous les participants de tous les événements)
      let totalParticipants = 0;
      if (eventsResponse.success && eventsResponse.data) {
        for (const event of eventsResponse.data) {
          const participantsResponse = await eventService.getEventParticipants(event.id);
          if (participantsResponse.success && participantsResponse.data?.participants) {
            totalParticipants += participantsResponse.data.participants.length;
          }
        }
      }

      setStats({
        eventsThisMonth,
        pendingTasks,
        totalParticipants
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

  const quickStats = [
    { 
      label: 'Événements\nce mois', 
      value: stats.eventsThisMonth.toString(), 
      color: theme.primary, 
      icon: 'calendar-outline' 
    },
    { 
      label: 'Tâches\nà faire', 
      value: stats.pendingTasks.toString(), 
      color: '#FF9500', 
      icon: 'checkmark-circle-outline' 
    },
    { 
      label: 'Participants\ntotal', 
      value: stats.totalParticipants.toString(), 
      color: '#34C759', 
      icon: 'people-outline' 
    },
  ];

  const quickActions = [
    {
      title: 'Créer un événement',
      subtitle: 'Organisez quelque chose',
      icon: 'add-circle',
      color: theme.primary,
      action: () => router.push('/modals/create-event')
    },
    {
      title: 'Voir le calendrier',
      subtitle: 'Planning complet',
      icon: 'calendar',
      color: '#4ECDC4',
      action: () => router.push('/calendars')
    },
    {
      title: 'Mes tâches',
      subtitle: `${stats.pendingTasks} en attente`,
      icon: 'checkmark-done',
      color: '#FF9500',
      action: () => router.push('/tasks')
    },
  ];

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header 
        title={`Iven`}
        rightAction={{
          icon: "notifications-outline",
          onPress: () => router.push('/notifications')
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
        <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[6] }}>
          <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[6] }]}>
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
          <View style={[layoutStyles.row, { marginBottom: spacing[6] }]}>
            {quickStats.map((stat, index) => (
              <View key={index} style={[layoutStyles.centerHorizontal, { flex: 1 }]}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: stat.color + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing[2]
                }}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text variant="h3" weight="bold" style={{ marginBottom: spacing[1] }}>
                  {stat.value}
                </Text>
                <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions rapides */}
        <View style={{ paddingHorizontal: spacing[5], marginBottom: spacing[6] }}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
            Actions rapides
          </Text>
          
          <View style={{ gap: spacing[3] }}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} onPress={action.action}>
                <Card variant="elevated" padding="medium">
                  <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: action.color + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: spacing[4]
                    }}>
                      <Ionicons name={action.icon as any} size={24} color={action.color} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: 2 }}>
                        {action.title}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {action.subtitle}
                      </Text>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prochains événements */}
        <View style={{ paddingHorizontal: spacing[5], marginBottom: spacing[6] }}>
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
            <Text variant="h3" weight="semibold">
              Prochains événements
            </Text>
            <TouchableOpacity onPress={() => router.push('/events')}>
              <Text variant="caption" color="primary">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.length > 0 ? (
            <View style={{ gap: spacing[3] }}>
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/events/${event.id}`)}
                  showLocation={true}
                  compact={false}
                  variant="elevated"
                />
              ))}
            </View>
          ) : (
            <Card variant="outlined" padding="large">
              <View style={[layoutStyles.centerHorizontal]}>
                <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} style={{ marginBottom: spacing[3] }} />
                <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[2] }}>
                  Aucun événement planifié
                </Text>
                <TouchableOpacity onPress={() => router.push('/modals/create-event')}>
                  <Text variant="caption" color="primary">
                    Créer votre premier événement
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        </View>

        {/* Section paramètres et outils */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
            Paramètres
          </Text>
          
          <View style={{ gap: spacing[3] }}>
            {/* Profil utilisateur */}
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Card variant="outlined" padding="medium">
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.primary + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing[3]
                  }}>
                    <Ionicons name="person" size={20} color={theme.primary} />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="medium">
                      Mon profil
                    </Text>
                    <Text variant="small" color="secondary">
                      {user.email}
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            {/* Mode développement */}
            <TouchableOpacity onPress={() => router.push('/ui-test')}>
              <Card variant="outlined" padding="medium">
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.backgroundSecondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing[3]
                  }}>
                    <Ionicons name="color-palette" size={20} color={theme.primary} />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="medium">
                      UI Components Showcase
                    </Text>
                    <Text variant="small" color="secondary">
                      Mode développement
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            {/* Test Auth */}
            <TouchableOpacity onPress={() => router.push('/test-auth')}>
              <Card variant="outlined" padding="medium">
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#4ECDC4' + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing[3]
                  }}>
                    <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="medium">
                      Tests d'authentification
                    </Text>
                    <Text variant="small" color="secondary">
                      Debug auth & sessions
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            {/* Déconnexion */}
            <TouchableOpacity 
              onPress={async () => {
                console.log('🚪 Déconnexion...');
                await logout();
                // La redirection sera gérée par AuthInitializer
              }}
            >
              <Card variant="outlined" padding="medium">
                <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FF453A' + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing[3]
                  }}>
                    <Ionicons name="log-out" size={20} color="#FF453A" />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="medium" style={{ color: '#FF453A' }}>
                      Se déconnecter
                    </Text>
                    <Text variant="small" color="secondary">
                      Revenir à l'écran de connexion
                    </Text>
                  </View>
                  
                  <Ionicons name="log-out" size={16} color="#FF453A" />
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

  
