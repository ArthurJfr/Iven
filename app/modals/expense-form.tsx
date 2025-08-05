import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ExpenseFormModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    paidBy: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.amount) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }
    
    Alert.alert('Succès', 'Dépense ajoutée !', [
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
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ajouter une dépense</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Titre */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Titre *</Text>
          <Input
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Ex: Déjeuner restaurant"
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Description</Text>
          <Input
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Détails de la dépense"
            multiline
          />
        </View>

        {/* Montant */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Montant *</Text>
          <Input
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        {/* Catégorie */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Catégorie</Text>
          <Input
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
            placeholder="Ex: Nourriture, Transport, Hébergement"
          />
        </View>

        {/* Payé par */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Payé par</Text>
          <Input
            value={formData.paidBy}
            onChangeText={(text) => setFormData({ ...formData, paidBy: text })}
            placeholder="Sélectionner un participant"
          />
        </View>

        {/* Date */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 8 }}>Date</Text>
          <Input
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            placeholder="JJ/MM/AAAA"
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
            title="Ajouter"
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 