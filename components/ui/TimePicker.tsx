import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing, layoutStyles } from '../../styles';
import Text from './atoms/Text';
import Input from './Input';

interface TimePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function TimePicker({
  label,
  placeholder = "Sélectionner une heure",
  value,
  onChangeText,
  required = false,
  disabled = false,
}: TimePickerProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handlePress = () => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    onChangeText?.(selectedTime);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Générer les créneaux horaires (30 minutes d'intervalle)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          label: timeString,
          value: timeString,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <View>
      <TouchableOpacity onPress={handlePress} disabled={disabled}>
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          leftIcon="time-outline"
          rightIcon="chevron-down"
          editable={false}
          onPressIn={handlePress}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[layoutStyles.rowBetween, styles.modalHeader]}>
              <Text variant="h3" weight="semibold" style={{ color: theme.text }}>
                Sélectionner une heure
              </Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => handleTimeChange(itemValue)}
                style={[styles.picker, { color: theme.text }]}
                itemStyle={{ color: theme.text }}
              >
                {timeSlots.map((slot, index) => (
                  <Picker.Item
                    key={index}
                    label={slot.label}
                    value={slot.value}
                    color={theme.text}
                  />
                ))}
              </Picker>
            </View>

            <View style={[layoutStyles.row, styles.buttonContainer]}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
                onPress={handleCancel}
              >
                <Text variant="body" weight="medium" style={{ color: theme.text }}>
                  Annuler
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: theme.primary }]}
                onPress={handleConfirm}
              >
                <Text variant="body" weight="medium" style={{ color: theme.buttonText }}>
                  Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    maxHeight: '70%',
  },
  modalHeader: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  picker: {
    height: 200,
  },
  buttonContainer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[3],
  },
  button: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    borderWidth: 0,
  },
}); 