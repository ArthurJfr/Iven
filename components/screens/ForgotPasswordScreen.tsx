import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendReset = () => {
    setError("");
    
    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      
      Alert.alert(
        "Email envoyé !",
        "Un lien de réinitialisation a été envoyé à votre adresse email.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
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
          {/* Header avec icône */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing[6]
          }}>
            <Ionicons name="mail-outline" size={40} color={theme.primary} />
          </View>

          <Text variant="h1" weight="bold" style={{ marginBottom: spacing[4] }}>
            Mot de passe oublié
          </Text>
          
          <Text variant="body" color="secondary" style={{ 
            textAlign: 'center', 
            marginBottom: spacing[8],
            lineHeight: 24
          }}>
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Text>
          
          <View style={{ width: '100%', gap: spacing[4] }}>
            <Input
              label="Adresse email"
              placeholder="exemple@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
            />
            
            {error ? <ErrorText>{error}</ErrorText> : null}
            
            <Button 
              title={loading ? "Envoi en cours..." : "Envoyer le lien"}
              onPress={handleSendReset} 
              disabled={loading || emailSent}
            />
            
            {/* Liens de navigation */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginTop: spacing[6],
              gap: spacing[2]
            }}>
              <Text variant="body" color="secondary">
                Vous vous souvenez ?
              </Text>
              <Link href="/login" asChild>
                <Text variant="body" color="primary" weight="semibold">
                  Se connecter
                </Text>
              </Link>
            </View>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: spacing[2]
            }}>
              <Text variant="body" color="secondary">
                Pas encore de compte ?
              </Text>
              <Link href="/register" asChild>
                <Text variant="body" color="primary" weight="semibold">
                  S'inscrire
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 