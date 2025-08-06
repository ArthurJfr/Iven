import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../styles';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  height?: number;
  animated?: boolean;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  height = 4,
  animated = true,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.background, { backgroundColor: theme.border }]} />
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: theme.primary,
            width: progressWidth,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
  },
  progress: {
    borderRadius: 2,
  },
}); 