import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles } from '../../styles';

export default function AuthLayout() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: [
          themedStyles.surface,
          { flex: 1 }
        ],
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Connexion',
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: 'Inscription',
        }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          title: 'Mot de passe oublié',
        }}
      />
      <Stack.Screen 
        name="confirm-account" 
        options={{
          title: 'Confirmation du compte',
        }}
      />
    </Stack>
  );
}
