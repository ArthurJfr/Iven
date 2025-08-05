import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { useTheme } from '../../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function EventTasksScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Acheter le gâteau",
      description: "Gâteau d'anniversaire au chocolat",
      completed: false,
      assignedTo: "Marie",
      dueDate: "2024-03-14",
      priority: 'high'
    },
    {
      id: 2,
      title: "Décorer la salle",
      description: "Ballons et guirlandes",
      completed: true,
      assignedTo: "Jean",
      dueDate: "2024-03-15",
      priority: 'medium'
    },
    {
      id: 3,
      title: "Préparer la playlist",
      description: "Musique pour la soirée",
      completed: false,
      assignedTo: "Sophie",
      dueDate: "2024-03-14",
      priority: 'low'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Erreur', 'Le titre de la tâche est requis');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      priority: 'medium'
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddForm(false);
  };

  const deleteTask = (taskId: number) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => task.id !== taskId))
        }
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Non définie';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Tâches de l'événement</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.background }]}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons 
            name={showAddForm ? "close" : "add"} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <Card style={styles.addForm}>
          <Text style={styles.formTitle}>Nouvelle tâche</Text>
          <Input
            placeholder="Titre de la tâche"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            style={styles.input}
          />
          <Input
            placeholder="Description (optionnel)"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            multiline
            style={styles.input}
          />
          <View style={styles.formButtons}>
            <Button 
              title="Annuler" 
              onPress={() => setShowAddForm(false)}
              style={[styles.formButton, styles.cancelButton]}
            />
            <Button 
              title="Ajouter" 
              onPress={addTask}
              style={styles.formButton}
            />
          </View>
        </Card>
      )}

      <ScrollView style={styles.content}>
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tâches en cours ({pendingTasks.length})</Text>
            {pendingTasks.map((task) => (
              <Card key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={[styles.checkboxInner, task.completed && styles.checkboxChecked]} />
                  </TouchableOpacity>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.description && (
                      <Text style={styles.taskDescription}>{task.description}</Text>
                    )}
                    <View style={styles.taskMeta}>
                      {task.assignedTo && (
                        <Text style={styles.taskAssignee}>Assigné à: {task.assignedTo}</Text>
                      )}
                      {task.dueDate && (
                        <Text style={styles.taskDueDate}>Échéance: {task.dueDate}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.taskActions}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.priorityText}>{getPriorityText(task.priority)}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tâches terminées ({completedTasks.length})</Text>
            {completedTasks.map((task) => (
              <Card key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={[styles.checkboxInner, styles.checkboxChecked]} />
                  </TouchableOpacity>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, styles.completedText]}>{task.title}</Text>
                    {task.description && (
                      <Text style={[styles.taskDescription, styles.completedText]}>{task.description}</Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tasks.length === 0 && (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune tâche pour cet événement</Text>
            <Text style={styles.emptyStateSubtext}>Ajoutez votre première tâche pour commencer</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: Math.min(20, width * 0.05),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
    margin: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  taskCard: {
    marginHorizontal: 16,
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
    color: '#1F2937',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  taskAssignee: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedTask: {
    opacity: 0.7,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  emptyState: {
    margin: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
}); 