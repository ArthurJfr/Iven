// Export central de tous les styles
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/shadows';

export * from './themes';

export * from './components/typography';
export * from './components/buttons';
export * from './components/inputs';
export * from './components/layout';

// Fonction utilitaire pour obtenir les styles thématiques
import { Theme } from './themes';
import { colors } from './tokens/colors';

export const createThemedStyles = (theme: Theme) => ({
  // Couleurs dynamiques basées sur le thème
  primaryButton: {
    backgroundColor: theme.primary,
  },
  secondaryButton: {
    backgroundColor: theme.buttonSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  input: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    color: theme.text,
  },
  inputFocused: {
    borderColor: theme.primary,
  },
  inputError: {
    borderColor: theme.error,
  },
  text: {
    color: theme.text,
  },
  textSecondary: {
    color: theme.textSecondary,
  },
  textPrimary: {
    color: theme.primary,
  },
  textSuccess: {
    color: theme.success,
  },
  textWarning: {
    color: theme.warning,
  },
  textError: {
    color: theme.error,
  },
  surface: {
    backgroundColor: theme.background,
  },
  surfaceSecondary: {
    backgroundColor: theme.backgroundSecondary,
  },
  border: {
    borderColor: theme.border,
  },
}); 