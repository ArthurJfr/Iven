import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { createThemedStyles } from '../styles';
import AuthInitializer from '../components/AuthInitializer';

function RootStack() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaProvider >
      <AuthInitializer>
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
      </AuthInitializer>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
