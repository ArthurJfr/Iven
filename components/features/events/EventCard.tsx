import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import Badge from '../../ui/atoms/Badge';
import { Event } from '../../../types/events';
import { taskService, TaskService } from '../../../services/TaskService';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  showLocation?: boolean;
  showParticipants?: boolean;
  compact?: boolean;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const EventCard = React.memo(({ 
  event, 
  onPress, 
  showLocation = true, 
  showParticipants = false,
  compact = false,
  variant = 'elevated'
}: EventCardProps) => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Mémoriser les fonctions de formatage pour éviter les recréations
  const formatDate = useCallback((dateString: string) => {
    return TaskService.formatDate(dateString);
  }, []);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // Mémoriser la configuration du statut pour éviter les recalculs
  const statusConfig = useMemo(() => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    
    if (now < start) {
      return { text: 'À venir', color: theme.primary, icon: 'time-outline' };
    } else if (now >= start && now <= end) {
      return { text: 'En cours', color: theme.warning, icon: 'play-circle-outline' };
    } else {
      return { text: 'Terminé', color: theme.success, icon: 'checkmark-circle-outline' };
    }
  }, [event.start_date, event.end_date, theme.primary, theme.warning, theme.success]);

  // Mémoriser le contenu de la carte pour éviter les re-renders inutiles
  const CardContent = useMemo(() => (
    <View style={compact ? {} : { padding: spacing[4] }}>
      {/* En-tête avec titre et statut */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: compact ? spacing[2] : spacing[3] 
      }}>
        <View style={{ flex: 1, marginRight: spacing[2] }}>
          <Text 
            variant={compact ? "body" : "h3"} 
            weight="semibold" 
            numberOfLines={2}
            style={{ marginBottom: compact ? spacing[1] : spacing[2] }}
          >
            {event.title}
          </Text>
          
          {event.description && !compact && (
            <Text 
              variant="small" 
              color="secondary" 
              numberOfLines={2}
              style={{ lineHeight: 18 }}
            >
              {event.description}
            </Text>
          )}
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Badge 
            text={statusConfig.text} 
            color={statusConfig.color}
          />
        </View>
      </View>

      {/* Informations de date et heure */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: compact ? spacing[2] : spacing[3] 
      }}>
        <Ionicons 
          name="calendar-outline" 
          size={compact ? 14 : 16} 
          color={theme.textSecondary} 
          style={{ marginRight: spacing[1] }} 
        />
        <Text 
          variant={compact ? "small" : "body"} 
          color="secondary"
          style={{ marginRight: spacing[3] }}
        >
          {formatDate(event.start_date)}
        </Text>
        
        <Ionicons 
          name="time-outline" 
          size={compact ? 14 : 16} 
          color={theme.textSecondary} 
          style={{ marginRight: spacing[1] }} 
        />
        <Text 
          variant={compact ? "small" : "body"} 
          color="secondary"
        >
          {formatTime(event.start_date)}
        </Text>
      </View>

      {/* Lieu et participants */}
      {(showLocation || showParticipants) && (
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {showLocation && event.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons 
                name="location-outline" 
                size={compact ? 14 : 16} 
                color={theme.textSecondary} 
                style={{ marginRight: spacing[1] }} 
              />
              <Text 
                variant={compact ? "small" : "body"} 
                color="secondary"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {event.location}
              </Text>
            </View>
          )}
          
          {showParticipants && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name="people-outline" 
                size={compact ? 14 : 16} 
                color={theme.textSecondary} 
                style={{ marginRight: spacing[1] }} 
              />
              <Text 
                variant={compact ? "small" : "body"} 
                color="secondary"
              >
                Voir participants
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  ), [event, compact, showLocation, showParticipants, statusConfig, formatDate, formatTime, theme.textSecondary]);

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant={variant} padding={compact ? "small" : "medium"}>
          {CardContent}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card variant={variant} padding={compact ? "small" : "medium"}>
      {CardContent}
    </Card>
  );
});

// Export par défaut pour maintenir la compatibilité
export default EventCard; 