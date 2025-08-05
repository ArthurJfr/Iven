import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function TaskDetailModal() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: 'Préparer la décoration',
    description: 'Acheter ballons, guirlandes et centres de table',
    assignedTo: 'Alice Martin',
    priority: 'medium',
    dueDate: '2024-01-15',
    status: 'pending',
  });

  const handleSubmit = () => {
    Alert.alert('Succès', 'Tâche mise à jour !', [
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
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Détail de la tâche</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Titre */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Titre *</Text>
          <Input
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Description</Text>
          <Input
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />
        </View>

        {/* Assigné à */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Assigné à</Text>
          <Input
            value={formData.assignedTo}
            onChangeText={(text) => setFormData({ ...formData, assignedTo: text })}
            placeholder="Sélectionner un participant"
          />
        </View>

        {/* Priorité */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Priorité</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['low', 'medium', 'high'].map(priority => (
              <TouchableOpacity
                key={priority}
                style={{ 
                  flex: 1, 
                  padding: 12, 
                  backgroundColor: formData.priority === priority ? '#007AFF' : '#F0F0F0',
                  borderRadius: 8
                }}
                onPress={() => setFormData({ ...formData, priority })}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: formData.priority === priority ? '#FFF' : '#000' 
                }}>
                  {priority === 'low' ? 'Faible' : priority === 'medium' ? 'Moyenne' : 'Élevée'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date d'échéance */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Date d'échéance</Text>
          <Input
            value={formData.dueDate}
            onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
            placeholder="JJ/MM/AAAA"
          />
        </View>

        {/* Statut */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 8 }}>Statut</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['pending', 'in_progress', 'completed'].map(status => (
              <TouchableOpacity
                key={status}
                style={{ 
                  flex: 1, 
                  padding: 12, 
                  backgroundColor: formData.status === status ? '#007AFF' : '#F0F0F0',
                  borderRadius: 8
                }}
                onPress={() => setFormData({ ...formData, status })}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: formData.status === status ? '#FFF' : '#000',
                  fontSize: 12
                }}>
                  {status === 'pending' ? 'À faire' : status === 'in_progress' ? 'En cours' : 'Terminé'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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