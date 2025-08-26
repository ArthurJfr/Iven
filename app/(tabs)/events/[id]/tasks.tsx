import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../../styles';
import { Task } from '../../../../types/tasks';
import { taskService } from '../../../../services/TaskService';
import Header from '../../../../components/ui/organisms/Header';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { TaskList, TaskFilters } from '../../../../components/features/tasks';



export default function EventTasksScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Toutes');


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



  // Supprimer une tâche - optimisé avec useCallback
  const deleteTask = useCallback(async (taskId: number) => {
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
  }, [tasks]);

  



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

  // Fonction de gestion des changements de filtre optimisée
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // Fonction de gestion des mises à jour de tâches optimisée
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [tasks]);

  // Fonction de rafraîchissement optimisée
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEventTasks();
    setRefreshing(false);
  }, []);

  // Tâches filtrées selon le filtre actif
  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case 'À faire':
        return tasks.filter(task => !task.validated_by);
      case 'Terminées':
        return tasks.filter(task => task.validated_by);
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);

  // Filtres disponibles avec compteurs
  const filters = useMemo(() => [
    { key: 'Toutes', label: 'Toutes', icon: 'apps-outline', count: tasks.length },
    { key: 'À faire', label: 'À faire', icon: 'time-outline', count: tasks.filter(t => !t.validated_by).length },
    { key: 'Terminées', label: 'Terminées', icon: 'checkmark-circle-outline', count: tasks.filter(t => t.validated_by).length }
  ], [tasks]);



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



        {/* Contenu principal avec composants optimisés */}
        <View style={{ flex: 1, paddingTop: spacing[8] }}>
          {/* Filtres des tâches */}
          <TaskFilters
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            compact={false}
          />
          
                    {/* Liste des tâches optimisée */}
          <TaskList
            tasks={filteredTasks}
            onTaskPress={(task) => router.push(`/tasks/${task.id}`)}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            loading={loading}
            activeFilter={activeFilter}
            style={{ paddingHorizontal: spacing[4] }}
          />
        </View>
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