import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { themedStyles } from '../../styles/global';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };

  leftAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };
}

export default function TopBar({
  title,
  showBackButton = false,
  onBackPress,
  rightAction,
  leftAction,
}: TopBarProps) {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[localStyles.container, { backgroundColor: theme.background }]}>
      <View style={localStyles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={localStyles.iconButton}
            accessibilityLabel="Retour"
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        {leftAction && (
          <TouchableOpacity
            onPress={leftAction.onPress}
            style={localStyles.iconButton}
            accessibilityLabel={leftAction.label || 'Action gauche'}
          >
            <Ionicons name={leftAction.icon} size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={localStyles.centerSection}>
        <Text style={styles.titleSm} numberOfLines={1}>
          {title} 
        </Text>
      </View>

      <View style={localStyles.rightSection}>
        {rightAction && (
          <View style={{flexDirection: 'row', alignItems: 'center', minWidth: 60, justifyContent: 'flex-end'}}>       
          <TouchableOpacity
            onPress={rightAction?.onPress}
            style={localStyles.iconButton}
            accessibilityLabel={rightAction?.label || 'Action droite'}
          >
            <Ionicons name={rightAction?.icon} size={24} color={theme.text} />
          </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
}); 