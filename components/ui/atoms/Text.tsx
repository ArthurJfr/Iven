import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { typographyStyles, createThemedStyles } from '../../../styles';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export default function Text({ 
  variant = 'body', 
  color, 
  weight = 'normal',
  style,
  children,
  ...props 
}: TextProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1': return typographyStyles.h1;
      case 'h2': return typographyStyles.h2;
      case 'h3': return typographyStyles.h3;
      case 'h4': return typographyStyles.h4 || typographyStyles.h3; // Fallback vers h3 si h4 n'existe pas
      case 'body': return typographyStyles.body;
      case 'caption': return typographyStyles.caption;
      case 'small': return typographyStyles.small;
      default: return typographyStyles.body;
    }
  };

  const getColorStyle = () => {
    if (!color) return themedStyles.text;
    
    switch (color) {
      case 'primary': return themedStyles.textPrimary;
      case 'secondary': return themedStyles.textSecondary;
      case 'tertiary': return { color: theme.textTertiary };
      case 'error': return themedStyles.textError;
      case 'success': return themedStyles.textSuccess;
      case 'warning': return themedStyles.textWarning;
      default: return themedStyles.text;
    }
  };

  const getWeightStyle = (): { fontWeight: '500' | '600' | 'bold' | 'normal' } => {
    switch (weight) {
      case 'medium': return { fontWeight: '500' };
      case 'semibold': return { fontWeight: '600' };
      case 'bold': return { fontWeight: 'bold' };
      default: return { fontWeight: 'normal' };
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        getColorStyle(),
        getWeightStyle(),
        style
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
} 