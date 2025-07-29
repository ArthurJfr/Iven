import { Slot, Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { KeyboardAvoidingView } from 'react-native';
import BottomBar from '../components/ui/BottomBar';
import Debugger from '../components/Debugger';
import '../services/LoggerService'; // Initialiser le service de logs
import React from 'react'; // Added missing import for React

// Ce composant utilise le contexte
function ThemedLayout() {
  const { theme } = useTheme();
  
  // Log au démarrage de l'app
  React.useEffect(() => {
    console.log('🚀 Application Iven démarrée');
    console.info('📱 Plateforme: React Native + Expo');
    console.info('🎨 Thème actuel:', theme.background === '#fff' ? 'Light' : 'Dark');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Slot
            screenOptions={{
            headerShown: false,
            }}
        />
        <Debugger isDebugMode={false} />
      </KeyboardAvoidingView>
      <BottomBar />
    </SafeAreaView>
  );
}

// Le provider englobe tout
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
}
