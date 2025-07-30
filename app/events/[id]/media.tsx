import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3; // 3 colonnes avec marges

export default function EventMediaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 1,
      url: 'https://picsum.photos/300/300?random=1',
      type: 'image',
      title: 'Photo de groupe',
      uploadedBy: 'Marie',
      uploadedAt: '2024-03-14',
      size: '2.3 MB'
    },
    {
      id: 2,
      url: 'https://picsum.photos/300/300?random=2',
      type: 'image',
      title: 'Décorations',
      uploadedBy: 'Jean',
      uploadedAt: '2024-03-13',
      size: '1.8 MB'
    },
    {
      id: 3,
      url: 'https://picsum.photos/300/300?random=3',
      type: 'image',
      title: 'Gâteau',
      uploadedBy: 'Sophie',
      uploadedAt: '2024-03-14',
      size: '3.1 MB'
    },
    {
      id: 4,
      url: 'https://picsum.photos/300/300?random=4',
      type: 'video',
      title: 'Vidéo souvenir',
      uploadedBy: 'Marie',
      uploadedAt: '2024-03-14',
      size: '15.2 MB'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const filteredMedia = mediaItems.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'images') return item.type === 'image';
    if (selectedFilter === 'videos') return item.type === 'video';
    return true;
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMedia: MediaItem = {
        id: Date.now(),
        url: result.assets[0].uri,
        type: 'image',
        title: `Photo ${mediaItems.length + 1}`,
        uploadedBy: 'Moi',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: '2.1 MB'
      };
      setMediaItems([...mediaItems, newMedia]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMedia: MediaItem = {
        id: Date.now(),
        url: result.assets[0].uri,
        type: 'video',
        title: `Vidéo ${mediaItems.length + 1}`,
        uploadedBy: 'Moi',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: '12.5 MB'
      };
      setMediaItems([...mediaItems, newMedia]);
    }
  };

  const deleteMedia = (mediaId: number) => {
    Alert.alert(
      'Supprimer le média',
      'Êtes-vous sûr de vouloir supprimer ce média ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => setMediaItems(mediaItems.filter(item => item.id !== mediaId))
        }
      ]
    );
  };

  const getMediaStats = () => {
    const images = mediaItems.filter(item => item.type === 'image').length;
    const videos = mediaItems.filter(item => item.type === 'video').length;
    const totalSize = mediaItems.reduce((acc, item) => {
      const size = parseFloat(item.size.split(' ')[0]);
      return acc + size;
    }, 0);
    
    return { images, videos, totalSize: totalSize.toFixed(1) };
  };

  const stats = getMediaStats();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Médias de l'événement</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.background }]}
          onPress={() => setShowUploadOptions(!showUploadOptions)}
        >
          <Ionicons 
            name={showUploadOptions ? "close" : "add"} 
            size={20} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>

      {showUploadOptions && (
        <Card style={styles.uploadOptions}>
          <Text style={styles.uploadTitle}>Ajouter un média</Text>
          <View style={styles.uploadButtons}>
            <TouchableOpacity 
              style={[styles.uploadButton, { backgroundColor: theme.background }]}
              onPress={pickImage}
            >
              <Ionicons name="camera-outline" size={24} color={theme.text} />
              <Text style={[styles.uploadButtonText, { color: theme.text }]}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.uploadButton, { backgroundColor: theme.background }]}
              onPress={pickVideo}
            >
              <Ionicons name="videocam-outline" size={24} color={theme.text} />
              <Text style={[styles.uploadButtonText, { color: theme.text }]}>Vidéo</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Statistiques */}
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.images}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.videos}</Text>
            <Text style={styles.statLabel}>Vidéos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalSize}</Text>
            <Text style={styles.statLabel}>MB</Text>
          </View>
        </View>
      </Card>

      {/* Filtres */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Tout ({mediaItems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'images' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('images')}
        >
          <Text style={[styles.filterText, selectedFilter === 'images' && styles.filterTextActive]}>
            Photos ({stats.images})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'videos' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('videos')}
        >
          <Text style={[styles.filterText, selectedFilter === 'videos' && styles.filterTextActive]}>
            Vidéos ({stats.videos})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredMedia.length > 0 ? (
          <View style={styles.mediaGrid}>
            {filteredMedia.map((item) => (
              <Card key={item.id} style={styles.mediaCard}>
                <View style={styles.mediaContainer}>
                  <Image 
                    source={{ uri: item.url }} 
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                  {item.type === 'video' && (
                    <View style={styles.videoOverlay}>
                      <Text style={styles.videoIcon}>▶</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteMedia(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.mediaInfo}>
                  <Text style={styles.mediaTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.mediaMeta}>
                    {item.uploadedBy} • {item.uploadedAt}
                  </Text>
                  <Text style={styles.mediaSize}>{item.size}</Text>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' 
                ? "Aucun média pour cet événement"
                : selectedFilter === 'images' 
                ? "Aucune photo pour cet événement"
                : "Aucune vidéo pour cet événement"
              }
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Ajoutez votre premier média pour commencer
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: Math.min(20, width * 0.05),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOptions: {
    margin: 16,
    padding: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  uploadButtonText: {
    fontSize: Math.min(14, width * 0.035),
    fontWeight: '500',
    marginTop: 8,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  mediaCard: {
    width: imageSize,
    marginBottom: 8,
  },
  mediaContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: imageSize,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaInfo: {
    padding: 8,
  },
  mediaTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  mediaMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  mediaSize: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyState: {
    margin: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
}); 