import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import Card from '../../ui/Card';
import { spacing } from '../../../styles';

interface SettingItem {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

interface HomeSettingsProps {
  onProfilePress: () => void;
  onLogoutPress: () => void;
  userEmail?: string;
  style?: any;
  compact?: boolean;
}

const HomeSettings = React.memo(({
  onProfilePress,
  onLogoutPress,
  userEmail,
  style,
  compact = false
}: HomeSettingsProps) => {
  const { theme } = useTheme();

  // Mémoriser les paramètres essentiels
  const settings = useMemo(() => [
    {
      title: 'Mon profil',
      subtitle: userEmail || 'Gérer mon compte',
      icon: 'person',
      color: theme.primary,
      route: 'profile'
    },
    {
      title: 'Se déconnecter',
      subtitle: 'Revenir à l\'écran de connexion',
      icon: 'log-out',
      color: '#FF453A',
      route: 'logout'
    }
  ], [userEmail, theme.primary]);

  // Mémoriser la fonction de gestion des clics sur les paramètres
  const handleSettingPress = useCallback((route: string) => {
    if (route === 'logout') {
      onLogoutPress();
    } else if (route === 'profile') {
      onProfilePress();
    }
  }, [onProfilePress, onLogoutPress]);

  // Mémoriser les éléments de paramètres pour éviter les recalculs
  const settingItems = useMemo(() => settings.map((setting, index) => (
    <TouchableOpacity
      key={`${setting.title}-${index}`}
      onPress={() => handleSettingPress(setting.route)}
      activeOpacity={0.7}
    >
      <Card 
        variant="outlined" 
        padding="medium"
        style={{
          ...styles.settingCard,
          marginBottom: index < settings.length - 1 ? spacing[3] : 0,
          borderColor: setting.route === 'logout' ? '#FF453A' + '30' : theme.border
        }}
      >
        <View style={styles.settingContent}>
          <View style={[
            styles.iconContainer, 
            { 
              backgroundColor: setting.color + '15',
              width: compact ? 36 : 40,
              height: compact ? 36 : 40,
              borderRadius: compact ? 18 : 20
            }
          ]}>
            <Ionicons 
              name={setting.icon as any} 
              size={compact ? 16 : 20} 
              color={setting.color} 
            />
          </View>
          
          <View style={styles.settingInfo}>
            <Text 
              variant={compact ? "small" : "body"} 
              weight="medium" 
              style={[
                styles.settingTitle,
                setting.route === 'logout' && { color: '#FF453A' }
              ]}
            >
              {setting.title}
            </Text>
            <Text 
              variant={compact ? "caption" : "small"} 
              color="secondary" 
              style={styles.settingSubtitle}
            >
              {setting.subtitle}
            </Text>
          </View>
          
          <Ionicons 
            name="chevron-forward" 
            size={compact ? 14 : 16} 
            color={setting.route === 'logout' ? '#FF453A' : theme.textSecondary} 
          />
        </View>
      </Card>
    </TouchableOpacity>
  )), [settings, handleSettingPress, compact, theme.textSecondary, theme.border]);

  return (
    <View style={[styles.container, style]}>
      <Text variant="h3" weight="semibold" style={styles.title}>
        Paramètres
      </Text>
      
      <View style={styles.settingsList}>
        {settingItems}
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
  },
  settingsList: {
    paddingHorizontal: spacing[5],
  },
  settingCard: {
    marginBottom: spacing[3],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing[2],
  },
  settingTitle: {
    marginBottom: spacing[1],
  },
  settingSubtitle: {
    lineHeight: 16,
  },
});

// Export par défaut pour maintenir la compatibilité
export default HomeSettings;
