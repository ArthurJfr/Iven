import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/organisms/Header';
import { useTheme } from '../../contexts/ThemeContext';

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  name: string;
}

export default function MediaUploadModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissions requises',
        'Nous avons besoin d\'accéder à votre galerie pour sélectionner des médias.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image' as const,
          name: asset.fileName || `image_${Date.now()}.jpg`
        }));
        setSelectedMedia(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newVideos = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'video' as const,
          name: asset.fileName || `video_${Date.now()}.mp4`
        }));
        setSelectedMedia(prev => [...prev, ...newVideos]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner la vidéo');
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Aucun média', 'Veuillez sélectionner au moins un média à uploader.');
      return;
    }

    setUploading(true);
    
    try {
      // Simulation d'upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Upload réussi !',
        `${selectedMedia.length} média(s) ajouté(s) à l'événement.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'upload des médias');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header
        title="Ajouter des médias"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView 
        style={[layoutStyles.container]}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing[5] }}>
          
          {/* Options de sélection */}
          <View style={{ paddingTop: spacing[6], paddingBottom: spacing[4] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[6] }}>
              Choisir le type de média
            </Text>

            {/* Cards de sélection améliorées */}
            <View style={[layoutStyles.gap4]}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                <Card variant="elevated" padding="large">
                  <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: theme.primary + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[4]
                    }}>
                      <Ionicons name="images" size={28} color={theme.primary} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="bold" style={{ marginBottom: spacing[1] }}>
                        Sélectionner des photos
                      </Text>
                      <Text variant="small" color="secondary">
                        Choisir depuis votre galerie iPhone
                      </Text>
                    </View>
                    
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: theme.backgroundSecondary,
                      ...layoutStyles.center
                    }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity onPress={pickVideo} activeOpacity={0.7}>
                <Card variant="elevated" padding="large">
                  <View style={[layoutStyles.row, { alignItems: 'center' }]}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: theme.warning + '15',
                      ...layoutStyles.center,
                      marginRight: spacing[4]
                    }}>
                      <Ionicons name="videocam" size={28} color={theme.warning} />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="bold" style={{ marginBottom: spacing[1] }}>
                        Sélectionner des vidéos
                      </Text>
                      <Text variant="small" color="secondary">
                        Choisir depuis votre galerie iPhone
                      </Text>
                    </View>
                    
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: theme.backgroundSecondary,
                      ...layoutStyles.center
                    }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </View>

          {/* Médias sélectionnés */}
          {selectedMedia.length > 0 && (
            <View style={{ paddingTop: spacing[4] }}>
              <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4], alignItems: 'center' }]}>
                <Text variant="h3" weight="semibold">
                  Médias sélectionnés
                </Text>
                <View style={{
                  backgroundColor: theme.primary + '15',
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                  borderRadius: 12
                }}>
                  <Text variant="caption" weight="semibold" style={{ color: theme.primary }}>
                    {selectedMedia.length}
                  </Text>
                </View>
              </View>

              {/* Grid des médias sélectionnés */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing[3],
                marginBottom: spacing[6]
              }}>
                {selectedMedia.map((media, index) => (
                  <View key={index} style={{ 
                    width: '30%',
                    minWidth: 100,
                    position: 'relative' 
                  }}>
                    <View style={{
                      aspectRatio: 1,
                      borderRadius: 12,
                      overflow: 'hidden',
                      backgroundColor: theme.backgroundSecondary,
                      borderWidth: 2,
                      borderColor: theme.border
                    }}>
                      {media.type === 'image' ? (
                        <Image 
                          source={{ uri: media.uri }} 
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[layoutStyles.center, { flex: 1, backgroundColor: theme.backgroundTertiary }]}>
                          <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: theme.warning + '20',
                            ...layoutStyles.center,
                            marginBottom: spacing[1]
                          }}>
                            <Ionicons name="play" size={16} color={theme.warning} />
                          </View>
                          <Text variant="small" color="secondary">
                            Vidéo
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Bouton de suppression */}
                    <TouchableOpacity
                      onPress={() => removeMedia(index)}
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: theme.error,
                        ...layoutStyles.center,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 4
                      }}
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* État vide avec illustration */}
          {selectedMedia.length === 0 && (
            <View style={{
              paddingVertical: spacing[10],
              ...layoutStyles.centerHorizontal
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.backgroundSecondary,
                ...layoutStyles.center,
                marginBottom: spacing[4]
              }}>
                <Ionicons name="cloud-upload-outline" size={40} color={theme.textTertiary} />
              </View>
              
              <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[2] }}>
                Aucun média sélectionné
              </Text>
              <Text variant="small" color="tertiary" style={{ textAlign: 'center' }}>
                Appuyez sur une option ci-dessus pour commencer
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Boutons d'action fixe en bas */}
      {selectedMedia.length > 0 && (
        <View style={{
          paddingHorizontal: spacing[5],
          paddingVertical: spacing[4],
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.background
        }}>
          <Button
            title={uploading ? "Upload en cours..." : `Ajouter ${selectedMedia.length} média(s)`}
            onPress={handleUpload}
            disabled={uploading}
          />
          
          {!uploading && (
            <TouchableOpacity 
              onPress={() => setSelectedMedia([])}
              style={[layoutStyles.centerHorizontal, { marginTop: spacing[3] }]}
            >
              <Text variant="caption" color="secondary">
                Tout effacer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
} 