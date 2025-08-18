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
import { apiService } from '../../services/ApiService';
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

  // Test de la méthode healthCheckProtected
  React.useEffect(() => {
    const testProtectedHealthCheck = async () => {
      if (isAuthenticated) {
        console.log('🧪 Test de healthCheckProtected...');
        try {
          const result = await apiService.healthCheckProtected();
          console.log('✅ Health check protégé:', result);
          
          if (result.success) {
            console.log('🎉 API protégée accessible avec token!');
          } else {
            console.warn('⚠️ Health check protégé échoué:', result.error);
          }
        } catch (error) {
          console.error('💥 Erreur lors du test health check protégé:', error);
        }
      } else {
        console.log('⏭️ Utilisateur non connecté, skip du test health check protégé');
      }
    };

    // Délai pour laisser le temps à l'auth de s'initialiser
    const timer = setTimeout(testProtectedHealthCheck, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

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
        <Debugger isDebugMode={true} />
        <DevNavigator isVisible={true} />
      </KeyboardAvoidingView>
      {!shouldHideBottomBar && <BottomBar />}
    </SafeAreaView>
  );
}
