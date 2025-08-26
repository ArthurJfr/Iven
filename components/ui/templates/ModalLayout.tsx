import React, { ReactNode } from 'react';
import { View, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles } from '../../../styles';
import Text from '../atoms/Text';
import { spacing } from '../../../styles';

interface ModalLayoutProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  fullScreen?: boolean;
}

export default function ModalLayout({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  fullScreen = false,
}: ModalLayoutProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={fullScreen ? 'fullScreen' : 'pageSheet'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[themedStyles.surface, { flex: 1 }]}>
        {/* Header de la modale */}
        {(title || showCloseButton) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
            }}
          >
            <Text variant="h3" weight="semibold" style={{ flex: 1 }}>
              {title}
            </Text>
            
            {showCloseButton && (
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: spacing[2],
                  borderRadius: 8,
                  backgroundColor: theme.backgroundSecondary,
                }}
              >
                <Text variant="body" weight="medium">
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Contenu de la modale */}
        <View style={{ flex: 1, padding: spacing[4] }}>
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
