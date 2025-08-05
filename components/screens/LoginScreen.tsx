import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [formState, setFormState] = useState({
    error: "",
    loading: false,
    showPassword: false,
  });

  // Validation email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gestion du formulaire
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: "" }));
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: "L'email est requis." }));
      return false;
    }
    
    if (!isValidEmail(formData.email)) {
      setFormState(prev => ({ ...prev, error: "Veuillez entrer un email valide." }));
      return false;
    }
    
    if (!formData.password) {
      setFormState(prev => ({ ...prev, error: "Le mot de passe est requis." }));
      return false;
    }
    
    if (formData.password.length < 6) {
      setFormState(prev => ({ ...prev, error: "Le mot de passe doit contenir au moins 6 caractères." }));
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setFormState(prev => ({ ...prev, loading: true, error: "" }));
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (formData.email === "test@iven.com" && formData.password === "password") {
        // Connexion réussie - redirection
        router.replace("/(tabs)");
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: "Email ou mot de passe incorrect." 
        }));
      }
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        error: "Une erreur est survenue. Veuillez réessayer." 
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <KeyboardAvoidingView 
      style={[layoutStyles.container, themedStyles.surface]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View 
        style={[layoutStyles.containerCenteredPadded]}
      >
        {/* En-tête */}
        <View style={[layoutStyles.centerHorizontal, { marginBottom: spacing[10] }]}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.primaryLight,
            marginBottom: spacing[6],
            ...layoutStyles.center
          }}>
            <Ionicons name="person" size={32} color={theme.primary} />
          </View>
          
          <Text variant="h1" weight="bold" style={{ textAlign: 'center' }}>
            Connexion
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginTop: spacing[2] }}>
            Connectez-vous à votre compte Iven
          </Text>
        </View>

        {/* Formulaire */}
        <View style={{ width: '100%', maxWidth: 400 }}>
          <View style={[layoutStyles.gap4]}>
            {/* Email */}
            <View>
              <Input
                label="Email"
                placeholder="votre@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                required
              />
            </View>

            {/* Mot de passe */}
            <View>
              <View style={{ position: 'relative' }}>
                <Input
                  label="Mot de passe"
                  placeholder="••••••••"
                  secureTextEntry={!formState.showPassword}
                  autoComplete="password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  required
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: spacing[3],
                    top: 40, // Ajuster selon la hauteur de l'input
                  }}
                >
                  <Ionicons 
                    name={formState.showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Erreur */}
            {formState.error ? (
              <ErrorText>{formState.error}</ErrorText>
            ) : null}

            {/* Mot de passe oublié */}
            <View style={[layoutStyles.rowBetween, { marginTop: spacing[2] }]}>
              <View />
              <Link href="/forgot-password" asChild>
                <TouchableOpacity>
                  <Text variant="caption" color="primary">
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Bouton de connexion */}
            <Button 
              title={formState.loading ? "Connexion..." : "Se connecter"}
              onPress={handleLogin} 
              disabled={formState.loading}
              style={{ marginTop: spacing[4] }}
            />

            {/* Séparateur */}
            <View style={[layoutStyles.rowCenter, { marginVertical: spacing[8] }]}>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: theme.border 
              }} />
              <Text variant="caption" color="secondary" style={{ 
                marginHorizontal: spacing[4] 
              }}>
                ou
              </Text>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: theme.border 
              }} />
            </View>

            {/* Lien inscription */}
            <View style={layoutStyles.centerHorizontal}>
              <Text variant="body" color="secondary">
                Pas encore de compte ?{" "}
              </Text>
              <Link href="/register" asChild>
                <TouchableOpacity style={{ marginTop: spacing[2] }}>
                  <Text variant="body" color="primary" weight="semibold">
                    Créer un compte
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
