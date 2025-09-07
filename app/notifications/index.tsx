import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { invitationService, type Invitation } from '../../services/InvitationService';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Header from '../../components/ui/organisms/Header';
import Badge from '../../components/ui/atoms/Badge';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Notification {
  id: string;
  type: 'event_invite' | 'task_assigned' | 'message' | 'event_reminder' | 'task_due' | 'event_update';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  actionable?: boolean;
  eventId?: string;
  taskId?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les invitations
  const loadInvitations = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await invitationService.getUserInvitations();
              if (response.success && response.data) {
          setInvitations(response.data);
        } else {
          setInvitations([]);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des invitations:', error);
        setInvitations([]);
      }
  };

  // Convertir les invitations en notifications
  const convertInvitationsToNotifications = (): Notification[] => {
    return invitations.map(inv => ({
      id: `inv_${inv.id}`,
      type: 'event_invite' as const,
      title: 'Invitation à un événement',
      message: inv.message || 'Vous avez été invité à participer à un événement',
      time: formatTimeAgo(inv.created_at),
      read: inv.status !== 'pending',
      actionable: inv.status === 'pending',
      eventId: inv.event_id.toString()
    }));
  };

  // Formater le temps écoulé
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  // Répondre à une invitation
  const handleInvitationResponse = async (invitationId: number, response: 'accept' | 'decline') => {
    try {
      const result = await invitationService.respondToInvitation(invitationId, { 
        invitation_id: invitationId, 
        action: response 
      });
      
      if (result.success) {
        Alert.alert(
          'Invitation traitée',
          `Invitation ${response === 'accept' ? 'acceptée' : 'refusée'} avec succès !`
        );
        
        // Recharger les invitations
        await loadInvitations();
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de traiter l\'invitation');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de traiter l\'invitation');
    }
  };

  // Marquer comme lu
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Marquer tout comme lu
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Gérer le clic sur une notification
  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.eventId) {
      router.push(`/events/${notification.eventId}`);
    } else if (notification.taskId) {
      router.push(`/tasks/${notification.taskId}`);
    }
  };

  // Rafraîchir
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInvitations();
    setRefreshing(false);
  };

  // Charger les données au montage et quand l'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      loadInvitations();
    }
  }, [isAuthenticated]);

  // Mettre à jour les notifications quand les invitations changent
  useEffect(() => {
    const invitationNotifications = convertInvitationsToNotifications();
    const allNotifications = [...invitationNotifications, ...notifications.filter(n => !n.id.startsWith('inv_'))];
    setNotifications(allNotifications);
    setIsLoading(false);
  }, [invitations]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const newNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
          <Header title="Notifications" />
          <View style={[layoutStyles.centerHorizontal, { paddingTop: spacing[8] }]}> 
            <Ionicons name="notifications-outline" size={64} color={theme.textSecondary} />
            <Text variant="body" color="secondary">Chargement des notifications...</Text>
          </View>
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
        <Header 
          title="Notifications"
          onBack={() => router.back()}
          showBack={true}
          rightAction={unreadCount > 0 ? {
            icon: "checkmark-circle-outline",
            onPress: markAllAsRead
          } : undefined}
        />

        <ScrollView 
          style={layoutStyles.container}
          contentContainerStyle={{ paddingBottom: spacing[8] }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Badge avec compteur */}
        {unreadCount > 0 && (
          <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
            <Badge 
              text={`${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}`} 
              color={theme.primary}
            />
          </View>
        )}

        {/* Nouvelles notifications */}
        {newNotifications.length > 0 && (
          <View style={{ paddingHorizontal: spacing[5], marginBottom: spacing[5] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
              Nouvelles
            </Text>
            
            <View style={{ gap: spacing[2] }}>
              {newNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Card variant="elevated" padding="medium">
                    <View style={[layoutStyles.row, { alignItems: 'flex-start' }]}>
                      {/* Icône de notification */}
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: getNotificationColor(notification.type, theme) + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: spacing[3]
                      }}>
                        <Ionicons 
                          name={getNotificationIcon(notification.type) as any} 
                          size={22} 
                          color={getNotificationColor(notification.type, theme)} 
                        />
                      </View>
                      
                      {/* Contenu */}
                      <View style={{ flex: 1 }}>
                        <View style={[layoutStyles.rowBetween, { marginBottom: spacing[1] }]}>
                          <Text variant="body" weight="semibold">
                            {notification.title}
                          </Text>
                          <Text variant="caption" color="secondary">
                            {notification.time}
                          </Text>
                        </View>
                        
                        <Text variant="body" color="secondary" style={{ marginBottom: spacing[2] }}>
                          {notification.message}
                        </Text>

                        {/* Actions pour les invitations */}
                        {notification.actionable && notification.type === 'event_invite' && notification.id.startsWith('inv_') && (
                          <View style={[layoutStyles.row, { gap: spacing[2] }]}>
                            <TouchableOpacity
                              style={{
                                paddingVertical: spacing[2],
                                paddingHorizontal: spacing[3],
                                backgroundColor: theme.primary,
                                borderRadius: 16,
                                flex: 1
                              }}
                              onPress={() => {
                                const invitationId = parseInt(notification.id.replace('inv_', ''));
                                handleInvitationResponse(invitationId, 'accept');
                              }}
                            >
                              <Text variant="caption" weight="semibold" style={{ 
                                color: 'white', 
                                textAlign: 'center' 
                              }}>
                                Accepter
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                paddingVertical: spacing[2],
                                paddingHorizontal: spacing[3],
                                backgroundColor: theme.backgroundSecondary,
                                borderRadius: 16,
                                flex: 1
                              }}
                              onPress={() => {
                                const invitationId = parseInt(notification.id.replace('inv_', ''));
                                handleInvitationResponse(invitationId, 'decline');
                              }}
                            >
                              <Text variant="caption" weight="semibold" style={{ 
                                textAlign: 'center' 
                              }}>
                                Refuser
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {/* Indicateur non lu */}
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.primary,
                        marginLeft: spacing[2],
                        marginTop: spacing[2]
                      }} />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Notifications lues */}
        {readNotifications.length > 0 && (
          <View style={{ paddingHorizontal: spacing[5] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
              Précédentes
            </Text>
            
            <View style={{ gap: spacing[2] }}>
              {readNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Card variant="outlined" padding="medium">
                    <View style={[layoutStyles.row, { alignItems: 'flex-start' }]}>
                      {/* Icône de notification */}
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.backgroundSecondary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: spacing[3]
                      }}>
                        <Ionicons 
                          name={getNotificationIcon(notification.type) as any} 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </View>
                      
                      {/* Contenu */}
                      <View style={{ flex: 1 }}>
                        <View style={[layoutStyles.rowBetween, { marginBottom: spacing[1] }]}>
                          <Text variant="body" weight="medium">
                            {notification.title}
                          </Text>
                          <Text variant="caption" color="secondary">
                            {notification.time}
                          </Text>
                        </View>
                        
                        <Text variant="caption" color="secondary">
                          {notification.message}
                        </Text>
                      </View>

                      <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color={theme.textSecondary}
                        style={{ marginTop: spacing[1] }}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* État vide */}
        {notifications.length === 0 && (
          <View style={[layoutStyles.centerHorizontal, { paddingHorizontal: spacing[5], paddingTop: spacing[8] }]}>
            <Ionicons name="notifications-off-outline" size={64} color={theme.textSecondary} style={{ marginBottom: spacing[4] }} />
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[2] }}>
              Aucune notification
            </Text>
            <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
              Vous êtes à jour ! Toutes vos notifications apparaîtront ici.
            </Text>
          </View>
        )}
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

// Fonctions utilitaires
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'event_invite': return 'calendar';
    case 'task_assigned': return 'checkmark-circle';
    case 'message': return 'chatbubble';
    case 'event_reminder': return 'alarm';
    case 'task_due': return 'warning';
    case 'event_update': return 'refresh-circle';
    default: return 'notifications';
  }
};

const getNotificationColor = (type: string, theme: any) => {
  switch (type) {
    case 'event_invite': return theme.primary;
    case 'task_assigned': return '#34C759';
    case 'message': return '#4ECDC4';
    case 'event_reminder': return '#FF9500';
    case 'task_due': return '#FF3B30';
    case 'event_update': return '#007AFF';
    default: return theme.primary;
  }
}; 