import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function EditProfileModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné d\'événements et de rencontres',
  });

  const handleSubmit = () => {
    Alert.alert('Succès', 'Profil mis à jour !', [
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
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Modifier le profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="person" size={40} color="#999" />
          </View>
          <TouchableOpacity>
            <Text style={{ color: '#007AFF' }}>Changer la photo</Text>
          </TouchableOpacity>
        </View>

        {/* Prénom */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Prénom</Text>
          <Input
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
        </View>

        {/* Nom */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Nom</Text>
          <Input
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
        </View>

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Email</Text>
          <Input
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
        </View>

        {/* Téléphone */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Téléphone</Text>
          <Input
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 8 }}>Bio</Text>
          <Input
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Parlez-nous de vous..."
            multiline
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
            title="Sauvegarder"
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 