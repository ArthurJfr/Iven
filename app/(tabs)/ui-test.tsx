import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../styles';
import { 
  Header, 
  Card, 
  Button, 
  Input, 
  Text, 
  Avatar, 
  Badge, 
  Divider,
  Spinner,
  SearchBar,
  EmptyState,
  LoadingOverlay,
  ProgressBar,
  EventCard,
  TaskCard,
  EventsTopBar,
  TopBar,
  BottomBar,
  AccountActivationBanner,
  ToggleTheme,
  ErrorText
} from '../../components/ui';

export default function UITestScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);

  const mockEvent = {
    id: 1,
    owner_id: 1,
    title: "Événement de test",
    description: "Description de l'événement de test",
    start_date: "2024-01-15T10:00:00Z",
    end_date: "2024-01-15T18:00:00Z",
    location: "Paris, France",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    participants: []
  };

  const mockTask = {
    id: 1,
    title: "Tâche de test",
    description: "Description de la tâche de test",
    owner_id: 1,
    event_id: 1,
    validated_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Test des Composants UI" />
      
      <ScrollView style={{ flex: 1, padding: spacing[4] }}>
        <Text variant="h1" style={{ marginBottom: spacing[6], textAlign: 'center' }}>
          🎨 Composants UI
        </Text>

        {/* Composants de base */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>Composants de base (Atoms)</Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Text</Text>
            <Text variant="h1">Titre H1</Text>
            <Text variant="h2">Titre H2</Text>
            <Text variant="h3">Titre H3</Text>
            <Text variant="body">Texte normal</Text>
            <Text variant="small" color="secondary">Texte petit secondaire</Text>
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Avatar</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <Avatar size="small" source={{ uri: 'https://via.placeholder.com/40' }} />
              <Avatar size="medium" source={{ uri: 'https://via.placeholder.com/60' }} />
              <Avatar size="large" source={{ uri: 'https://via.placeholder.com/80' }} />
            </View>
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Badge</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <Badge text="Succès" color="green" />
              <Badge text="Attention" color="orange" />
              <Badge text="Erreur" color="red" />
            </View>
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Spinner</Text>
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
            </View>
          </View>

          <Divider spacing="medium" />
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Divider</Text>
            <Divider spacing="small" />
            <Divider spacing="medium" />
            <Divider spacing="large" />
            <View style={{ height: 40, flexDirection: 'row', alignItems: 'center' }}>
              <Text>Gauche</Text>
              <Divider orientation="vertical" spacing="medium" />
              <Text>Droite</Text>
            </View>
          </View>
        </Card>

        {/* Composants composés */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>Composants composés (Molecules)</Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">SearchBar</Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher..."
              onSearch={() => console.log('Recherche:', searchQuery)}
            />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">EmptyState</Text>
            <EmptyState
              icon="document-outline"
              title="Aucun élément trouvé"
              description="Essayez de modifier vos critères de recherche"
              actionButton={{
                text: "Créer un élément",
                onPress: () => console.log('Créer'),
                icon: "add"
              }}
            />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">ProgressBar</Text>
            <ProgressBar
              currentStep={currentStep}
              totalSteps={5}
              showLabel={true}
              showPercentage={true}
              height={8}
            />
            <Button
              title="Progression +1"
              onPress={() => setCurrentStep(Math.min(currentStep + 1, 5))}
              style={{ marginTop: spacing[2] }}
            />
          </View>
        </Card>

        {/* Composants complexes */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>Composants complexes (Organisms)</Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">EventCard</Text>
            <EventCard event={mockEvent} onPress={() => console.log('Event press')} />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">TaskCard</Text>
            <TaskCard task={mockTask} onPress={() => console.log('Task press')} />
          </View>
        </Card>

        {/* Composants spécifiques */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>Composants spécifiques</Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Button</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
              <Button title="Primaire" onPress={() => {}} />
              <Button title="Secondaire" variant="outline" onPress={() => {}} />
              <Button title="Désactivé" disabled onPress={() => {}} />
            </View>
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">Input</Text>
            <Input
              label="Email"
              placeholder="votre@email.com"
              keyboardType="email-address"
            />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">ToggleTheme</Text>
            <ToggleTheme />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">ErrorText</Text>
            <ErrorText>Ceci est un message d'erreur</ErrorText>
          </View>
        </Card>

        {/* Composants de navigation */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>Composants de navigation</Text>
          
          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">TopBar</Text>
            <TopBar
              title="Titre de la page"
              showBackButton={true}
              onBackPress={() => console.log('Back press')}
              rightAction={{
                icon: "menu",
                onPress: () => console.log('Right press'),
                label: "Menu"
              }}
            />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">EventsTopBar</Text>
            <EventsTopBar
              title="Événements"
              onCreatePress={() => console.log('Add event')}
              onFilterPress={() => console.log('Filter')}
            />
          </View>

          <View style={{ marginBottom: spacing[3] }}>
            <Text variant="h3">AccountActivationBanner</Text>
            <AccountActivationBanner
              email="test@example.com"
              onActivatePress={() => console.log('Activate account')}
            />
          </View>
        </Card>

        {/* Test LoadingOverlay */}
        <Card variant="elevated" padding="large" style={{ marginBottom: spacing[4] }}>
          <Text variant="h2" style={{ marginBottom: spacing[3] }}>LoadingOverlay</Text>
          <Button
            title="Afficher Loading"
            onPress={() => setShowLoading(true)}
          />
          <LoadingOverlay
            visible={showLoading}
            message="Chargement en cours..."
            fullScreen={false}
          />
          {showLoading && (
            <Button
              title="Masquer Loading"
              onPress={() => setShowLoading(false)}
              style={{ marginTop: spacing[2] }}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}