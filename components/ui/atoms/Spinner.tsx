import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function Spinner({ size = 'medium', color = '#007AFF' }: SpinnerProps) {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    
    animation.start();
    
    return () => animation.stop();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSizeStyle = () => {
    switch (size) {
      case 'small': return { width: 16, height: 16 };
      case 'medium': return { width: 24, height: 24 };
      case 'large': return { width: 32, height: 32 };
      default: return { width: 24, height: 24 };
    }
  };

  const sizeStyle = getSizeStyle();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          sizeStyle,
          { borderTopColor: color },
          { transform: [{ rotate }] }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 50,
  },
});

