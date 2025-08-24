import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function EventLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Événement',
        }}
      />
      <Stack.Screen
        name="tasks"
        options={{
          title: 'Tâches',
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          title: 'Budget',
        }}
      />
      <Stack.Screen
        name="media"
        options={{
          title: 'Médias',
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: 'Chat',
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          title: 'Gérer',
        }}
      />
      <Stack.Screen
        name="participants"
        options={{
          title: 'Participants',
        }}
      />
    </Stack>
  );
} 