import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../styles';
import Text from './ui/atoms/Text';
import Card from './ui/Card';
import Button from './ui/Button';

interface StorageData {
  key: string;
  value: string | null;
}

export default function DebuggerView() {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const themedStyles = createThemedStyles(theme);

  const loadStorageData = async () => {
    setIsLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => key.startsWith('@iven_'));
      
      const data: StorageData[] = [];
      for (const key of authKeys) {
        const value = await AsyncStorage.getItem(key);
        data.push({ key, value });
      }
      
      setStorageData(data);
    } catch (error) {
      console.error('Erreur chargement données storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = async () => {
    Alert.alert(
      "Nettoyer le stockage",
      "Êtes-vous sûr de vouloir supprimer toutes les données d'authentification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              await loadStorageData();
              Alert.alert("Succès", "Stockage nettoyé");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de nettoyer le stockage");
            }
          }
        }
      ]
    );
  };

  const restoreFromLocal = async () => {
    try {
      const success = await authService.restoreFromLocalStorage();
      if (success) {
        Alert.alert("Succès", "Session restaurée depuis le stockage local");
        await loadStorageData();
      } else {
        Alert.alert("Échec", "Impossible de restaurer la session locale");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la restauration");
    }
  };

  const syncStorage = async () => {
    try {
      const success = await authService.syncLocalStorage();
      if (success) {
        Alert.alert("Succès", "Stockage synchronisé");
        await loadStorageData();
      } else {
        Alert.alert("Échec", "Impossible de synchroniser le stockage");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la synchronisation");
    }
  };

  const analyzeUserData = (userDataString: string) => {
    try {
      const userData = JSON.parse(userDataString);
      const hasFname = !!userData.fname;
      const hasLname = !!userData.lname;
      
      return {
        hasFname,
        hasLname,
        fnameValue: userData.fname,
        lnameValue: userData.lname,
        allFields: Object.keys(userData)
      };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <ScrollView style={[layoutStyles.container, themedStyles.surface]}>
      <View style={{ padding: spacing[4] }}>
        <Text variant="h1" weight="bold" style={{ marginBottom: spacing[4] }}>
          🔍 Debugger - Stockage Local
        </Text>

        {/* État de l'authentification */}
        <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[4] }}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            État de l'authentification
          </Text>
          
          <View style={{ marginBottom: spacing[2] }}>
            <Text variant="body" color="secondary">
              Connecté: {isAuthenticated ? '✅ Oui' : '❌ Non'}
            </Text>
          </View>
          
          {user && (
            <>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  ID: {user.id}
                </Text>
              </View>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  Email: {user.email}
                </Text>
              </View>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  Prénom: {user.fname || '❌ Manquant'}
                </Text>
              </View>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  Nom: {user.lname || '❌ Manquant'}
                </Text>
              </View>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  Username: {user.username}
                </Text>
              </View>
              <View style={{ marginBottom: spacing[2] }}>
                <Text variant="body" color="secondary">
                  Actif: {user.active ? '✅ Oui' : '❌ Non'}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Données du stockage local */}
        <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[4] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
            <Text variant="h3" weight="semibold">
              📱 Stockage local (AsyncStorage)
            </Text>
            <TouchableOpacity onPress={loadStorageData} disabled={isLoading}>
              <Text variant="body" color="primary">
                {isLoading ? '🔄' : '🔄'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {storageData.length === 0 ? (
            <Text variant="body" color="secondary">
              Aucune donnée trouvée
            </Text>
          ) : (
            storageData.map((item, index) => {
              const isUserData = item.key === '@iven_user_data';
              const userAnalysis = isUserData && item.value ? analyzeUserData(item.value) : null;
              
              return (
                <View key={index} style={{ marginBottom: spacing[3] }}>
                  <Text variant="caption" color="tertiary" style={{ marginBottom: spacing[1] }}>
                    {item.key}
                  </Text>
                  
                  {isUserData && userAnalysis ? (
                    <View style={{ marginBottom: spacing[2] }}>
                      <Text variant="body" color="secondary" style={{ marginBottom: spacing[1] }}>
                        <Text variant="body" weight="bold">Analyse des données utilisateur:</Text>
                      </Text>
                      <Text variant="body" color="secondary">
                        fname présent: {userAnalysis.hasFname ? '✅ Oui' : '❌ Non'}
                      </Text>
                      <Text variant="body" color="secondary">
                        lname présent: {userAnalysis.hasLname ? '✅ Oui' : '❌ Non'}
                      </Text>
                      <Text variant="body" color="secondary">
                        Valeur fname: "{userAnalysis.fnameValue || 'undefined'}"
                      </Text>
                      <Text variant="body" color="secondary">
                        Valeur lname: "{userAnalysis.lnameValue || 'undefined'}"
                      </Text>
                      <Text variant="body" color="secondary">
                        Champs disponibles: {userAnalysis.allFields.join(', ')}
                      </Text>
                    </View>
                  ) : (
                    <Text variant="body" color="secondary" numberOfLines={3}>
                      {item.value ? item.value.substring(0, 200) + (item.value.length > 200 ? '...' : '') : 'null'}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </Card>

        {/* Actions de débogage */}
        <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[4] }}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            Actions de débogage
          </Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Button
              title="Restaurer depuis le stockage local"
              onPress={restoreFromLocal}
              variant="outline"
            />
          </View>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Button
              title="Synchroniser le stockage"
              onPress={syncStorage}
              variant="outline"
            />
          </View>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Button
              title="Nettoyer le stockage"
              onPress={clearStorage}
              variant="outline"
            />
          </View>
        </Card>

        {/* Informations du service */}
        <Card variant="elevated" padding="medium">
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            Informations du service
          </Text>
          
          <View style={{ marginBottom: spacing[2] }}>
            <Text variant="body" color="secondary">
              Token présent: {authService.getAuthToken() ? '✅ Oui' : '❌ Non'}
            </Text>
          </View>
          
          <View style={{ marginBottom: spacing[2] }}>
            <Text variant="body" color="secondary">
              Utilisateur service: {authService.getCurrentUser()?.email || '❌ Null'}
            </Text>
          </View>
          
          <View style={{ marginBottom: spacing[2] }}>
            <Text variant="body" color="secondary">
              Authentifié service: {authService.isAuthenticated() ? '✅ Oui' : '❌ Non'}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

