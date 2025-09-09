import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { TaskProvider } from '../contexts/TaskContext';
import { EventProvider } from '../contexts/EventContext';
import { NotificationProvider } from '../contexts/NotificationContext';
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
  SplashScreen.preventAutoHideAsync();
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <TaskProvider>
            <EventProvider>
              <RootStack />
            </EventProvider>
          </TaskProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
