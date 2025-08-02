import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné d\'événements et de rencontres',
    eventsCreated: 12,
    eventsParticipated: 28,
    tasksCompleted: 45,
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Modifier le profil', action: () => router.push('/modals/edit-profile') },
    { icon: 'settings-outline', title: 'Paramètres', action: () => router.push('/profile/settings') },
    { icon: 'notifications-outline', title: 'Notifications', action: () => router.push('/notifications') },
    { icon: 'help-circle-outline', title: 'Aide & Support', action: () => {} },
    { icon: 'information-circle-outline', title: 'À propos', action: () => {} },
    { icon: 'log-out-outline', title: 'Déconnexion', action: () => {}, color: '#FF3B30' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView>
        {/* Header avec profil */}
        <View style={{ alignItems: 'center', padding: 20, paddingTop: 60 }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#F0F0F0',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Ionicons name="person" size={50} color="#999" />
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {mockUser.name}
          </Text>
          <Text style={{ color: '#666', marginBottom: 8 }}>
            {mockUser.email}
          </Text>
          <Text style={{ color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
            {mockUser.bio}
          </Text>
        </View>

        {/* Statistiques */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#F9F9F9', borderRadius: 12, marginRight: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF' }}>
              {mockUser.eventsCreated}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Événements créés</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#F9F9F9', borderRadius: 12, marginHorizontal: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#34C759' }}>
              {mockUser.eventsParticipated}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Participations</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#F9F9F9', borderRadius: 12, marginLeft: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF9500' }}>
              {mockUser.tasksCompleted}
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Tâches terminées</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={{ paddingHorizontal: 20 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: '#F0F0F0',
              }}
              onPress={item.action}
            >
              <Ionicons
                name={item.icon as "person-outline" | "settings-outline" | "notifications-outline" | "help-circle-outline" | "information-circle-outline" | "log-out-outline"}
                size={24}
                color={item.color || '#666'}
                style={{ marginRight: 16 }}
              />
              <Text style={{
                flex: 1,
                fontSize: 16,
                color: item.color || '#000',
              }}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}