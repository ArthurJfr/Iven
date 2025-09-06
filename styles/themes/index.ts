 // Thèmes mis à jour avec les tokens
import { colors } from '../tokens/colors';

export const lightTheme = {
  // Couleurs de fond
  background: colors.white,
  backgroundSecondary: colors.gray[50],
  backgroundTertiary: colors.gray[100],

  // Couleurs de fond des cards
  cardBackground: colors.gray[50],
  cardBackgroundSecondary: colors.gray[100],
  cardBackgroundTertiary: colors.gray[200],
  
  // Couleurs de texte
  text: colors.gray[900],
  textSecondary: colors.gray[600],
  textTertiary: colors.gray[400],
  
  // Couleurs de marque
  primary: colors.primary[500],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[700],
  secondary: colors.primary[300], // Couleur secondaire basée sur la primaire
  accent: colors.primary[600],    // Couleur d'accent
  info: colors.primary[400],      // Couleur d'information
  
  // Couleurs sémantiques
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  
  // Couleurs d'interface
  border: colors.gray[200],
  borderLight: colors.gray[100],
  borderDark: colors.gray[300],
  
  // Couleurs interactives
  buttonText: colors.white,
  buttonSecondary: colors.gray[100],
  buttonSecondaryText: colors.gray[700],
  
  // États
  hover: colors.gray[50],
  pressed: colors.gray[100],
  disabled: colors.gray[300],
  disabledText: colors.gray[400],
};

export const darkTheme = {
  // Couleurs de fond
  background: colors.gray[900],
  backgroundSecondary: colors.gray[800],
  backgroundTertiary: colors.gray[700],
  
  // Couleurs de fond des cards
  cardBackground: colors.gray[900],
  cardBackgroundSecondary: colors.gray[800],
  cardBackgroundTertiary: colors.gray[700],
  
  // Couleurs de texte
  text: colors.white,
  textSecondary: colors.gray[300],
  textTertiary: colors.gray[400],
  
  // Couleurs de marque
  primary: colors.primary[400],
  primaryLight: colors.primary[300],
  primaryDark: colors.primary[600],
  secondary: colors.primary[200], // Couleur secondaire pour le mode sombre
  accent: colors.primary[500],    // Couleur d'accent pour le mode sombre
  info: colors.primary[300],      // Couleur d'information pour le mode sombre
  
  // Couleurs sémantiques
  success: colors.success[500],
  warning: colors.warning[500], 
  error: colors.error[500],
  
  // Couleurs d'interface
  border: colors.gray[700],
  borderLight: colors.gray[600],
  borderDark: colors.gray[800],
  
  // Couleurs interactives
  buttonText: colors.white,
  buttonSecondary: colors.gray[700],
  buttonSecondaryText: colors.gray[200],
  
  // États
  hover: colors.gray[800],
  pressed: colors.gray[700],
  disabled: colors.gray[600],
  disabledText: colors.gray[500],
};

export type Theme = typeof lightTheme;