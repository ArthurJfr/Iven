import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

// Import des composants
import Text from '../../components/ui/atoms/Text';
import Avatar from '../../components/ui/atoms/Avatar';
import Badge from '../../components/ui/atoms/Badge';
import Spinner from '../../components/ui/atoms/Spinner';
import Divider from '../../components/ui/atoms/Divider';
import SearchBar from '../../components/ui/molecules/SearchBar';
import EmptyState from '../../components/ui/molecules/EmptyState';
import LoadingOverlay from '../../components/ui/molecules/LoadingOverlay';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ErrorText from '../../components/ui/ErrorText';
import ToggleTheme from '../../components/ui/ToggleTheme';

export default function UITestScreen() {
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" weight="bold">
            UI Components
          </Text>
          <Text variant="body" color="secondary">
            Showcase de tous les composants disponibles
          </Text>
        </View>

        {/* Typography */}
        <Section title="Typography">
          <Text variant="h1" weight="bold">Heading 1 - Bold</Text>
          <Text variant="h2" weight="semibold">Heading 2 - Semibold</Text>
          <Text variant="h3" weight="medium">Heading 3 - Medium</Text>
          <Text variant="body">Body text normal</Text>
          <Text variant="caption" color="secondary">Caption text secondary</Text>
          <Text variant="small" color="primary">Small text primary</Text>
          <View style={styles.row}>
            <Text variant="body" color="success">Success</Text>
            <Text variant="body" color="warning">Warning</Text>
            <Text variant="body" color="error">Error</Text>
          </View>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <View style={styles.buttonGroup}>
            <Button title="Primary Button" variant="primary" />
            <Button title="Secondary Button" variant="secondary" />
            <Button title="Disabled Button" disabled />
          </View>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <Input
            label="Label avec placeholder"
            placeholder="Entrez votre texte..."
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Input
            label="Champ requis"
            placeholder="Ce champ est obligatoire"
            required
          />
          <Input
            placeholder="Sans label"
          />
          <ErrorText>Ceci est un message d'erreur</ErrorText>
        </Section>

        {/* Search Bar */}
        <Section title="Search Bar">
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher quelque chose..."
            onClear={() => setSearchText('')}
          />
        </Section>

        {/* Avatars */}
        <Section title="Avatars">
          <View style={styles.avatarGroup}>
            <Avatar size="small" fallback="S" />
            <Avatar size="medium" fallback="M" online />
            <Avatar size="large" fallback="L" />
            <Avatar size="xlarge" fallback="XL" online />
          </View>
          <View style={styles.avatarGroup}>
            <Avatar 
              size="medium" 
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
            />
            <Avatar 
              size="medium" 
              source={{ uri: 'https://i.pravatar.cc/150?img=2' }} 
              online 
            />
            <Avatar size="medium" />
          </View>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <View style={styles.badgeGroup}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </View>
          <View style={styles.badgeGroup}>
            <Badge variant="primary" size="small">Small</Badge>
            <Badge variant="success" size="medium">Medium</Badge>
          </View>
        </Section>

        {/* Spinners */}
        <Section title="Spinners">
          <View style={styles.spinnerGroup}>
            <View style={styles.spinnerContainer}>
              <Spinner size="small" />
              <Text variant="caption">Small</Text>
            </View>
            <View style={styles.spinnerContainer}>
              <Spinner size="medium" />
              <Text variant="caption">Medium</Text>
            </View>
            <View style={styles.spinnerContainer}>
              <Spinner size="large" />
              <Text variant="caption">Large</Text>
            </View>
            <View style={styles.spinnerContainer}>
              <Spinner size="medium" color="#FF3B30" />
              <Text variant="caption">Custom Color</Text>
            </View>
          </View>
        </Section>

        {/* Dividers */}
        <Section title="Dividers">
          <Text variant="body">Texte au-dessus</Text>
          <Divider spacing="small" />
          <Text variant="body">Texte au milieu</Text>
          <Divider spacing="medium" />
          <Text variant="body">Texte au-dessous</Text>
          <Divider spacing="large" />
          <Text variant="body">Après grand divider</Text>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <Card>
            <Text variant="h3" weight="semibold">Titre de la carte</Text>
            <Text variant="body" color="secondary">
              Contenu de la carte avec du texte descriptif.
            </Text>
            <View style={styles.cardActions}>
              <Button title="Action" variant="primary" />
              <Button title="Annuler" variant="secondary" />
            </View>
          </Card>
        </Section>

        {/* Theme Toggle */}
        <Section title="Theme Toggle">
          <ToggleTheme />
        </Section>

        {/* Loading Overlay */}
        <Section title="Loading Overlay">
          <Button
            title={showLoading ? "Masquer Loading" : "Afficher Loading"}
            onPress={() => setShowLoading(!showLoading)}
          />
          <LoadingOverlay 
            visible={showLoading} 
            message="Chargement en cours..." 
          />
        </Section>

        {/* Empty State */}
        <Section title="Empty State">
          <EmptyState
            icon="document-text-outline"
            title="Aucun élément"
            description="Il n'y a rien à afficher pour le moment."
            actionLabel="Créer un élément"
            onAction={() => alert('Action déclenchée!')}
          />
        </Section>

        {/* Spacing bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonGroup: {
    gap: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  spinnerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
}); 