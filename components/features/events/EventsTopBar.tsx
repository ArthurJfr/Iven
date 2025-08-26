import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import TopBar from '../../ui/TopBar';
import { useTheme } from '../../../contexts/ThemeContext';

interface EventsTopBarProps {
  title: string;
  showBackButton?: boolean;
  showCreateButton?: boolean;
  showSearchButton?: boolean;
  showFilterButton?: boolean;
  onBackPress?: () => void;
  onCreatePress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { id: 'all', label: 'Tous', icon: 'list' },
  { id: 'upcoming', label: 'À venir', icon: 'calendar' },
  { id: 'past', label: 'Passés', icon: 'time' },
  { id: 'favorites', label: 'Favoris', icon: 'heart' },
];

export default function EventsTopBar({
  title,
  showBackButton = false,
  showCreateButton = true,
  showSearchButton = true,
  showFilterButton = true,
  onBackPress,
  onCreatePress,
  onSearchPress,
  onFilterPress,
  activeTab = 'all',
  onTabChange,
}: EventsTopBarProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleCreatePress = () => {
    if (onCreatePress) {
      onCreatePress();
    } else {
      // Navigation vers la page de création d'événement
      router.push('/events/create-event');
    }
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      // Action de recherche par défaut
      console.log('Recherche d\'événements');
    }
  };

  const handleFilterPress = () => {
    if (onFilterPress) {
      onFilterPress();
    } else {
      // Action de filtre par défaut
      console.log('Filtrer les événements');
    }
  };

  const handleTabPress = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Déterminer quelle action afficher à droite
  const getRightAction = () => {
    if (showCreateButton) {
      return {
        icon: 'add' as const,
        onPress: handleCreatePress,
        label: 'Créer un événement',
      };
    }
    if (showSearchButton) {
      return {
        icon: 'search' as const,
        onPress: handleSearchPress,
        label: 'Rechercher',
      };
    }
    if (showFilterButton) {
      return {
        icon: 'filter' as const,
        onPress: handleFilterPress,
        label: 'Filtrer',
      };
    }
    return undefined;
  };


  return (
    <View style={localStyles.container}>
      <TopBar
        title={title}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        rightAction={getRightAction()}
      />
      
      {/* Navigation Bar */}
      <View style={[localStyles.navigationBar, { backgroundColor: theme.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              localStyles.tab,
              currentTab === tab.id && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => handleTabPress(tab.id)}
            accessibilityLabel={`Onglet ${tab.label}`}
          >
            <Text
              style={[
                localStyles.tabText,
                { color: currentTab === tab.id ? theme.buttonText : theme.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 