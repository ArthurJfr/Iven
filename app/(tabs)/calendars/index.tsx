import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const mockEvents = [
    {
      id: '1',
      title: 'Anniversaire Marie',
      date: '2024-01-15',
      time: '19:00',
      color: '#FF3B30',
    },
    {
      id: '2',
      title: 'Réunion équipe',
      date: '2024-01-18',
      time: '14:00',
      color: '#007AFF',
    },
    {
      id: '3',
      title: 'Weekend ski',
      date: '2024-01-20',
      time: '08:00',
      color: '#34C759',
    },
  ];

  // Génération simple d'un calendrier mensuel
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Premier jour du mois
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Jours vides au début
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Calendrier</Text>
        <TouchableOpacity onPress={() => router.push('/modals/create-event')}>
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Calendrier */}
        <View style={{ padding: 20 }}>
          {/* En-têtes des jours */}
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {weekDays.map(day => (
              <View key={day} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>{day}</Text>
              </View>
            ))}
          </View>
          
          {/* Grille du calendrier */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: '14.28%',
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: day && selectedDate === `2024-01-${day.toString().padStart(2, '0')}` ? '#007AFF' : 'transparent',
                }}
                onPress={() => day && setSelectedDate(`2024-01-${day.toString().padStart(2, '0')}`)}
              >
                {day && (
                  <>
                    <Text style={{
                      color: selectedDate === `2024-01-${day.toString().padStart(2, '0')}` ? '#FFF' : '#000',
                      fontWeight: 'bold',
                    }}>
                      {day}
                    </Text>
                    {/* Indicateur d'événement */}
                    {mockEvents.some(event => event.date === `2024-01-${day.toString().padStart(2, '0')}`) && (
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: selectedDate === `2024-01-${day.toString().padStart(2, '0')}` ? '#FFF' : '#007AFF',
                        marginTop: 2,
                      }} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Événements du jour sélectionné */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Événements du {selectedDate}
          </Text>
          
          {mockEvents
            .filter(event => event.date === selectedDate)
            .map(event => (
              <TouchableOpacity
                key={event.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F9F9F9',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: event.color,
                }}
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: event.color,
                  marginRight: 12,
                }} />
                
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text style={{ color: '#666' }}>{event.time}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          
          {mockEvents.filter(event => event.date === selectedDate).length === 0 && (
            <Text style={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
              Aucun événement ce jour
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 