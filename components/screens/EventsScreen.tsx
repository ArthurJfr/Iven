import { View, Text, TouchableOpacity } from "react-native";
import { themedStyles } from "../../styles/global";
import { useTheme } from "../../contexts/ThemeContext";
import EventsTopBar from "../ui/EventsTopBar";
import { Link } from "expo-router";
import { useState } from "react";

export default function EventsScreen() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(`Onglet sélectionné: ${tab}`);
    // Ici vous pouvez ajouter la logique pour filtrer les événements
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <View style={[styles.container, { flex: 1, paddingTop: 0 }]}>
            <Text style={[styles.titleLg, { textAlign: 'center' }]}>Tous les événements</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Tous vos événements apparaîtront ici
            </Text>
          </View>
        );
      case 'upcoming':
        return (
          <View style={[styles.container, { flex: 1, paddingTop: 0 }]}>
            <Text style={[styles.titleLg, { textAlign: 'center' }]}>Événements à venir</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Vos événements à venir apparaîtront ici
            </Text>
          </View>
        );
      case 'past':
        return (
          <View style={[styles.container, { flex: 1, paddingTop: 0 }]}>
            <Text style={[styles.titleLg, { textAlign: 'center' }]}>Événements passés</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Vos événements passés apparaîtront ici
            </Text>
          </View>
        );
      case 'favorites':
        return (
          <View style={[styles.container, { flex: 1, paddingTop: 0 }]}>
            <Text style={[styles.titleLg, { textAlign: 'center' }]}>Événements favoris</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Vos événements favoris apparaîtront ici
            </Text>
          </View>
        );
      default:
        return null;
    }
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