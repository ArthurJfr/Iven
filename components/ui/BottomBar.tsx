import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles, spacing } from "../../styles";
import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";

interface TabItem {
  name: string;
  icon: keyof typeof Feather.glyphMap;
  href: string;
}

const tabs: TabItem[] = [
  { name: "Accueil", icon: "home", href: "/" },
  { name: "Événements", icon: "calendar", href: "/events" },
  { name: "Calendrier", icon: "clock", href: "/calendars" },
  { name: "Profil", icon: "user", href: "/profile" },
];

export default function BottomBar() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const pathname = usePathname();

  return (
    <View style={[
      localStyles.container, 
      { backgroundColor: theme.background, borderTopColor: theme.border }
    ]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || 
          (tab.href !== "/" && pathname.startsWith(tab.href));
        
        return (
          <Link key={tab.name} href={tab.href} asChild>
            <TouchableOpacity style={localStyles.tab}>
              <Feather
                name={tab.icon}
                size={22}
                color={isActive ? theme.primary : theme.textSecondary}
              />
              <Text style={[
                localStyles.tabText,
                { color: isActive ? theme.primary : theme.textSecondary }
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
}); 