import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MediaViewerModal() {
  const router = useRouter();
  const { url, type } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="download-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {type === 'video' ? (
          <View style={{ width: width * 0.9, height: height * 0.5, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="play-circle" size={80} color="#FFF" />
          </View>
        ) : (
          <Image
            source={{ uri: url as string || 'https://via.placeholder.com/400x300' }}
            style={{ width: width, height: height * 0.7 }}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
} 