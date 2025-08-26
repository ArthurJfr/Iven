import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from './Text';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function NotificationBadge({ 
  count, 
  size = 'medium',
  position = 'top-right' 
}: NotificationBadgeProps) {
  const { theme } = useTheme();
  
  if (count <= 0) return null;

  const getSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 10;
      case 'medium': return 12;
      case 'large': return 14;
      default: return 12;
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top-right': return { top: -2, right: -2 };
      case 'top-left': return { top: -2, left: -2 };
      case 'bottom-right': return { bottom: -2, right: -2 };
      case 'bottom-left': return { bottom: -2, left: -2 };
      default: return { top: -2, right: -2 };
    }
  };

  return (
    <View style={[
      styles.badge,
      {
        width: getSize(),
        height: getSize(),
        borderRadius: getSize() / 2,
        backgroundColor: theme.error,
        ...getPosition()
      }
    ]}>
      <Text 
        variant="caption" 
        weight="bold" 
        style={[
          styles.text,
          { 
            fontSize: getFontSize(),
            color: 'white'
          }
        ]}
      >
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 16,
    paddingHorizontal: 2,
  },
  text: {
    textAlign: 'center',
    lineHeight: 12,
  },
});
