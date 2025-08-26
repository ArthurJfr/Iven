import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../Input';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSearch?: () => void;
  style?: any;
  containerStyle?: any;
  compact?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
  onClear,
  onSearch,
  style,
  containerStyle,
  compact = false
}: SearchBarProps) {
  const { theme } = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[
        styles.searchContainer, 
        { 
          paddingHorizontal: compact ? 12 : 16,
          minHeight: compact ? 44 : 48
        }, 
        style
      ]}>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          inputStyle={{
            ...styles.input,
            fontSize: compact ? 15 : 16,
            paddingVertical: compact ? 8 : 10
          }}
          variant="filled"
          size={compact ? "small" : "medium"}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons 
              name="close-circle" 
              size={compact ? 18 : 20} 
              color={theme.textSecondary} 
            />
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  clearButton: {
    padding: 6,
    marginRight: 4,
    borderRadius: 12,
  },
  searchButton: {
    padding: 6,
    marginRight: 4,
    borderRadius: 12,
  },
}); 