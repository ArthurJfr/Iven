import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../atoms/Text';
import Button from '../Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionButton?: {
    text: string;
    onPress: () => void;
    icon?: string;
  };
  iconColor?: string;
  iconSize?: number;
}

export default function EmptyState({
  icon = 'document-outline',
  title,
  description,
  actionLabel,
  onAction,
  actionButton,
  iconColor,
  iconSize = 64
}: EmptyStateProps) {
  const { theme } = useTheme();
  const finalIconColor = iconColor || theme.textSecondary;
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={iconSize} color={finalIconColor} />
      </View>
      
      <Text variant="h3" weight="semibold" style={styles.title}>
        {title}
      </Text>
      
      {description && (
        <Text variant="body" color="secondary" style={styles.description}>
          {description}
        </Text>
      )}
      
      {/* Support pour l'ancienne API */}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      )}
      
      {/* Nouvelle API avec actionButton */}
      {actionButton && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={actionButton.onPress}
          activeOpacity={0.8}
        >
          {actionButton.icon && (
            <Ionicons 
              name={actionButton.icon as any} 
              size={20} 
              color="white" 
              style={styles.actionIcon} 
            />
          )}
          <Text style={[styles.actionText, { color: 'white' }]}>
            {actionButton.text}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  action: {
    minWidth: 120,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 16,
  },
});






