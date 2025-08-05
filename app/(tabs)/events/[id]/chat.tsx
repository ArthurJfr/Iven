import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'system';
}

export default function EventChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Salut tout le monde ! Comment ça va ?",
      sender: "Marie",
      timestamp: "14:30",
      type: 'text'
    },
    {
      id: 2,
      text: "Ça va bien ! J'ai hâte de voir tout le monde",
      sender: "Jean",
      timestamp: "14:32",
      type: 'text'
    },
    {
      id: 3,
      text: "Sophie a rejoint le chat",
      sender: "Système",
      timestamp: "14:35",
      type: 'system'
    },
    {
      id: 4,
      text: "Salut ! J'ai apporté le gâteau, il est magnifique",
      sender: "Sophie",
      timestamp: "14:36",
      type: 'text'
    },
    {
      id: 5,
      text: "Parfait ! J'ai fini les décorations",
      sender: "Marie",
      timestamp: "14:38",
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }

    const message: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "Moi",
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const deleteMessage = (messageId: number) => {
    Alert.alert(
      'Supprimer le message',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => setMessages(messages.filter(msg => msg.id !== messageId))
        }
      ]
    );
  };

  const formatTime = (time: string) => {
    return time;
  };

  const isMyMessage = (sender: string) => {
    return sender === "Moi";
  };

  const getMessageStyle = (message: Message) => {
    if (message.type === 'system') {
      return styles.systemMessage;
    }
    return isMyMessage(message.sender) ? styles.myMessage : styles.otherMessage;
  };

  const getMessageContainerStyle = (message: Message) => {
    if (message.type === 'system') {
      return styles.systemContainer;
    }
    return isMyMessage(message.sender) ? styles.myMessageContainer : styles.otherMessageContainer;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chat de l'événement</Text>
        <Text style={styles.participants}>3 participants</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={getMessageContainerStyle(message)}>
            {message.type === 'system' ? (
              <View style={styles.systemMessage}>
                <Text style={styles.systemText}>{message.text}</Text>
                <Text style={styles.systemTime}>{formatTime(message.timestamp)}</Text>
              </View>
            ) : (
              <View style={getMessageStyle(message)}>
                {!isMyMessage(message.sender) && (
                  <Text style={styles.senderName}>{message.sender}</Text>
                )}
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{message.text}</Text>
                  <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                </View>
                {isMyMessage(message.sender) && (
                  <TouchableOpacity 
                    style={styles.deleteMessageButton}
                    onPress={() => deleteMessage(message.id)}
                  >
                    <Text style={styles.deleteMessageText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
        
        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>Marie tape...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tapez votre message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={[
              styles.sendButtonText,
              !newMessage.trim() && styles.sendButtonTextDisabled
            ]}>
              Envoyer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  participants: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessage: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: '80%',
  },
  systemText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  systemTime: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  myMessage: {
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  otherMessage: {
    maxWidth: '80%',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  deleteMessageButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteMessageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sendButtonTextDisabled: {
    color: '#9CA3AF',
  },
}); 