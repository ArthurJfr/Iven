import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function TasksScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const mockTasks = [
    {
      id: '1',
      title: 'Réserver le restaurant',
      event: 'Anniversaire Marie',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-10',
    },
    {
      id: '2',
      title: 'Acheter les décorations',
      event: 'Anniversaire Marie',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-01-12',
    },
    {
      id: '3',
      title: 'Préparer la présentation',
      event: 'Réunion équipe',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-15',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'time';
      case 'pending': return 'ellipse-outline';
      default: return 'ellipse-outline';
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mes Tâches</Text>
        <TouchableOpacity onPress={() => router.push('/modals/task-detail')}>
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {['Toutes', 'À faire', 'En cours', 'Terminées'].map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: index === 0 ? '#007AFF' : '#F0F0F0',
              }}
            >
              <Text style={{ color: index === 0 ? '#FFF' : '#000' }}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {mockTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={{
              backgroundColor: '#F9F9F9',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getPriorityColor(task.priority),
            }}
            onPress={() => router.push(`/tasks/${task.id}`)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons
                name={getStatusIcon(task.status)}
                size={20}
                color={task.status === 'completed' ? '#34C759' : '#666'}
                style={{ marginRight: 12 }}
              />
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                flex: 1,
                textDecorationLine: task.status === 'completed' ? 'line-through' : 'none',
              }}>
                {task.title}
              </Text>
            </View>
            
            <Text style={{ color: '#666', marginBottom: 4 }}>{task.event}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{
                backgroundColor: getPriorityColor(task.priority),
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}>
                <Text style={{ color: '#FFF', fontSize: 12 }}>
                  {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                </Text>
              </View>
              <Text style={{ color: '#666', fontSize: 12 }}>Échéance: {task.dueDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    </ProtectedRoute>
  );
} 