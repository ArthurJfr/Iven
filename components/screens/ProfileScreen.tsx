import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/atoms/Avatar';
import ToggleTheme from '../../components/ui/ToggleTheme';
import Header from '../../components/ui/organisms/Header';
import ProtectedRoute from '../ProtectedRoute';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await logout();
            console.log('👋 Utilisateur déconnecté depuis ProfileScreen');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: "Préférences",
      items: [
        { 
          icon: 'color-palette-outline', 
          title: 'Thème', 
          subtitle: 'Clair ou sombre',
          component: <ToggleTheme />
        },
        { 
          icon: 'notifications-outline', 
          title: 'Notifications push', 
          subtitle: 'Recevoir des alertes',
          action: () => {},
          component: null
        },
        { 
          icon: 'mail-outline', 
          title: 'Notifications email', 
          subtitle: 'Recevoir des emails',
          action: () => {},
          component: null
        },
      ]
    },
    {
      title: "Confidentialité & Sécurité",
      items: [
        { 
          icon: 'lock-closed-outline', 
          title: 'Profil privé', 
          subtitle: 'Contrôler la visibilité',
          action: () => {},
          component: null
        },
        { 
          icon: 'eye-off-outline', 
          title: 'Statut en ligne', 
          subtitle: 'Afficher votre présence',
          action: () => {},
          component: null
        },
      ]
    },
    {
      title: "Support & Informations",
      items: [
        { 
          icon: 'help-circle-outline', 
          title: 'Centre d\'aide', 
          subtitle: 'FAQ et assistance',
          action: () => {},
          component: null
        },
        { 
          icon: 'information-circle-outline', 
          title: 'À propos d\'Iven', 
          subtitle: 'Version 1.0.0',
          action: () => {},
          component: null
        }
      ]
    }
  ];

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={[layoutStyles.container, themedStyles.surface]}>
        <Header 
          title="Mon profil"
        />
      
      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Profile Section */}
        <View style={{ 
          paddingHorizontal: spacing[5], 
          paddingTop: spacing[2],
          paddingBottom: spacing[6] 
        }}>
          <Card variant="elevated" padding="large">
            {/* Avatar et infos principales - Layout horizontal */}
            <View>
              {/* Header avec avatar à gauche et noms à droite */}
              <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[5] }]}>
                <Avatar
                  size="xlarge"
                  source={user?.avatar ? { uri: user.avatar } : undefined}
                  fallbackIcon="person"
                  style={{ marginRight: spacing[5] }}
                />
                <View style={{ flex: 1 }}>
                  <Text variant="h1" weight="bold" style={{ marginBottom: spacing[1] }}>
                    {user?.fname}
                  </Text>
                  <Text variant="h2" weight="semibold" color="secondary" style={{ marginBottom: spacing[1] }}>
                    {user?.lname}
                  </Text>
                  <View style={[layoutStyles.row, { alignItems: 'center', marginBottom: spacing[2] }]}>
                    <Text variant="caption" color="secondary">
                      @{user?.username}
                    </Text>
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: user?.active ? '#34C759' : '#FF9500',
                      marginLeft: spacing[2]
                    }} />
                    <Text variant="caption" color="secondary" style={{ marginLeft: spacing[1] }}>
                      {user?.active ? 'Vérifié' : 'En attente'}
                    </Text>
                  </View>
                  <Text variant="body" color="secondary">
                    {user?.email}
                  </Text>
                </View>
              </View>

              {/* Bio centrée */}
              <Text variant="body" color="secondary" style={{ 
                textAlign: 'center', 
                marginBottom: spacing[5],
                lineHeight: 20 
              }}>
                {user?.bio}
              </Text>

              {/* Boutons d'actions principales */}
              <View style={[layoutStyles.row, { marginBottom: spacing[6] }]}>
                <TouchableOpacity
                  onPress={() => router.push('/modals/edit-profile')}
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[4],
                      backgroundColor: theme.primary,
                      borderRadius: 25,
                      marginRight: spacing[2]
                    }
                  ]}
                >
                  <Ionicons 
                    name="person-outline" 
                    size={18} 
                    color="white"
                    style={{ marginRight: spacing[2] }}
                  />
                  <Text variant="body" weight="semibold" style={{ color: 'white' }}>
                    Modifier
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/notifications')}
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[4],
                      backgroundColor: theme.backgroundSecondary,
                      borderRadius: 25,
                      marginLeft: spacing[2]
                    }
                  ]}
                >
                  <Ionicons 
                    name="notifications-outline" 
                    size={18} 
                    color={theme.text}
                    style={{ marginRight: spacing[2] }}
                  />
                  <Text variant="body" weight="semibold">
                    Notifications
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={{ 
                width: '100%', 
                height: 1, 
                backgroundColor: theme.border,
                marginBottom: spacing[5] 
              }} />

              {/* Statistiques en grid - reste identique */}
              <View style={{ width: '100%' }}>
                <Text variant="h3" weight="semibold" style={{ 
                  marginBottom: spacing[4],
                  textAlign: 'center' 
                }}>
                  Statistiques
                </Text>
                
                <View style={[layoutStyles.row, { justifyContent: 'space-between' }]}>
                  <View style={[layoutStyles.centerHorizontal, { flex: 1 }]}>
                    <View style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: theme.primary + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: spacing[2]
                    }}>
                      <Text variant="h2" weight="bold" color="primary" style={{ marginBottom: 0 }}>
                        -
                      </Text>
                    </View>
                    <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                      Événements{'\n'}créés
                    </Text>
                  </View>

                  <View style={[layoutStyles.centerHorizontal, { flex: 1 }]}>
                    <View style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: '#34C759' + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: spacing[2]
                    }}>
                      <Text variant="h2" weight="bold" style={{ color: '#34C759', marginBottom: 0 }}>
                        -
                      </Text>
                    </View>
                    <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                      Participations
                    </Text>
                  </View>

                  <View style={[layoutStyles.centerHorizontal, { flex: 1 }]}>
                    <View style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: '#FF9500' + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: spacing[2]
                    }}>
                      <Text variant="h2" weight="bold" style={{ color: '#FF9500', marginBottom: 0 }}>
                        -
                      </Text>
                    </View>
                    <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                      Tâches{'\n'}terminées
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Sections Paramètres avec espacement amélioré */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={{ marginBottom: spacing[5] }}>
              <Text variant="h3" weight="semibold" style={{ 
                marginBottom: spacing[3],
                marginLeft: spacing[1] 
              }}>
                {section.title}
              </Text>
              
              <Card variant="elevated" padding="medium">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={item.action}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: spacing[4],
                      paddingHorizontal: spacing[4],
                      borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                      borderBottomColor: theme.border,
                    }}
                  >
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.backgroundSecondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: spacing[4]
                    }}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color={theme.primary}
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight="semibold" style={{ marginBottom: 2 }}>
                        {item.title}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {item.subtitle}
                      </Text>
                    </View>
                    
                    {item.component || (
                      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    )}
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}
        </View>

        {/* Section Déconnexion - style amélioré */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing[4],
              paddingHorizontal: spacing[5],
              backgroundColor: '#FF3B30' + '10',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#FF3B30' + '30',
            }}
          >
            <Ionicons 
              name="log-out-outline" 
              size={22} 
              color="#FF3B30"
              style={{ marginRight: spacing[3] }}
            />
            <Text variant="body" weight="bold" style={{ color: '#FF3B30' }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    </ProtectedRoute>
  );
}