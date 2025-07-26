import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import { User } from "../../types/users";
import usersData from "../../data/users.json";
import Card from "../../components/ui/Card";
import TopBar from "../../components/ui/TopBar";
import { Ionicons } from '@expo/vector-icons';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  // Recherche de l'utilisateur correspondant
  const user: User | undefined = (usersData as User[]).find(u => u.id === id);

  if (!user) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.titleLg, { color: theme.text, marginBottom: 8 }]}>Utilisateur introuvable</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Aucun utilisateur ne correspond à cet identifiant.</Text>
      </View>
    );
  }

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin':
        return '#ef4444';
      case 'organizer':
        return '#3b82f6';
      case 'participant':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getRoleText = () => {
    switch (user.role) {
      case 'admin':
        return 'Administrateur';
      case 'organizer':
        return 'Organisateur';
      case 'participant':
        return 'Participant';
      default:
        return 'Observateur';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopBar 
        title="Profil utilisateur"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
          <View style={localStyles.header}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={localStyles.avatar} />
            ) : (
              <View style={[localStyles.avatar, { backgroundColor: theme.primary }]}>
                <Ionicons name="person" size={32} color="#ffffff" />
              </View>
            )}
            <View style={localStyles.userInfo}>
              <Text style={[styles.titleLg, { marginBottom: 4 }]}>{user.name}</Text>
              <View style={[localStyles.roleBadge, { backgroundColor: getRoleColor() }]}>
                <Text style={localStyles.roleText}>{getRoleText()}</Text>
              </View>
            </View>
          </View>
          
          <View style={localStyles.row}>
            <Ionicons name="mail" size={18} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={styles.textMd}>{user.email}</Text>
          </View>
          
          {user.phone && (
            <View style={localStyles.row}>
              <Ionicons name="call" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>{user.phone}</Text>
            </View>
          )}
          
          {user.bio && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.titleSm, { marginBottom: 4 }]}>Biographie</Text>
              <Text style={styles.textSm}>{user.bio}</Text>
            </View>
          )}
          
          <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={localStyles.row}>
              <Ionicons name="calendar" size={16} color={theme.secondary} style={{ marginRight: 4 }} />
              <Text style={styles.textSm}>Membre depuis {user.createdAt}</Text>
            </View>
            {user.lastSeen && (
              <View style={localStyles.row}>
                <Ionicons name="time" size={16} color={theme.secondary} style={{ marginRight: 4 }} />
                <Text style={styles.textSm}>Dernière connexion {user.lastSeen}</Text>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
}); 