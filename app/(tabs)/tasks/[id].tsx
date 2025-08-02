import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { themedStyles } from "../../../styles/global";
import { Task } from "../../../types/tasks";
import tasksData from "../../../data/tasks.json";
import Card from "../../../components/ui/Card";
import TopBar from "../../../components/ui/TopBar";
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  // Recherche de la tâche correspondante
  const task: Task | undefined = (tasksData as Task[]).find(t => t.id === id);

  if (!task) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.titleLg, { color: theme.text, marginBottom: 8 }]}>Tâche introuvable</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Aucune tâche ne correspond à cet identifiant.</Text>
      </View>
    );
  }

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'completed':
        return 'Terminée';
      case 'in_progress':
        return 'En cours';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  };

  const getPriorityText = () => {
    switch (task.priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      default:
        return 'Basse';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopBar 
        title="Détail de la tâche"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
          <Text style={[styles.titleLg, { marginBottom: 16 }]}>{task.title}</Text>
          
          <View style={localStyles.row}>
            <Ionicons name="checkmark-circle" size={18} color={getStatusColor()} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Statut : {getStatusText()}</Text>
          </View>
          
          <View style={localStyles.row}>
            <Ionicons name="flag" size={18} color={getPriorityColor()} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Priorité : {getPriorityText()}</Text>
          </View>
          
          {task.assignedTo && (
            <View style={localStyles.row}>
              <Ionicons name="person" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>Assignée à : {task.assignedTo}</Text>
            </View>
          )}
          
          {task.dueDate && (
            <View style={localStyles.row}>
              <Ionicons name="calendar" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>Date limite : {task.dueDate}</Text>
            </View>
          )}
          
          <View style={localStyles.row}>
            <Ionicons name="link" size={18} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>Événement : #{task.eventId}</Text>
          </View>
          
          {task.description && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.titleSm, { marginBottom: 4 }]}>Description</Text>
              <Text style={styles.textSm}>{task.description}</Text>
            </View>
          )}
          
          <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={localStyles.row}>
              <Ionicons name="time" size={16} color={theme.text} style={{ marginRight: 4 }} />
              <Text style={styles.textSm}>Créée le {task.createdAt}</Text>
            </View>
            <View style={localStyles.row}>
              <Ionicons name="refresh" size={16} color={theme.text} style={{ marginRight: 4 }} />
              <Text style={styles.textSm}>Modifiée le {task.updatedAt}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
}); 