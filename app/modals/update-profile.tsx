import React, { useState } from 'react';
import { View, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { apiService } from '../../services/ApiService';
import { authService } from '../../services/AuthService';

export default function UpdateProfileModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: user?.fname || '',
    lname: user?.lname || '',
    username: user?.username || '',
  });

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value || '' }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!formData.fname || !formData.lname || !formData.username) {
      Alert.alert('Erreur', 'Prénom, nom et nom d\'utilisateur sont requis');
      return;
    }
    try {
      setLoading(true);
      // S'assurer que le token est bien appliqué
      const token = authService.getAuthToken();
      if (token) apiService.setAuthToken(token);
      console.log('Token:', token);
            console.log('User:', user);
            console.log('FormData:', formData);
      // Tentative principale: route fournie /auth/user/:id
      let response = await apiService.put<any>(`/auth/user/${user.id}`, {
        fname: formData.fname,
        lname: formData.lname,
        username: formData.username,
      });
      console.log('Response:', response);


      if (response.success && response.data) {
        const updated = response.data.user ?? response.data;
        // Mettre à jour le contexte et persister
        const merged = { ...user, ...updated } as any;
        updateUser(merged);
        authService.setCurrentUser(merged);
        await authService.syncLocalStorage();
        Alert.alert('Succès', 'Profil mis à jour', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        Alert.alert('Erreur', response.error || 'Mise à jour impossible. Vérifiez vos droits et votre connexion.');
      }
    } catch (e) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing[5], paddingBottom: spacing[8], paddingTop: spacing[4] }}
          showsVerticalScrollIndicator={false}
        >
          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[6] }}>
            <View style={[layoutStyles.gap4]}>
              <View style={[layoutStyles.columnCenter, { marginBottom: spacing[4] }]}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: theme.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing[2],
                }}>
                  <Ionicons name="person" size={28} color={theme.buttonText} />
                </View>
                <Text variant="h3" weight="semibold" style={{ color: theme.text }}>
                  Modifier le profil
                </Text>
                <Text variant="body" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: spacing[1] }}>
                  Mettez à jour vos informations personnelles
                </Text>
              </View>

              <Input label="Prénom " value={formData.fname} onChangeText={(v) => updateField('fname', v)} leftIcon="person" required />
              <Input label="Nom " value={formData.lname} onChangeText={(v) => updateField('lname', v)} leftIcon="person" required />
              <Input label="Nom d'utilisateur " value={formData.username} onChangeText={(v) => updateField('username', v)} leftIcon="at-outline" required />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
      }}>
        <Button title={loading ? 'Enregistrement...' : 'Enregistrer'} onPress={handleSave} disabled={loading} />
      </View>
    </SafeAreaView>
  );
}


