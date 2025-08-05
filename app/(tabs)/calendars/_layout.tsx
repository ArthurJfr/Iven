import { Stack } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native";

export default function CalendarsLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false, // Masquer le header par défaut pour utiliser notre TopBar
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
     / >
      
    </SafeAreaView>
  );
}