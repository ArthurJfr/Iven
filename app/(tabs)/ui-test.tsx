import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, spacing } from "../../styles";
import Input from "../../components/ui/Input";

export default function UITestScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  // États pour les différents inputs
  const [basicInput, setBasicInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [errorInput, setErrorInput] = useState('invalid-email');
  const [multilineInput, setMultilineInput] = useState('');

  return (
    <ScrollView style={[themedStyles.surface]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        🎨 Test du composant Input
      </Text>
      
      {/* Input basique */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Input basique</Text>
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          value={basicInput}
          onChangeText={setBasicInput}
          helperText="Entrez votre nom et prénom"
        />
      </View>

      {/* Variantes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Variantes</Text>
        <Input
          label="Outlined (default)"
          variant="outlined"
          placeholder="Outlined input"
          value={emailInput}
          onChangeText={setEmailInput}
        />
        <Input
          label="Filled"
          variant="filled"
          placeholder="Filled input"
          value={emailInput}
          onChangeText={setEmailInput}
        />
      </View>

      {/* Tailles */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tailles</Text>
        <Input
          label="Small"
          size="small"
          placeholder="Small input"
          value={basicInput}
          onChangeText={setBasicInput}
        />
        <Input
          label="Medium (default)"
          size="medium"
          placeholder="Medium input"
          value={basicInput}
          onChangeText={setBasicInput}
        />
        <Input
          label="Large"
          size="large"
          placeholder="Large input"
          value={basicInput}
          onChangeText={setBasicInput}
        />
      </View>

      {/* Input avec icônes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Avec icônes</Text>
        <Input
          label="Email"
          placeholder="votre@email.com"
          value={emailInput}
          onChangeText={setEmailInput}
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        <Input
          label="Rechercher"
          placeholder="Tapez votre recherche..."
          value={searchInput}
          onChangeText={setSearchInput}
          leftIcon="search"
          rightIcon={searchInput ? "close-circle" : undefined}
          onRightIconPress={() => setSearchInput('')}
        />
      </View>

      {/* Password input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Mot de passe</Text>
        <Input
          label="Mot de passe"
          placeholder="••••••••"
          value={passwordInput}
          onChangeText={setPasswordInput}
          leftIcon="lock-closed"
          secureTextEntry
          showPasswordToggle
          required
        />
      </View>

      {/* États d'erreur */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>États</Text>
        <Input
          label="Input avec erreur"
          placeholder="Format invalide"
          value={errorInput}
          onChangeText={setErrorInput}
          error
          errorText="Format d'email invalide"
          leftIcon="warning"
        />
        <Input
          label="Input désactivé"
          placeholder="Non modifiable"
          value="Valeur fixe"
          disabled
        />
      </View>

      {/* Multiline */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Multiline</Text>
        <Input
          label="Message"
          placeholder="Tapez votre message..."
          value={multilineInput}
          onChangeText={setMultilineInput}
          multiline
          numberOfLines={4}
          helperText="Maximum 500 caractères"
        />
      </View>

      {/* Formulaire exemple */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Formulaire exemple</Text>
        <FormExample />
      </View>
    </ScrollView>
  );
}

// Composant formulaire d'exemple
function FormExample() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const updateField = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasPasswordMismatch = formData.password !== formData.confirmPassword && formData.confirmPassword !== '';

  return (
    <View>
      <Input
        label="Nom d'utilisateur"
        placeholder="johndoe123"
        value={formData.username}
        onChangeText={updateField('username')}
        leftIcon="person"
        required
        helperText="Minimum 3 caractères"
      />
      
      <Input
        label="Email"
        placeholder="votre@email.com"
        value={formData.email}
        onChangeText={updateField('email')}
        leftIcon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      
      <Input
        label="Mot de passe"
        placeholder="••••••••"
        value={formData.password}
        onChangeText={updateField('password')}
        leftIcon="lock-closed"
        secureTextEntry
        showPasswordToggle
        required
      />
      
      <Input
        label="Confirmer le mot de passe"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChangeText={updateField('confirmPassword')}
        leftIcon="lock-closed"
        secureTextEntry
        showPasswordToggle
        error={hasPasswordMismatch}
        errorText={hasPasswordMismatch ? 'Les mots de passe ne correspondent pas' : undefined}
        required
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing[6],
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[4],
  },
});