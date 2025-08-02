import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Iven</Text>
        <TouchableOpacity onPress={() => router.push('/ui-test')}>
          <Ionicons name="color-palette" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Bienvenue sur Iven</Text>
        
        {/* Bouton d'accès au showcase UI */}
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => router.push('/ui-test')}
        >
          <Ionicons name="color-palette" size={24} color="#FFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
              UI Components Showcase
            </Text>
            <Text style={{ color: '#FFF', opacity: 0.8, fontSize: 14 }}>
              Voir tous les composants disponibles
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Autres contenus de la page d'accueil... */}
        <Text style={{ color: '#666' }}>
          Votre application de gestion d'événements
        </Text>
      </ScrollView>
    </View>
  );
}

  
