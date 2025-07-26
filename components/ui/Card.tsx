import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'small' | 'medium' | 'large';
  margin?: number;
  style?: ViewStyle;
  disabled?: boolean;
  showShadow?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  onPress,
  variant = 'default',
  padding = 'medium',
  margin = 0,
  style,
  disabled = false,
  showShadow = true,
}: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.background,
      borderRadius: 12,
      margin,
    };

    // Styles selon la variante
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: theme.background,
        };
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          ...(showShadow && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }),
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'small':
        return { padding: 12 };
      case 'large':
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        localStyles.container,
        getCardStyle(),
        getPaddingStyle(),
        disabled && localStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {(title || subtitle) && (
        <View style={localStyles.header}>
          {title && (
            <Text style={[localStyles.title, { color: theme.text }]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[localStyles.subtitle, { color: theme.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={localStyles.content}>
        {children}
      </View>
    </Container>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  disabled: {
    opacity: 0.6,
  },
}); 