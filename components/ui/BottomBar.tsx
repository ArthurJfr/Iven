import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";

interface TabItem {
  name: string;
  icon: keyof typeof Feather.glyphMap;
  href: string;
}

const tabs: TabItem[] = [
  { name: "Accueil", icon: "home", href: "/" },
  { name: "Événements", icon: "map-pin", href: "/events/allevents" },
  { name: "Calendrier", icon: "calendar", href: "/calendars/calendar" },
  { name: "Settings", icon: "settings", href: "/settings" },
];

export default function BottomBar() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const pathname = usePathname();

  return (
    <View style={localStyles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.name} href={tab.href} asChild>
            <TouchableOpacity style={localStyles.tab}>
              <Feather
                name={tab.icon}
                size={24}
                color={isActive ? theme.primary : theme.text}
              />
              <Text style={[
                localStyles.tabText,
                { color: isActive ? theme.primary : theme.text }
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
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingTop: 16,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
}); 