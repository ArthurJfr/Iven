import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, layoutStyles, spacing } from "../../styles";
import Text from "../ui/atoms/Text";
import ToggleTheme from "../ui/ToggleTheme";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const settingSections = [
    {
      title: "Apparence",
      items: [
        { 
          icon: 'color-palette-outline', 
          title: 'Thème', 
          subtitle: 'Clair ou sombre',
          component: <ToggleTheme />
        },
      ]
    },
    {
      title: "Notifications",
      items: [
        { 
          icon: 'notifications-outline', 
          title: 'Notifications push', 
          subtitle: 'Recevoir des notifications',
          component: null
        },
        { 
          icon: 'mail-outline', 
          title: 'Notifications email', 
          subtitle: 'Recevoir des emails',
          component: null
        },
      ]
    },
    {
      title: "Confidentialité",
      items: [
        { 
          icon: 'lock-closed-outline', 
          title: 'Profil privé', 
          subtitle: 'Masquer votre profil',
          component: null
        },
        { 
          icon: 'eye-off-outline', 
          title: 'Statut en ligne', 
          subtitle: 'Afficher votre présence',
          component: null
        },
      ]
    }
  ];

  return (
    <View style={[layoutStyles.container, themedStyles.surface]}>
      <ScrollView 
        style={layoutStyles.container}
        contentContainerStyle={{ padding: spacing[5] }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" weight="bold" style={{ marginBottom: spacing[8], marginTop: spacing[8] }}>
          Paramètres
        </Text>

        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: spacing[6] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
              {section.title}
            </Text>
            
            <View style={{ 
              backgroundColor: theme.backgroundSecondary,
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing[4],
                    borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={theme.textSecondary}
                    style={{ marginRight: spacing[4] }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="medium">
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
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}