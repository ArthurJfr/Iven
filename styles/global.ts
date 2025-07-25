import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  // Conteneurs
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPadding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  
  // Textes
  titleXl: {
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 20,
  },
  titleLg: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  titleMd: {  
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  titleSm: {
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  textXl: {
    fontSize: 48,
  },
  textLg: {
    fontSize: 32,
  },
  textMd: { 
    fontSize: 24,
  },
  textSm: {
    fontSize: 16,
  },
  textXs: {
    fontSize: 12,
  },
  textCenter: {
    textAlign: "center",
  },
  
  // Espacement
  marginTop: {
    marginTop: 8,
  },
  marginVertical: {
    marginVertical: 8,
  },
  
  // Erreurs
  error: {
    color: "red",
    marginBottom: 8,
    fontSize: 16,
  },
  
  // Boutons
  button: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  
  // Inputs améliorés
  input: {
    width: "85%",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Fonctions utilitaires avec thème
export const themedStyles = (theme: any) => ({
  container: {
    ...globalStyles.container,
    backgroundColor: theme.background,
  },
  titleXl: {
    ...globalStyles.titleXl,
    color: theme.text,
  },
  titleLg: {
    ...globalStyles.titleLg,
    color: theme.text,
  },
  titleMd: {
    ...globalStyles.titleMd,
    color: theme.text,
  },
  titleSm: {
    ...globalStyles.titleSm,
    color: theme.text,
  },
  subtitle: {
    ...globalStyles.subtitle,
    color: theme.text,
  },
  textXl: {
    ...globalStyles.textXl,
    color: theme.text,
  },
  textLg: {
    ...globalStyles.textLg,
    color: theme.text,
  },
  textMd: {
    ...globalStyles.textMd,
    color: theme.text,
  },
  textSm: {
    ...globalStyles.textSm,
    color: theme.text,
  },
  textXs: {
    ...globalStyles.textXs,
    color: theme.text,
  },
  input: {
    ...globalStyles.input,
    color: theme.text,
    backgroundColor: theme.background,
    borderColor: theme.text,
    shadowColor: theme.text,
  },
  button: {
    ...globalStyles.button,
    backgroundColor: theme.primary,
  },
  buttonText: {
    ...globalStyles.buttonText,
    color: theme.buttonText,
  },
}); 