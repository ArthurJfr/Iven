import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, spacing } from "../../styles";
import Text from "./atoms/Text";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  disabled = false, 
  style, 
  ...rest 
}: ButtonProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.disabled,
      };
    }
    
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.backgroundSecondary,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.primary,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.disabledText;
    
    switch (variant) {
      case 'secondary':
        return theme.text;
      case 'outline':
        return theme.primary;
      default:
        return theme.buttonText;
    }
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled}
      {...rest}
    >
      <Text 
        variant="body" 
        weight="semibold"
        style={{ color: getTextColor() }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
