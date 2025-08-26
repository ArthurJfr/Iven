import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../styles';
import Text from './atoms/Text';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  height = 8,
  animated = true,
  showLabel = false,
  showPercentage = false,
  color,
  backgroundColor,
  style
}: ProgressBarProps) {
  const { theme } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressColor = color || theme.primary;
  const bgColor = backgroundColor || theme.border;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: currentStep / totalSteps,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, totalSteps, animated]);

  const progressWidth = animated 
    ? progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      })
    : `${(currentStep / totalSteps) * 100}%`;

  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <View style={[styles.container, style]}>
      {(showLabel || showPercentage) && (
        <View style={styles.header}>
          {showLabel && (
            <Text variant="caption" color="secondary">
              Étape {currentStep} sur {totalSteps}
            </Text>
          )}
          {showPercentage && (
            <Text variant="caption" color="secondary" weight="semibold">
              {percentage}%
            </Text>
          )}
        </View>
      )}
      
      <View style={[styles.progressContainer, { height }]}>
        <View style={[styles.background, { backgroundColor: bgColor }]} />
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: progressColor,
              width: progressWidth,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  progressContainer: {
    width: '100%',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
  progress: {
    borderRadius: 4,
  },
}); 