// Styles des inputs
import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing[2],
  },
  
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.fontSizes.base,
    minHeight: 48,
  },
  
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
  
  errorText: {
    fontSize: typography.fontSizes.sm,
    marginTop: spacing[1],
  },
}); 