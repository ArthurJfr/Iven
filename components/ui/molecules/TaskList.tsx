import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { TaskCard } from '../../features/tasks';
import EmptyState from './EmptyState';
import { spacing } from '../../../styles';
import { Task } from '../../../types/tasks';

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  activeFilter: string;
  loading?: boolean;
  style?: any;
}

const TaskList = React.memo(({
  tasks,
  onTaskPress,
  onRefresh,
  refreshing = false,
  activeFilter,
  loading = false,
  style
}: TaskListProps) => {
  const { theme } = useTheme();

  // Mémoriser la fonction de gestion des clics sur les tâches
  const handleTaskPress = useCallback((task: Task) => {
    onTaskPress(task);
  }, [onTaskPress]);

  // Mémoriser les états de chargement et vide pour éviter les recalculs
  const loadingState = useMemo(() => (
    <View style={[styles.loadingContainer, style]}>
      <EmptyState
        icon="hourglass-outline"
        title="Chargement..."
        description="Récupération de vos tâches en cours"
      />
    </View>
  ), [style]);

  const emptyState = useMemo(() => (
    <View style={[styles.emptyContainer, style]}>
      <EmptyState
        icon="checkbox-outline"
        title={activeFilter === 'Toutes' ? 'Aucune tâche' : `Aucune tâche ${activeFilter.toLowerCase()}`}
        description={activeFilter === 'Toutes' 
          ? 'Créez votre première tâche pour commencer à organiser votre travail' 
          : `Toutes les tâches sont dans d'autres catégories`
        }
        actionButton={activeFilter === 'Toutes' ? {
          text: 'Créer une tâche',
          onPress: () => console.log('Créer une tâche'),
          icon: 'add'
        } : undefined}
      />
    </View>
  ), [activeFilter, style]);

  if (loading) {
    return loadingState;
  }

  if (tasks.length === 0) {
    return emptyState;
  }

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

  return (
    <ScrollView
      style={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {/* Mémoriser la liste des tâches pour éviter les recalculs */}
      {useMemo(() => tasks.map((task, index) => (
        <View key={`task-${task.id}-${index}`} style={styles.taskItem}>
          <TaskCard
            task={task}
            onPress={() => handleTaskPress(task)}
            variant="elevated"
            compact={false}
          />
        </View>
      )), [tasks, handleTaskPress])}
      
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
  taskItem: {
    marginBottom: spacing[3],
  },
  bottomSpacing: {
    height: spacing[8],
  },
});

// Export par défaut pour maintenir la compatibilité
export default TaskList;
