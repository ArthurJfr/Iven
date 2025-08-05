import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles, spacing, shadows } from '../styles';
import Text from './ui/atoms/Text'; // 🔧 Utiliser notre composant Text personnalisé

interface Route {
  name: string;
  path: string;
  group: string;
  icon?: string;
  description?: string;
}

const routes: Route[] = [
  // Auth Routes
  { name: 'Connexion', path: '/login', group: 'Auth', icon: 'log-in-outline', description: 'Page de connexion' },
  { name: 'Inscription', path: '/register', group: 'Auth', icon: 'person-add-outline', description: 'Page d\'inscription' },
  { name: 'Mot de passe oublié', path: '/forgot-password', group: 'Auth', icon: 'mail-outline', description: 'Réinitialisation mot de passe' },
  
  // Main Routes
  { name: 'Accueil', path: '/', group: 'Principal', icon: 'home-outline', description: 'Page d\'accueil' },
  { name: 'Événements', path: '/events', group: 'Principal', icon: 'calendar-outline', description: 'Liste des événements' },
  { name: 'Calendrier', path: '/calendars', group: 'Principal', icon: 'time-outline', description: 'Vue calendrier' },
  { name: 'Profil', path: '/profile', group: 'Principal', icon: 'person-outline', description: 'Profil utilisateur' },
  { name: 'Paramètres', path: '/profile/settings', group: 'Principal', icon: 'settings-outline', description: 'Paramètres de l\'app' },
  
  // Events Detail Routes  
  { name: 'Événement #1', path: '/events/1', group: 'Événements', icon: 'information-circle-outline', description: 'Détail événement' },
  { name: 'Tâches Event #1', path: '/events/1/tasks', group: 'Événements', icon: 'checkmark-done-outline', description: 'Tâches de l\'événement' },
  { name: 'Budget Event #1', path: '/events/1/budget', group: 'Événements', icon: 'card-outline', description: 'Budget de l\'événement' },
  { name: 'Médias Event #1', path: '/events/1/media', group: 'Événements', icon: 'image-outline', description: 'Galerie média' },
  { name: 'Chat Event #1', path: '/events/1/chat', group: 'Événements', icon: 'chatbubble-outline', description: 'Chat temps réel' },
  { name: 'Gérer Event #1', path: '/events/1/manage', group: 'Événements', icon: 'cog-outline', description: 'Gestion événement' },
  
  // Other Routes
  { name: 'Tâches', path: '/tasks', group: 'Autres', icon: 'list-outline', description: 'Toutes les tâches' },
  { name: 'Tâche #1', path: '/tasks/1', group: 'Autres', icon: 'document-text-outline', description: 'Détail tâche' },
  { name: 'Médias', path: '/media', group: 'Autres', icon: 'images-outline', description: 'Tous les médias' },
  { name: 'Média #1', path: '/media/1', group: 'Autres', icon: 'image-outline', description: 'Visualiseur média' },
  { name: 'Utilisateurs', path: '/users', group: 'Autres', icon: 'people-outline', description: 'Liste utilisateurs' },
  { name: 'Utilisateur #1', path: '/users/1', group: 'Autres', icon: 'person-circle-outline', description: 'Profil utilisateur' },
  { name: 'Notifications', path: '/notifications', group: 'Autres', icon: 'notifications-outline', description: 'Centre de notifications' },
  
  // Modals
  { name: 'Créer Événement', path: '/modals/create-event', group: 'Modales', icon: 'add-circle-outline', description: 'Modal création événement' },
  { name: 'Éditer Profil', path: '/modals/edit-profile', group: 'Modales', icon: 'create-outline', description: 'Modal édition profil' },
  { name: 'Visualiseur Média', path: '/modals/media-viewer', group: 'Modales', icon: 'expand-outline', description: 'Modal visualiseur' },
  { name: 'Inviter Participants', path: '/modals/invite-participants', group: 'Modales', icon: 'person-add-outline', description: 'Modal invitation' },
  { name: 'Détail Tâche', path: '/modals/task-detail', group: 'Modales', icon: 'document-outline', description: 'Modal tâche' },
  { name: 'Formulaire Dépense', path: '/modals/expense-form', group: 'Modales', icon: 'receipt-outline', description: 'Modal dépense' },
  
  // Special
  { name: 'UI Test', path: '/ui-test', group: 'Dev', icon: 'color-palette-outline', description: 'Showcase composants UI' },
];

interface DevNavigatorProps {
  isVisible?: boolean;
}

export default function DevNavigator({ isVisible = true }: DevNavigatorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Grouper les routes
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.group]) {
      acc[route.group] = [];
    }
    acc[route.group].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  const handleRoutePress = (path: string) => {
    router.push(path as any);
    setShowModal(false);
  };

  const filteredRoutes = selectedGroup 
    ? groupedRoutes[selectedGroup] || []
    : Object.values(groupedRoutes).flat();

  if (!isVisible) return null;

  return (
    <>
      {/* Bouton flottant */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor: theme.primary },
          shadows.lg
        ]}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="menu" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Modal de navigation */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, themedStyles.surface]}>
          {/* Header */}
          <View style={[styles.modalHeader, themedStyles.border]}>
            <View>
              <Text variant="h3" weight="bold">
                🚀 Navigation Dev
              </Text>
              <Text variant="caption" color="secondary">
                {filteredRoutes.length} route{filteredRoutes.length > 1 ? 's' : ''} disponible{filteredRoutes.length > 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Filtres par groupe */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={{ paddingHorizontal: spacing[4] }}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                { backgroundColor: selectedGroup === null ? theme.primary : theme.backgroundSecondary }
              ]}
              onPress={() => setSelectedGroup(null)}
            >
              <Text 
                variant="caption" 
                weight="semibold"
                style={{ color: selectedGroup === null ? '#FFF' : theme.textSecondary }}
              >
                Toutes
              </Text>
            </TouchableOpacity>
            
            {Object.keys(groupedRoutes).map(group => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.filterChip,
                  { backgroundColor: selectedGroup === group ? theme.primary : theme.backgroundSecondary }
                ]}
                onPress={() => setSelectedGroup(group)}
              >
                <Text 
                  variant="caption" 
                  weight="semibold"
                  style={{ color: selectedGroup === group ? '#FFF' : theme.textSecondary }}
                >
                  {group} ({groupedRoutes[group].length})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Liste des routes */}
          <ScrollView style={styles.routesList}>
            {filteredRoutes.map((route, index) => {
              const isActive = pathname === route.path;
              
              return (
                <TouchableOpacity
                  key={`${route.path}-${index}`}
                  style={[
                    styles.routeItem,
                    { backgroundColor: isActive ? theme.primaryLight : theme.backgroundSecondary },
                    themedStyles.border
                  ]}
                  onPress={() => handleRoutePress(route.path)}
                >
                  <View style={styles.routeIcon}>
                    <Ionicons 
                      name={route.icon as any || 'link-outline'} 
                      size={20} 
                      color={isActive ? theme.primary : theme.textSecondary} 
                    />
                  </View>
                  
                  <View style={styles.routeInfo}>
                    <View style={styles.routeHeader}>
                      <Text 
                        variant="body" 
                        weight="semibold"
                        style={{ 
                          color: isActive ? theme.primary : theme.text,
                          flex: 1 
                        }}
                      >
                        {route.name}
                      </Text>
                      {isActive && (
                        <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                          <Text variant="small" style={{ color: '#FFF' }}>
                            Actuel
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <Text variant="caption" style={{ color: theme.textSecondary, fontFamily: 'monospace' }}>
                      {route.path}
                    </Text>
                    
                    {route.description && (
                      <Text variant="small" color="secondary" style={{ fontStyle: 'italic' }}>
                        {route.description}
                      </Text>
                    )}
                  </View>
                  
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 60,
    right: spacing[4],
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: spacing[2],
  },
  filterContainer: {
    paddingVertical: spacing[3],
    marginBottom: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  routesList: {

    padding: spacing[4],
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[2],
    borderWidth: 1,
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  routeInfo: {
    flex: 1,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
}); 