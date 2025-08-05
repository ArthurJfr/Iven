import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'small' | 'medium' | 'large';
}

export default function Divider({ 
  orientation = 'horizontal', 
  spacing = 'medium' 
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
    if (orientation === 'horizontal') {
      return {
        height: 1,
        width: '100%',
        backgroundColor: '#E5E7EB',
      };
    } else {
      return {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E7EB',
      };
    }
  };

  return (
    <View style={getSpacingStyle()}>
      <View style={[StyleSheet.create({
        divider: {
          height: orientation === 'horizontal' ? 1 : '100%',
          width: orientation === 'horizontal' ? '100%' : 1,
          backgroundColor: '#E5E7EB'
        }
      }).divider]} />
    </View>
  );
}