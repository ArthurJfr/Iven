// Styles typographiques
import { StyleSheet } from 'react-native';
import { typography } from '../tokens/typography';

export const typographyStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: typography.fontSizes['5xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.fontSizes['5xl'] * typography.lineHeights.tight,
    marginBottom: 24,
  },
  
  h2: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.fontSizes['3xl'] * typography.lineHeights.tight,
    marginBottom: 20,
  },
  
  h3: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.fontSizes['2xl'] * typography.lineHeights.snug,
    marginBottom: 16,
  },
  
  h4: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.fontSizes.xl * typography.lineHeights.snug,
    marginBottom: 12,
  },
  
  // Body text
  body: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },
  
  bodyLarge: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.fontSizes.lg * typography.lineHeights.normal,
  },
  
  // Support text
  caption: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.normal,
  },
  
  small: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.fontSizes.xs * typography.lineHeights.normal,
  },
  
  // Utilities
  textCenter: {
    textAlign: 'center',
  },
  
  textLeft: {
    textAlign: 'left',
  },
  
  textRight: {
    textAlign: 'right',
  },
}); 