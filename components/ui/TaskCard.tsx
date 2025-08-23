import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import Text from './atoms/Text';
import Card from './Card';
import Badge from './atoms/Badge';
import { Task } from '../../types/tasks';
import { taskService, TaskService } from '../../services/TaskService';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  showEvent?: boolean;
  compact?: boolean;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export default function TaskCard({ 
  task, 
  onPress, 
  showEvent = false,
  compact = false,
  variant = 'elevated'
}: TaskCardProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const getValidationColor = (validatedBy: number | null) => {
    return TaskService.getValidationColor(validatedBy);
  };

  const getValidationIcon = (validatedBy: number | null) => {
    return TaskService.getValidationIcon(validatedBy);
  };

  const getValidationText = (validatedBy: number | null) => {
    return TaskService.getValidationText(validatedBy);
  };

  const CardContent = () => (
    <View style={compact ? {} : { padding: spacing[4] }}>
      {/* En-tête avec titre et statut de validation */}
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
            {task.title}
          </Text>
          
          {task.description && !compact && (
            <Text 
              variant="small" 
              color="secondary" 
              numberOfLines={2}
              style={{ lineHeight: 18 }}
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

      {/* Statut de validation */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: compact ? spacing[2] : spacing[3] 
      }}>
        <View style={{
          width: compact ? 12 : 16,
          height: compact ? 12 : 16,
          borderRadius: compact ? 6 : 8,
          backgroundColor: getValidationColor(task.validated_by || null) + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing[2]
        }}>
          <Ionicons 
            name={getValidationIcon(task.validated_by || null) as any} 
            size={compact ? 8 : 10} 
            color={getValidationColor(task.validated_by || null)} 
          />
        </View>
        
        <Text 
          variant={compact ? "small" : "body"} 
          color="secondary"
          style={{ marginRight: spacing[3] }}
        >
          {getValidationText(task.validated_by || null)}
        </Text>
      </View>

      {/* Événement associé */}
      {showEvent && task.event_id && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          paddingTop: compact ? spacing[1] : spacing[2],
          borderTopWidth: 1,
          borderTopColor: theme.border
        }}>
          <Ionicons 
            name="calendar-outline" 
            size={compact ? 12 : 14} 
            color={theme.textSecondary} 
            style={{ marginRight: spacing[1] }} 
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
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant={variant} padding={compact ? "small" : "medium"}>
          <View style={{
            borderLeftWidth: 4,
            borderLeftColor: getValidationColor(task.validated_by || null),
          }}>
            <CardContent />
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
        <CardContent />
      </View>
    </Card>
  );
}
