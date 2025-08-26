import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import { Task, UpdateTaskRequest } from '../../types/tasks';
import { taskService } from '../../services/TaskService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/organisms/Header';

export default function UpdateTaskModal() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UpdateTaskRequest>({
    title: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Récupérer les détails de la tâche
  const fetchTaskDetails = async () => {
    if (!taskId) {
      setError('ID de tâche manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Récupération des détails de la tâche:', taskId);
      
      const response = await taskService.getTaskById(Number(taskId));
      
      if (response.success && response.data) {
        console.log('✅ Détails de la tâche récupérés:', response.data);
        setTask(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description || ''
        });
      } else {
        console.error('❌ Erreur lors de la récupération:', response.error);
        setError(response.error || 'Impossible de récupérer les détails de la tâche');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails au montage
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Le titre de la tâche est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mettre à jour la tâche
  const handleUpdateTask = async () => {
    if (!validateForm() || !task) return;

    try {
      setSaving(true);
      
      console.log('📝 Mise à jour de la tâche:', taskId, formData);
      
      const response = await taskService.updateTask(task.id, formData);
      
      if (response.success && response.data) {
        console.log('✅ Tâche mise à jour avec succès:', response.data);
        Alert.alert(
          'Succès', 
          'Tâche mise à jour avec succès !',
          [
            { 
              text: 'OK', 
              onPress: () => {
                router.back();
              }
            }
          ]
        );
      } else {
        console.error('❌ Erreur lors de la mise à jour:', response.error);
        Alert.alert('Erreur', response.error || 'Impossible de mettre à jour la tâche');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', 'Erreur lors de la mise à jour de la tâche');
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour un champ du formulaire
  const updateField = (field: keyof UpdateTaskRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="hourglass-outline" size={48} color={theme.primary} />
            <Text style={{ marginTop: spacing[4], color: theme.textSecondary, fontSize: 16 }}>
              Chargement des détails...
            </Text>
            <Text style={{ marginTop: spacing[2], color: theme.textTertiary, fontSize: 14 }}>
              Récupération des informations de la tâche
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Affichage de l'erreur
  if (error || !task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Header
          title="Modifier la tâche"
          showBack={true}
          onBack={() => router.back()}
        />
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[5] }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.error + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing[4]
          }}>
            <Ionicons name="alert-circle-outline" size={40} color={theme.error} />
          </View>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: theme.text, 
            marginBottom: spacing[2], 
            textAlign: 'center' 
          }}>
            Erreur de chargement
          </Text>
          
          <Text style={{ 
            color: theme.textSecondary, 
            marginBottom: spacing[6], 
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: spacing[4]
          }}>
            {error || 'Tâche introuvable'}
          </Text>
          
          <Button
            title="Réessayer"
            onPress={fetchTaskDetails}
            style={{ paddingHorizontal: spacing[5] }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Header
          title="Modifier la tâche"
          showBack={true}
          onBack={() => router.back()}
        />

        <ScrollView 
          style={{ flex: 1, paddingHorizontal: spacing[4] }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing[6] }}
        >
          {/* Informations de la tâche */}
          <Card variant="elevated" padding="medium" style={{ marginTop: spacing[4], marginBottom: spacing[4] }}>
            <View style={styles.taskInfo}>
              <Ionicons name="checkmark-circle-outline" size={24} color={theme.primary} />
              <View style={styles.taskDetails}>
                <Text style={[styles.taskLabel, { color: theme.textSecondary }]}>
                  Tâche #{task.id}
                </Text>
                <Text style={[styles.taskStatus, { color: task.validated_by ? '#10b981' : '#f59e0b' }]}>
                  {task.validated_by ? 'Validée' : 'En attente'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Formulaire de modification */}
          <Card variant="elevated" padding="large">
            <Text style={[styles.formTitle, { color: theme.text }]}>
              Modifier les détails
            </Text>

            {/* Titre */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                Titre de la tâche *
              </Text>
              <Input
                placeholder="Titre de la tâche"
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
                placeholder="Description de la tâche..."
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Informations système */}
            <View style={styles.systemInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color={theme.textTertiary} />
                <Text style={[styles.infoText, { color: theme.textTertiary }]}>
                  Événement: #{task.event_id}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color={theme.textTertiary} />
                <Text style={[styles.infoText, { color: theme.textTertiary }]}>
                  Propriétaire: #{task.owner_id}
                </Text>
              </View>
              {task.validated_by && (
                <View style={styles.infoRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={[styles.infoText, { color: '#10b981' }]}>
                    Validée par: #{task.validated_by}
                  </Text>
                </View>
              )}
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
              title={saving ? "Sauvegarde..." : "Sauvegarder"}
              onPress={handleUpdateTask}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  taskDetails: {
    flex: 1,
  },
  taskLabel: {
    fontSize: 14,
    marginBottom: spacing[1],
  },
  taskStatus: {
    fontSize: 16,
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
  saveButton: {
    flex: 2,
  },
});
