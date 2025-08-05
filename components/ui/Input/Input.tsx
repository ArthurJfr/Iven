import React, { useState, forwardRef } from "react";
import { 
  TextInput, 
  TextInputProps, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { createThemedStyles, spacing, typography } from "../../../styles";
import { Ionicons } from "@expo/vector-icons";

// Types pour les variantes et états
export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = 'small' | 'medium' | 'large';
export type InputState = 'default' | 'focused' | 'error' | 'disabled';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  // Props de base
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  
  // Variantes et tailles
  variant?: InputVariant;
  size?: InputSize;
  
  // États
  error?: boolean;
  disabled?: boolean;
  
  // Icônes et actions
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  
  // Styles personnalisés
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  
  // Props spéciaux
  autoFocus?: boolean;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
}

const Input = forwardRef<TextInput, InputProps>(({
  // Props de base
  label,
  placeholder,
  helperText,
  errorText,
  required = false,
  
  // Variantes et tailles  
  variant = 'outlined',
  size = 'medium',
  
  // États
  error = false,
  disabled = false,
  
  // Icônes et actions
  leftIcon,
  rightIcon,
  onRightIconPress,
  showPasswordToggle = false,
  
  // Styles personnalisés
  containerStyle,
  inputStyle,
  labelStyle,
  
  // Props TextInput
  secureTextEntry = false,
  multiline = false,
  numberOfLines,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  // États internes
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  
  // Déterminer l'état actuel
  const currentState: InputState = disabled ? 'disabled' : 
    error || errorText ? 'error' : 
    isFocused ? 'focused' : 'default';
  
  // Handlers pour le focus
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Calculer les styles dynamiques
  const containerStyles = [
    styles.container,
    containerStyle
  ];
  
  const labelStyles = [
    styles.label,
    themedStyles.text,
    size === 'small' && styles.labelSmall,
    size === 'large' && styles.labelLarge,
    labelStyle
  ];
  
  const inputContainerStyles = [
    styles.inputContainer,
    styles[`inputContainer_${variant}`],
    styles[`inputContainer_${size}`],
    variant === 'outlined' && { borderColor: theme.border },
    variant === 'filled' && { backgroundColor: theme.backgroundSecondary },
    currentState === 'focused' && [
      styles.inputContainerFocused,
      { borderColor: theme.primary }
    ],
    currentState === 'error' && [
      styles.inputContainerError,
      { borderColor: theme.error }
    ],
    currentState === 'disabled' && [
      styles.inputContainerDisabled,
      { backgroundColor: theme.disabled, borderColor: theme.disabled }
    ],
  ];
  
  const textInputStyles = [
    styles.textInput,
    styles[`textInput_${size}`],
    { color: theme.text },
    multiline && styles.textInputMultiline,
    disabled && { color: theme.disabledText },
    inputStyle
  ];
  
  const helperTextStyles = [
    styles.helperText,
    { color: theme.textSecondary },
    currentState === 'error' && { color: theme.error }
  ];
  
  // Icône à droite (password toggle ou custom)
  const getRightIcon = () => {
    if (showPasswordToggle && secureTextEntry) {
      return isPasswordVisible ? 'eye-off' : 'eye';
    }
    return rightIcon;
  };
  
  const handleRightIconPress = () => {
    if (showPasswordToggle && secureTextEntry) {
      togglePasswordVisibility();
    } else {
      onRightIconPress?.();
    }
  };
  
  return (
    <View style={containerStyles}>
      {/* Label */}
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={[styles.required, { color: theme.error }]}> *</Text>}
        </Text>
      )}
      
      {/* Input Container */}
      <View style={inputContainerStyles}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon as any} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={currentState === 'error' ? theme.error : 
                    currentState === 'focused' ? theme.primary : 
                    theme.textSecondary} 
            />
          </View>
        )}
        
        {/* Text Input */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          style={textInputStyles}
          {...props}
        />
        
        {/* Right Icon */}
        {getRightIcon() && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={handleRightIconPress}
            disabled={!showPasswordToggle && !onRightIconPress}
          >
            <Ionicons 
              name={getRightIcon() as any} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={currentState === 'error' ? theme.error : 
                    currentState === 'focused' ? theme.primary : 
                    theme.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Helper Text / Error Text */}
      {(helperText || errorText) && (
        <Text style={helperTextStyles}>
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
});

// Styles du composant
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
    width: '100%',
  },
  
  // Label styles
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as any,
    marginBottom: spacing[2],
  },
  labelSmall: {
    fontSize: typography.fontSizes.xs,
  },
  labelLarge: {
    fontSize: typography.fontSizes.base,
  },
  required: {
    fontSize: typography.fontSizes.sm,
  },
  
  // Input container styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  // Variantes
  inputContainer_default: {
    borderWidth: 1,
  },
  inputContainer_outlined: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  inputContainer_filled: {
    borderWidth: 0,
  },
  
  // Tailles
  inputContainer_small: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 40,
  },
  inputContainer_medium: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
  },
  inputContainer_large: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    minHeight: 56,
  },
  
  // États
  inputContainerFocused: {
    borderWidth: 2,
  },
  inputContainerError: {
    borderWidth: 2,
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  
  // Text Input
  textInput: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    padding: 0, // Remove default padding
  },
  textInput_small: {
    fontSize: typography.fontSizes.sm,
  },
  textInput_medium: {
    fontSize: typography.fontSizes.base,
  },
  textInput_large: {
    fontSize: typography.fontSizes.lg,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  
  // Icons
  leftIconContainer: {
    marginRight: spacing[2],
  },
  rightIconContainer: {
    marginLeft: spacing[2],
    padding: spacing[1],
  },
  
  // Helper text
  helperText: {
    fontSize: typography.fontSizes.xs,
    marginTop: spacing[1],
    lineHeight: 16,
  },
});

Input.displayName = 'Input';

export default Input;