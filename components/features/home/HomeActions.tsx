import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import { spacing } from '../../../styles';
import { Link } from 'expo-router';

interface ActionItem {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

interface HomeActionsProps {
  actions: ActionItem[];
  onActionPress: (route: string) => void;
  style?: any;
  compact?: boolean;
}

const HomeActions = React.memo(({
  actions,
  onActionPress,
  style,
  compact = false
}: HomeActionsProps) => {
  const { theme } = useTheme();

  // Mémoriser la fonction de gestion des actions
  const handleActionPress = useCallback((route: string) => {
    onActionPress(route);
  }, [onActionPress]);

  // Mémoriser les actions pour éviter les recalculs
  const actionItems = useMemo(() => actions.map((action, index) => (
    <Link key={`${action.title}-${index}`} href={action.route} asChild>
    <TouchableOpacity
      onPress={() => handleActionPress(action.route)}
      activeOpacity={0.7}
    >
      <Card 
        variant="elevated" 
        padding="medium"
        style={{
          ...styles.actionCard,
          marginBottom: index < actions.length - 1 ? spacing[3] : 0
        }}
      >
        <View style={styles.actionContent}>
          <View style={[
            styles.iconContainer, 
            { 
              backgroundColor: action.color + '15',
              width: compact ? 40 : 48,
              height: compact ? 40 : 48,
              borderRadius: compact ? 20 : 24
            }
          ]}>
            <Ionicons 
              name={action.icon as any} 
              size={compact ? 20 : 24} 
              color={action.color} 
            />
          </View>
          
          <View style={styles.actionInfo}>
            <Text 
              variant={compact ? "body" : "h3"} 
              weight="semibold" 
              style={styles.actionTitle}
            >
              {action.title}
            </Text>
            <Text 
              variant={compact ? "small" : "body"} 
              color="secondary" 
              style={styles.actionSubtitle}
            >
              {action.subtitle}
            </Text>
          </View>
          
          <Ionicons 
            name="chevron-forward" 
            size={compact ? 16 : 20} 
            color={theme.textSecondary} 
          />
        </View>
      </Card>
    </TouchableOpacity>
    </Link>
  )), [actions, handleActionPress, compact, theme.textSecondary]);

  return (
    <View style={[styles.container, style]}>
      <Text variant="h3" weight="semibold" style={styles.title}>
        Actions rapides
      </Text>
      <View style={styles.actionsList}>
        {actionItems}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  title: {
    marginBottom: spacing[4],
    paddingHorizontal: spacing[5],
  },
  actionsList: {
    paddingHorizontal: spacing[5],
  },
  actionCard: {
    marginBottom: spacing[3],
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  actionInfo: {
    flex: 1,
    marginRight: spacing[2],
  },
  actionTitle: {
    marginBottom: spacing[1],
  },
  actionSubtitle: {
    lineHeight: 18,
  },
});

// Export par défaut pour maintenir la compatibilité
export default HomeActions;
