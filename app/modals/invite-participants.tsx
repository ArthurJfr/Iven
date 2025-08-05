import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function InviteParticipantsModal() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const mockUsers = [
    { id: '1', name: 'Alice Martin', email: 'alice@example.com' },
    { id: '2', name: 'Bob Dupont', email: 'bob@example.com' },
    { id: '3', name: 'Claire Leblanc', email: 'claire@example.com' },
  ];

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = () => {
    Alert.alert('Succès', `${selectedUsers.length} invitation(s) envoyée(s) !`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Inviter des participants</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Recherche */}
      <View style={{ marginBottom: 20 }}>
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher par nom ou email..."
        />
      </View>

      {/* Liste utilisateurs */}
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {mockUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F9F9F9', marginBottom: 8, borderRadius: 8 }}
            onPress={() => toggleUser(user.id)}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text>{user.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500' }}>{user.name}</Text>
              <Text style={{ color: '#666' }}>{user.email}</Text>
            </View>
            {selectedUsers.includes(user.id) && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Boutons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button
          title="Annuler"
          onPress={() => router.back()}
          variant="secondary"
          style={{ flex: 1 }}
        />
        <Button
          title={`Inviter (${selectedUsers.length})`}
          onPress={handleInvite}
          style={{ flex: 1 }}
          disabled={selectedUsers.length === 0}
        />
      </View>
    </View>
  );
} 