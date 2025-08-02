// Styles des boutons
import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { typography } from '../tokens/typography';

export const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flexDirection: 'row',
  },
  
  // Tailles
  small: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    minHeight: 36,
  },
  
  medium: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    minHeight: 48,
  },
  
  large: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    minHeight: 56,
  },
  
  // Styles de texte
  text: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  
  textSmall: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  
  textLarge: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
  },
  
  // États
  pressed: {
    opacity: 0.8,
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  // Ombre
  shadow: {
    ...shadows.sm,
  },
}); 