import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import Spinner from '../atoms/Spinner';
import Text from '../atoms/Text';
import { useTheme } from '../../../contexts/ThemeContext';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  fullScreen?: boolean;
  overlayColor?: string;
}

export default function LoadingOverlay({ 
  visible, 
  message, 
  fullScreen = false,
  overlayColor 
}: LoadingOverlayProps) {
  const { theme } = useTheme();
  const finalOverlayColor = overlayColor || theme.background;
  
  if (fullScreen) {
    return visible ? (
      <View style={[styles.fullScreenContainer, { backgroundColor: finalOverlayColor }]}>
        <View style={styles.fullScreenContent}>
          <Spinner size="large" color={theme.primary} />
          {message && (
            <Text 
              variant="body" 
              color="secondary" 
              style={styles.fullScreenMessage}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    ) : null;
  }
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
          <Spinner size="large" color={theme.primary} />
          {message && (
            <Text variant="body" color="secondary" style={styles.message}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContent: {
    alignItems: 'center',
    padding: 32,
  },
  fullScreenMessage: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
});