import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
import { createThemedStyles } from '../styles';
import Button from '../components/ui/Button';
import Text from '../components/ui/atoms/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestScreen() {
  const { theme } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();
  const themedStyles = createThemedStyles(theme);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAsyncStorage = async () => {
    try {
      addResult('🧪 Test AsyncStorage...');
      
      // Test d'écriture
      await AsyncStorage.setItem('@test_key', 'test_value');
      addResult('✅ Écriture AsyncStorage OK');
      
      // Test de lecture
      const value = await AsyncStorage.getItem('@test_key');
      if (value === 'test_value') {
        addResult('✅ Lecture AsyncStorage OK');
      } else {
        addResult('❌ Lecture AsyncStorage échouée');
      }
      
      // Test de suppression
      await AsyncStorage.removeItem('@test_key');
      const deletedValue = await AsyncStorage.getItem('@test_key');
      if (deletedValue === null) {
        addResult('✅ Suppression AsyncStorage OK');
      } else {
        addResult('❌ Suppression AsyncStorage échouée');
      }
      
    } catch (error) {
      addResult(`❌ Erreur AsyncStorage: ${error}`);
    }
  };

  const testAuthStorage = async () => {
    try {
      addResult('🔐 Test stockage authentification...');
      
      // Simuler des données d'authentification
      const testAuthData = {
        token: 'test_token_123',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          fname: 'Test',
          lname: 'User',
          active: true,
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Test de sauvegarde
      await authService.persistSession(testAuthData);
      addResult('✅ Sauvegarde auth OK');
      
      // Test de restauration
      const restored = await authService.initialize();
      if (restored) {
        addResult('✅ Restauration auth OK');
      } else {
        addResult('❌ Restauration auth échouée');
      }
      
      // Nettoyage
      await authService.logout();
      addResult('✅ Nettoyage auth OK');
      
    } catch (error) {
      addResult(`❌ Erreur auth: ${error}`);
    }
  };

  const testRepairStorage = async () => {
    try {
      addResult('🔧 Test réparation stockage...');
      
      // Créer des données corrompues
      await AsyncStorage.setItem('@iven_corrupted', '');
      await AsyncStorage.setItem('@iven_auth_token', 'valid_token');
      
      // Tester la réparation
      await authService.repairStoredAuth();
      addResult('✅ Réparation stockage OK');
      
    } catch (error) {
      addResult(`❌ Erreur réparation: ${error}`);
    }
  };

  const clearAllStorage = async () => {
    try {
      addResult('🗑️ Nettoyage complet...');
      await AsyncStorage.clear();
      addResult('✅ Nettoyage complet OK');
    } catch (error) {
      addResult(`❌ Erreur nettoyage: ${error}`);
    }
  };

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.content}>
        <Text variant="h1" style={themedStyles.text}>
          🧪 Tests AsyncStorage & Auth
        </Text>
        
        <Text variant="body" style={themedStyles.text}>
          État actuel: {isAuthenticated ? '✅ Connecté' : '❌ Déconnecté'}
        </Text>
        
        {user && (
          <Text variant="body" style={themedStyles.text}>
            Utilisateur: {user.email}
          </Text>
        )}
        
        <View style={{ gap: 10, marginTop: 20 }}>
          <Button 
            title="Test AsyncStorage" 
            onPress={testAsyncStorage}
            variant="primary"
          />
          
          <Button 
            title="Test Auth Storage" 
            onPress={testAuthStorage}
            variant="secondary"
          />
          
          <Button 
            title="Test Réparation" 
            onPress={testRepairStorage}
            variant="outline"
          />
          
          <Button 
            title="Nettoyer Tout" 
            onPress={clearAllStorage}
            variant="danger"
          />
        </View>
        
        <View style={{ marginTop: 20 }}>
          <Text variant="h2" style={themedStyles.text}>
            Résultats des tests:
          </Text>
          <ScrollView style={{ maxHeight: 300, backgroundColor: theme.colors.background }}>
            {testResults.map((result, index) => (
              <Text key={index} variant="caption" style={themedStyles.text}>
                {result}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
} 