import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function CreateEventModal() {
  const router = useRouter();

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
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Créer un événement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Titre */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Titre *</Text>
          <Input
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Nom de l'événement"
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Description</Text>
          <Input
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Description de l'événement"
            multiline
          />
        </View>

        {/* Date et Heure */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ marginBottom: 8 }}>Date *</Text>
            <Input
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="JJ/MM/AAAA"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ marginBottom: 8 }}>Heure</Text>
            <Input
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              placeholder="HH:MM"
            />
          </View>
        </View>

        {/* Lieu */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Lieu *</Text>
          <Input
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="Adresse ou lieu"
          />
        </View>

        {/* Type */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Type</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ flex: 1, padding: 12, marginRight: 8, backgroundColor: formData.type === 'physique' ? '#007AFF' : '#F0F0F0' }}
              onPress={() => setFormData({ ...formData, type: 'physique' })}
            >
              <Text style={{ textAlign: 'center', color: formData.type === 'physique' ? '#FFF' : '#000' }}>Physique</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, padding: 12, marginLeft: 8, backgroundColor: formData.type === 'virtuel' ? '#007AFF' : '#F0F0F0' }}
              onPress={() => setFormData({ ...formData, type: 'virtuel' })}
            >
              <Text style={{ textAlign: 'center', color: formData.type === 'virtuel' ? '#FFF' : '#000' }}>Virtuel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Catégorie */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Catégorie</Text>
          <Input
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
            placeholder="Ex: Fête, Réunion, Voyage..."
          />
        </View>

        {/* Participants max */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 8 }}>Participants max</Text>
          <Input
            value={formData.maxParticipants}
            onChangeText={(text) => setFormData({ ...formData, maxParticipants: text })}
            placeholder="Nombre maximum"
            keyboardType="numeric"
          />
        </View>

        {/* Boutons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            title="Annuler"
            onPress={() => router.back()}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <Button
            title="Créer"
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 