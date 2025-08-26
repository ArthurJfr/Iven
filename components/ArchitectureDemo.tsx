import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../styles';
import { spacing } from '../styles';

// Import depuis la nouvelle architecture
import { PageLayout, TabLayout, ModalLayout } from './ui/templates';
import { Button, Card, Text, Avatar, Badge } from './ui';
import { EventCard, EventsTopBar } from './features/events';
import { TaskCard } from './features/tasks';
import { AccountActivationBanner } from './features/auth';
import { LoadingOverlay, EmptyState, SearchBar } from './shared';

export default function ArchitectureDemo() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [showModal, setShowModal] = React.useState(false);

  const tabs = [
    {
      id: 'ui',
      title: 'Composants UI',
      content: (
        <View style={{ gap: spacing[4] }}>
          <Text variant="h2" weight="bold">Composants de Base</Text>
          
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <Button title="Primaire" variant="primary" />
            <Button title="Secondaire" variant="secondary" />
            <Button title="Outline" variant="outline" />
          </View>

          <Card>
            <Text variant="body">Carte avec contenu</Text>
          </Card>

          <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
            <Avatar size="large" />
            <Badge label="Nouveau" variant="success" />
            <Badge label="En cours" variant="warning" />
          </View>
        </View>
      ),
    },
    {
      id: 'features',
      title: 'Fonctionnalités',
      content: (
        <View style={{ gap: spacing[4] }}>
          <Text variant="h2" weight="bold">Composants Métier</Text>
          
          <EventCard
            event={{
              id: '1',
              title: 'Événement de démonstration',
              description: 'Cet événement montre l\'utilisation des composants',
              startDate: new Date(),
              endDate: new Date(),
              location: 'Paris',
              participants: [],
              category: 'Démo',
            }}
            onPress={() => {}}
          />

          <TaskCard
            task={{
              id: '1',
              title: 'Tâche de démonstration',
              description: 'Cette tâche montre l\'utilisation des composants',
              status: 'pending',
              priority: 'medium',
              dueDate: new Date(),
              assignedTo: null,
            }}
            onPress={() => {}}
          />
        </View>
      ),
    },
    {
      id: 'templates',
      title: 'Templates',
      content: (
        <View style={{ gap: spacing[4] }}>
          <Text variant="h2" weight="bold">Templates de Layout</Text>
          
          <Button 
            title="Ouvrir Modale" 
            onPress={() => setShowModal(true)} 
          />

          <Text variant="body">
            Utilisez les templates pour créer des layouts cohérents dans toute l'application.
          </Text>
        </View>
      ),
    },
  ];

  return (
    <PageLayout title="Démonstration Architecture" padding={false}>
      <TabLayout tabs={tabs} defaultTab="ui" />
      
      <ModalLayout
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Exemple de Modale"
      >
        <View style={{ gap: spacing[4] }}>
          <Text variant="body">
            Cette modale utilise le template ModalLayout pour une présentation cohérente.
          </Text>
          
          <Button 
            title="Fermer" 
            variant="secondary" 
            onPress={() => setShowModal(false)} 
          />
        </View>
      </ModalLayout>
    </PageLayout>
  );
}
