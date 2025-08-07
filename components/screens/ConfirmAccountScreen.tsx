import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Text from "../ui/atoms/Text";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { authService } from "../../services/AuthService";
import type { ConfirmAccountRequest } from "../../types/auth";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmAccountScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();
  const { email, fromLogin } = useLocalSearchParams<{ email?: string; fromLogin?: string }>();

  // États du formulaire
  const [formData, setFormData] = useState({
    email: (email as string) || "",
    code: "",
  });

  const [formState, setFormState] = useState({
    error: "",
    loading: false,
    resendLoading: false,
    countdown: 0,
  });

  // Countdown pour le renvoi du code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (formState.countdown > 0) {
      interval = setInterval(() => {
        setFormState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [formState.countdown]);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!formData.code.trim()) {
      setFormState(prev => ({ ...prev, error: "Le code de confirmation est requis." }));
      return false;
    }

    if (formData.code.length !== 6) {
      setFormState(prev => ({ ...prev, error: "Le code de confirmation doit contenir 6 chiffres." }));
      return false;
    }

    return true;
  };

  // Gestion du formulaire
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: "" }));
    }
  };

  const handleConfirmAccount = async () => {
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      const confirmationData: ConfirmAccountRequest = {
        email: formData.email,
        code: formData.code,
      };

      const response = await authService.confirmAccount(confirmationData);

      if (response.success) {
        // Confirmation réussie avec auto-login
        console.info('🎉 Activation réussie avec auto-login');
        
        // Auto-login après activation réussie
        if (response.data?.user && response.data?.token) {
          await login(response.data.user, response.data.token);
        }
        
        Alert.alert(
          "🎉 Activation réussie !",
          "Votre compte a été activé et vous êtes maintenant connecté. Bienvenue !",
          [
            {
              text: "Accéder à l'application",
              onPress: () => {
                // Redirection manuelle pour s'assurer qu'elle se fait
                router.replace("/(tabs)");
              }
            }
          ]
        );
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: response.error || "Erreur lors de la confirmation du compte." 
        }));
      }
    } catch (error) {
      console.error("Erreur confirmation:", error);
      setFormState(prev => ({ 
        ...prev, 
        error: "Une erreur est survenue lors de la confirmation. Veuillez réessayer." 
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleResendCode = async () => {
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: "Veuillez entrer votre email." }));
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormState(prev => ({ ...prev, error: "Veuillez entrer un email valide." }));
      return;
    }

    setFormState(prev => ({ ...prev, resendLoading: true, error: "" }));

    try {
      const response = await authService.resendConfirmationCode(formData.email);

      if (response.success) {
        setFormState(prev => ({ ...prev, countdown: 60 }));
        Alert.alert(
          "Code renvoyé",
          "Un nouveau code de confirmation a été envoyé à votre email."
        );
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: response.error || "Erreur lors du renvoi du code." 
        }));
      }
    } catch (error) {
      console.error("Erreur renvoi code:", error);
      setFormState(prev => ({ 
        ...prev, 
        error: "Une erreur est survenue lors du renvoi du code." 
      }));
    } finally {
      setFormState(prev => ({ ...prev, resendLoading: false }));
    }
  };

  return (
    <SafeAreaView style={[themedStyles.surface, { flex: 1 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            layoutStyles.centerHorizontal,
            { padding: spacing[5], paddingTop: spacing[8] }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* En-tête avec icône */}
          <View style={[layoutStyles.centerHorizontal, { marginBottom: spacing[8] }]}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.primaryLight,
              marginBottom: spacing[6],
              ...layoutStyles.center
            }}>
              <Ionicons name="mail-open" size={32} color={theme.primary} />
            </View>
            
            <Text variant="h1" weight="bold" style={{ textAlign: 'center' }}>
              {fromLogin === 'true' ? 'Activez votre compte' : 'Vérifiez votre email'}
            </Text>
            <Text variant="body" color="secondary" style={{ textAlign: 'center', marginTop: spacing[2] }}>
              {fromLogin === 'true' 
                ? 'Vos identifiants sont corrects ! Il ne reste plus qu\'à activer votre compte avec le code envoyé à'
                : 'Nous avons envoyé un code de vérification à'
              }
            </Text>
            {formData.email && (
              <Text variant="body" weight="semibold" style={{ 
                textAlign: 'center', 
                marginTop: spacing[1],
                color: theme.primary 
              }}>
                {formData.email}
              </Text>
            )}
          </View>

          {/* Formulaire */}
          <View style={{ width: '100%', maxWidth: 400 }}>
            <View style={[layoutStyles.gap4]}>
              {/* Email (seulement si pas passé en paramètre) */}
              {!email && (
                <View>
                  <Input
                    label="Email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="votre@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    required
                  />
                </View>
              )}

              {/* Code de confirmation avec style amélioré */}
              <View>
                <Input
                  label="Code de vérification"
                  value={formData.code}
                  onChangeText={(value) => handleInputChange('code', value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoCorrect={false}
                  textAlign="center"
                  inputStyle={{
                    fontSize: 24,
                    fontWeight: '600',
                    letterSpacing: 8,
                  }}
                  required
                />
                <Text variant="caption" color="secondary" style={{ 
                  textAlign: 'center', 
                  marginTop: spacing[2] 
                }}>
                  Entrez le code à 6 chiffres
                </Text>
              </View>

              {/* Erreur */}
              {formState.error ? (
                <ErrorText>{formState.error}</ErrorText>
              ) : null}

              {/* Bouton de confirmation */}
                              <Button
                  title={formState.loading ? "Vérification..." : "Vérifier le code"}
                  onPress={handleConfirmAccount}
                  disabled={formState.loading || formData.code.length !== 6}
                  style={{ marginTop: spacing[4] }}
                />
            </View>
          </View>

          {/* Section renvoi du code */}
          <View style={[layoutStyles.centerHorizontal, { marginTop: spacing[8] }]}>
            <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
              Vous n'avez pas reçu le code ?
            </Text>
            
            {formState.countdown > 0 ? (
              <View style={[layoutStyles.centerHorizontal]}>
                <View style={{
                  backgroundColor: theme.backgroundSecondary,
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                  borderRadius: 8,
                  marginBottom: spacing[2]
                }}>
                  <Text variant="body" weight="semibold" style={{ color: theme.primary }}>
                    {formState.countdown}s
                  </Text>
                </View>
                <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                  Vous pourrez renvoyer le code dans
                </Text>
              </View>
            ) : (
              <Button
                title={formState.resendLoading ? "📧 Envoi..." : "📧 Renvoyer le code"}
                onPress={handleResendCode}
                variant="outline"
                disabled={formState.resendLoading || !formData.email}
              />
            )}
          </View>

          {/* Navigation vers login */}
          <View style={[layoutStyles.centerHorizontal, { marginTop: spacing[8] }]}>
            <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
              Déjà vérifié ?{" "}
              <Link href="/(auth)/login">
                <Text variant="body" weight="semibold" style={{ color: theme.primary }}>
                  Se connecter
                </Text>
              </Link>
            </Text>
          </View>

          {/* Message spécial si venant du login */}
          {fromLogin === 'true' && (
            <View style={[
              layoutStyles.centerHorizontal, 
              { 
                marginTop: spacing[6], 
                padding: spacing[4], 
                backgroundColor: theme.primaryLight,
                borderRadius: 12,
                marginBottom: spacing[4]
              }
            ]}>
              <Ionicons name="checkmark-circle" size={24} color={theme.primary} style={{ marginBottom: spacing[2] }} />
              <Text variant="body" weight="semibold" style={{ textAlign: 'center', color: theme.primary }}>
                Connexion validée ! 🎉
              </Text>
              <Text variant="caption" color="secondary" style={{ textAlign: 'center', marginTop: spacing[1] }}>
                Vos identifiants sont corrects. Activez votre compte pour accéder à l'application.
              </Text>
            </View>
          )}

          {/* Aide supplémentaire */}
          <View style={[
            layoutStyles.centerHorizontal, 
            { 
              marginTop: spacing[4], 
              padding: spacing[4], 
              backgroundColor: theme.backgroundSecondary,
              borderRadius: 12,
              marginBottom: spacing[4]
            }
          ]}>
            <Ionicons name="help-circle" size={24} color={theme.textSecondary} style={{ marginBottom: spacing[2] }} />
            <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              Le code peut prendre quelques minutes à arriver.{"\n"}
              Vérifiez vos spams si vous ne le recevez pas.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}