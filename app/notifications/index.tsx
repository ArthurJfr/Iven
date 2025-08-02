import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();

  const mockNotifications = [
    {
      id: '1',
      type: 'event_invite',
      title: 'Nouvelle invitation',
      message: 'Alice vous a invité à "Anniversaire Marie"',
      time: '2 min',
      read: false,
    },
    {
      id: '2',
      type: 'task_assigned',
      title: 'Nouvelle tâche',
      message: 'Une tâche vous a été assignée',
      time: '1h',
      read: true,
    },
    {
      id: '3',
      type: 'message',
      title: 'Nouveau message',
      message: 'Bob: "N\'oubliez pas les boissons!"',
      time: '3h',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_invite': return 'calendar';
      case 'task_assigned': return 'checkmark-circle';
      case 'message': return 'chatbubble';
      default: return 'notifications';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>Notifications</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {mockNotifications.map(notification => (
          <TouchableOpacity
            key={notification.id}
            style={{
              flexDirection: 'row',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0',
              backgroundColor: notification.read ? '#FFF' : '#F8F9FA',
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <Ionicons name={getNotificationIcon(notification.type)} size={20} color="#FFF" />
            </View>
            
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{notification.title}</Text>
                <Text style={{ color: '#666', fontSize: 12 }}>{notification.time}</Text>
              </View>
              <Text style={{ color: '#666' }}>{notification.message}</Text>
            </View>
            
            {!notification.read && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#007AFF',
                marginLeft: 8,
                alignSelf: 'center',
              }} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 