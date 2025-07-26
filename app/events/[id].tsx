import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import { Event } from "../../types/events";
import eventsData from "../../data/events.json";
import Card from "../../components/ui/Card";
import TopBar from "../../components/ui/TopBar";
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import tasks from "../../data/tasks.json";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  // Recherche de l'événement correspondant
  const event: Event | undefined = (eventsData as Event[]).find(e => e.id === id);

  if (!event) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.titleLg, { color: theme.text, marginBottom: 8 }]}>Événement introuvable</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Aucun événement ne correspond à cet identifiant.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopBar 
        title="Détail de l'événement"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
        <Text style={[styles.titleMd, { marginBottom: 16 }]}>{event.title}</Text>
        <View style={localStyles.row}>
          <Ionicons name="calendar" size={18} color={theme.text} style={{ marginRight: 6 }} />
            <Text style={styles.textSm}>{event.date} {event.time && `• ${event.time}`}</Text>
        </View>
        <View style={localStyles.row}>
          <Ionicons name="location" size={18} color={theme.text} style={{ marginRight: 6 }} />
          <Text style={styles.textSm}>{event.location}</Text>
        </View>
        <View style={localStyles.row}>
          <Ionicons name="people" size={18} color={theme.text} style={{ marginRight: 6 }} />
          <Text style={styles.textSm}>{event.participants}/{event.maxParticipants || '?'}</Text>
        </View>
        <View style={localStyles.row}>
          <Ionicons name="person" size={18} color={theme.text} style={{ marginRight: 6 }} />
          <Text style={styles.textSm}>Organisateur : {event.organizer || 'N/A'}</Text>
        </View>
        <View style={localStyles.row}>
          <Ionicons name="pricetag" size={18} color={theme.text} style={{ marginRight: 6 }} />
          <Text style={styles.textSm}>{event.category || 'N/A'}</Text>
        </View>
        {event.description && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.titleSm, { marginBottom: 4 }]}>Description</Text>
            <Text style={styles.textSm}>{event.description}</Text>
          </View>
        )}
        </Card>

        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
          <Text style={[styles.titleSm, { marginBottom: 4 }]}>Participants</Text>
          <Text style={styles.textSm}>{event.participants}/{event.maxParticipants || '?'} participants</Text>
          <Link style={{ alignItems: 'flex-end' }} href={`/users/${event.id}`}>
            <Text style={{ color: theme.primary, marginTop: 16 }}>Voir plus</Text>
          </Link>
        </Card>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
            <Text style={[styles.titleSm, { marginBottom: 4 }]}>To do list</Text>
            {tasks
                .filter(task => task.eventId === event.id)
                .map(task => (
                    <View key={task.id} style={{ marginBottom: 8 }}>
                        <Text style={styles.textSm}>{task.title}</Text>
                        <Text style={[styles.textXs, { color: theme.text }]}>{task.status}</Text>
                    </View>
                ))
            }
            <Link style={{ alignItems: 'flex-end' }} href={`/tasks?eventId=${event.id}`}>
                <Text style={{ color: theme.primary, marginTop: 16 }}>Voir plus</Text>
            </Link>
        </Card>
        {event.location && (
            <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
                <Text style={[styles.titleSm, { marginBottom: 4 }]}>Localisation</Text>
                <Text style={[styles.textSm, { marginBottom: 16 }]}>{event.location}</Text>
                
                <MapView
                    style={{ width: '100%', height: 200 }}
                    initialRegion={{
                        latitude: event.latitude || 100.8566,
                        longitude: event.longitude || 100.3522,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                />
            </Card>
        )}
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
  info: {
    fontSize: 16,
    color: '#222',
  },
}); 