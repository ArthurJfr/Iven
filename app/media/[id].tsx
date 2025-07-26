import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import { Media } from "../../types/categories";
import mediaData from "../../data/media.json";
import Card from "../../components/ui/Card";
import TopBar from "../../components/ui/TopBar";
import { Ionicons } from '@expo/vector-icons';

export default function MediaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  // Recherche du média correspondant
  const media: Media | undefined = (mediaData as Media[]).find(m => m.id === id);

  if (!media) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.titleLg, { color: theme.text, marginBottom: 8 }]}>Média introuvable</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Aucun média ne correspond à cet identifiant.</Text>
      </View>
    );
  }

  const getTypeIcon = () => {
    switch (media.type) {
      case 'image':
        return 'image';
      case 'video':
        return 'videocam';
      case 'document':
        return 'document';
      case 'audio':
        return 'musical-notes';
      default:
        return 'file';
    }
  };

  const getTypeColor = () => {
    switch (media.type) {
      case 'image':
        return '#10b981';
      case 'video':
        return '#ef4444';
      case 'document':
        return '#3b82f6';
      case 'audio':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getTypeText = () => {
    switch (media.type) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Vidéo';
      case 'document':
        return 'Document';
      case 'audio':
        return 'Audio';
      default:
        return 'Fichier';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopBar 
        title="Détail du média"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
          <Text style={[styles.titleLg, { marginBottom: 16 }]}>{media.title}</Text>
          
          <View style={localStyles.mediaPreview}>
            {media.type === 'image' && media.thumbnail ? (
              <Image source={{ uri: media.thumbnail }} style={localStyles.previewImage} />
            ) : (
              <View style={[localStyles.previewPlaceholder, { backgroundColor: getTypeColor() }]}>
                <Ionicons name={getTypeIcon()} size={48} color="#ffffff" />
              </View>
            )}
          </View>
          
          <View style={localStyles.row}>
            <Ionicons name={getTypeIcon()} size={18} color={getTypeColor()} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Type : {getTypeText()}</Text>
          </View>
          
          <View style={localStyles.row}>
            <Ionicons name="link" size={18} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Événement : #{media.eventId}</Text>
          </View>
          
          <View style={localStyles.row}>
            <Ionicons name="person" size={18} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Uploadé par : {media.uploadedBy}</Text>
          </View>
          
          {media.size && (
            <View style={localStyles.row}>
              <Ionicons name="hard-disk" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>Taille : {formatFileSize(media.size)}</Text>
            </View>
          )}
          
          <View style={localStyles.row}>
            <Ionicons name="calendar" size={18} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Uploadé le {media.createdAt}</Text>
          </View>
          
          <TouchableOpacity style={localStyles.downloadButton}>
            <Ionicons name="download" size={20} color="#ffffff" />
            <Text style={localStyles.downloadText}>Télécharger</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  mediaPreview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  previewPlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  downloadText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 