import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { taskService, TaskService } from '../../../services/TaskService';
import { Task } from '../../../types/tasks';
import { 
  Header, 
  LoadingOverlay, 
  EmptyState,
  SearchBar,
  Text,
} from '../../../components/ui';
import { TaskCard, TaskList, TaskFilters, TaskStats } from '../../../components/features/tasks';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';

export default function TasksScreen() {
  // 1. Hooks de contexte et de navigation (toujours en premier)
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  // 2. Hooks d'état (toujours dans le même ordre)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fadeAnim] = useState(new Animated.Value(0));

  // 3. Fonction de récupération des tâches - optimisée avec useCallback
  const fetchUserTasks = useCallback(async () => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Récupération des tâches pour l\'utilisateur:', user.id);
      
      // Appel à l'API pour récupérer les tâches du participant
      const response = await taskService.getTasksByParticipantId(Number(user.id));
      
      if (response.success && response.data) {
        console.log('✅ Tâches récupérées:', response.data);
        setTasks(response.data);
        
        // Animation d'apparition
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        console.error('❌ Erreur lors de la récupération des tâches:', response.error);
        setError(response.error || 'Impossible de récupérer les tâches');
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      setError('Erreur de connexion au serveur');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fadeAnim]);

  // 4. Fonction de rafraîchissement (pull-to-refresh) optimisée
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserTasks();
    setRefreshing(false);
  }, [fetchUserTasks]);

  // 5. Fonction de gestion des changements de filtre optimisée
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // 6. Fonction de gestion des mises à jour de tâches optimisée
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [tasks]);

  // 7. Filtrer les tâches selon le filtre actif et la recherche - optimisé avec useMemo
  const filteredTasks = useMemo(() => {
    let filteredTasks = tasks;
    
    // Filtre par statut
    switch (activeFilter) {
      case 'À faire':
        filteredTasks = tasks.filter(task => !task.validated_by);
        break;
      case 'En cours':
        filteredTasks = tasks.filter(task => !task.validated_by);
        break;
      case 'Terminées':
        filteredTasks = tasks.filter(task => task.validated_by);
        break;
      default:
        filteredTasks = tasks;
    }
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    return filteredTasks;
  }, [tasks, activeFilter, searchQuery]);

  // 8. Charger les tâches au montage du composant
  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks]);

  // 9. Filtres disponibles avec compteurs - optimisé avec useMemo
  const filters = useMemo(() => [
    { key: 'Toutes', label: 'Toutes', icon: 'list', count: tasks.length },
    { key: 'À faire', label: 'À faire', icon: 'time', count: tasks.filter(t => !t.validated_by).length },
    { key: 'Terminées', label: 'Terminées', icon: 'checkmark-circle', count: tasks.filter(t => t.validated_by).length }
  ], [tasks]);



  // Affichage du chargement
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <LoadingOverlay 
            visible={true} 
            message="Chargement des tâches..." 
          />
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
            title="Mes Tâches"
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
              onPress={fetchUserTasks}
            >
              <Ionicons name="refresh" size={20} color="white" style={{ marginRight: spacing[2] }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header simple */}
        <Header
          title="Mes Tâches"
        />
        




        {/* Barre de recherche et filtres */}
        <View style={{ marginBottom: spacing[4] }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher une tâche..."
            onSearch={() => {}}
            compact={true}
            containerStyle={{ 
              marginBottom: spacing[3],
              paddingHorizontal: spacing[5]
            }}
          />
          
          {/* Filtres optimisés */}
          <TaskFilters
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            compact={true}
          />
        </View>

        {/* Liste des tâches optimisée avec TaskList */}
        <TaskList
          tasks={filteredTasks}
          onTaskPress={(task) => router.push(`/tasks/${task.id}`)}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          loading={false}
          activeFilter={activeFilter}
          style={{ paddingHorizontal: spacing[5] }}
        />
      </View>
    </ProtectedRoute>
  );
} 