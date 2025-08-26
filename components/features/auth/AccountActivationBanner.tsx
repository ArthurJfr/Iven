import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { spacing } from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../ui/atoms/Text';

interface AccountActivationBannerProps {
  email: string;
  onActivatePress: () => void;
  onDismiss?: () => void;
  variant?: 'info' | 'warning' | 'success';
}

export default function AccountActivationBanner({
  email,
  onActivatePress,
  onDismiss,
  variant = 'warning'
}: AccountActivationBannerProps) {
  const { theme } = useTheme();
  
  const getVariantConfig = () => {
    switch (variant) {
      case 'info':
        return {
          backgroundColor: theme.primary + '15',
          borderColor: theme.primary,
          iconColor: theme.primary,
          iconName: 'information-circle' as const
        };
      case 'success':
        return {
          backgroundColor: theme.success + '15',
          borderColor: theme.success,
          iconColor: theme.success,
          iconName: 'checkmark-circle' as const
        };
      case 'warning':
      default:
        return {
          backgroundColor: theme.warning + '15',
          borderColor: theme.warning,
          iconColor: theme.warning,
          iconName: 'warning' as const
        };
    }
  };
  
  const config = getVariantConfig();
  
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }
    ]}>
      <View style={styles.content}>
        <Ionicons 
          name={config.iconName} 
          size={24} 
          color={config.iconColor}
          style={styles.icon}
        />
        
        <View style={styles.textContainer}>
          <Text variant="body" weight="semibold" style={{ color: theme.text }}>
            Compte non activé
          </Text>
          <Text variant="caption" style={{ color: theme.textSecondary, marginTop: spacing[1] }}>
            Votre compte ({email}) n'est pas encore activé. Activez-le pour accéder à toutes les fonctionnalités.
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.activateButton, { backgroundColor: config.iconColor }]}
          onPress={onActivatePress}
        >
          <Text variant="caption" weight="semibold" style={{ color: '#fff' }}>
            Activer
          </Text>
        </TouchableOpacity>
        
        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <Ionicons name="close" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: spacing[2],
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  activateButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 6,
    marginRight: spacing[2],
  },
  dismissButton: {
    padding: spacing[1],
  },
});
