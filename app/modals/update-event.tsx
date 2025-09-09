import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEventContext } from '../../contexts/EventContext';
import { createThemedStyles, layoutStyles, spacing } from '../../styles';
import Text from '../../components/ui/atoms/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DatePicker from '../../components/ui/DatePicker';
import TimePicker from '../../components/ui/TimePicker';
import { eventService } from '../../services/EventService';

export default function UpdateEventModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { updateEvent } = useEventContext();
  const themedStyles = createThemedStyles(theme);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
  });

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError("ID d'événement manquant");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEventById(Number(id));
        if (!response.success || !response.data) {
          throw new Error(response.error || "Impossible de récupérer l'événement");
        }

        // Vérifier ownership
        if (!user?.id || Number(user.id) !== Number(response.data.owner_id)) {
          Alert.alert('Accès refusé', "Seul le propriétaire peut modifier l'événement", [
            { text: 'OK', onPress: () => router.back() }
          ]);
          setLoading(false);
          return;
        }

        const parseDate = (dt: string) => {
          const d = new Date(dt);
          if (isNaN(d.getTime())) return { date: '', time: '' };
          const date = d.toLocaleDateString('fr-FR');
          const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          return { date, time };
        };

        const start = parseDate(response.data.start_date);
        const end = parseDate(response.data.end_date);

        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          startDate: start.date,
          startTime: start.time,
          endDate: end.date,
          endTime: end.time,
          location: response.data.location || '',
        });
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id, user?.id]);

  const toMySQLDateTime = (dateStr: string, timeStr?: string) => {
    try {
      let d: Date;
      if (dateStr && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        d = new Date(dateStr);
      }
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':');
        d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        d.setHours(0, 0, 0, 0);
      }
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    if (!id) return;
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (titre, dates de début/fin et lieu)');
      return;
    }

    const startDT = toMySQLDateTime(formData.startDate, formData.startTime);
    const endDT = toMySQLDateTime(formData.endDate, formData.endTime);
    if (!startDT || !endDT) {
      Alert.alert('Erreur', 'Dates/Heures invalides');
      return;
    }

    try {
      setSaving(true);
      const response = await eventService.updateEvent(Number(id), {
        title: formData.title,
        description: formData.description,
        start_date: startDT as any,
        end_date: endDT as any,
        location: formData.location,
      } as any);

      if (response.success && response.data) {
        updateEvent(response.data as any);
        Alert.alert('Succès', "Événement mis à jour avec succès !", [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Erreur', response.error || "Impossible de mettre à jour l'événement");
      }
    } catch (e) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface, layoutStyles.center]}>
        <View style={layoutStyles.center}>
          <Ionicons name="sync" size={28} color={theme.primary} />
          <Text variant="body" color="secondary" style={{ marginTop: spacing[2] }}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[layoutStyles.container, themedStyles.surface, layoutStyles.center]}>
        <View style={layoutStyles.center}>
          <Ionicons name="alert-circle-outline" size={32} color={theme.error} />
          <Text variant="body" color="error" style={{ marginTop: spacing[2], textAlign: 'center' }}>
            {error}
          </Text>
          <Button title="Fermer" onPress={() => router.back()} style={{ marginTop: spacing[3] }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[layoutStyles.container, themedStyles.surface]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing[5], paddingBottom: spacing[8], paddingTop: spacing[4] }}
          showsVerticalScrollIndicator={false}
        >
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
                  <Ionicons name="create" size={28} color={theme.buttonText} />
                </View>
                <Text variant="h3" weight="semibold" style={{ color: theme.text }}>
                  Modifier l'événement
                </Text>
                <Text variant="body" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: spacing[1] }}>
                  Mettez à jour les informations de votre événement
                </Text>
              </View>

              <Input
                label="Titre"
                value={formData.title}
                onChangeText={(v) => updateFormField('title', v)}
                leftIcon="create"
                required
              />

              <Input
                label="Description"
                value={formData.description}
                onChangeText={(v) => updateFormField('description', v)}
                multiline
                numberOfLines={3}
                leftIcon="document-text"
              />

              <View style={[layoutStyles.row, layoutStyles.gap3]}>
                <View style={{ flex: 1 }}>
                  <DatePicker
                    label="Date de début"
                    value={formData.startDate}
                    onChangeText={(v) => updateFormField('startDate', v)}
                    required
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TimePicker
                    label="Heure de début"
                    value={formData.startTime}
                    onChangeText={(v) => updateFormField('startTime', v)}
                  />
                </View>
              </View>

              <View style={[layoutStyles.row, layoutStyles.gap3]}>
                <View style={{ flex: 1 }}>
                  <DatePicker
                    label="Date de fin"
                    value={formData.endDate}
                    onChangeText={(v) => updateFormField('endDate', v)}
                    required
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TimePicker
                    label="Heure de fin"
                    value={formData.endTime}
                    onChangeText={(v) => updateFormField('endTime', v)}
                  />
                </View>
              </View>

              <Input
                label="Lieu"
                value={formData.location}
                onChangeText={(v) => updateFormField('location', v)}
                leftIcon="location-outline"
                required
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
      }}>
        <Button title={saving ? 'Enregistrement...' : 'Enregistrer les modifications'} onPress={handleSave} disabled={saving} />
      </View>
    </SafeAreaView>
  );
}


