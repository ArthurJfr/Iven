import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DebuggerView from "../../components/DebuggerView";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import Button from "../../components/ui/Button";
import { apiService } from "../../services/ApiService";
import type { ApiResponse, HealthCheckResponse } from "../../types/api";

export default function Test() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setIsLoading(true);
    console.log("🧪 Début du test Health Check...");
    
    try {
      const response: ApiResponse<HealthCheckResponse> = await apiService.healthCheck();
      
      if (response.success) {
        console.log("✅ Health Check réussi:", response.data);
        setLastResponse(`✅ API disponible - Status: ${response.data?.status}`);
      } else {
        console.error("❌ Health Check échoué:", response.error);
        setLastResponse(`❌ API indisponible - Erreur: ${response.error}`);
      }
    } catch (error) {
      console.error("💥 Erreur lors du test:", error);
      setLastResponse("💥 Erreur lors du test API");
    }
    
    setIsLoading(false);
  };

  const testConfig = () => {
    console.log("⚙️ Configuration API actuelle:");
    console.log("Base URL:", apiService.getInstance().defaults.baseURL);
    console.log("Timeout:", apiService.getInstance().defaults.timeout);
    console.log("Headers:", apiService.getInstance().defaults.headers);
    setLastResponse("⚙️ Configuration affichée dans les logs");
  };

  const testChangeBaseURL = () => {
    const newURL = "https://api.example.com/v1";
    setLastResponse(`🔄 URL de base changée vers: ${newURL}`);
  };

  const testAuthToken = () => {
    const demoToken = "demo-jwt-token-123456789";
    apiService.setAuthToken(demoToken);
    setLastResponse("🔐 Token d'authentification ajouté");
  };

  const testRegisterData = () => {
    const sampleRegisterData = {
      username: "arthur123",
      fname: "arthur", 
      lname: "User",
      email: "arthur@example.com",
      password: "SecurePass123"
    };
    console.log("📝 Exemple de données d'inscription:", sampleRegisterData);
    setLastResponse("📝 Données d'inscription avec fname/lname affichées dans les logs");
  };

  const addTestLogs = () => {
    console.log("📝 Test log normal");
    console.warn("⚠️ Test warning");
    console.error("🚨 Test error");
    console.info("ℹ️ Test info");
    setLastResponse("📝 Logs de test ajoutés");
  };

  return (
    <ScrollView style={[localStyles.container]}>
      <View style={localStyles.testSection}>
        <Text style={[styles.titleLg, { color: theme.text }]}>Test API</Text>
        
        {lastResponse && (
          <View style={[localStyles.responseContainer, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[localStyles.responseText, { color: theme.text }]}>
              {lastResponse}
            </Text>
          </View>
        )}

        <View style={localStyles.buttonsContainer}>
          <Button
            title="🏥 Health Check"
            onPress={testHealthCheck}
            disabled={isLoading}
            style={localStyles.button}
          />
          
          <Button
            title="⚙️ Voir Config"
            onPress={testConfig}
            variant="outline"
            style={localStyles.button}
          />
          
          <Button
            title="🔄 Changer URL"
            onPress={testChangeBaseURL}
            variant="outline"
            style={localStyles.button}
          />
          
          <Button
            title="🔐 Add Token"
            onPress={testAuthToken}
            variant="outline"
            style={localStyles.button}
          />
          
          <Button
            title="📝 Test Logs"
            onPress={addTestLogs}
            variant="outline"
            style={localStyles.button}
          />
          
          <Button
            title="👤 Test Register Data"
            onPress={testRegisterData}
            variant="outline"
            style={localStyles.button}
          />
        </View>
      </View>

      <View style={localStyles.debuggerContainer}>
        <DebuggerView />
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  testSection: {
    marginBottom: 20,
  },
  responseContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  responseText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    gap: 10,
  },
  button: {
    marginBottom: 8,
  },
  debuggerContainer: {
    flex: 1,
    minHeight: 300,
  },
});
