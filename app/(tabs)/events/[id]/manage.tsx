import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface EventSettings {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'physique' | 'virtuel';
  isPrivate: boolean;
  allowInvites: boolean;
  notifications: boolean;
  maxParticipants: number;
}

interface Participant {
  id: number;
  name: string;
  email: string;
  role: 'organizer' | 'participant';
  status: 'accepted' | 'pending' | 'declined';
  joinedAt: string;
}

export default function EventManageScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [settings, setSettings] = useState<EventSettings>({
    title: "Anniversaire de Marie",
    description: "Célébration de l'anniversaire de Marie avec tous ses amis",
    date: "2024-03-15",
    time: "19:00",
    location: "123 Rue de la Paix, Paris",
    type: "physique",
    isPrivate: true,
    allowInvites: true,
    notifications: true,
    maxParticipants: 20
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      name: "Marie",
      email: "marie@example.com",
      role: "organizer",
      status: "accepted",
      joinedAt: "2024-03-01"
    },
    {
      id: 2,
      name: "Jean",
      email: "jean@example.com",
      role: "participant",
      status: "pending",
      joinedAt: "2024-03-02"
    },
    {
      id: 3,
      name: "Sophie",
      email: "sophie@example.com",
      role: "participant",
      status: "accepted",
      joinedAt: "2024-03-03"
    }
  ]);

  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateSetting = (key: keyof EventSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const inviteParticipant = () => {
    if (!newParticipantEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email');
      return;
    }

    if (!newParticipantEmail.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }

    const newParticipant: Participant = {
      id: Date.now(),
      name: newParticipantEmail.split('@')[0],
      email: newParticipantEmail,
      role: 'participant',
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantEmail('');
    setShowInviteForm(false);
    Alert.alert('Succès', 'Invitation envoyée !');
  };

  const removeParticipant = (participantId: number) => {
    Alert.alert(
      'Retirer le participant',
      'Êtes-vous sûr de vouloir retirer ce participant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: () => setParticipants(participants.filter(p => p.id !== participantId))
        }
      ]
    );
  };

  const changeParticipantRole = (participantId: number, newRole: 'organizer' | 'participant') => {
    setParticipants(participants.map(p => 
      p.id === participantId ? { ...p, role: newRole } : p
    ));
  };

  const deleteEvent = () => {
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Événement supprimé', 'L\'événement a été supprimé avec succès');
            router.back();
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepté';
      case 'pending': return 'En attente';
      case 'declined': return 'Refusé';
      default: return 'Inconnu';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gérer l'événement</Text>
        <Button 
          title={isEditing ? "Sauvegarder" : "Modifier"}
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        />
      </View>

      {/* Informations de base */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de base</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Titre</Text>
          <Input
            value={settings.title}
            onChangeText={(text) => updateSetting('title', text)}
            editable={isEditing}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <Input
            value={settings.description}
            onChangeText={(text) => updateSetting('description', text)}
            multiline
            editable={isEditing}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <Input
              value={settings.date}
              onChangeText={(text) => updateSetting('date', text)}
              editable={isEditing}
              style={styles.input}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Heure</Text>
            <Input
              value={settings.time}
              onChangeText={(text) => updateSetting('time', text)}
              editable={isEditing}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Lieu</Text>
          <Input
            value={settings.location}
            onChangeText={(text) => updateSetting('location', text)}
            editable={isEditing}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Type d'événement</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                settings.type === 'physique' && styles.typeButtonActive
              ]}
              onPress={() => updateSetting('type', 'physique')}
              disabled={!isEditing}
            >
              <Text style={[
                styles.typeButtonText,
                settings.type === 'physique' && styles.typeButtonTextActive
              ]}>
                En présentiel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                settings.type === 'virtuel' && styles.typeButtonActive
              ]}
              onPress={() => updateSetting('type', 'virtuel')}
              disabled={!isEditing}
            >
              <Text style={[
                styles.typeButtonText,
                settings.type === 'virtuel' && styles.typeButtonTextActive
              ]}>
                Virtuel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Paramètres de confidentialité */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Événement privé</Text>
            <Text style={styles.settingDescription}>
              Seuls les participants invités peuvent voir l'événement
            </Text>
          </View>
          <Switch
            value={settings.isPrivate}
            onValueChange={(value) => updateSetting('isPrivate', value)}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Autoriser les invitations</Text>
            <Text style={styles.settingDescription}>
              Les participants peuvent inviter d'autres personnes
            </Text>
          </View>
          <Switch
            value={settings.allowInvites}
            onValueChange={(value) => updateSetting('allowInvites', value)}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Recevoir les notifications de l'événement
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            disabled={!isEditing}
          />
        </View>
      </Card>

      {/* Participants */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
          <Button 
            title="Inviter"
            onPress={() => setShowInviteForm(!showInviteForm)}
            style={styles.inviteButton}
          />
        </View>

        {showInviteForm && (
          <View style={styles.inviteForm}>
            <Input
              placeholder="Adresse email"
              value={newParticipantEmail}
              onChangeText={setNewParticipantEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <View style={styles.inviteButtons}>
              <Button 
                title="Annuler" 
                onPress={() => setShowInviteForm(false)}
                style={[styles.inviteFormButton, styles.cancelButton]}
              />
              <Button 
                title="Inviter" 
                onPress={inviteParticipant}
                style={styles.inviteFormButton}
              />
            </View>
          </View>
        )}

        {participants.map((participant) => (
          <View key={participant.id} style={styles.participantCard}>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <Text style={styles.participantEmail}>{participant.email}</Text>
              <View style={styles.participantMeta}>
                <Text style={styles.participantRole}>
                  {participant.role === 'organizer' ? 'Organisateur' : 'Participant'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(participant.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(participant.status)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.participantActions}>
              {participant.role === 'participant' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => changeParticipantRole(participant.id, 'organizer')}
                >
                  <Text style={styles.actionButtonText}>Promouvoir</Text>
                </TouchableOpacity>
              )}
              {participant.role === 'organizer' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => changeParticipantRole(participant.id, 'participant')}
                >
                  <Text style={styles.actionButtonText}>Rétrograder</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeParticipant(participant.id)}
              >
                <Text style={styles.removeButtonText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Card>

      {/* Actions dangereuses */}
      <Card style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Actions dangereuses</Text>
        <Text style={styles.dangerDescription}>
          Ces actions sont irréversibles. Utilisez-les avec précaution.
        </Text>
        <Button 
          title="Supprimer l'événement"
          onPress={deleteEvent}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inviteForm: {
    marginBottom: 16,
  },
  inviteButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  inviteFormButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  participantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  participantEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  participantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantRole: {
    fontSize: 10,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  participantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  removeButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
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