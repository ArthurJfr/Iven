import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { spacing } from '../../../styles';
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
  // 1. Tous les hooks en premier, dans le bon ordre
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // 2. Toutes les fonctions useCallback
  const getValidationColor = useCallback((validatedBy: number | null) => {
    return TaskService.getValidationColor(validatedBy);
  }, []);

  const getValidationText = useCallback((validatedBy: number | null) => {
    return TaskService.getValidationText(validatedBy);
  }, []);

  const animateCheckbox = useCallback((scale: number) => {
    Animated.spring(scaleAnim, {
      toValue: scale,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [scaleAnim]);

  const validateTask = useCallback(async () => {
    if (isUpdating) return;
    
    console.log('🔄 Début validation tâche:', task.id, task.title);
    
    // Mise à jour optimiste immédiate: marquer comme validée (l'API renverra la valeur correcte)
    const optimisticTask = { ...task, validated_by: task.validated_by ?? -1 };
    onTaskUpdate?.(optimisticTask);
    
    // Animation de feedback immédiat
    animateCheckbox(0.9);
    
    try {
      setIsUpdating(true);
      const response = await taskService.validateTask(task.id);
      
      if (response.success && response.data) {
        // Mise à jour avec les vraies données de l'API
        console.log('✅ Validation réussie, mise à jour avec données API:', response.data);
        onTaskUpdate?.(response.data);
        
        // Animation de succès
        animateCheckbox(1.1);
        setTimeout(() => animateCheckbox(1), 200);
      } else {
        // En cas d'erreur, revenir à l'état précédent
        console.log('❌ Erreur validation, retour à l\'état précédent');
        onTaskUpdate?.(task);
        Alert.alert('Erreur', response.error || 'Impossible de valider la tâche');
        animateCheckbox(1);
      }
    } catch (error: any) {
      // En cas d'erreur réseau, revenir à l'état précédent
      console.log('❌ Erreur réseau validation, retour à l\'état précédent:', error.message);
      onTaskUpdate?.(task);
      
      if (error.response?.status === 403) {
        Alert.alert('Erreur', 'Vous n\'avez pas les permissions pour valider cette tâche');
      } else if (error.response?.status === 400) {
        Alert.alert('Erreur', 'Cette tâche ne peut pas être validée dans son état actuel');
      } else {
        Alert.alert('Erreur', 'Erreur lors de la validation');
      }
      animateCheckbox(1);
    } finally {
      setIsUpdating(false);
    }
  }, [task, onTaskUpdate, isUpdating, animateCheckbox]);

  const unvalidateTask = useCallback(async () => {
    if (isUpdating) return;
    
    console.log('🔄 Début annulation validation tâche:', task.id, task.title);
    
    // Mise à jour optimiste immédiate
    const optimisticTask = { ...task, validated_by: null };
    onTaskUpdate?.(optimisticTask);
    
    // Animation de feedback immédiat
    animateCheckbox(0.9);
    
    try {
      setIsUpdating(true);
      const response = await taskService.unvalidateTask(task.id);
      
      if (response.success && response.data) {
        // Mise à jour avec les vraies données de l'API
        console.log('✅ Annulation validation réussie, mise à jour avec données API:', response.data);
        onTaskUpdate?.(response.data);
        
        // Animation de succès
        animateCheckbox(1.1);
        setTimeout(() => animateCheckbox(1), 200);
      } else {
        // En cas d'erreur, revenir à l'état précédent
        console.log('❌ Erreur annulation validation, retour à l\'état précédent');
        onTaskUpdate?.(task);
        Alert.alert('Erreur', response.error || 'Impossible d\'annuler la validation');
        animateCheckbox(1);
      }
    } catch (error: any) {
      // En cas d'erreur réseau, revenir à l'état précédent
      console.log('❌ Erreur réseau annulation validation, retour à l\'état précédent:', error.message);
      onTaskUpdate?.(task);
      
      if (error.response?.status === 403) {
        Alert.alert('Erreur', 'Vous n\'avez pas les permissions pour annuler la validation de cette tâche');
      } else if (error.response?.status === 400) {
        Alert.alert('Erreur', 'Cette tâche ne peut pas être dévalidée dans son état actuel');
      } else {
        Alert.alert('Erreur', 'Erreur lors de l\'annulation de la validation');
      }
      animateCheckbox(1);
    } finally {
      setIsUpdating(false);
    }
  }, [task, onTaskUpdate, isUpdating, animateCheckbox]);

  // 4. Tous les useMemo - SUPPRIMÉS pour assurer la réactivité
  // const validationColor = useMemo(() => 
  //   getValidationColor(task.validated_by || null), 
  //   [getValidationColor, task.validated_by]
  // );

  // const validationText = useMemo(() => 
  //   getValidationText(task.validated_by || null), 
  //   [getValidationText, task.validated_by]
  // );

  // 5. Rendu du composant (pas de hooks conditionnels)
  const renderCardContent = () => {
    // Calculer les valeurs directement pour assurer la réactivité
    const currentValidationColor = getValidationColor(task.validated_by || null);
    const currentValidationText = getValidationText(task.validated_by || null);
    
    return (
      <View style={compact ? {} : { padding: spacing[4] }}>
        {/* En-tête avec titre et statut de validation */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: compact ? 12 : 16 
        }}>
          <View style={{ flex: 1, marginRight: spacing[3] }}>
            <Text 
              variant={compact ? "body" : "h3"} 
              weight="semibold" 
              numberOfLines={2}
              style={[
                { marginBottom: 6 },
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
                  { lineHeight: 20 },
                  task.validated_by ? styles.completedText : null
                ]}
              >
                {task.description}
              </Text>
            )}
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <Badge 
              text={currentValidationText} 
              color={currentValidationColor}
            />
          </View>
        </View>

        {/* Statut de validation avec checkbox cliquable améliorée */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: compact ? 12 : 16 
        }}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={[
                styles.checkbox,
                compact ? styles.checkboxCompact : null,
                task.validated_by ? styles.checkboxChecked : null,
                isUpdating && styles.checkboxUpdating
              ]}
              onPress={task.validated_by ? unvalidateTask : validateTask}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {task.validated_by ? (
                <Ionicons 
                  name="checkmark" 
                  size={compact ? 16 : 20} 
                  color="white" 
                />
              ) : (
                <View style={styles.checkboxInner} />
              )}
            </TouchableOpacity>
          </Animated.View>
          
          <Text 
            variant={compact ? "small" : "body"} 
            color="secondary"
            style={{ marginLeft: spacing[3], flex: 1 }}
          >
            {currentValidationText}
          </Text>

          {/* Indicateur de chargement amélioré */}
          {isUpdating && (
            <View style={styles.loadingIndicator}>
              <Ionicons name="sync" size={16} color={theme.primary} />
            </View>
          )}
        </View>

        {/* Événement associé */}
        {showEvent && task.event_id && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            paddingTop: compact ? 8 : 12,
            borderTopWidth: 1,
            borderTopColor: theme.border
          }}>
            <Ionicons 
              name="calendar-outline" 
              size={compact ? 14 : 16} 
              color={theme.textSecondary} 
              style={{ marginRight: 6 }} 
            />
            <Text 
              variant="small" 
              color="secondary"
            >
              Événement #{task.event_id}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const cardContent = (
    <View style={{
      borderLeftWidth: 6,
      borderLeftColor: getValidationColor(task.validated_by || null), // Utiliser la fonction directement
    }}>
      {renderCardContent()}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant={variant} padding={compact ? "small" : "medium"}>
          {cardContent}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card variant={variant} padding={compact ? "small" : "medium"}>
      {cardContent}
    </Card>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkboxCompact: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
  },
  checkboxUpdating: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
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

export default TaskCard;