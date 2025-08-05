import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link, useRouter } from "expo-router";
import { authService } from "../../services/AuthService";
import type { RegisterRequest } from "../../types/auth";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();

  // États du formulaire
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formState, setFormState] = useState({
    error: "",
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    acceptTerms: false,
  });

  // Validation email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation mot de passe
  const isStrongPassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
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
    if (!formData.username.trim()) {
      setFormState(prev => ({ ...prev, error: "Le nom d'utilisateur est requis." }));
      return false;
    }

    if (formData.username.length < 3) {
      setFormState(prev => ({ ...prev, error: "Le nom d'utilisateur doit contenir au moins 3 caractères." }));
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setFormState(prev => ({ ...prev, error: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores." }));
      return false;
    }

    if (!formData.fname.trim()) {
      setFormState(prev => ({ ...prev, error: "Le prénom est requis." }));
      return false;
    }

    if (!formData.lname.trim()) {
      setFormState(prev => ({ ...prev, error: "Le nom est requis." }));
      return false;
    }

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

    if (!isStrongPassword(formData.password)) {
      setFormState(prev => ({ 
        ...prev, 
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre." 
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormState(prev => ({ ...prev, error: "Les mots de passe ne correspondent pas." }));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.register(registerData);

      if (response.success) {
        // Inscription réussie - redirection vers la confirmation
        Alert.alert(
          "Inscription réussie !",
          "Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.",
          [
            {
              text: "Continuer",
              onPress: () => router.push({
                pathname: "/(auth)/confirm-account",
                params: { email: formData.email }
              })
            }
          ]
        );
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: response.error || "Une erreur est survenue lors de l'inscription. Veuillez réessayer." 
        }));
      }
    } catch (error) {
      console.error("Erreur inscription:", error);
      setFormState(prev => ({ 
        ...prev, 
        error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer." 
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    } else {
      setFormState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return theme.error;
    if (strength < 4) return theme.warning;
    return theme.success;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return "Faible";
    if (strength < 4) return "Moyen";
    return "Fort";
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView 
      style={[layoutStyles.container, themedStyles.surface]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          layoutStyles.centerHorizontal,
          { padding: spacing[5], paddingTop: spacing[0] }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* En-tête */}
        <View style={[layoutStyles.centerHorizontal, { marginBottom: spacing[2] }]}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.primaryLight,
            marginBottom: spacing[6],
            ...layoutStyles.center
          }}>
            <Ionicons name="person-add" size={32} color={theme.primary} />
          </View>
          
          <Text variant="h1" weight="bold" style={{ textAlign: 'center' }}>
            Inscription
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginTop: spacing[2] }}>
            Créez votre compte Iven
          </Text>
        </View>

        {/* Formulaire */}
        <View style={{ width: '100%', maxWidth: 400 }}>
          <View style={[layoutStyles.gap1]}>
            {/* Nom et prénom */}
            <View style={[layoutStyles.row, layoutStyles.gap3]}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  autoCapitalize="words"
                  value={formData.fname}
                  onChangeText={(value) => handleInputChange('fname', value)}
                  required
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  autoCapitalize="words"
                  value={formData.lname}
                  onChangeText={(value) => handleInputChange('lname', value)}
                  required
                />
              </View>
            </View>

            {/* Nom d'utilisateur */}
            <View>
              <Input
                label="Nom d'utilisateur"
                placeholder="johndoe123"
                autoCapitalize="none"
                autoCorrect={false}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                required
              />
            </View>

            {/* Email */}
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

            {/* Mot de passe */}
            <View>
              <View style={{ position: 'relative' }}>
                <Input
                  label="Mot de passe"
                  placeholder="••••••••"
                  secureTextEntry={!formState.showPassword}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  required
                />
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('password')}
                  style={{
                    position: 'absolute',
                    right: spacing[3],
                    top: 40,
                  }}
                >
                  <Ionicons 
                    name={formState.showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Indicateur de force du mot de passe */}
              {formData.password.length > 0 && (
                <View style={{ marginTop: spacing[2] }}>
                  <View style={[layoutStyles.rowBetween, { marginBottom: spacing[1] }]}>
                    <Text variant="caption" color="secondary">
                      Force du mot de passe
                    </Text>
                    <Text 
                      variant="caption" 
                      style={{ 
                        color: getPasswordStrengthColor(getPasswordStrength(formData.password)) 
                      }}
                    >
                      {getPasswordStrengthText(getPasswordStrength(formData.password))}
                    </Text>
                  </View>
                  <View style={{
                    height: 4,
                    backgroundColor: theme.backgroundSecondary,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <View style={{
                      height: '100%',
                      width: `${(getPasswordStrength(formData.password) / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(getPasswordStrength(formData.password)),
                      borderRadius: 2,
                    }} />
                  </View>
                </View>
              )}
            </View>

            {/* Confirmation mot de passe */}
            <View style={{ position: 'relative' }}>
              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                secureTextEntry={!formState.showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                required
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('confirmPassword')}
                style={{
                  position: 'absolute',
                  right: spacing[3],
                  top: 40,
                  padding: spacing[2],
                }}
              >
                <Ionicons 
                  name={formState.showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Erreur */}
            {formState.error ? (
              <ErrorText>{formState.error}</ErrorText>
            ) : null}

            {/* Bouton d'inscription */}
            <Button 
              title={formState.loading ? "Inscription..." : "Créer mon compte"}
              onPress={handleRegister} 
              disabled={formState.loading}
              style={{ marginTop: spacing[6] }}
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

            {/* Lien connexion */}
            <View style={layoutStyles.centerHorizontal}>
              <Text variant="body" color="secondary">
                Déjà un compte ?{" "}
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity style={{ marginTop: spacing[2] }}>
                  <Text variant="body" color="primary" weight="semibold">
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}