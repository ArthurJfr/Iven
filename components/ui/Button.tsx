import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({ title, variant = 'primary', disabled = false, style, ...rest }: ButtonProps) {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  
  const getButtonStyle = () => {
    if (disabled) {
      return [localStyles.button, localStyles.disabled, style];
    }
    
    if (variant === 'secondary') {
      return [localStyles.button, localStyles.secondary, style];
    }
    
    return [localStyles.button, localStyles.primary, style];
  };

  const getTextStyle = () => {
    if (disabled) {
      return localStyles.disabledText;
    }
    
    if (variant === 'secondary') {
      return localStyles.secondaryText;
    }
    
    return localStyles.primaryText;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled}
      {...rest}
    >
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  disabled: {
    backgroundColor: '#9ca3af',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
