import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../atoms/Text';
import { spacing } from '../../../styles';

const { width: screenWidth } = Dimensions.get('window');

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  style?: any;
  compact?: boolean;
}

export default function TaskStats({
  totalTasks,
  completedTasks,
  pendingTasks,
  style,
  compact = false
}: TaskStatsProps) {
  const { theme } = useTheme();
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const progressWidth = (screenWidth - (spacing[5] * 2) - (spacing[4] * 2)) * (completedTasks / totalTasks);

  return (
    <View style={[styles.container, style]}>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.primary,
                width: progressWidth || 0
              }
            ]} 
          />
        </View>
        <Text style={[styles.percentageText, { color: theme.primary }]}>
          {completionRate}%
        </Text>
      </View>

      {/* Statistiques détaillées */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="list" size={compact ? 16 : 18} color={theme.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {totalTasks}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={compact ? 16 : 18} color={theme.success} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {completedTasks}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Terminées
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.warning + '15' }]}>
            <Ionicons name="time" size={compact ? 16 : 18} color={theme.warning} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {pendingTasks}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              En attente
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  progressBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[3],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
