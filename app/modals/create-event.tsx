import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Header from '../../components/ui/organisms/Header';

export default function CreateEventModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'physique',
    category: '',
    maxParticipants: '',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.location) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }
    
    Alert.alert('Succès', 'Événement créé avec succès !', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header 
        title="Créer un événement"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView 
        style={[layoutStyles.container]}
        contentContainerStyle={{ paddingHorizontal: spacing[5], paddingBottom: spacing[8] }}
      >
        
        {/* Informations principales */}
        <View style={{ paddingTop: spacing[6] }}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
            Informations principales
          </Text>

          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[6] }}>
            <View style={[layoutStyles.gap4]}>
              <Input
                label="Titre de l'événement"
                placeholder="Ex: Anniversaire de Marie"
                value={formData.title}
                onChangeText={(value) => setFormData({...formData, title: value})}
                required
              />

              <Input
                label="Description"
                placeholder="Décrivez votre événement..."
                value={formData.description}
                onChangeText={(value) => setFormData({...formData, description: value})}
                multiline
                numberOfLines={3}
              />

              <View style={[layoutStyles.row, layoutStyles.gap3]}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Date"
                    placeholder="JJ/MM/AAAA"
                    value={formData.date}
                    onChangeText={(value) => setFormData({...formData, date: value})}
                    required
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Heure"
                    placeholder="HH:MM"
                    value={formData.time}
                    onChangeText={(value) => setFormData({...formData, time: value})}
                  />
                </View>
              </View>

              <Input
                label="Lieu"
                placeholder="Adresse ou nom du lieu"
                value={formData.location}
                onChangeText={(value) => setFormData({...formData, location: value})}
                required
              />
            </View>
          </Card>

          {/* Type d'événement */}
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
            Type d'événement
          </Text>

          <View style={[layoutStyles.row, layoutStyles.gap3, { marginBottom: spacing[6] }]}>
            <TouchableOpacity 
              style={{ flex: 1 }}
              onPress={() => setFormData({...formData, type: 'physique'})}
            >
              <Card 
                variant={formData.type === 'physique' ? 'elevated' : 'outlined'} 
                padding="medium"
                style={{ 
                  backgroundColor: formData.type === 'physique' ? theme.primary : theme.backgroundSecondary 
                }}
              >
                <View style={[layoutStyles.centerHorizontal]}>
                  <Ionicons 
                    name="location" 
                    size={24} 
                    color={formData.type === 'physique' ? '#FFF' : theme.textSecondary} 
                    style={{ marginBottom: spacing[2] }}
                  />
                  <Text 
                    variant="body" 
                    weight="semibold"
                    style={{ 
                      color: formData.type === 'physique' ? '#FFF' : theme.text,
                      textAlign: 'center'
                    }}
                  >
                    Physique
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ flex: 1 }}
              onPress={() => setFormData({...formData, type: 'virtuel'})}
            >
              <Card 
                variant={formData.type === 'virtuel' ? 'elevated' : 'outlined'} 
                padding="medium"
                style={{ 
                  backgroundColor: formData.type === 'virtuel' ? theme.primary : theme.backgroundSecondary 
                }}
              >
                <View style={[layoutStyles.centerHorizontal]}>
                  <Ionicons 
                    name="videocam" 
                    size={24} 
                    color={formData.type === 'virtuel' ? '#FFF' : theme.textSecondary} 
                    style={{ marginBottom: spacing[2] }}
                  />
                  <Text 
                    variant="body" 
                    weight="semibold"
                    style={{ 
                      color: formData.type === 'virtuel' ? '#FFF' : theme.text,
                      textAlign: 'center'
                    }}
                  >
                    Virtuel
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer fixe */}
      <View style={{
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background
      }}>
        <Button 
          title="Créer l'événement"
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
} 