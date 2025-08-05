import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { layoutStyles, spacing } from '../../styles';

const { width, height } = Dimensions.get('window');

export default function MediaViewerModal() {
  const router = useRouter();
  const { url, type } = useLocalSearchParams();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{ 
        position: 'absolute', 
        top: spacing[6], 
        left: spacing[5], 
        right: spacing[5], 
        zIndex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...layoutStyles.center
          }}
        >
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={[layoutStyles.row, { gap: spacing[3] }]}>
          <TouchableOpacity style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...layoutStyles.center
          }}>
            <Ionicons name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...layoutStyles.center
          }}>
            <Ionicons name="download-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(220, 38, 38, 0.8)',
            ...layoutStyles.center
          }}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu */}
      <View style={[layoutStyles.center, { flex: 1 }]}>
        {type === 'video' ? (
          <View style={{ 
            width: width * 0.9, 
            height: height * 0.5, 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: 12,
            ...layoutStyles.center
          }}>
            <TouchableOpacity style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              ...layoutStyles.center
            }}>
              <Ionicons name="play" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={{ uri: url as string || 'https://via.placeholder.com/400x300' }}
            style={{ width: width, height: height * 0.7, borderRadius: 12 }}
            resizeMode="contain"
          />
        )}
      </View>
    </SafeAreaView>
  );
} 