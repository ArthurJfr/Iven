import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Text from "../ui/atoms/Text";
import Avatar from "../ui/atoms/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();

  const menuItems = [
    { icon: 'person-outline', title: 'Modifier le profil', href: '/modals/edit-profile' },
    { icon: 'settings-outline', title: 'Paramètres', href: '/profile/settings' },
    { icon: 'notifications-outline', title: 'Notifications', href: '/notifications' },
    { icon: 'help-circle-outline', title: 'Aide & Support', href: '/help' },
    { icon: 'log-out-outline', title: 'Déconnexion', href: '/auth/login', color: theme.error },
  ];

  return (
    <View style={[layoutStyles.container, themedStyles.surface]}>
      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ padding: spacing[5] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profil */}
        <View style={{ alignItems: 'center', marginBottom: spacing[8], marginTop: spacing[8] }}>
          <View style={{ marginBottom: spacing[4] }}>
            <Avatar size="xlarge" fallback="JD" />
          </View>
          <Text variant="h2" weight="bold">John Doe</Text>
          <Text variant="body" color="secondary">john.doe@example.com</Text>
        </View>

        {/* Statistiques */}
        <View style={{ 
          flexDirection: 'row', 
          marginBottom: spacing[8],
          backgroundColor: theme.backgroundSecondary,
          padding: spacing[4],
          borderRadius: 12,
          gap: spacing[4]
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text variant="h3" weight="bold" color="primary">12</Text>
            <Text variant="caption" color="secondary">Événements</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text variant="h3" weight="bold" color="success">28</Text>
            <Text variant="caption" color="secondary">Participations</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text variant="h3" weight="bold" color="warning">45</Text>
            <Text variant="caption" color="secondary">Tâches</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={{ gap: spacing[1] }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing[4],
                backgroundColor: theme.backgroundSecondary,
                borderRadius: 8,
              }}
              onPress={() => router.push(item.href as any)}
            >
              <Ionicons 
                name={item.icon as any} 
                size={22} 
                color={item.color || theme.textSecondary}
                style={{ marginRight: spacing[4] }}
              />
              <Text 
                variant="body" 
                style={{ 
                  flex: 1, 
                  color: item.color || theme.text 
                }}
              >
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}