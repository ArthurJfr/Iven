import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../../components/ui/Input';

export default function UsersScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const mockUsers = [
    {
      id: '1',
      name: 'Alice Martin',
      email: 'alice@example.com',
      eventsCount: 5,
      avatar: '🐯',
    },
    {
      id: '2',
      name: 'Bob Dupont',
      email: 'bob@example.com',
      eventsCount: 3,
      avatar: '🦁',
    },
    {
      id: '3',
      name: 'Claire Leblanc',
      email: 'claire@example.com',
      eventsCount: 8,
      avatar: '🐸',
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'david@example.com',
      eventsCount: 2,
      avatar: '🐺',
    },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Utilisateurs</Text>
        
        {/* Barre de recherche */}
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher un utilisateur..."
        />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {filteredUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9F9F9',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
            onPress={() => router.push(`/users/${user.id}`)}
          >
            {/* Avatar */}
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#E0E0E0',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
            </View>
            
            {/* Infos utilisateur */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                {user.name}
              </Text>
              <Text style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                {user.email}
              </Text>
              <Text style={{ color: '#999', fontSize: 12 }}>
                {user.eventsCount} événement{user.eventsCount > 1 ? 's' : ''}
              </Text>
            </View>
            
            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#007AFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => router.push('/modals/invite-participants')}
              >
                <Ionicons name="person-add" size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#34C759',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="chatbubble" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 