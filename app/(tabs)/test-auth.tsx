import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, spacing } from "../../styles";
import Button from "../../components/ui/Button";
import { authService } from "../../services/AuthService";
import { AccountActivationBanner } from "../../components/features/auth";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestAuthScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  // Simuler différents scénarios de login
  const testLoginScenarios = async (scenario: string) => {
    setLastResponse(`🧪 Test du scénario: ${scenario}`);
    
    try {
      let testCredentials;
      
      switch (scenario) {
                 case 'valid_confirmed':
           testCredentials = {
             email: 'user@confirmed.com',
             password: 'password123'
           };
           break;
           
         case 'valid_not_confirmed':
           testCredentials = {
             email: 'user@notconfirmed.com',
             password: 'password123'
           };
          break;
          
                 case 'invalid_credentials':
           testCredentials = {
             email: 'wrong@email.com',
             password: 'wrongpassword'
           };
          break;
          
        default:
          return;
      }
      
      console.log(`🧪 Testing ${scenario}:`, testCredentials);
      
      // Note: Ces tests ne fonctionneront vraiment qu'avec un vrai backend
      // Pour l'instant, c'est pour tester l'interface et les logs
      const response = await authService.login(testCredentials);
      
             if (response.success) {
         if (response.data?.user.active === 1) {
           setLastResponse(`✅ ${scenario}: Connexion réussie, compte confirmé`);
         } else {
           setLastResponse(`⚠️ ${scenario}: Connexion réussie, compte NON confirmé`);
         }
       } else {
        setLastResponse(`❌ ${scenario}: ${response.error}`);
      }
      
    } catch (error) {
      console.error('Erreur test:', error);
      setLastResponse(`💥 Erreur lors du test ${scenario}`);
    }
  };

  const testConfirmAccount = async () => {
    setLastResponse("🧪 Test confirmation de compte...");
    
    try {
      const response = await authService.confirmAccount({
        email: 'test@example.com',
        code: '123456'
      });
      
      if (response.success) {
        setLastResponse("✅ Confirmation réussie (simulation)");
      } else {
        setLastResponse(`❌ Confirmation échouée: ${response.error}`);
      }
    } catch (error) {
      setLastResponse("💥 Erreur lors de la confirmation");
    }
  };

  const testResendCode = async () => {
    setLastResponse("🧪 Test renvoi de code...");
    
    try {
      const response = await authService.resendConfirmationCode('test@example.com');
      
      if (response.success) {
        setLastResponse("✅ Code renvoyé (simulation)");
      } else {
        setLastResponse(`❌ Renvoi échoué: ${response.error}`);
      }
    } catch (error) {
      setLastResponse("💥 Erreur lors du renvoi");
    }
  };

  const navigateToConfirmAccount = () => {
    router.push({
      pathname: "/(auth)/confirm-account",
      params: { 
        email: 'test@example.com',
        fromLogin: 'true'
      }
    });
  };

  return (
    <ScrollView style={[themedStyles.surface]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        🔐 Test Flux d'Authentification
      </Text>
      
      {/* Banner d'activation */}
      {showBanner && (
        <AccountActivationBanner
          email="test@example.com"
          onActivatePress={navigateToConfirmAccount}
          onDismiss={() => setShowBanner(false)}
          variant="warning"
        />
      )}
      
      {/* Dernière réponse */}
      {lastResponse && (
        <View style={[styles.responseContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Text style={[styles.responseText, { color: theme.text }]}>
            {lastResponse}
          </Text>
        </View>
      )}

      {/* Tests de scénarios de login */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Scénarios de connexion
        </Text>
        
        <Button
          title="✅ Login valide + compte confirmé"
          onPress={() => testLoginScenarios('valid_confirmed')}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="⚠️ Login valide + compte NON confirmé"
          onPress={() => testLoginScenarios('valid_not_confirmed')}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="❌ Identifiants incorrects"
          onPress={() => testLoginScenarios('invalid_credentials')}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* Tests de confirmation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Confirmation de compte
        </Text>
        
        <Button
          title="📧 Confirmer compte"
          onPress={testConfirmAccount}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="🔄 Renvoyer code"
          onPress={testResendCode}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="📱 Aller à Confirm Account"
          onPress={navigateToConfirmAccount}
          style={styles.button}
        />
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Navigation
        </Text>
        
        <Button
          title="🚪 Aller au Login"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="📝 Aller au Register"
          onPress={() => router.push('/(auth)/register')}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* Tests de persistance et auto-login */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Persistance & Auto-login
        </Text>
        
        <Button
          title="💾 Tester sauvegarde session"
          onPress={async () => {
            // Simuler un login pour tester la persistance
            setLastResponse("💾 Test de persistance de session...");
            console.log("💾 Test de persistance effectué");
          }}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="🔄 Tester restauration session"
          onPress={async () => {
            setLastResponse("🔄 Test de restauration...");
            const restored = await authService.initialize();
            setLastResponse(restored ? "✅ Session restaurée" : "❌ Aucune session");
          }}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="🗑️ Nettoyer session stockée"
          onPress={async () => {
            await authService.logout();
            setLastResponse("🗑️ Session nettoyée");
          }}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="💾 Vérifier stockage local"
          onPress={async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const authKeys = keys.filter(key => key.startsWith('@iven_'));
              
              let storageInfo = `Clés trouvées: ${authKeys.join(', ')}\n\n`;
              
              for (const key of authKeys) {
                const value = await AsyncStorage.getItem(key);
                if (key === '@iven_user_data' && value) {
                  try {
                    const userData = JSON.parse(value);
                    storageInfo += `📱 ${key}:\n`;
                    storageInfo += `  - fname: "${userData.fname || 'undefined'}"\n`;
                    storageInfo += `  - lname: "${userData.lname || 'undefined'}"\n`;
                    storageInfo += `  - email: "${userData.email || 'undefined'}"\n`;
                    storageInfo += `  - Champs: ${Object.keys(userData).join(', ')}\n`;
                  } catch (parseError) {
                    storageInfo += `📱 ${key}: Erreur parsing\n`;
                  }
                } else {
                  storageInfo += `🔑 ${key}: ${value ? value.substring(0, 50) + '...' : 'null'}\n`;
                }
              }
              
              setLastResponse(`💾 Contenu du stockage:\n${storageInfo}`);
            } catch (error) {
              setLastResponse(`❌ Erreur lecture stockage: ${error}`);
            }
          }}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="🔄 Synchroniser stockage"
          onPress={async () => {
            try {
              const success = await authService.syncLocalStorage();
              setLastResponse(success ? "✅ Stockage synchronisé" : "❌ Échec synchronisation");
            } catch (error) {
              setLastResponse(`❌ Erreur synchronisation: ${error}`);
            }
          }}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* Informations sur l'état */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          État actuel
        </Text>
        
        <View style={[styles.infoContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Utilisateur: {authService.getCurrentUser()?.email || 'Non connecté'}
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Token: {authService.getAuthToken() ? 'Présent' : 'Absent'}
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Authentifié: {authService.isAuthenticated() ? 'Oui' : 'Non'}
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Compte confirmé: {authService.isAccountConfirmed() ? 'Oui' : 'Non'}
          </Text>
        </View>
      </View>
    </ScrollView>
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
  button: {
    marginBottom: spacing[3],
  },
  responseContainer: {
    padding: spacing[4],
    borderRadius: 8,
    marginBottom: spacing[4],
  },
  responseText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    padding: spacing[4],
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: spacing[1],
  },
});
