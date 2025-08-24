import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Animated } from 'react-native';
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
  const [fadeAnim] = useState(new Animated.Value(0));

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
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ marginTop: spacing[4], color: theme.textSecondary, fontSize: 16 }}>
              Chargement des tâches...
            </Text>
            <Text style={{ marginTop: spacing[2], color: theme.textTertiary, fontSize: 14 }}>
              Récupération de vos tâches en cours
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
        {/* Header */}
        <Header
          title="Mes Tâches"
        />

        {/* Filtres */}
        <View style={{ paddingHorizontal: spacing[5], marginBottom: spacing[3] }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingRight: spacing[5] }}
            style={{ height: 32 }}
          >
          {[
            { key: 'Toutes', icon: 'list', count: tasks.length },
            { key: 'À faire', icon: 'time', count: tasks.filter(t => !t.validated_by).length },
            { key: 'En cours', icon: 'play', count: tasks.filter(t => !t.validated_by).length },
            { key: 'Terminées', icon: 'checkmark-circle', count: tasks.filter(t => t.validated_by).length }
          ].map((filter, index) => (
            <TouchableOpacity
              key={filter.key}
              style={{
                paddingHorizontal: spacing[3],
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: activeFilter === filter.key ? theme.primary : theme.backgroundSecondary,
                marginRight: spacing[3],
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: 70,
                justifyContent: 'center',
                height: 32
              }}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={14} 
                color={activeFilter === filter.key ? 'white' : theme.textSecondary}
                style={{ marginRight: spacing[1] }}
              />
              <Text style={{ 
                color: activeFilter === filter.key ? 'white' : theme.text,
                fontWeight: activeFilter === filter.key ? '600' : '500',
                fontSize: 13
              }}>
                {filter.key}
              </Text>
              <View style={{
                backgroundColor: activeFilter === filter.key ? 'rgba(255,255,255,0.2)' : theme.border,
                paddingHorizontal: spacing[1],
                paddingVertical: 1,
                borderRadius: 8,
                marginLeft: spacing[1]
              }}>
                <Text style={{
                  color: activeFilter === filter.key ? 'white' : theme.textSecondary,
                  fontSize: 11,
                  fontWeight: '600'
                }}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>

        {/* Liste des tâches */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: spacing[5] }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TouchableOpacity
                key={`task-${task.id}-${index}`}
                style={{
                  marginBottom: spacing[3],
                }}
                onPress={() => router.push(`/tasks/${task.id}`)}
                activeOpacity={0.7}
              >
                <Card variant="elevated" padding="medium">
                  <View style={{
                    borderLeftWidth: 4,
                    borderLeftColor: getValidationColor(task.validated_by || null),
                    borderRadius: 2
                  }}>
                    <View style={{ paddingLeft: spacing[4] }}>
                      {/* Header de la tâche */}
                      <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        marginBottom: spacing[2] 
                      }}>
                        <View style={{ flex: 1, marginRight: spacing[3] }}>
                          <Text style={{ 
                            fontSize: 16, 
                            fontWeight: '600', 
                            color: theme.text,
                            marginBottom: spacing[1],
                            lineHeight: 22
                          }}>
                            {task.title}
                          </Text>
                          
                                                     {/* Métadonnées de la tâche */}
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                               <View style={{
                                 width: 8,
                                 height: 8,
                                 borderRadius: 4,
                                 backgroundColor: getValidationColor(task.validated_by || null),
                                 marginRight: spacing[1]
                               }} />
                               <Text style={{ 
                                 color: theme.textSecondary, 
                                 fontSize: 12
                               }}>
                                 {task.validated_by ? 'Validé' : 'En attente'}
                               </Text>
                             </View>
                           </View>
                        </View>
                        
                        <Badge 
                          text={task.validated_by ? 'Validé' : 'Non validé'} 
                          color={getValidationColor(task.validated_by || null)}
                        />
                      </View>
                      
                      {/* Description */}
                      {task.description && (
                        <Text style={{ 
                          color: theme.textSecondary, 
                          marginBottom: spacing[3],
                          lineHeight: 20,
                          fontSize: 14
                        }}>
                          {task.description}
                        </Text>
                      )}
                      
                      {/* Footer de la tâche */}
                      <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: spacing[2],
                        borderTopWidth: 1,
                        borderTopColor: theme.border
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons 
                            name={getValidationIcon(task.validated_by || null) as any} 
                            size={16} 
                            color={theme.textSecondary} 
                          />
                          <Text style={{ 
                            color: theme.textSecondary, 
                            marginLeft: spacing[1],
                            fontSize: 13
                          }}>
                            {task.validated_by ? 'Validé' : 'Non validé'}
                          </Text>
                        </View>
                        
                                                 {/* Date de création si disponible */}
                         {task.created_at && (
                           <Text style={{ 
                             color: theme.textTertiary, 
                             fontSize: 12 
                           }}>
                             Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}
                           </Text>
                         )}
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
              paddingVertical: spacing[8],
              paddingHorizontal: spacing[4]
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.backgroundSecondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing[4]
              }}>
                <Ionicons name="checkbox-outline" size={40} color={theme.textSecondary} />
              </View>
              
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: theme.text, 
                marginBottom: spacing[2], 
                textAlign: 'center' 
              }}>
                {activeFilter === 'Toutes' ? 'Aucune tâche' : `Aucune tâche ${activeFilter.toLowerCase()}`}
              </Text>
              
              <Text style={{ 
                color: theme.textSecondary, 
                marginBottom: spacing[6], 
                textAlign: 'center',
                lineHeight: 22
              }}>
                {activeFilter === 'Toutes' 
                  ? 'Créez votre première tâche pour commencer à organiser votre travail' 
                  : `Toutes les tâches sont dans d'autres catégories`
                }
              </Text>
              
              {activeFilter === 'Toutes' && (
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.primary,
                    paddingHorizontal: spacing[5],
                    paddingVertical: spacing[3],
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                //  onPress={() => router.push('/modals/create-task')}
                >
                  <Ionicons name="add" size={20} color="white" style={{ marginRight: spacing[2] }} />
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    Créer une tâche
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
} 