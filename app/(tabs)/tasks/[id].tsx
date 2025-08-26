import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTaskContext } from '../../../contexts/TaskContext';
import { createThemedStyles, spacing } from '../../../styles';
import { Task } from '../../../types/tasks';
import { taskService } from '../../../services/TaskService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/atoms/Badge';
import Header from '../../../components/ui/organisms/Header';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { updateTask, tasks } = useTaskContext(); // Utiliser le contexte pour synchroniser
  const router = useRouter();
  const themedStyles = createThemedStyles(theme);
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Récupérer les détails de la tâche depuis l'API
  const fetchTaskDetails = async () => {
    if (!id) {
      setError('ID de tâche manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Récupération des détails de la tâche:', id);
      
      // Appel à l'API pour récupérer les détails de la tâche
      const response = await taskService.getTaskById(Number(id));
      
      if (response.success && response.data) {
        console.log('✅ Détails de la tâche récupérés:', response.data);
        setTask(response.data);
      } else {
        console.error('❌ Erreur lors de la récupération des détails:', response.error);
        setError(response.error || 'Impossible de récupérer les détails de la tâche');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des détails:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  // Écouter les changements du contexte pour synchroniser l'état local
  useEffect(() => {
    if (task && tasks.length > 0) {
      const updatedTask = tasks.find(t => t.id === task.id);
      if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(task)) {
        console.log('🔄 Synchronisation avec le contexte - Mise à jour de la tâche locale');
        setTask(updatedTask);
      }
    }
  }, [tasks, task]);

  // Marquer la tâche comme validée
  const validateTask = async () => {
    if (!task || isUpdating) return;

    Alert.alert(
      'Valider la tâche',
      'Êtes-vous sûr de vouloir marquer cette tâche comme terminée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Valider',
          style: 'default',
          onPress: async () => {
            try {
              setIsUpdating(true);
              
              // Mise à jour optimiste immédiate
              const optimisticTask = { ...task, validated_by: task.owner_id || 1 };
              setTask(optimisticTask);
              console.log('🔄 Mise à jour optimiste - Tâche validée localement');
              
              const response = await taskService.validateTask(task.id);
              
              if (response.success && response.data) {
                // Mise à jour avec les vraies données de l'API
                setTask(response.data);
                console.log('✅ Validation réussie, mise à jour avec données API:', response.data);
                
                // Synchroniser avec le contexte pour la liste
                updateTask(response.data);
                
                Alert.alert('Succès', 'Tâche marquée comme terminée !');
              } else {
                // En cas d'erreur, revenir à l'état précédent
                setTask(task);
                console.log('❌ Erreur validation, retour à l\'état précédent');
                
                Alert.alert('Erreur', response.error || 'Impossible de valider la tâche');
              }
            } catch (error: any) {
              // En cas d'erreur réseau, revenir à l'état précédent
              setTask(task);
              console.log('❌ Erreur réseau validation, retour à l\'état précédent:', error.message);
              
              if (error.response?.status === 403) {
                Alert.alert('Erreur', 'Vous n\'avez pas les permissions pour valider cette tâche');
              } else if (error.response?.status === 400) {
                Alert.alert('Erreur', 'Cette tâche ne peut pas être validée dans son état actuel');
              } else {
                Alert.alert('Erreur', 'Erreur lors de la validation');
              }
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  // Annuler la validation de la tâche
  const unvalidateTask = async () => {
    if (!task || isUpdating) return;

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
              setIsUpdating(true);
              
              // Mise à jour optimiste immédiate
              const optimisticTask = { ...task, validated_by: null };
              setTask(optimisticTask);
              console.log('🔄 Mise à jour optimiste - Validation annulée localement');
              
              const response = await taskService.unvalidateTask(task.id);
              
              if (response.success && response.data) {
                // Mise à jour avec les vraies données de l'API
                setTask(response.data);
                console.log('✅ Annulation validation réussie, mise à jour avec données API:', response.data);
                
                // Synchroniser avec le contexte pour la liste
                updateTask(response.data);
                
                Alert.alert('Succès', 'Validation de la tâche annulée !');
              } else {
                // En cas d'erreur, revenir à l'état précédent
                setTask(task);
                console.log('❌ Erreur annulation validation, retour à l\'état précédent');
                
                Alert.alert('Erreur', response.error || 'Impossible d\'annuler la validation');
              }
            } catch (error: any) {
              // En cas d'erreur réseau, revenir à l'état précédent
              setTask(task);
              console.log('❌ Erreur réseau annulation validation, retour à l\'état précédent:', error.message);
              
              if (error.response?.status === 403) {
                Alert.alert('Erreur', 'Vous n\'avez pas les permissions pour annuler la validation de cette tâche');
              } else if (error.response?.status === 400) {
                Alert.alert('Erreur', 'Cette tâche ne peut pas être dévalidée dans son état actuel');
              } else {
                Alert.alert('Erreur', 'Erreur lors de l\'annulation de la validation');
              }
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  // Supprimer la tâche
  const deleteTask = async () => {
    if (!task) return;

    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskService.deleteTask(task.id);
              
              if (response.success) {
                Alert.alert('Succès', 'Tâche supprimée avec succès !');
                router.back();
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

  // Vérifier si l'utilisateur est le propriétaire de la tâche
  const isOwner = user?.id === task?.owner_id;

  // Affichage du chargement
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ marginTop: spacing[4], color: theme.textSecondary, fontSize: 16 }}>
              Chargement des détails...
            </Text>
            <Text style={{ marginTop: spacing[2], color: theme.textTertiary, fontSize: 14 }}>
              Récupération des informations de la tâche
            </Text>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  // Affichage de l'erreur
  if (error || !task) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[3],
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={fetchTaskDetails}
            >
              <Ionicons name="refresh" size={20} color="white" style={{ marginRight: spacing[2] }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <Header
          title="Détail de la tâche"
          showBack={true}
          onBack={() => router.back()}
          rightAction={isOwner ? {
            icon: "trash",
            onPress: deleteTask
          } : {
            icon: "create",
            onPress: () => router.push(`/modals/update-task?id=${task.id}`)
          }}
        />

        <ScrollView 
          style={{ flex: 1, paddingHorizontal: spacing[5], paddingTop: spacing[8] }}
          showsVerticalScrollIndicator={false}
        >
          {/* Titre et statut principal */}
          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: spacing[4]
            }}>
              <View style={{ flex: 1, marginRight: spacing[3] }}>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: theme.text,
                  marginBottom: spacing[2],
                  lineHeight: 30
                }}>
                  {task.title}
                </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <Badge 
                    text={task.validated_by ? 'Validé' : 'En attente'} 
                    color={getValidationColor(task.validated_by)}
                  />
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name={getValidationIcon(task.validated_by) as any} 
                      size={16} 
                      color={getValidationColor(task.validated_by)} 
                    />
                    <Text style={{ 
                      color: getValidationColor(task.validated_by), 
                      marginLeft: spacing[1],
                      fontSize: 14,
                      fontWeight: '500'
                    }}>
                      {task.validated_by ? 'Tâche terminée' : 'Tâche en cours'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            {task.description && (
              <View style={{ marginBottom: spacing[4] }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: theme.text,
                  marginBottom: spacing[2]
                }}>
                  Description
                </Text>
                <Text style={{ 
                  color: theme.textSecondary, 
                  lineHeight: 24,
                  fontSize: 15
                }}>
                  {task.description}
                </Text>
              </View>
            )}

            {/* Informations de base */}
            <View style={{ 
              paddingTop: spacing[4],
              borderTopWidth: 1,
              borderTopColor: theme.border
            }}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={theme.primary} />
                <Text style={styles.infoLabel}>Événement :</Text>
                <Text style={styles.infoValue}>#{typeof task.event_id === 'number' ? task.event_id : 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color={theme.primary} />
                <Text style={styles.infoLabel}>Propriétaire :</Text>
                <Text style={styles.infoValue}>#{typeof task.owner_id === 'number' ? task.owner_id : 'N/A'}</Text>
              </View>
              
              {task.validated_by && (
                <View style={styles.infoRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text style={styles.infoLabel}>Validée par :</Text>
                  <Text style={styles.infoValue}>#{typeof task.validated_by === 'number' ? task.validated_by : 'N/A'}</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Dates */}
          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: theme.text,
              marginBottom: spacing[3]
            }}>
              Informations temporelles
            </Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={theme.primary} />
              <Text style={styles.infoLabel}>Créée le :</Text>
              <Text style={styles.infoValue}>{formatDate(task.created_at)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="refresh" size={20} color={theme.primary} />
              <Text style={styles.infoLabel}>Modifiée le :</Text>
              <Text style={styles.infoValue}>{formatDate(task.updated_at)}</Text>
            </View>
          </Card>

          {/* Actions */}
          <Card variant="elevated" padding="large" style={{ marginBottom: spacing[6] }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: theme.text,
              marginBottom: spacing[3]
            }}>
              Actions
            </Text>
            
            <View style={{ gap: spacing[3] }}>
              {!task.validated_by ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#10b981',
                    paddingVertical: spacing[3],
                    paddingHorizontal: spacing[4],
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={validateTask}
                  disabled={isUpdating}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: spacing[2] }} />
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    {isUpdating ? 'Validation...' : 'Marquer comme terminée'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f59e0b',
                    paddingVertical: spacing[3],
                    paddingHorizontal: spacing[4],
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={unvalidateTask}
                  disabled={isUpdating}
                >
                  <Ionicons name="time" size={20} color="white" style={{ marginRight: spacing[2] }} />
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    {isUpdating ? 'Annulation...' : 'Marquer comme en cours'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={{
                  backgroundColor: theme.backgroundSecondary,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[4],
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: theme.border
                }}
                onPress={() => router.push(`/modals/update-task?id=${task.id}`)}
              >
                <Ionicons name="create" size={20} color={theme.text} style={{ marginRight: spacing[2] }} />
                <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16 }}>
                  Modifier la tâche
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2]
  },
  infoLabel: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    minWidth: 100
  },
  infoValue: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    flex: 1
  }
}); 