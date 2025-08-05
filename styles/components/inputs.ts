// Styles des inputs - Version améliorée
import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const inputStyles = StyleSheet.create({
  // Container principal
  container: {
    marginBottom: spacing[4],
    width: '100%',
  },
  
  // Labels
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing[2],
  },
  
  labelSmall: {
    fontSize: typography.fontSizes.xs,
  },
  
  labelLarge: {
    fontSize: typography.fontSizes.base,
  },
  
  // Input de base
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.fontSizes.base,
    minHeight: 48,
  },
  
  // Variantes d'input
  inputOutlined: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  
  inputFilled: {
    borderWidth: 0,
  },
  
  // Tailles
  inputSmall: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 40,
    fontSize: typography.fontSizes.sm,
  },
  
  inputMedium: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
    fontSize: typography.fontSizes.base,
  },
  
  inputLarge: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    minHeight: 56,
    fontSize: typography.fontSizes.lg,
  },
  
  // États
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  inputFocused: {
    borderWidth: 2,
  },
  
  inputError: {
    borderWidth: 2,
  },
  
  inputDisabled: {
    opacity: 0.6,
  },
  
  // Container avec icônes
  inputWithIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  leftIcon: {
    marginRight: spacing[2],
  },
  
  rightIcon: {
    marginLeft: spacing[2],
    padding: spacing[1],
  },
  
  // Textes d'aide
  helperText: {
    fontSize: typography.fontSizes.xs,
    marginTop: spacing[1],
    lineHeight: 16,
  },
  
  errorText: {
    fontSize: typography.fontSizes.xs,
    marginTop: spacing[1],
    lineHeight: 16,
  },
  
  // Composants spéciaux
  required: {
    fontSize: typography.fontSizes.sm,
  },
  
  // Styles pour password toggle
  passwordToggle: {
    padding: spacing[2],
  },
}); 