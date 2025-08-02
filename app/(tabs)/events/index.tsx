import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import events from '../../../data/events.json';

export default function EventsListScreen() {
  const router = useRouter();

  const mockEvents = events;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mes Événements</Text>
        <TouchableOpacity onPress={() => router.push('/modals/create-event')}>
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {mockEvents.map(event => (
          <TouchableOpacity
            key={event.id}
            style={{
              backgroundColor: '#F9F9F9',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
            onPress={() => router.push(`/events/${event.id}`)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{event.title}</Text>
              <View style={{
                backgroundColor: '#007AFF',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#FFF', fontSize: 12 }}>{event.status}</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={{ color: '#666', marginLeft: 8 }}>{event.date}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={{ color: '#666', marginLeft: 8 }}>{event.location}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={{ color: '#666', marginLeft: 8 }}>{event.participants} participants</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 