import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';

interface AvatarProps {
  source?: { uri: string };
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
  fallback?: string;
  fallbackIcon?: string;
  online?: boolean;
  style?: any;
}

export default function Avatar({ 
  source, 
  size = 'medium', 
  fallback,
  fallbackIcon = 'person',
  online,
  style 
}: AvatarProps) {
  const getSizeStyle = () => {
    switch (size) {
      case 'small': return { width: 32, height: 32, borderRadius: 16 };
      case 'medium': return { width: 48, height: 48, borderRadius: 24 };
      case 'large': return { width: 64, height: 64, borderRadius: 32 };
      case 'xlarge': return { width: 96, height: 96, borderRadius: 48 };
      case 'xxlarge': return { width: 120, height: 120, borderRadius: 60 };
      case 'xxxlarge': return { width: 140, height: 140, borderRadius: 70 };
      default: return { width: 48, height: 48, borderRadius: 24 };
    }
  };

  const getFallbackTextSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'medium': return 'body';
      case 'large': return 'h3';
      case 'xlarge': return 'h2';
      case 'xxlarge': return 'h1';
      default: return 'body';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      case 'xlarge': return 48;
      case 'xxlarge': return 65;
      case 'xxxlarge': return 100;
      default: return 24;
    }
  };

  const sizeStyle = getSizeStyle();

  return (
    <View style={[styles.container, sizeStyle, style]}>
      {source?.uri ? (
        <Image source={source} style={[styles.image, sizeStyle]} />
      ) : fallback ? (
        <View style={[styles.fallback, sizeStyle]}>
          <Text variant={getFallbackTextSize()} weight="semibold" color="primary">
            {fallback.charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : (
        <View style={[styles.fallback, sizeStyle]}>
          <Ionicons name={fallbackIcon as any} size={getIconSize()} color="#999" />
        </View>
      )}
      
      {online && (
        <View style={[
          styles.onlineIndicator,
          { 
            width: sizeStyle.width * 0.25,
            height: sizeStyle.width * 0.25,
            borderRadius: sizeStyle.width * 0.125,
            bottom: -2,
            right: -2,
          }
        ]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#F0F0F0',
  },
  fallback: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFF',
  },
}); 