import React, { useState } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorText from "../../components/ui/ErrorText";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
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
    <View style={styles.container}>
      <Text style={styles.titleLg}>Connexion</Text>
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
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
      <Link href="/auth/forgot-password" style={styles.textSm}>Mot de passe oublié ?</Link>
    </View>
  );
}
