import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../../styles';
import { Task } from '../../../../types/tasks';
import { taskService } from '../../../../services/TaskService';
import Badge from '../../../../components/ui/atoms/Badge';
import Header from '../../../../components/ui/organisms/Header';
import ProtectedRoute from '../../../../components/ProtectedRoute';



export default function EventTasksScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Récupérer les tâches de l'événement
  const fetchEventTasks = async () => {
    if (!id) {
      setError('ID de l\'événement manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Récupération des tâches pour l\'événement:', id);
      
      // Appel à l'API pour récupérer les tâches de l'événement
      const response = await taskService.getTasksByEventId(Number(id));
      
      if (response.success && response.data) {
        console.log('✅ Tâches récupérées:', response.data);
        setTasks(response.data);
      } else {
        console.error('❌ Erreur lors de la récupération des tâches:', response.error);
        setError(response.error || 'Impossible de récupérer les tâches');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchEventTasks();
  }, [id]);

  // Rafraîchir les tâches quand on revient sur l'écran (après création)
  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        fetchEventTasks();
      }
    }, [id])
  );



  // Supprimer une tâche
  const deleteTask = async (taskId: number) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskService.deleteTask(taskId);
              
              if (response.success) {
                setTasks(tasks.filter(task => task.id !== taskId));
                Alert.alert('Succès', 'Tâche supprimée avec succès !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible de supprimer la tâche');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la suppression');
            }
          }
        }
      ]
    );
  };

  // Marquer une tâche comme validée
  const validateTask = async (taskId: number) => {
    Alert.alert(
      'Valider la tâche',
      'Êtes-vous sûr de vouloir valider cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Valider', 
          style: 'default',
          onPress: async () => {
            try {
              const response = await taskService.validateTask(taskId);
              
              if (response.success && response.data) {
                // Mettre à jour la tâche dans la liste
                setTasks(tasks.map(task => 
                  task.id === taskId ? response.data! : task
                ));
                Alert.alert('Succès', 'Tâche validée avec succès !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible de valider la tâche');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la validation');
            }
          }
        }
      ]
    );
  };

  // Annuler la validation d'une tâche
  const unvalidateTask = async (taskId: number) => {
    Alert.alert(
      'Annuler la validation',
      'Êtes-vous sûr de vouloir annuler la validation de cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Annuler la validation', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskService.unvalidateTask(taskId);
              
              if (response.success && response.data) {
                // Mettre à jour la tâche dans la liste
                setTasks(tasks.map(task => 
                  task.id === taskId ? response.data! : task
                ));
                Alert.alert('Succès', 'Validation de la tâche annulée !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible d\'annuler la validation');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de l\'annulation de la validation');
            }
          }
        }
      ]
    );
  };

  const getValidationColor = (validatedBy: number | null | undefined) => {
    return validatedBy ? '#10b981' : '#f59e0b';
  };

  const getValidationIcon = (validatedBy: number | null | undefined) => {
    return validatedBy ? 'checkmark-circle' : 'time';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ marginTop: spacing[4], color: theme.textSecondary, fontSize: 16 }}>
              Chargement des tâches...
            </Text>
            <Text style={{ marginTop: spacing[2], color: theme.textTertiary, fontSize: 14 }}>
              Récupération des tâches de l'événement
            </Text>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <Header
            title="Tâches de l'événement"
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
              {error}
            </Text>
            
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[3],
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={fetchEventTasks}
            >
              <Ionicons name="refresh" size={20} color="white" style={{ marginRight: spacing[2] }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  const pendingTasks = tasks.filter(task => !task.validated_by);
  const completedTasks = tasks.filter(task => task.validated_by);

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <Header
          title="Tâches de l'événement"
          showBack={true}
          onBack={() => router.back()}
          rightAction={{
            icon: "add",
            onPress: () => router.push(`/modals/create-task?eventId=${id}`)
          }}
        />



        <ScrollView 
          style={{ flex: 1, paddingHorizontal: spacing[4] }}
          showsVerticalScrollIndicator={false}
        >
          {pendingTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Tâches en cours ({pendingTasks.length})
              </Text>
              {pendingTasks.map((task) => (
                <Card key={task.id} variant="elevated" padding="medium" style={{ marginBottom: spacing[3] }}>
                  <View style={styles.taskHeader}>
                    <TouchableOpacity 
                      style={styles.checkbox}
                      onPress={() => validateTask(task.id)}
                    >
                      <View style={styles.checkboxInner} />
                    </TouchableOpacity>
                    <View style={styles.taskInfo}>
                      <Text style={[styles.taskTitle, { color: theme.text }]}>{task.title}</Text>
                      {task.description && (
                        <Text style={[styles.taskDescription, { color: theme.textSecondary }]}>
                          {task.description}
                        </Text>
                      )}
                                             <View style={styles.taskMeta}>
                         <Text style={{ color: theme.textTertiary, fontSize: 12 }}>
                           Créée le: {formatDate(task.created_at)}
                         </Text>
                       </View>
                    </View>
                    <View style={styles.taskActions}>
                      <Badge 
                        text="En attente" 
                        color={getValidationColor(task.validated_by)}
                      />
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                          onPress={() => validateTask(task.id)}
                        >
                          <Ionicons name="checkmark-circle-outline" size={16} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.backgroundSecondary }]}
                          onPress={() => router.push(`/modals/update-task?taskId=${task.id}`)}
                        >
                          <Ionicons name="create-outline" size={16} color={theme.text} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                          onPress={() => deleteTask(task.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color={theme.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Tâches terminées ({completedTasks.length})
              </Text>
              {completedTasks.map((task) => (
                <Card key={task.id} variant="elevated" padding="medium" style={{ marginBottom: spacing[3] }}>
                  <View style={styles.taskHeader}>
                    <View style={[styles.checkbox, styles.checkboxChecked]}>
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                    <View style={styles.taskInfo}>
                      <Text style={[styles.taskTitle, styles.completedText, { color: theme.textSecondary }]}>
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text style={[styles.taskDescription, styles.completedText, { color: theme.textTertiary }]}>
                          {task.description}
                        </Text>
                      )}
                                             <View style={styles.taskMeta}>
                         <Text style={{ color: theme.textTertiary, fontSize: 12 }}>
                           Terminée le: {formatDate(task.updated_at)}
                         </Text>
                       </View>
                    </View>
                    <View style={styles.taskActions}>
                      <Badge 
                        text="Validé" 
                        color={getValidationColor(task.validated_by)}
                      />
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.warning + '20' }]}
                          onPress={() => unvalidateTask(task.id)}
                        >
                          <Ionicons name="close-circle-outline" size={16} color={theme.warning} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.backgroundSecondary }]}
                          onPress={() => router.push(`/modals/update-task?taskId=${task.id}`)}
                        >
                          <Ionicons name="create-outline" size={16} color={theme.text} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                          onPress={() => deleteTask(task.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color={theme.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {tasks.length === 0 && (
            <Card variant="elevated" padding="large" style={{ marginTop: spacing[6], alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={64} color={theme.textTertiary} style={{ marginBottom: spacing[4] }} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Aucune tâche pour cet événement
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.textTertiary }]}>
                Ajoutez votre première tâche pour commencer
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskMeta: {
    marginTop: 4,
  },
  taskActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 