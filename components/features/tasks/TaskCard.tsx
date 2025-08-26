import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import Badge from '../../ui/atoms/Badge';
import { Task } from '../../../types/tasks';
import { taskService, TaskService } from '../../../services/TaskService';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
  showEvent?: boolean;
  compact?: boolean;
  variant?: 'elevated' | 'outlined' | 'flat';
  showActions?: boolean;
}

const TaskCard = React.memo(({
  task, 
  onPress, 
  onTaskUpdate,
  showEvent = false,
  compact = false,
  variant = 'elevated',
  showActions = true
}: TaskCardProps) => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mémoriser les fonctions de validation pour éviter les recréations
  const getValidationColor = useCallback((validatedBy: number | null) => {
    return TaskService.getValidationColor(validatedBy);
  }, []);

  const getValidationIcon = useCallback((validatedBy: number | null) => {
    return TaskService.getValidationIcon(validatedBy);
  }, []);

  const getValidationText = useCallback((validatedBy: number | null) => {
    return TaskService.getValidationText(validatedBy);
  }, []);

  // Valider une tâche - Mémorisé avec useCallback
  const validateTask = useCallback(async () => {
    if (isUpdating) return;
    
    Alert.alert(
      'Valider la tâche',
      'Êtes-vous sûr de vouloir valider cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Valider', 
          style: 'default',
          onPress: async () => {
            try {
              setIsUpdating(true);
              const response = await taskService.validateTask(task.id);
              
              if (response.success && response.data) {
                onTaskUpdate?.(response.data);
                Alert.alert('Succès', 'Tâche validée avec succès !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible de valider la tâche');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la validation');
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  }, [task.id, onTaskUpdate, isUpdating]);

  // Annuler la validation d'une tâche - Mémorisé avec useCallback
  const unvalidateTask = useCallback(async () => {
    if (isUpdating) return;
    
    Alert.alert(
      'Annuler la validation',
      'Êtes-vous sûr de vouloir annuler la validation de cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Annuler la validation', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsUpdating(true);
              const response = await taskService.unvalidateTask(task.id);
              
              if (response.success && response.data) {
                onTaskUpdate?.(response.data);
                Alert.alert('Succès', 'Validation de la tâche annulée !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible d\'annuler la validation');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de l\'annulation de la validation');
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  }, [task.id, onTaskUpdate, isUpdating]);

  // Mémoriser le contenu de la carte pour éviter les re-renders inutiles
  const CardContent = useMemo(() => (
    <View style={compact ? {} : { padding: spacing[3] }}>
      {/* En-tête avec titre et statut de validation */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: compact ? 8 : 8 
      }}>
        <View style={{ flex: 1, marginRight: spacing[2] }}>
          <Text 
            variant={compact ? "body" : "h3"} 
            weight="semibold" 
            numberOfLines={2}
            style={[
              { marginBottom: 4 },
              task.validated_by ? styles.completedText : null
            ]}
          >
            {task.title}
          </Text>
          
          {task.description && !compact && (
            <Text 
              variant="small" 
              color="secondary" 
              numberOfLines={2}
              style={[
                { lineHeight: 18 },
                task.validated_by ? styles.completedText : null
              ]}
            >
              {task.description}
            </Text>
          )}
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Badge 
            text={getValidationText(task.validated_by || null)} 
            color={getValidationColor(task.validated_by || null)}
          />
        </View>
      </View>

      {/* Statut de validation avec puce cliquable */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: compact ? 8 : 12 
      }}>
        <TouchableOpacity 
          style={[
            styles.checkbox,
            compact ? styles.checkboxCompact : null,
            task.validated_by ? styles.checkboxChecked : null
          ]}
          onPress={task.validated_by ? unvalidateTask : validateTask}
          disabled={isUpdating}
          activeOpacity={0.7}
        >
          {task.validated_by ? (
            <Ionicons name="checkmark" size={compact ? 8 : 12} color="white" />
          ) : (
            <View style={styles.checkboxInner} />
          )}
        </TouchableOpacity>
        
        <Text 
          variant={compact ? "small" : "body"} 
          color="secondary"
          style={{ marginRight: spacing[3] }}
        >
          {getValidationText(task.validated_by || null)}
        </Text>

        {/* Indicateur de chargement */}
        {isUpdating && (
          <View style={styles.loadingIndicator}>
            <Ionicons name="sync" size={12} color={theme.primary} />
          </View>
        )}
      </View>

      {/* Événement associé */}
      {showEvent && task.event_id && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          paddingTop: compact ? 4 : 8,
          borderTopWidth: 1,
          borderTopColor: theme.border
        }}>
          <Ionicons 
            name="calendar-outline" 
            size={compact ? 12 : 14} 
            color={theme.textSecondary} 
            style={{ marginRight: 4 }} 
          />
          <Text 
            variant={compact ? "small" : "body"} 
            color="secondary"
          >
            Événement #{task.event_id}
          </Text>
        </View>
      )}
    </View>
  ), [task, compact, showEvent, isUpdating, validateTask, unvalidateTask, getValidationText, getValidationColor, theme]);

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant={variant} padding={compact ? "small" : "medium"}>
          <View style={{
            borderLeftWidth: 4,
            borderLeftColor: getValidationColor(task.validated_by || null),
          }}>
            {CardContent}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card variant={variant} padding={compact ? "small" : "medium"}>
      <View style={{
        borderLeftWidth: 4,
        borderLeftColor: getValidationColor(task.validated_by || null),
      }}>
        {CardContent}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompact: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  loadingIndicator: {
    marginLeft: spacing[2],
  },
});

// Export par défaut pour maintenir la compatibilité
export default TaskCard;
