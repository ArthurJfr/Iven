import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { KeyboardAvoidingView, Platform } from 'react-native';
import BottomBar from '../../components/ui/BottomBar';
import Debugger from '../../components/Debugger';
import { createThemedStyles, layoutStyles } from "../../styles";
import '../../services/LoggerService';
import React from 'react';

// Ce composant utilise le contexte
function ThemedLayout() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  // Log au démarrage de l'app
  React.useEffect(() => {
    console.log('🚀 Application Iven démarrée');
    console.info('📱 Plateforme: React Native + Expo');
    console.info('🎨 Thème actuel:', theme.background);
  }, [theme]);

  return (
    <SafeAreaView style={[
      layoutStyles.container, 
      themedStyles.surface
    ]}>
      <KeyboardAvoidingView 
        style={layoutStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Slot />
        <Debugger isDebugMode={false} />
      </KeyboardAvoidingView>
      <BottomBar />
    </SafeAreaView>
  );
}

// Le provider englobe tout
export default function TabsLayout() {
  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
}
