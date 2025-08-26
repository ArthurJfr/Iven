import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import { spacing } from '../../../styles';
import Divider from '../../ui/atoms/Divider';

interface HomeStatsProps {
  stats: {
    eventsThisMonth: number;
    pendingTasks: number;
    completedTasks: number;
  };
  style?: any;
  compact?: boolean;
}

const HomeStats = React.memo(({
  stats,
  style,
  compact = false
}: HomeStatsProps) => {
  const { theme } = useTheme();

  // Mémoriser les statistiques avec le thème global
  const statItems = useMemo(() => [
    {
      label: 'Événements ce mois',
      value: stats.eventsThisMonth,
      icon: 'calendar-outline',
      primaryColor: theme.primary,
      description: 'Événements programmés'
    },
    {
      label: 'Tâches validées',
      value: stats.completedTasks || 0,
      icon: 'checkmark-done-circle',
      primaryColor: theme.success,
      description: 'Tâches terminées'
    },
    {
      label: 'Tâches en attente',
      value: stats.pendingTasks,
      icon: 'checkmark-circle-outline',
      primaryColor: theme.warning,
      description: 'Tâches à compléter'
    }
  ], [stats, theme]);

  return (
    <View style={[styles.container, style]}>
      <Divider /> 
      <View style={styles.statsRow}>
        {statItems.map((stat, index) => (
          <View 
            key={stat.label} 
            style={[
              styles.statCard,
              { 
                marginRight: index < statItems.length - 1 ? spacing[3] : 0
              }
            ]}
          >
            {/* Icône avec fond coloré */}
            <View style={[
              styles.iconContainer, 
              { 
                backgroundColor: stat.primaryColor,
                width: compact ? 40 : 48,
                height: compact ? 40 : 48,
                borderRadius: compact ? 20 : 24,
              }
            ]}>
              <Ionicons 
                name={stat.icon as any} 
                size={compact ? 18 : 20} 
                color="white" 
              />
            </View>
            
            {/* Contenu de la statistique */}
            <View style={styles.statContent}>
              {/* Valeur */}
              <Text 
                variant={compact ? "h3" : "h2"} 
                weight="bold" 
                style={[
                  styles.statValue, 
                  { color: stat.primaryColor }
                ]}
              >
                {stat.value}
              </Text>
              
              {/* Label */}
              <Text 
                variant={compact ? "small" : "body"} 
                weight="medium" 
                numberOfLines={2}
                style={[
                  styles.statLabel, 
                  { color: theme.textSecondary }
                ]}
              >
                {stat.label}
              </Text>
              
              {/* Description en mode non-compact */}
              {!compact && stat.description && (
                <Text 
                  variant="caption" 
                  color="secondary" 
                  numberOfLines={2}
                  style={styles.statDescription}
                >
                  {stat.description}
                </Text>
              )}
            </View>
          </View>
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
    marginBottom: spacing[4],
    paddingHorizontal: spacing[5],
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: spacing[3],
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  statLabel: {
    marginBottom: spacing[1],
    textAlign: 'center',
    lineHeight: 16,
  },
  statDescription: {
    textAlign: 'center',
    lineHeight: 14,
    fontSize: 11,
  },
});

// Export par défaut pour maintenir la compatibilité
export default HomeStats;
