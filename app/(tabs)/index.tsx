import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Header from '../../components/ui/organisms/Header';
import Avatar from '../../components/ui/atoms/Avatar';
import Badge from '../../components/ui/atoms/Badge';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Mock data - à remplacer par de vraies données
  const user = {
    firstName: 'Arthur',
    lastName: 'Jaffro',
    avatar: null,
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Anniversaire de Marie',
      date: '15 Jan',
      time: '19:00',
      attendees: 12,
      category: 'Anniversaire',
      color: '#FF6B9D'
    },
    {
      id: 2,
      title: 'Réunion équipe',
      date: '18 Jan', 
      time: '14:30',
      attendees: 8,
      category: 'Professionnel',
      color: '#4ECDC4'
    }
  ];

  const quickStats = [
    { label: 'Événements\nce mois', value: '5', color: theme.primary, icon: 'calendar-outline' },
    { label: 'Tâches\nà faire', value: '8', color: '#FF9500', icon: 'checkmark-circle-outline' },
    { label: 'Participants\ntotal', value: '24', color: '#34C759', icon: 'people-outline' },
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
      subtitle: '8 en attente',
      icon: 'checkmark-done',
      color: '#FF9500',
      action: () => router.push('/tasks')
    },
  ];

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header 
        title="Iven" 
        rightAction={{
          icon: "notifications-outline",
          onPress: () => router.push('/notifications')
        }}
      />

      <ScrollView 
        style={[layoutStyles.container]} 
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section de bienvenue avec avatar */}
        <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[6] }}>
          <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[6] }]}>
            <Avatar
              size="large"
              source={user.avatar ? { uri: user.avatar } : undefined}
              fallbackIcon="person"
              style={{ marginRight: spacing[4] }}
            />
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="secondary" style={{ marginBottom: spacing[1] }}>
                Bonjour,
              </Text>
              <Text variant="h2" weight="bold">
                {user.firstName} {user.lastName} 👋
              </Text>
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
                <TouchableOpacity key={event.id} onPress={() => router.push(`/events/${event.id}`)}>
                  <Card variant="elevated" padding="medium">
                    <View style={[layoutStyles.rowBetween, { marginBottom: spacing[2] }]}>
                      <Badge text={event.category} color={event.color} />
                      <Text variant="caption" color="secondary">
                        {event.attendees} participants
                      </Text>
                    </View>
                    
                    <Text variant="body" weight="semibold" style={{ marginBottom: spacing[2] }}>
                      {event.title}
                    </Text>
                    
                    <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                      <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} style={{ marginRight: spacing[2] }} />
                      <Text variant="caption" color="secondary" style={{ marginRight: spacing[4] }}>
                        {event.date}
                      </Text>
                      <Ionicons name="time-outline" size={16} color={theme.textSecondary} style={{ marginRight: spacing[2] }} />
                      <Text variant="caption" color="secondary">
                        {event.time}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
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

        {/* Section développement (à supprimer en prod) */}
        <View style={{ paddingHorizontal: spacing[5] }}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

  
