import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { themedStyles } from "../../../styles/global";
import TopBar from "../../../components/ui/TopBar";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: string;
}

export default function CreateEvent() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EventForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }

    if (!form.date.trim()) {
      Alert.alert('Erreur', 'La date est obligatoire');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'une création d'événement
      console.log('Création d\'événement:', form);
      
      // Attendre un peu pour simuler l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Succès', 
        'Événement créé avec succès !',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler ? Les données seront perdues.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Annuler', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar
        title="Créer un événement"
        showBackButton={true}
        rightAction={{
          icon: 'checkmark',
          onPress: handleSubmit,
          label: 'Créer l\'événement'
        }}
      />
      
      <ScrollView 
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={localStyles.form}>
          <View style={[localStyles.card, { backgroundColor: theme.background, borderColor: '#e5e7eb' }]}>
            <Text style={[localStyles.sectionTitle, { color: theme.text }]}>
              📝 Informations générales
            </Text>
            
            <Input
              label="Titre de l'événement *"
              value={form.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Ex: Soirée d'entreprise"
              required
            />
            
            <Input
              label="Description"
              value={form.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Décrivez votre événement..."
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={[localStyles.card, { backgroundColor: theme.background, borderColor: '#e5e7eb' }]}>
            <Text style={[localStyles.sectionTitle, { color: theme.text }]}>
              📅 Détails pratiques
            </Text>
            
            <View style={localStyles.row}>
              <View style={localStyles.halfWidth}>
                <Input
                  label="Date *"
                  value={form.date}
                  onChangeText={(value) => handleInputChange('date', value)}
                  placeholder="JJ/MM/AAAA"
                  required
                />
              </View>
              <View style={localStyles.halfWidth}>
                <Input
                  label="Heure"
                  value={form.time}
                  onChangeText={(value) => handleInputChange('time', value)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            <Input
              label="📍 Lieu"
              value={form.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Adresse ou lieu"
            />
            
            <Input
              label="👥 Nombre max de participants"
              value={form.maxParticipants}
              onChangeText={(value) => handleInputChange('maxParticipants', value)}
              placeholder="Ex: 50"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={[localStyles.footer, { backgroundColor: theme.background, borderTopColor: '#e5e7eb' }]}>
        <Button
          title="Annuler"
          onPress={handleCancel}
          variant="secondary"
          style={localStyles.footerButton}
        />
        <Button
          title={isSubmitting ? "Création..." : "Créer l'événement"}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={localStyles.footerButton}
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  form: {
    gap: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    gap: 10,
  },
  footerButton: {
    flex: 1,
  },
});