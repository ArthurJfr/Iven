import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../../styles';
import Text from '../../../../components/ui/atoms/Text';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Header from '../../../../components/ui/organisms/Header';
import Avatar from '../../../../components/ui/atoms/Avatar';
import { Event } from '../../../../types/events';
import { eventService } from '../../../../services/EventService';
import { useAuth } from '../../../../contexts/AuthContext';

// Types pour le chat
interface ChatMessage {
  id: number;
  event_id: number;
  user_id: number;
  username: string;
  user_avatar?: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  created_at: string;
  updated_at: string;
  is_edited?: boolean;
  reply_to?: number;
}

interface ChatParticipant {
  id: number;
  username: string;
  fname: string;
  lname: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen?: string;
}

export default function EventChatScreen() {
  console.log('💬 EventChatScreen rendu');
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Récupérer les données du chat
  const fetchChatData = async () => {
    if (!id || !user?.id) {
      setError('ID d\'événement ou utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventId = Number(id);
      console.log('💬 Récupération des données du chat:', eventId);
      
      // Récupérer l'événement
      const eventResponse = await eventService.getEventById(eventId);
      if (!eventResponse.success || !eventResponse.data) {
        throw new Error(eventResponse.error || 'Erreur lors de la récupération de l\'événement');
      }
      
      const eventData = eventResponse.data;
      // Créer un objet Event complet avec la propriété participants requise
      const completeEvent: Event = {
        ...eventData,
        participants: [] // Ajouter la propriété participants manquante
      };
      setEvent(completeEvent);
      setIsOwner(eventData.owner_id === user.id);
      
      // Simuler les données du chat (à remplacer par des appels API réels)
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          event_id: eventId,
          user_id: user.id,
          username: user.fname + ' ' + user.lname,
          user_avatar: user.avatar_url,
          message: 'Salut tout le monde ! Comment ça va ?',
          message_type: 'text',
          created_at: '2024-01-15 10:00:00',
          updated_at: '2024-01-15 10:00:00'
        },
        {
          id: 2,
          event_id: eventId,
          user_id: 2,
          username: 'Marie Dubois',
          user_avatar: 'https://via.placeholder.com/40',
          message: 'Super ! J\'ai hâte de voir tout le monde samedi 😊',
          message_type: 'text',
          created_at: '2024-01-15 10:05:00',
          updated_at: '2024-01-15 10:05:00'
        },
        {
          id: 3,
          event_id: eventId,
          user_id: 3,
          username: 'Pierre Martin',
          user_avatar: 'https://via.placeholder.com/40',
          message: 'Moi aussi ! J\'apporte le matériel de décoration',
          message_type: 'text',
          created_at: '2024-01-15 10:10:00',
          updated_at: '2024-01-15 10:10:00'
        },
        {
          id: 4,
          event_id: eventId,
          user_id: user.id,
          username: user.fname + ' ' + user.lname,
          user_avatar: user.avatar_url,
          message: 'Parfait ! N\'oubliez pas de confirmer votre présence',
          message_type: 'text',
          created_at: '2024-01-15 10:15:00',
          updated_at: '2024-01-15 10:15:00'
        }
      ];
      
      setMessages(mockMessages);
      
      // Simuler les participants
      const mockParticipants: ChatParticipant[] = [
        {
          id: user.id,
          username: user.fname + ' ' + user.lname,
          fname: user.fname,
          lname: user.lname,
          avatar_url: user.avatar_url,
          is_online: true
        },
        {
          id: 2,
          username: 'Marie Dubois',
          fname: 'Marie',
          lname: 'Dubois',
          avatar_url: 'https://via.placeholder.com/40',
          is_online: true,
          last_seen: '2024-01-15 10:05:00'
        },
        {
          id: 3,
          username: 'Pierre Martin',
          fname: 'Pierre',
          lname: 'Martin',
          avatar_url: 'https://via.placeholder.com/40',
          is_online: false,
          last_seen: '2024-01-15 09:30:00'
        }
      ];
      
      setParticipants(mockParticipants);
      
      console.log('✅ Données du chat récupérées avec succès');
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération du chat:', error);
      setError(error.message || 'Erreur lors de la récupération du chat');
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un nouveau message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      // Simuler l'envoi du message (à remplacer par un appel API réel)
      const newChatMessage: ChatMessage = {
        id: Date.now(), // ID temporaire
        event_id: Number(id),
        user_id: user!.id,
        username: user!.fname + ' ' + user!.lname,
        user_avatar: user!.avatar_url,
        message: newMessage.trim(),
        message_type: 'text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reply_to: replyingTo?.id
      };
      
      setMessages(prev => [...prev, newChatMessage]);
      setNewMessage('');
      setReplyingTo(null);
      
      // Faire défiler vers le bas
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      console.log('✅ Message envoyé:', newChatMessage.message);
      
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    } finally {
      setSending(false);
    }
  };

  // Supprimer un message
  const deleteMessage = (messageId: number) => {
    Alert.alert(
      'Supprimer le message',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            console.log('🗑️ Message supprimé:', messageId);
          }
        }
      ]
    );
  };

  // Modifier un message
  const editMessage = (messageId: number) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setNewMessage(message.message);
      setReplyingTo(null);
      inputRef.current?.focus();
      // Supprimer le message original
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  // Répondre à un message
  const replyToMessage = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  // Annuler la réponse
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Actualiser les données
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatData();
    setRefreshing(false);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchChatData();
  }, [id, user?.id]);

  // Formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  // Grouper les messages par date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Chat"
          showBack
          onBack={() => router.back()}
        />
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <Text variant="body" color="secondary">Chargement du chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Chat"
          showBack
          onBack={() => router.back()}
        />
        <View style={[layoutStyles.center, { flex: 1, paddingHorizontal: spacing[5] }]}>
          <Ionicons name="chatbubbles-outline" size={48} color={theme.error} />
          <Text variant="h3" weight="semibold" style={{ marginTop: spacing[3], marginBottom: spacing[2] }}>
            Erreur
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
            {error}
          </Text>
          <Button
            title="Réessayer"
            onPress={fetchChatData}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Chat"
        showBack
        onBack={() => router.back()}
        rightAction={{
          icon: "people",
          onPress: () => console.log('Voir participants')
        }}
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Zone de chat */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
            
            {messages.length === 0 ? (
              <View style={[layoutStyles.center, { paddingVertical: spacing[8] }]}>
                <Ionicons name="chatbubbles-outline" size={64} color={theme.textSecondary} />
                <Text variant="h3" weight="semibold" style={{ marginTop: spacing[4], marginBottom: spacing[2] }}>
                  Aucun message
                </Text>
                <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                  Soyez le premier à écrire dans ce chat !
                </Text>
              </View>
            ) : (
              Object.entries(messageGroups).map(([date, dateMessages]) => (
                <View key={date}>
                  {/* Séparateur de date */}
                  <View style={[layoutStyles.center, { marginVertical: spacing[4] }]}>
                    <View style={{
                      backgroundColor: theme.backgroundSecondary,
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[1],
                      borderRadius: 12
                    }}>
                      <Text variant="caption" color="secondary">
                        {date}
                      </Text>
                    </View>
                  </View>

                  {/* Messages du jour */}
                  {dateMessages.map((message, index) => {
                    const isOwnMessage = message.user_id === user?.id;
                    const showAvatar = index === 0 || dateMessages[index - 1].user_id !== message.user_id;
                    const showTime = index === dateMessages.length - 1 || 
                      new Date(dateMessages[index + 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000; // 5 minutes

                    return (
                      <View key={message.id} style={{ marginBottom: spacing[2] }}>
                        <View style={[
                          layoutStyles.row,
                          { 
                            alignItems: 'flex-end',
                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                          }
                        ]}>
                          {!isOwnMessage && (
                            <View style={{ marginRight: spacing[2] }}>
                              {showAvatar ? (
                                <Avatar
                                  size="small"
                                  source={message.user_avatar ? { uri: message.user_avatar } : undefined}
                                  fallback={message.username}
                                />
                              ) : (
                                <View style={{ width: 32 }} />
                              )}
                            </View>
                          )}
                          
                          <View style={{ maxWidth: '70%' }}>
                            {!isOwnMessage && showAvatar && (
                              <Text variant="caption" color="secondary" style={{ marginBottom: spacing[1] }}>
                                {message.username}
                              </Text>
                            )}
                            
                            <View style={[
                              {
                                backgroundColor: isOwnMessage ? theme.primary : theme.backgroundSecondary,
                                paddingHorizontal: spacing[3],
                                paddingVertical: spacing[2],
                                borderRadius: 16,
                                borderBottomLeftRadius: isOwnMessage ? 16 : 4,
                                borderBottomRightRadius: isOwnMessage ? 4 : 16,
                              }
                            ]}>
                              <Text 
                                variant="body" 
                                color={isOwnMessage ? 'primary' : 'primary'}
                                style={{ 
                                  lineHeight: 20,
                                  color: isOwnMessage ? 'white' : undefined
                                }}
                              >
                                {message.message}
                              </Text>
                            </View>
                            
                            {showTime && (
                              <Text variant="caption" color="secondary" style={{ 
                                marginTop: spacing[1],
                                textAlign: isOwnMessage ? 'right' : 'left'
                              }}>
                                {formatTime(message.created_at)}
                                {message.is_edited && ' (modifié)'}
                              </Text>
                            )}
                          </View>
                          
                          {isOwnMessage && (
                            <View style={{ marginLeft: spacing[2] }}>
                              {showAvatar ? (
                                <Avatar
                                  size="small"
                                  source={user?.avatar_url ? { uri: user.avatar_url } : undefined}
                                  fallback={user?.fname + ' ' + user?.lname}
                                />
                              ) : (
                                <View style={{ width: 32 }} />
                              )}
                            </View>
                          )}
                        </View>
                        
                        {/* Actions sur le message (long press) */}
                        <View style={[
                          layoutStyles.row,
                          { 
                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                            marginTop: spacing[1],
                            opacity: 0.7
                          }
                        ]}>
                          <TouchableOpacity 
                            onPress={() => replyToMessage(message)}
                            style={{ marginHorizontal: spacing[1] }}
                          >
                            <Text variant="caption" color="secondary">Répondre</Text>
                          </TouchableOpacity>
                          
                          {isOwnMessage && (
                            <>
                              <TouchableOpacity 
                                onPress={() => editMessage(message.id)}
                                style={{ marginHorizontal: spacing[1] }}
                              >
                                <Text variant="caption" color="secondary">Modifier</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                onPress={() => deleteMessage(message.id)}
                                style={{ marginHorizontal: spacing[1] }}
                              >
                                <Text variant="caption" color="error">Supprimer</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Zone de réponse */}
        {replyingTo && (
          <View style={{
            backgroundColor: theme.backgroundSecondary,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[2],
            borderTopWidth: 1,
            borderTopColor: theme.border
          }}>
            <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="secondary">
                  Répondre à {replyingTo.username}
                </Text>
                <Text variant="body" numberOfLines={1} style={{ marginTop: spacing[1] }}>
                  {replyingTo.message}
                </Text>
              </View>
              <TouchableOpacity onPress={cancelReply}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Zone de saisie */}
        <View style={{
          backgroundColor: theme.background,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderTopWidth: 1,
          borderTopColor: theme.border
        }}>
          <View style={[layoutStyles.row, { alignItems: 'flex-end' }]}>
            <View style={{
              flex: 1,
              backgroundColor: theme.backgroundSecondary,
              borderRadius: 20,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
              marginRight: spacing[2],
              maxHeight: 100
            }}>
              <TextInput
                ref={inputRef}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Tapez votre message..."
                placeholderTextColor={theme.textSecondary}
                multiline
                style={{
                  color: theme.text,
                  fontSize: 16,
                  lineHeight: 20,
                  minHeight: 20,
                  maxHeight: 80
                }}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
            </View>
            
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim() || sending}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: newMessage.trim() ? theme.primary : theme.border,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {sending ? (
                <Ionicons name="hourglass" size={20} color="white" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
