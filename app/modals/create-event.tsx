import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { useEventContext } from '../../contexts/EventContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DatePicker from '../../components/ui/DatePicker';
import TimePicker from '../../components/ui/TimePicker';
import { eventService } from '../../services/EventService';

const { width } = Dimensions.get('window');

export default function CreateEventModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const { addEvent } = useEventContext(); // Utiliser le contexte pour ajouter l'événement
  const themedStyles = createThemedStyles(theme);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fonction utilitaire pour mettre à jour les champs de manière sécurisée
  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || '' // Assurer qu'on n'a jamais undefined
    }));
  };

  const handleSubmit = async () => {
    // Validation des champs obligatoires
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (titre, dates de début/fin et lieu)');
      return;
    }

    try {
      // Récupérer l'owner_id depuis le stockage local
      const userData = await AsyncStorage.getItem('@iven_user_data');
      if (!userData) {
        Alert.alert('Erreur', 'Impossible de récupérer les informations utilisateur. Veuillez vous reconnecter.');
        return;
      }

      const user = JSON.parse(userData);
      const owner_id = user.id;

      if (!owner_id) {
        Alert.alert('Erreur', 'ID utilisateur manquant. Veuillez vous reconnecter.');
        return;
      }



      // PARSER LES DATES FRANÇAISES (DD/MM/YYYY)
      let startDate: Date;
      let endDate: Date;

      try {
        // Le DatePicker retourne DD/MM/YYYY, il faut le parser
        if (formData.startDate && formData.startDate.includes('/')) {
          const [day, month, year] = formData.startDate.split('/');
          startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          startDate = new Date(formData.startDate);
        }

        if (formData.endDate && formData.endDate.includes('/')) {
          const [day, month, year] = formData.endDate.split('/');
          endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          endDate = new Date(formData.endDate);
        }
      } catch (error) {
        console.error('❌ Erreur parsing des dates:', error);
        Alert.alert('Erreur', 'Format de date invalide. Veuillez sélectionner des dates valides.');
        return;
      }

      // Validation des dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        Alert.alert('Erreur', 'Format de date invalide. Veuillez sélectionner des dates valides.');
        return;
      }

      if (endDate <= startDate) {
        Alert.alert('Erreur', 'La date de fin doit être postérieure à la date de début');
        return;
      }

      // Combiner les dates et heures en format DATETIME MySQL compatible
      let startDateTime = '';
      let endDateTime = '';

      if (formData.startTime) {
        // Si une heure de début est sélectionnée, l'ajouter à la date
        const [hours, minutes] = formData.startTime.split(':');
        const dateObj = new Date(startDate);
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Format MySQL DATETIME: YYYY-MM-DD HH:MM:SS
        startDateTime = dateObj.getFullYear() + '-' + 
                      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(dateObj.getDate()).padStart(2, '0') + ' ' + 
                      String(dateObj.getHours()).padStart(2, '0') + ':' + 
                      String(dateObj.getMinutes()).padStart(2, '0') + ':' + 
                      String(dateObj.getSeconds()).padStart(2, '0');
      } else {
        // Si pas d'heure, utiliser minuit (00:00:00)
        const dateObj = new Date(startDate);
        dateObj.setHours(0, 0, 0, 0);
        startDateTime = dateObj.getFullYear() + '-' + 
                      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(dateObj.getDate()).padStart(2, '0') + ' 00:00:00';
      }

      if (formData.endTime) {
        // Si une heure de fin est sélectionnée, l'ajouter à la date
        const [hours, minutes] = formData.endTime.split(':');
        const dateObj = new Date(endDate);
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Format MySQL DATETIME: YYYY-MM-DD HH:MM:SS
        endDateTime = dateObj.getFullYear() + '-' + 
                    String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(dateObj.getDate()).padStart(2, '0') + ' ' + 
                    String(dateObj.getHours()).padStart(2, '0') + ':' + 
                    String(dateObj.getMinutes()).padStart(2, '0') + ':' + 
                    String(dateObj.getSeconds()).padStart(2, '0');
      } else {
        // Si pas d'heure, utiliser minuit (00:00:00)
        const dateObj = new Date(endDate);
        dateObj.setHours(0, 0, 0, 0);
        endDateTime = dateObj.getFullYear() + '-' + 
                    String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(dateObj.getDate()).padStart(2, '0') + ' 00:00:00';
      }

      // Préparer les données pour l'API
      const eventData = {
        title: formData.title,
        description: formData.description || '',
        start_date: startDateTime,
        end_date: endDateTime,
        location: formData.location,
        owner_id: owner_id,
      };



      // Appel API pour créer l'événement
      const response = await eventService.createEvent(eventData);
      
      if (response.success) {
        addEvent(response.data); // Utiliser le contexte pour ajouter l'événement
        Alert.alert('Succès', 'Événement créé avec succès !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de créer l\'événement');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'événement:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'événement. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: spacing[5], 
            paddingBottom: spacing[8],
            paddingTop: spacing[4]
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            {/* Informations principales */}
            <Card variant="elevated" padding="large" style={{ marginBottom: spacing[6] }}>
              <View style={[layoutStyles.gap4]}>
                <View style={[layoutStyles.columnCenter, { marginBottom: spacing[4] }]}>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: theme.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing[2],
                  }}>
                    <Ionicons name="calendar" size={28} color={theme.buttonText} />
                  </View>
                  <Text variant="h3" weight="semibold" style={{ color: theme.text }}>
                    Créer un événement
                  </Text>
                  <Text variant="body" style={{ 
                    color: theme.textSecondary, 
                    textAlign: 'center',
                    marginTop: spacing[1]
                  }}>
                    Remplissez les informations de votre événement
                  </Text>
                </View>

                <Input
                  label="Titre de l'événement *"
                  placeholder="Ex: Anniversaire de Marie"
                  value={formData.title}
                  onChangeText={(value) => updateFormField('title', value)}
                  required
                  leftIcon="create"
                />

                <Input
                  label="Description"
                  placeholder="Décrivez votre événement (optionnel)..."
                  value={formData.description}
                  onChangeText={(value) => updateFormField('description', value)}
                  multiline
                  numberOfLines={3}
                  leftIcon="document-text"
                />

                <View style={[layoutStyles.row, layoutStyles.gap3]}>
                  <View style={{ flex: 1 }}>
                    <DatePicker
                      label="Date de début *"
                      value={formData.startDate}
                      onChangeText={(value) => updateFormField('startDate', value)}
                      required
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TimePicker
                      label="Heure de début"
                      value={formData.startTime}
                      onChangeText={(value) => updateFormField('startTime', value)}
                    />
                  </View>
                </View>

                <View style={[layoutStyles.row, layoutStyles.gap3]}>
                  <View style={{ flex: 1 }}>
                    <DatePicker
                      label="Date de fin *"
                      value={formData.endDate}
                      onChangeText={(value) => updateFormField('endDate', value)}
                      required
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TimePicker
                      label="Heure de fin"
                      value={formData.endTime}
                      onChangeText={(value) => updateFormField('endTime', value)}
                    />
                  </View>
                </View>

                <Input
                  label="Lieu *"
                  placeholder="Adresse ou nom du lieu"
                  value={formData.location}
                  onChangeText={(value) => updateFormField('location', value)}
                  required
                  leftIcon="location-outline"
                />

                {/* Informations sur la structure de la base de données */}
                <View style={{
                  padding: spacing[3],
                  backgroundColor: theme.backgroundSecondary,
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: theme.primary,
                }}>
                  <Text variant="caption" style={{ 
                    color: theme.textSecondary,
                    fontStyle: 'italic'
                  }}>
                    💡 Les champs marqués d'un * sont obligatoires. 
                    L'événement sera automatiquement associé à votre compte.
                  </Text>
                  <Text variant="caption" style={{ 
                    color: theme.textSecondary,
                    fontStyle: 'italic',
                    marginTop: spacing[2]
                  }}>
                    📅 Structure: start_date et end_date (DATETIME MySQL) - Format: YYYY-MM-DD HH:MM:SS
                    Si aucune heure n'est spécifiée, l'événement sera programmé à 00:00:00.
                  </Text>
                  <Text variant="caption" style={{ 
                    color: theme.textSecondary,
                    fontStyle: 'italic',
                    marginTop: spacing[2]
                  }}>
                    ✅ Validation: La date de fin doit être postérieure à la date de début.
                  </Text>
                  <Text variant="caption" style={{ 
                    color: theme.textSecondary,
                    fontStyle: 'italic',
                    marginTop: spacing[2]
                  }}>
                    👤 Owner ID: Récupéré automatiquement depuis votre session connectée.
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer fixe */}
      <View style={{
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
      }}>
        <Button 
          title="Créer l'événement"
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
} 