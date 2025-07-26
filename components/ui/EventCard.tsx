import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import Card from './Card';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  participants?: number;
  maxParticipants?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  participants = 0,
  maxParticipants,
  status = 'upcoming',
  onPress,
  onFavoritePress,
  isFavorite = false,
}: EventCardProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'ongoing':
        return '#10b981'; // Vert
      case 'completed':
        return '#6b7280'; // Gris
      case 'cancelled':
        return '#ef4444'; // Rouge
      default:
        return '#3b82f6'; // Bleu
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'À venir';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ongoing':
        return 'play-circle';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'calendar';
    }
  };

  return (
    <Card
      onPress={onPress}
      variant="elevated"
      padding="medium"
      margin={8}
    >
      <View style={localStyles.header}>
        <View style={localStyles.titleSection}>
          <Text style={[localStyles.title, { color: theme.text }]} numberOfLines={2}>
            {title}
          </Text>
          {onFavoritePress && (
            <TouchableOpacity
              onPress={onFavoritePress}
              style={localStyles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#ef4444' : theme.text}
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[localStyles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Ionicons name={getStatusIcon() as any} size={12} color="#ffffff" />
          <Text style={localStyles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={localStyles.details}>
        <View style={localStyles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.secondary} />
          <Text style={[localStyles.detailText, { color: theme.text }]}>
            {date} {time && `• ${time}`}
          </Text>
        </View>

        {location && (
          <View style={localStyles.detailRow}>
            <Ionicons name="location" size={16} color={theme.secondary} />
            <Text style={[localStyles.detailText, { color: theme.text }]} numberOfLines={1}>
              {location}
            </Text>
          </View>
        )}

        {maxParticipants && (
          <View style={localStyles.detailRow}>
            <Ionicons name="people" size={16} color={theme.secondary} />
            <Text style={[localStyles.detailText, { color: theme.text }]}>
              {participants}/{maxParticipants} participants
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
}); 