import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { taskService, TaskService } from '../../../services/TaskService';
import { Task } from '../../../types/tasks';
import Header from '../../../components/ui/organisms/Header';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/atoms/Badge';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';

export default function TasksScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Toutes');

  // Récupérer les tâches de l'utilisateur connecté
  const fetchUserTasks = async () => {
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
  };

  // Fonction de rafraîchissement (pull-to-refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserTasks();
    setRefreshing(false);
  };

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchUserTasks();
  }, [user?.id]);

  // Filtrer les tâches selon le filtre actif
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'À faire':
        return tasks.filter(task => !task.validated_by);
      case 'En cours':
        return tasks.filter(task => !task.validated_by);
      case 'Terminées':
        return tasks.filter(task => task.validated_by);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getValidationColor = (validatedBy: number | null) => {
    return TaskService.getValidationColor(validatedBy);
  };

  const getValidationIcon = (validatedBy: number | null) => {
    return TaskService.getValidationIcon(validatedBy);
  };

  // Affichage du chargement
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, color: theme.textSecondary }}>Chargement des tâches...</Text>
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
            rightAction={{
              icon: "add-circle",
              onPress: () => router.push('/modals/task-detail')
            }}
          />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginTop: 16, textAlign: 'center' }}>
              Erreur de chargement
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 8, textAlign: 'center', marginBottom: 24 }}>
              {error}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8
              }}
              onPress={fetchUserTasks}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <Header
          title="Mes Tâches"
          rightAction={{
            icon: "add-circle",
            onPress: () => router.push('/modals/task-detail')
          }}
        />

        {/* Filtres */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['Toutes', 'À faire', 'En cours', 'Terminées'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: activeFilter === filter ? theme.primary : theme.border,
                }}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={{ 
                  color: activeFilter === filter ? 'white' : theme.text,
                  fontWeight: activeFilter === filter ? '600' : '400'
                }}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Liste des tâches */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={{
                  marginBottom: 12,
                }}
                onPress={() => router.push(`/tasks/${task.id}`)}
              >
                <Card variant="elevated" padding="medium">
                                          <View style={{
                          borderLeftWidth: 4,
                          borderLeftColor: getValidationColor(task.validated_by || null),
                        }}>
                    <View style={{ paddingLeft: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: '600', 
                          color: theme.text,
                          flex: 1,
                          marginRight: 12
                        }}>
                          {task.title}
                        </Text>
                                                  <Badge 
                            text={task.validated_by ? 'Validé' : 'Non validé'} 
                            color={getValidationColor(task.validated_by || null)}
                          />
                      </View>
                      
                      {task.description && (
                        <Text style={{ 
                          color: theme.textSecondary, 
                          marginBottom: 8,
                          lineHeight: 20
                        }}>
                          {task.description}
                        </Text>
                      )}
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons 
                            name={getValidationIcon(task.validated_by || null) as any} 
                            size={16} 
                            color={theme.textSecondary} 
                          />
                          <Text style={{ 
                            color: theme.textSecondary, 
                            marginLeft: 6,
                            fontSize: 14
                          }}>
                            {task.validated_by ? 'Validé' : 'Non validé'}
                          </Text>
                        </View>
                        

                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 60 
            }}>
              <Ionicons name="checkbox-outline" size={64} color={theme.textSecondary} />
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: theme.text, 
                marginTop: 16, 
                textAlign: 'center' 
              }}>
                {activeFilter === 'Toutes' ? 'Aucune tâche' : `Aucune tâche ${activeFilter.toLowerCase()}`}
              </Text>
              <Text style={{ 
                color: theme.textSecondary, 
                marginTop: 8, 
                textAlign: 'center' 
              }}>
                {activeFilter === 'Toutes' 
                  ? 'Créez votre première tâche pour commencer' 
                  : `Toutes les tâches sont dans d'autres catégories`
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
} 