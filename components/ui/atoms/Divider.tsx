import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'small' | 'medium' | 'large';
  color?: string;
  thickness?: number;
  style?: any;
}

export default function Divider({ 
  orientation = 'horizontal', 
  spacing = 'medium',
  color,
  thickness = 1,
  style
}: DividerProps) {
  const { theme } = useTheme();

  const getSpacingStyle = () => {
    const spacingValue = spacing === 'small' ? 8 : spacing === 'large' ? 24 : 16;
    
    if (orientation === 'horizontal') {
      return { marginVertical: spacingValue };
    } else {
      return { marginHorizontal: spacingValue };
    }
  };

  const getDividerStyle = () => {
    const dividerColor = color || theme.border;
    
    if (orientation === 'horizontal') {
      return {
        height: thickness,
        width: '100%',
        backgroundColor: dividerColor,
      };
    } else {
      return {
        width: thickness,
        height: '100%',
        backgroundColor: dividerColor,
      };
    }
  };

  return (
    <View style={[getSpacingStyle(), style]}>
      <View style={getDividerStyle()} />
    </View>
  );
}