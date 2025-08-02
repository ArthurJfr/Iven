import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "test@iven.com" && password === "password") {
        // Connexion réussie
      } else {
        setError("Email ou mot de passe incorrect.");
      }
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
            Connexion
          </Text>
          
          <View style={{ width: '100%', gap: spacing[4] }}>
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
            
            {error ? <ErrorText>{error}</ErrorText> : null}
            
            <Button 
              title={loading ? "Connexion..." : "Se connecter"}
              onPress={handleLogin} 
              disabled={loading}
            />
            
            <Link href="/auth/forgot-password" asChild>
              <Text variant="body" color="primary" style={{ textAlign: 'center', marginTop: spacing[4] }}>
                Mot de passe oublié ?
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
