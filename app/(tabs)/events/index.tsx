import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import events from '../../../data/events.json';
import Header from '../../../components/ui/organisms/Header';
import { useTheme } from '../../../contexts/ThemeContext';
import Card from '../../../components/ui/Card';

export default function EventsListScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const mockEvents = events;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Header
        title="Mes Événements"
        rightAction={{
          icon: "add-circle",
          onPress: () => router.push('/modals/create-event')
        }}
      />

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {mockEvents.map(event => (
          <Card
            key={event.id}
            style={{ marginBottom: 12 }}
            variant="elevated"
            padding="medium"
            onPress={() => router.push(`/events/${event.id}`)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, color: theme.text }}>{event.title}</Text>
              <View style={{
                backgroundColor: theme.primaryDark,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#FFF', fontSize: 12 }}>{event.status}</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>{event.date}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>{event.location}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>{event.participants} participants</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
} 