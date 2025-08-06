import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DatePicker from '../../components/ui/DatePicker';
import TimePicker from '../../components/ui/TimePicker';

const { width } = Dimensions.get('window');

export default function CreateEventModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'physique',
    category: '',
    maxParticipants: '',
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

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.location) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }
    
    Alert.alert('Succès', 'Événement créé avec succès !', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const categories = [
    { 
      id: 'anniversaire', 
      name: 'Anniversaire', 
      icon: 'gift',
      color: '#FF6B6B', // Rouge corail
      lightColor: '#FFE8E8'
    },
    { 
      id: 'reunion', 
      name: 'Réunion', 
      icon: 'people',
      color: '#4ECDC4', // Turquoise
      lightColor: '#E8F8F7'
    },
    { 
      id: 'voyage', 
      name: 'Voyage', 
      icon: 'airplane',
      color: '#45B7D1', // Bleu ciel
      lightColor: '#E8F4F8'
    },
    { 
      id: 'soiree', 
      name: 'Soirée', 
      icon: 'wine',
      color: '#96CEB4', // Vert menthe
      lightColor: '#E8F5F0'
    },
    { 
      id: 'sport', 
      name: 'Sport', 
      icon: 'football',
      color: '#FFA726', // Orange
      lightColor: '#FFF3E0'
    },
    { 
      id: 'culture', 
      name: 'Culture', 
      icon: 'library',
      color: '#AB47BC', // Violet
      lightColor: '#F3E5F5'
    },
  ];

  const renderTypeSelector = () => (
    <View style={{ marginBottom: spacing[6] }}>
      <Text variant="h3" weight="semibold" style={{ 
        marginBottom: spacing[4],
        color: theme.text,
        textAlign: 'center'
      }}>
        Type d'événement
      </Text>

      <View style={[layoutStyles.row, layoutStyles.gap3]}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={() => setFormData({...formData, type: 'physique'})}
        >
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            <Card 
              variant={formData.type === 'physique' ? 'elevated' : 'outlined'} 
              padding="medium"
              style={{ 
                backgroundColor: formData.type === 'physique' ? theme.primary : theme.backgroundSecondary,
                alignItems: 'center',
                borderColor: formData.type === 'physique' ? theme.primary : theme.border,
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: formData.type === 'physique' ? 'rgba(255,255,255,0.2)' : theme.background,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing[2],
              }}>
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={formData.type === 'physique' ? theme.buttonText : theme.textSecondary} 
                />
              </View>
              <Text 
                variant="body" 
                weight="semibold"
                style={{ 
                  color: formData.type === 'physique' ? theme.buttonText : theme.text,
                  textAlign: 'center'
                }}
              >
                Physique
              </Text>
              <Text 
                variant="caption" 
                style={{ 
                  color: formData.type === 'physique' ? 'rgba(255,255,255,0.8)' : theme.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing[1]
                }}
              >
                En présentiel
              </Text>
            </Card>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={() => setFormData({...formData, type: 'virtuel'})}
        >
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}>
            <Card 
              variant={formData.type === 'virtuel' ? 'elevated' : 'outlined'} 
              padding="medium"
              style={{ 
                backgroundColor: formData.type === 'virtuel' ? theme.primary : theme.backgroundSecondary,
                alignItems: 'center',
                borderColor: formData.type === 'virtuel' ? theme.primary : theme.border,
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: formData.type === 'virtuel' ? 'rgba(255,255,255,0.2)' : theme.background,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing[2],
              }}>
                <Ionicons 
                  name="videocam" 
                  size={24} 
                  color={formData.type === 'virtuel' ? theme.buttonText : theme.textSecondary} 
                />
              </View>
              <Text 
                variant="body" 
                weight="semibold"
                style={{ 
                  color: formData.type === 'virtuel' ? theme.buttonText : theme.text,
                  textAlign: 'center'
                }}
              >
                Virtuel
              </Text>
              <Text 
                variant="caption" 
                style={{ 
                  color: formData.type === 'virtuel' ? 'rgba(255,255,255,0.8)' : theme.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing[1]
                }}
              >
                En ligne
              </Text>
            </Card>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategorySelector = () => (
    <View style={{ marginBottom: spacing[6] }}>
      <Text variant="h3" weight="semibold" style={{ 
        marginBottom: spacing[4],
        color: theme.text,
        textAlign: 'center'
      }}>
        Catégorie
      </Text>

      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        gap: spacing[3]
      }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={{ width: (width - spacing[10] - spacing[3]) / 2 }}
            onPress={() => setFormData({...formData, category: category.id})}
          >
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}>
              <Card 
                variant={formData.category === category.id ? 'elevated' : 'outlined'} 
                padding="medium"
                style={{ 
                  backgroundColor: formData.category === category.id ? category.color : category.lightColor,
                  alignItems: 'center',
                  minHeight: 100,
                  borderColor: formData.category === category.id ? category.color : theme.border,
                  borderWidth: formData.category === category.id ? 2 : 1,
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: formData.category === category.id ? 'rgba(255,255,255,0.2)' : category.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing[2],
                }}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={20} 
                    color={formData.category === category.id ? '#FFF' : '#FFF'} 
                  />
                </View>
                <Text 
                  variant="body" 
                  weight="medium"
                  style={{ 
                    color: formData.category === category.id ? '#FFF' : category.color,
                    textAlign: 'center',
                    fontSize: 14,
                  }}
                >
                  {category.name}
                </Text>
              </Card>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
                    Informations principales
                  </Text>
                </View>

                <Input
                  label="Titre de l'événement"
                  placeholder="Ex: Anniversaire de Marie"
                  value={formData.title}
                  onChangeText={(value) => setFormData({...formData, title: value})}
                  required
                  leftIcon="create"
                />

                <Input
                  label="Description"
                  placeholder="Décrivez votre événement..."
                  value={formData.description}
                  onChangeText={(value) => setFormData({...formData, description: value})}
                  multiline
                  numberOfLines={3}
                  leftIcon="document-text"
                />

                <View style={[layoutStyles.row, layoutStyles.gap3]}>
                  <View style={{ flex: 1 }}>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChangeText={(value) => setFormData({...formData, date: value})}
                      required
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TimePicker
                      label="Heure"
                      value={formData.time}
                      onChangeText={(value) => setFormData({...formData, time: value})}
                    />
                  </View>
                </View>

                <Input
                  label="Lieu"
                  placeholder="Adresse ou nom du lieu"
                  value={formData.location}
                  onChangeText={(value) => setFormData({...formData, location: value})}
                  required
                  leftIcon="location-outline"
                />
              </View>
            </Card>

            {renderTypeSelector()}
            {renderCategorySelector()}
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