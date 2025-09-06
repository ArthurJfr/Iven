import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import EventCard from './EventCard';
import { LoadingOverlay, EmptyState } from '../../ui/molecules';
import { spacing } from '../../../styles';
import { Event } from '../../../types/events';

interface EventListProps {
  events: Event[];
  onEventPress?: (event: Event) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  style?: any;
  compact?: boolean;
  showLocation?: boolean;
  showParticipants?: boolean;
}

const EventList = React.memo(({
  events,
  onEventPress,
  onRefresh,
  refreshing = false,
  loading = false,
  style,
  compact = false,
  showLocation = true,
  showParticipants = false
}: EventListProps) => {
  const { theme } = useTheme();

  // Mémoriser la fonction de gestion des clics sur les événements
  const handleEventPress = useCallback((event: Event) => {
    if (onEventPress) {
      onEventPress(event);
    }
  }, [onEventPress]);

  // Mémoriser le RefreshControl pour éviter les recréations
  const refreshControl = useMemo(() => {
    if (!onRefresh) return undefined;
    
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[theme.primary]}
        tintColor={theme.primary}
      />
    );
  }, [onRefresh, refreshing, theme.primary]);

  // Mémoriser l'état de chargement pour éviter les recalculs
  const loadingState = useMemo(() => (
    <View style={[styles.loadingContainer, style]}>
      <LoadingOverlay visible={true} />
    </View>
  ), [style]);

  // Mémoriser l'état vide pour éviter les recalculs
  const emptyState = useMemo(() => (
    <View style={[styles.emptyContainer, style]}>
      <EmptyState
        icon="calendar-outline"
        title="Aucun événement"
        description="Créez votre premier événement pour commencer à organiser vos activités"
        actionButton={{
          text: 'Créer un événement',
          onPress: () => console.log('Créer un événement'),
          icon: 'add'
        }}
      />
    </View>
  ), [style]);

  if (loading) {
    return loadingState;
  }

  if (events.length === 0) {
    return emptyState;
  }

  return (
    <ScrollView
      style={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {/* Mémoriser la liste des événements pour éviter les recalculs */}
      {useMemo(() => events.map((event, index) => (
        <View key={`event-${event.id}-${index}`} style={styles.eventItem}>
          <EventCard
            event={event}
            onPress={onEventPress ? () => handleEventPress(event) : undefined}
            showLocation={showLocation}
            showParticipants={showParticipants}
            compact={compact}
            variant="elevated"
          />
        </View>
      )), [events, onEventPress, handleEventPress, showLocation, showParticipants, compact])}
      
      {/* Espace en bas pour éviter que le dernier élément soit caché par la barre de navigation */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  eventItem: {
    marginBottom: spacing[3],
  },
  bottomSpacing: {
    height: spacing[8],
  },
});

// Export par défaut pour maintenir la compatibilité
export default EventList;
