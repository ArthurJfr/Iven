import React from 'react';
import { View, ViewStyle } from 'react-native';
import Text from './Text';
import { spacing } from '../../../styles';

interface BadgeProps {
  text: string;
  color: string;
  variant?: 'default' | 'small';
  style?: ViewStyle;
}

export default function Badge({ text, color, variant = 'default', style }: BadgeProps) {
  const badgeStyle: ViewStyle = {
    backgroundColor: color + '20',
    borderColor: color,
    borderWidth: 1,
    borderRadius: variant === 'small' ? 10 : 12,
    paddingHorizontal: variant === 'small' ? spacing[2] : spacing[3],
    paddingVertical: variant === 'small' ? spacing[1] : spacing[1],
    alignSelf: 'flex-start',
  };

  return (
    <View style={[badgeStyle, style]}>
      <Text 
        variant={variant === 'small' ? 'small' : 'caption'} 
        weight="semibold"
        style={{ color }}
      >
        {text}
      </Text>
    </View>
  );
}

