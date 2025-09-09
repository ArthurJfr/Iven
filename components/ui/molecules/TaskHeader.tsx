import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../atoms/Text';
import { spacing } from '../../../styles';

interface TaskHeaderProps {
  title: string;
  onAddPress?: () => void;
  onFilterPress?: () => void;
  onSearchPress?: () => void;
  showAddButton?: boolean;
  showFilterButton?: boolean;
  showSearchButton?: boolean;
  style?: any;
}

export default function TaskHeader({
  title,
  onAddPress,
  onFilterPress,
  onSearchPress,
  showAddButton = true,
  showFilterButton = true,
  showSearchButton = true,
  style
}: TaskHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Titre principal */}
      <View style={styles.titleSection}>
        <Text variant="h1" style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        <Text variant="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
          Gérez vos tâches efficacement
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        {showSearchButton && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.backgroundSecondary }]}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        
        {showFilterButton && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.backgroundSecondary }]}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        
        {showAddButton && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: 'transparent',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});