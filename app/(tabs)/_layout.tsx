import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../contexts/ThemeContext";
import { KeyboardAvoidingView, Platform } from 'react-native';
import BottomBar from '../../components/ui/BottomBar';
import Debugger from '../../components/Debugger';
import DevNavigator from '../../components/DevNavigator';
import { createThemedStyles, layoutStyles } from "../../styles";
import '../../services/LoggerService';
import React from 'react';

// Suppression du double ThemeProvider
export default function TabsLayout() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const pathname = usePathname();
  
  // Masquer la BottomBar pour les pages d'événements individuels
  const shouldHideBottomBar = pathname.includes('/events/') && pathname.split('/').length > 3;
  
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
        <DevNavigator isVisible={true} />
      </KeyboardAvoidingView>
      {!shouldHideBottomBar && <BottomBar />}
    </SafeAreaView>
  );
}
