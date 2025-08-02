import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import Spinner from '../atoms/Spinner';
import Text from '../atoms/Text';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Spinner size="large" />
          {message && (
            <Text variant="body" style={styles.message}>
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
    backgroundColor: '#FFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});