import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import { EventCard } from '../events';
import { spacing } from '../../../styles';
import { Event } from '../../../types/events';

interface HomeUpcomingEventsProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  onViewAllPress: () => void;
  onCreateEventPress: () => void;
  style?: any;
  compact?: boolean;
}

const HomeUpcomingEvents = React.memo(({
  events,
  onEventPress,
  onViewAllPress,
  onCreateEventPress,
  style,
  compact = false
}: HomeUpcomingEventsProps) => {
  const { theme } = useTheme();

  // Mémoriser la fonction de gestion des clics sur les événements
  const handleEventPress = useCallback((event: Event) => {
    onEventPress(event);
  }, [onEventPress]);

  // Mémoriser la fonction de gestion du clic "Voir tout"
  const handleViewAllPress = useCallback(() => {
    onViewAllPress();
  }, [onViewAllPress]);

  // Mémoriser la fonction de gestion du clic "Créer un événement"
  const handleCreateEventPress = useCallback(() => {
    onCreateEventPress();
  }, [onCreateEventPress]);

  // Mémoriser le contenu des événements pour éviter les recalculs
  const eventsContent = useMemo(() => {
    if (events.length > 0) {
      return (
        <View style={styles.eventsList}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <EventCard
                event={event}
                onPress={() => handleEventPress(event)}
                showLocation={true}
                showParticipants={true}
                compact={compact}
                variant="elevated"
              />
            </View>
          ))}
        </View>
      );
    }

    return (
      <Card variant="outlined" padding="large">
        <View style={styles.emptyContent}>
          <Ionicons 
            name="calendar-outline" 
            size={compact ? 40 : 48} 
            color={theme.textSecondary} 
            style={styles.emptyIcon} 
          />
          <Text 
            variant={compact ? "body" : "h3"} 
            color="secondary" 
            style={styles.emptyTitle}
          >
            Aucun événement planifié
          </Text>
          <TouchableOpacity onPress={handleCreateEventPress}>
            <Text 
              variant={compact ? "small" : "body"} 
              color="primary" 
              style={styles.createButton}
            >
              Créer votre premier événement
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }, [events, compact, theme.textSecondary, handleEventPress, handleCreateEventPress]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="h3" weight="semibold" style={styles.title}>
          Prochains événements
        </Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text variant="caption" color="primary" style={styles.viewAllButton}>
            Voir tout
          </Text>
        </TouchableOpacity>
      </View>
      
      {eventsContent}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[5],
  },
  title: {
    flex: 1,
  },
  viewAllButton: {
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  eventItem: {
    marginBottom: spacing[3],
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  emptyIcon: {
    marginBottom: spacing[3],
  },
  emptyTitle: {
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  createButton: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Export par défaut pour maintenir la compatibilité
export default HomeUpcomingEvents;
