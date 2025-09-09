import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import { spacing } from '../../../styles';
import { Event } from '../../../types/events';

interface EventStatsProps {
  events: Event[];
  style?: any;
  compact?: boolean;
}

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  description?: string;
}

const EventStats = React.memo(({
  events,
  style,
  compact = false
}: EventStatsProps) => {
  const { theme } = useTheme();

  // Mémoriser les statistiques calculées pour éviter les recalculs
  const stats = useMemo(() => {
    const now = new Date();
    const totalEvents = events.length;
    
    const upcomingEvents = events.filter(event => new Date(event.start_date) > now).length;
    const ongoingEvents = events.filter(event => {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      return now >= start && now <= end;
    }).length;
    const pastEvents = events.filter(event => new Date(event.end_date) < now).length;
    
    const eventsWithLocation = events.filter(event => event.location).length;
    const eventsWithParticipants = events.filter(event => event.participants && event.participants.length > 0).length;

    return [
      {
        label: 'Total',
        value: totalEvents,
        icon: 'calendar-outline',
        color: theme.primary,
        description: 'Événements créés'
      },
      {
        label: 'À venir',
        value: upcomingEvents,
        icon: 'time-outline',
        color: theme.info,
        description: 'Événements programmés'
      },
      {
        label: 'En cours',
        value: ongoingEvents,
        icon: 'play-circle-outline',
        color: theme.warning,
        description: 'Événements actifs'
      },
      {
        label: 'Terminés',
        value: pastEvents,
        icon: 'checkmark-circle-outline',
        color: theme.success,
        description: 'Événements passés'
      },
      {
        label: 'Avec lieu',
        value: eventsWithLocation,
        icon: 'location-outline',
        color: theme.secondary,
        description: 'Événements localisés'
      },
      {
        label: 'Avec participants',
        value: eventsWithParticipants,
        icon: 'people-outline',
        color: theme.accent,
        description: 'Événements avec équipe'
      }
    ];
  }, [events, theme]);

  if (events.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Card variant="outlined" padding="medium">
          <View style={styles.emptyContent}>
            <Ionicons name="stats-chart-outline" size={24} color={theme.textSecondary} />
            <Text variant="body" color="secondary" style={styles.emptyText}>
              Aucune statistique disponible
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text variant="h4" weight="semibold" style={styles.title}>
        Statistiques des Événements
      </Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            variant="elevated" 
            padding={compact ? "small" : "medium"}
            style={[
              styles.statCard,
              { marginBottom: index < stats.length - 2 ? spacing[2] : 0 }
            ]}
          >
            <View style={styles.statContent}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={compact ? 16 : 20} color={stat.color} />
              </View>
              
              <View style={styles.statInfo}>
                <Text 
                  variant={compact ? "h4" : "h3"} 
                  weight="bold" 
                  style={[styles.statValue, { color: stat.color }]}
                >
                  {stat.value}
                </Text>
                <Text 
                  variant={compact ? "small" : "body"} 
                  color="secondary" 
                  numberOfLines={1}
                  style={styles.statLabel}
                >
                  {stat.label}
                </Text>
                {!compact && stat.description && (
                  <Text 
                    variant="small" 
                    color="tertiary" 
                    numberOfLines={2}
                    style={styles.statDescription}
                  >
                    {stat.description}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
    paddingHorizontal: spacing[5],
  },
  statsGrid: {
    paddingHorizontal: spacing[5],
  },
  statCard: {
    marginBottom: spacing[2],
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    marginBottom: spacing[1],
  },
  statLabel: {
    marginBottom: spacing[1],
    fontWeight: '600',
  },
  statDescription: {
    lineHeight: 16,
  },
  emptyContainer: {
    paddingHorizontal: spacing[5],
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  emptyText: {
    marginTop: spacing[2],
    textAlign: 'center',
  },
});

// Export par défaut pour maintenir la compatibilité
export default EventStats;
