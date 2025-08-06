import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles, spacing, layoutStyles } from '../../styles';
import Text from './atoms/Text';
import Input from './Input';

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function DatePicker({
  label,
  placeholder = "Sélectionner une date",
  value,
  onChangeText,
  required = false,
  disabled = false,
}: DatePickerProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handlePress = () => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    onChangeText?.(formattedDate);
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onChangeText?.(formattedDate);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Générer les options pour les 30 prochains jours
  const generateDateOptions = () => {
    const options = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      options.push({
        label: formatDate(date),
        value: date,
      });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  return (
    <View>
      <TouchableOpacity onPress={handlePress} disabled={disabled}>
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          leftIcon="calendar-outline"
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
                Sélectionner une date
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
                selectedValue={selectedDate}
                onValueChange={(itemValue) => handleDateChange(itemValue)}
                style={[styles.picker, { color: theme.text }]}
                itemStyle={{ color: theme.text }}
              >
                {dateOptions.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
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