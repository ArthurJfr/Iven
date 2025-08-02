import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../styles';

function RootStack() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: [
            themedStyles.surface,
            { flex: 1 }
          ],
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
