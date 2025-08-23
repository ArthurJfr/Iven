import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import { CreateTaskRequest } from '../../types/tasks';
import { taskService } from '../../services/TaskService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/organisms/Header';

export default function CreateTaskModal() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    event_id: eventId ? Number(eventId) : 0,
    owner_id: 1 // TODO: Récupérer l'ID de l'utilisateur connecté
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre de la tâche est requis';
    }

    if (!formData.event_id) {
      newErrors.event_id = 'ID de l\'événement manquant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Créer la tâche
  const handleCreateTask = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      console.log('📋 Création de la tâche:', formData);
      
      const response = await taskService.createTask(formData);
      
      if (response.success && response.data) {
        console.log('✅ Tâche créée avec succès:', response.data);
        Alert.alert(
          'Succès', 
          'Tâche créée avec succès !',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Retourner à l'écran précédent avec un refresh
                router.back();
              }
            }
          ]
        );
      } else {
        console.error('❌ Erreur lors de la création:', response.error);
        Alert.alert('Erreur', response.error || 'Impossible de créer la tâche');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un champ du formulaire
  const updateField = (field: keyof CreateTaskRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
  <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <Header
        title="Nouvelle tâche"
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: spacing[4] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing[6] }}
      >
        {/* Informations de l'événement */}
        <Card variant="elevated" padding="medium" style={{ marginTop: spacing[4], marginBottom: spacing[4] }}>
          <View style={styles.eventInfo}>
            <Ionicons name="calendar-outline" size={24} color={theme.primary} />
            <View style={styles.eventDetails}>
              <Text style={[styles.eventLabel, { color: theme.textSecondary }]}>
                Événement
              </Text>
              <Text style={[styles.eventId, { color: theme.text }]}>
                #{eventId}
              </Text>
            </View>
          </View>
        </Card>

        {/* Formulaire de création */}
        <Card variant="elevated" padding="large">
          <Text style={[styles.formTitle, { color: theme.text }]}>
            Détails de la tâche
          </Text>

          {/* Titre */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Titre de la tâche *
            </Text>
            <Input
              placeholder="Ex: Acheter le gâteau d'anniversaire"
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              error={!!errors.title}
              errorText={errors.title}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Description (optionnel)
            </Text>
            <Input
              placeholder="Détails supplémentaires sur la tâche..."
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Informations système */}
          <View style={styles.systemInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color={theme.textTertiary} />
              <Text style={[styles.infoText, { color: theme.textTertiary }]}>
                Créée par vous
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={theme.textTertiary} />
              <Text style={[styles.infoText, { color: theme.textTertiary }]}>
                Créée maintenant
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Annuler"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={loading ? "Création..." : "Créer la tâche"}
            onPress={handleCreateTask}
            disabled={loading}
            style={styles.createButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  eventDetails: {
    flex: 1,
  },
  eventLabel: {
    fontSize: 14,
    marginBottom: spacing[1],
  },
  eventId: {
    fontSize: 18,
    fontWeight: '600',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[4],
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  systemInfo: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: spacing[2],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  infoText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
});
