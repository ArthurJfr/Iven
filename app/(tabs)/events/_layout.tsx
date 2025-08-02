import { Stack } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import Debugger from "../../../components/Debugger";

export default function EventsLayout() {
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
          name="events"
          options={{
            title: "Événements",
          }}
        />
      </Stack>
      <Debugger isDebugMode={false} />
    </>
  );
}