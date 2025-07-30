import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  bio: string;
  preferences: {
    language: 'fr' | 'en';
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  stats: {
    eventsCreated: number;
    eventsParticipated: number;
    totalEvents: number;
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    avatar: 'https://picsum.photos/200/200?random=1',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionnée d\'événements et d\'organisation. J\'aime créer des moments inoubliables avec mes amis et ma famille.',
    preferences: {
      language: 'fr',
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      pushNotifications: true,
    },
    stats: {
      eventsCreated: 12,
      eventsParticipated: 25,
      totalEvents: 37,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [key]: value }));
  };

  const updatePreference = (key: keyof UserProfile['preferences'], value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const saveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès !');
  };

  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const logout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            // Ici on redirigerait vers la page de login
            router.push('/auth/login');
          }
        }
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès');
            router.push('/auth/login');
          }
        }
      ]
    );
  };

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
        <Button 
          title={isEditing ? "Sauvegarder" : "Modifier"}
          onPress={isEditing ? saveProfile : () => setIsEditing(true)}
          style={styles.editButton}
        />
      </View>

      {/* Informations de base */}
      <Card style={styles.section}>
        <View style={styles.avatarSection}>
          <Image 
            source={{ uri: currentProfile.avatar }} 
            style={styles.avatar}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Changer</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <Input
            value={currentProfile.name}
            onChangeText={(text) => updateProfile('name', text)}
            editable={isEditing}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <Input
            value={currentProfile.email}
            onChangeText={(text) => updateProfile('email', text)}
            editable={isEditing}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <Input
            value={currentProfile.phone}
            onChangeText={(text) => updateProfile('phone', text)}
            editable={isEditing}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <Input
            value={currentProfile.bio}
            onChangeText={(text) => updateProfile('bio', text)}
            multiline
            editable={isEditing}
            style={styles.input}
          />
        </View>

        {isEditing && (
          <View style={styles.editActions}>
            <Button 
              title="Annuler" 
              onPress={cancelEdit}
              style={[styles.editActionButton, styles.cancelButton]}
            />
            <Button 
              title="Sauvegarder" 
              onPress={saveProfile}
              style={styles.editActionButton}
            />
          </View>
        )}
      </Card>

      {/* Statistiques */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Mes statistiques</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentProfile.stats.eventsCreated}</Text>
            <Text style={styles.statLabel}>Événements créés</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentProfile.stats.eventsParticipated}</Text>
            <Text style={styles.statLabel}>Événements participés</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentProfile.stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </Card>

      {/* Préférences */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Langue</Text>
            <Text style={styles.settingDescription}>
              Langue de l'interface
            </Text>
          </View>
          {isEditing ? (
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  currentProfile.preferences.language === 'fr' && styles.languageButtonActive
                ]}
                onPress={() => updatePreference('language', 'fr')}
              >
                <Text style={[
                  styles.languageButtonText,
                  currentProfile.preferences.language === 'fr' && styles.languageButtonTextActive
                ]}>
                  Français
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  currentProfile.preferences.language === 'en' && styles.languageButtonActive
                ]}
                onPress={() => updatePreference('language', 'en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  currentProfile.preferences.language === 'en' && styles.languageButtonTextActive
                ]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.settingValue}>
              {currentProfile.preferences.language === 'fr' ? 'Français' : 'English'}
            </Text>
          )}
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Thème</Text>
            <Text style={styles.settingDescription}>
              Apparence de l'application
            </Text>
          </View>
          {isEditing ? (
            <View style={styles.themeButtons}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  currentProfile.preferences.theme === 'light' && styles.themeButtonActive
                ]}
                onPress={() => updatePreference('theme', 'light')}
              >
                <Text style={[
                  styles.themeButtonText,
                  currentProfile.preferences.theme === 'light' && styles.themeButtonTextActive
                ]}>
                  Clair
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  currentProfile.preferences.theme === 'dark' && styles.themeButtonActive
                ]}
                onPress={() => updatePreference('theme', 'dark')}
              >
                <Text style={[
                  styles.themeButtonText,
                  currentProfile.preferences.theme === 'dark' && styles.themeButtonTextActive
                ]}>
                  Sombre
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.settingValue}>
              {currentProfile.preferences.theme === 'light' ? 'Clair' : 'Sombre'}
            </Text>
          )}
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications push</Text>
            <Text style={styles.settingDescription}>
              Recevoir les notifications sur l'appareil
            </Text>
          </View>
          <Switch
            value={currentProfile.preferences.pushNotifications}
            onValueChange={(value) => updatePreference('pushNotifications', value)}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications email</Text>
            <Text style={styles.settingDescription}>
              Recevoir les notifications par email
            </Text>
          </View>
          <Switch
            value={currentProfile.preferences.emailNotifications}
            onValueChange={(value) => updatePreference('emailNotifications', value)}
            disabled={!isEditing}
          />
        </View>
      </Card>

      {/* Actions */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <Button 
          title="Changer le mot de passe"
          onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
          style={styles.actionButton}
        />
        
        <Button 
          title="Exporter mes données"
          onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
          style={styles.actionButton}
        />
        
        <Button 
          title="Se déconnecter"
          onPress={logout}
          style={[styles.actionButton, styles.logoutButton]}
        />
      </Card>

      {/* Actions dangereuses */}
      <Card style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Actions dangereuses</Text>
        <Text style={styles.dangerDescription}>
          Ces actions sont irréversibles. Utilisez-les avec précaution.
        </Text>
        <Button 
          title="Supprimer mon compte"
          onPress={deleteAccount}
          style={styles.deleteButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    margin: 16,
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changeAvatarButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editActionButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  languageButtonActive: {
    backgroundColor: '#3B82F6',
  },
  languageButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  themeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  themeButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#F59E0B',
  },
  dangerSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#7F1D1D',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
}); 