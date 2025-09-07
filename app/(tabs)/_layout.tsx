import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../contexts/ThemeContext";
import { KeyboardAvoidingView, Platform } from 'react-native';
import BottomBar from '../../components/ui/BottomBar';

import { createThemedStyles, layoutStyles } from "../../styles";
import '../../services/LoggerService';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Suppression du double ThemeProvider
export default function TabsLayout() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const themedStyles = createThemedStyles(theme);
  const pathname = usePathname();
  
  // Masquer la BottomBar pour les pages d'événements individuels
  const shouldHideBottomBar = pathname.includes('/events/') && pathname.split('/').length > 3;
  
  // Log au démarrage de l'app
  React.useEffect(() => {
    console.log('🚀 Application Iven démarrée');
    console.info('📱 Plateforme: React Native + Expo');
    console.info('🎨 Thème actuel:', theme.background);
    console.info('🔐 État authentification:', isAuthenticated ? 'Connecté' : 'Non connecté');
    if (user) {
      console.info('👤 Utilisateur:', user.username);
    }
  }, [theme, isAuthenticated, user]);

  // (retiré) appel healthCheckProtected

  return (
    <SafeAreaView style={[
      layoutStyles.container, 
      { backgroundColor: 'transparent' }
    ]}>
      <KeyboardAvoidingView 
        style={layoutStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Slot />
      </KeyboardAvoidingView>
      {!shouldHideBottomBar && <BottomBar />}
    </SafeAreaView>
  );
}
