import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import Text from '../../ui/atoms/Text';
import { spacing } from '../../../styles';

const { width: screenWidth } = Dimensions.get('window');

interface FilterOption {
  key: string;
  label: string;
  icon: string;
  count: number;
}

interface EventFiltersProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  style?: any;
  compact?: boolean;
}

const EventFilters = React.memo(({
  filters,
  activeFilter,
  onFilterChange,
  style,
  compact = false
}: EventFiltersProps) => {
  const { theme } = useTheme();

  // Mémoriser la fonction de calcul de largeur pour éviter les recréations
  const getFilterWidth = useCallback(() => {
    const filterCount = filters.length;
    const availableWidth = screenWidth - (spacing[5] * 2); // Padding horizontal
    const minFilterWidth = 80;
    const maxFilterWidth = Math.max(minFilterWidth, availableWidth / filterCount);
    
    return Math.min(maxFilterWidth, 120); // Limite la largeur maximale
  }, [filters.length]);

  // Mémoriser la fonction de gestion des changements de filtre
  const handleFilterChange = useCallback((filterKey: string) => {
    onFilterChange(filterKey);
  }, [onFilterChange]);

  // Mémoriser la liste des filtres pour éviter les recalculs
  const filterButtons = useMemo(() =>
    filters.map((filter, index) => {
      const isActive = activeFilter === filter.key;
      const filterWidth = getFilterWidth();
      
      return (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            {
              backgroundColor: isActive ? theme.primary : theme.backgroundSecondary,
              width: filterWidth,
              height: compact ? 36 : 40,
              marginRight: index === filters.length - 1 ? 0 : spacing[2],
            }
          ]}
          onPress={() => handleFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <View style={styles.filterContent}>
            <Ionicons 
              name={filter.icon as any} 
              size={compact ? 12 : 14} 
              color={isActive ? 'white' : theme.textSecondary}
              style={styles.filterIcon} 
            />
            <Text 
              style={[
                styles.filterLabel,
                {
                  color: isActive ? 'white' : theme.text,
                  fontWeight: isActive ? '600' : '500',
                  fontSize: compact ? 12 : 13
                }
              ]}
              numberOfLines={1}
            >
              {filter.label}
            </Text>
            <View style={[
              styles.countBadge,
              {
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : theme.border,
              }
            ]}>
              <Text style={[
                styles.countText,
                {
                  color: isActive ? 'white' : theme.textSecondary,
                  fontSize: compact ? 10 : 11
                }
              ]}>
                {filter.count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }),
    [filters, activeFilter, compact, theme, getFilterWidth, handleFilterChange]
  );

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {filterButtons}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[3],
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingRight: spacing[5],
    alignItems: 'center',
  },
  filterButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  filterIcon: {
    marginRight: spacing[1],
  },
  filterLabel: {
    marginRight: spacing[1],
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: spacing[1],
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Export par défaut pour maintenir la compatibilité
export default EventFilters;
