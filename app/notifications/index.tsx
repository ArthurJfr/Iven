import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Header from '../../components/ui/organisms/Header';
import Badge from '../../components/ui/atoms/Badge';

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
  const themedStyles = createThemedStyles(theme);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'event_invite',
      title: 'Nouvelle invitation',
      message: 'Alice vous a invité à "Anniversaire Marie"',
      time: '2 min',
      read: false,
      avatar: undefined,
      actionable: true,
      eventId: '1'
    },
    {
      id: '2',
      type: 'task_assigned',
      title: 'Nouvelle tâche assignée',
      message: 'Vous avez été assigné à "Acheter les décorations"',
      time: '1h',
      read: false,
      actionable: true,
      taskId: '1'
    },
    {
      id: '3',
      type: 'message',
      title: 'Nouveau message',
      message: 'Bob dans "Anniversaire Marie": "N\'oubliez pas les boissons!"',
      time: '3h',
      read: true,
      avatar: undefined,
    },
    {
      id: '4',
      type: 'event_reminder',
      title: 'Rappel d\'événement',
      message: '"Réunion équipe" commence dans 30 minutes',
      time: '5h',
      read: true,
      eventId: '2'
    },
    {
      id: '5',
      type: 'task_due',
      title: 'Tâche en retard',
      message: '"Réserver le restaurant" était due hier',
      time: '1j',
      read: true,
      actionable: true,
      taskId: '2'
    },
    {
      id: '6',
      type: 'event_update',
      title: 'Événement modifié',
      message: 'L\'heure de "Anniversaire Marie" a été changée',
      time: '2j',
      read: true,
      eventId: '1'
    }
  ]);

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

  const getNotificationColor = (type: string) => {
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigation basée sur le type de notification
    if (notification.eventId) {
      router.push(`/events/${notification.eventId}`);
    } else if (notification.taskId) {
      router.push(`/tasks/${notification.taskId}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const newNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <Header 
        title="Notifications"
        showBackButton={true}
        rightAction={unreadCount > 0 ? {
          icon: "checkmark-circle-outline",
          onPress: markAllAsRead
        } : undefined}
      />

      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
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
                        backgroundColor: getNotificationColor(notification.type) + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: spacing[3]
                      }}>
                        <Ionicons 
                          name={getNotificationIcon(notification.type) as any} 
                          size={22} 
                          color={getNotificationColor(notification.type)} 
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

                        {/* Actions si applicable */}
                        {notification.actionable && notification.type === 'event_invite' && (
                          <View style={[layoutStyles.row, { gap: spacing[2] }]}>
                            <TouchableOpacity
                              style={{
                                paddingVertical: spacing[2],
                                paddingHorizontal: spacing[3],
                                backgroundColor: theme.primary,
                                borderRadius: 16,
                                flex: 1
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
  );
} 