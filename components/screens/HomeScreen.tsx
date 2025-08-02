import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Text from "../ui/atoms/Text";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const router = useRouter();

  const quickActions = [
    { 
      icon: "add-circle", 
      title: "Créer un événement", 
      subtitle: "Organisez votre prochain événement",
      action: () => router.push('/modals/create-event'),
      color: theme.primary
    },
    { 
      icon: "calendar", 
      title: "Mes événements", 
      subtitle: "Voir tous vos événements",
      action: () => router.push('/events'),
      color: theme.success
    },
    { 
      icon: "people", 
      title: "Inviter des amis", 
      subtitle: "Partagez Iven avec vos proches",
      action: () => router.push('/modals/invite-participants'),
      color: theme.warning
    },
  ];

  return (
    <View style={[layoutStyles.container, themedStyles.surface]}>
      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ padding: spacing[5] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing[8], marginTop: spacing[8] }}>
          <Text variant="h1" weight="bold">
            Bienvenue sur Iven
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: spacing[2] }}>
            Organisez et gérez vos événements facilement
          </Text>
        </View>

        {/* Actions rapides */}
        <View style={{ gap: spacing[4] }}>
          <Text variant="h3" weight="semibold">
            Actions rapides
          </Text>
          
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {
                  backgroundColor: theme.backgroundSecondary,
                  padding: spacing[4],
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                },
                themedStyles.border
              ]}
              onPress={action.action}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: action.color + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing[4]
              }}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="semibold">
                  {action.title}
                </Text>
                <Text variant="caption" color="secondary">
                  {action.subtitle}
                </Text>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}