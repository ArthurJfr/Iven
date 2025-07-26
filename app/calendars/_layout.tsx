import { Stack } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import Debugger from "../../components/Debugger";

export default function CalendarsLayout() {
  const { theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false, // Masquer le header par défaut pour utiliser notre TopBar
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="calendar"
          options={{
            title: "Calendrier",
          }}
        />
      </Stack>
      <Debugger isDebugMode={false} />
    </>
  );
}