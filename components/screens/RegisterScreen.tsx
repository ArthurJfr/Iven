import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link } from "expo-router";

export default function RegisterScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setError("");
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Inscription réussie
    }, 1200);
  };

  return (
    <KeyboardAvoidingView 
      style={[layoutStyles.container, themedStyles.surface]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={[layoutStyles.containerCenteredPadded]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: 400, alignItems: 'center' }}>
          <Text variant="h1" weight="bold" style={{ marginBottom: spacing[8] }}>
            Inscription
          </Text>
          
          <View style={{ width: '100%', gap: spacing[4] }}>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Input
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
                style={{ flex: 1 }}
              />
            </View>
            
            <Input
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Input
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            {error ? <ErrorText>{error}</ErrorText> : null}
            
            <Button 
              title={loading ? "Inscription..." : "S'inscrire"}
              onPress={handleRegister} 
              disabled={loading}
            />
            
            <Link href="/auth/login" asChild>
              <Text variant="body" color="primary" style={{ textAlign: 'center', marginTop: spacing[4] }}>
                Déjà un compte ? Se connecter
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}