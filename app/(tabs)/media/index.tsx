import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 3; // 3 colonnes avec marges

export default function MediaScreen() {
  const router = useRouter();

  const mockMedia = [
    {
      id: '1',
      url: 'https://via.placeholder.com/150',
      type: 'image',
      event: 'Anniversaire Marie',
    },
    {
      id: '2',
      url: 'https://via.placeholder.com/150',
      type: 'video',
      event: 'Anniversaire Marie',
    },
    {
      id: '3',
      url: 'https://via.placeholder.com/150',
      type: 'image',
      event: 'Weekend ski',
    },
    {
      id: '4',
      url: 'https://via.placeholder.com/150',
      type: 'image',
      event: 'Réunion équipe',
    },
    {
      id: '5',
      url: 'https://via.placeholder.com/150',
      type: 'video',
      event: 'Weekend ski',
    },
    {
      id: '6',
      url: 'https://via.placeholder.com/150',
      type: 'image',
      event: 'Anniversaire Marie',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mes Médias</Text>
        <TouchableOpacity onPress={() => router.push('/modals/media-viewer')}>
          <Ionicons name="camera" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {['Tous', 'Photos', 'Vidéos', 'Récents'].map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: index === 0 ? '#007AFF' : '#F0F0F0',
              }}
            >
              <Text style={{ color: index === 0 ? '#FFF' : '#000' }}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {mockMedia.map(media => (
            <TouchableOpacity
              key={media.id}
              style={{
                width: itemWidth,
                height: itemWidth,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#F0F0F0',
              }}
              onPress={() => router.push(`/media/${media.id}`)}
            >
              <Image
                source={{ uri: media.url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              
              {/* Overlay pour les vidéos */}
              {media.type === 'video' && (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                  <Ionicons name="play-circle" size={32} color="#FFF" />
                </View>
              )}
              
              {/* Nom de l'événement */}
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: 4,
              }}>
                <Text style={{ color: '#FFF', fontSize: 10, textAlign: 'center' }}>
                  {media.event}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 