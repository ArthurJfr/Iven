import { View, Text, ScrollView } from "react-native";
import { themedStyles } from "../../styles/global";
import { useTheme } from "../../contexts/ThemeContext";
import EventsTopBar from "../ui/EventsTopBar";
import EventCard from "../ui/EventCard";
import { useState, useEffect } from "react";
import { Event } from "../../types/events";
import { useRouter } from "expo-router";

// Import des données depuis le fichier JSON
import eventsData from "../../data/events.json";

export default function EventsScreen() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [events, setEvents] = useState<Event[]>([]);

  // Charger les données depuis le fichier JSON
  useEffect(() => {
    setEvents(eventsData as Event[]);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(`Onglet sélectionné: ${tab}`);
  };

  const handleEventPress = (eventId: string) => {
    console.log('Événement sélectionné:', eventId);
    // Navigation vers le détail de l'événement
    router.push(`/events/${eventId}`);
  };

  const handleFavoritePress = (eventId: string) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const getFilteredEvents = () => {
    switch (activeTab) {
      case 'upcoming':
        return events.filter((event: Event) => event.status === 'upcoming');
      case 'past':
        return events.filter((event: Event) => event.status === 'completed');
      case 'favorites':
        return events.filter((event: Event) => favorites.includes(event.id));
      default:
        return events;
    }
  };

  const renderContent = () => {
    const filteredEvents = getFilteredEvents();

    if (filteredEvents.length === 0) {
      return (
        <View style={[styles.container, { flex: 1, paddingTop: 0, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.titleLg, { textAlign: 'center', marginBottom: 8 }]}>
            Aucun événement
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondary, textAlign: 'center' }]}>
            {activeTab === 'favorites' 
              ? 'Vous n\'avez pas encore d\'événements favoris'
              : 'Aucun événement trouvé pour cette catégorie'
            }
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.map((event: Event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            participants={event.participants}
            maxParticipants={event.maxParticipants}
            status={event.status}
            isFavorite={favorites.includes(event.id)}
            onPress={() => handleEventPress(event.id)}
            onFavoritePress={() => handleFavoritePress(event.id)}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <EventsTopBar 
        title="Événements"
        showCreateButton={true}
        showSearchButton={false}
        showFilterButton={false}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {renderContent()}
    </View>
  );
}