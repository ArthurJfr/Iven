import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import Text from './atoms/Text';
import Card from './Card';
import Badge from './atoms/Badge';
import { Event } from '../../types/events';
import { taskService, TaskService } from '../../services/TaskService';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  showLocation?: boolean;
  showParticipants?: boolean;
  compact?: boolean;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export default function EventCard({ 
  event, 
  onPress, 
  showLocation = true, 
  showParticipants = false,
  compact = false,
  variant = 'elevated'
}: EventCardProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const formatDate = (dateString: string) => {
    return TaskService.formatDate(dateString);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusConfig = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { text: 'À venir', color: theme.primary, icon: 'time-outline' };
    } else if (now >= start && now <= end) {
      return { text: 'En cours', color: theme.warning, icon: 'play-circle-outline' };
    } else {
      return { text: 'Terminé', color: theme.success, icon: 'checkmark-circle-outline' };
    }
  };

  const statusConfig = getStatusConfig(event.start_date, event.end_date);

  const CardContent = () => (
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
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant={variant} padding={compact ? "small" : "medium"}>
          <CardContent />
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card variant={variant} padding={compact ? "small" : "medium"}>
      <CardContent />
    </Card>
  );
} 