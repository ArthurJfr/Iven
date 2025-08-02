import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
}

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'medium' 
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'success': return styles.success;
      case 'warning': return styles.warning;
      case 'error': return styles.error;
      default: return styles.primary;
    }
  };

  const getSizeStyle = () => {
    return size === 'small' ? styles.small : styles.medium;
  };

  const getTextColor = () => {
    return variant === 'secondary' ? '#666' : '#FFF';
  };

  return (
    <View style={[styles.container, getVariantStyle(), getSizeStyle()]}>
      <Text 
        variant={size === 'small' ? 'small' : 'caption'} 
        style={{ color: getTextColor() }}
        weight="medium"
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#F0F0F0',
  },
  success: {
    backgroundColor: '#34C759',
  },
  warning: {
    backgroundColor: '#FF9500',
  },
  error: {
    backgroundColor: '#FF3B30',
  },
});

