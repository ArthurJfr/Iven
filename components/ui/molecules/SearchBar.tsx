import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../Input';
import { useTheme } from '../../../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
  onClear
}: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.textSecondary || '#666'} 
          style={styles.searchIcon} 
        />
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={styles.input}
        />
        {value.length > 0 && onClear && (
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={theme.textSecondary || '#666'} 
            style={styles.clearIcon}
            onPress={onClear}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  clearIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
}); 