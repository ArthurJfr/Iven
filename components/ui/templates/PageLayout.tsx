import React, { ReactNode } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles } from '../../../styles';
import TopBar from '../TopBar';

interface PageLayoutProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
  children: ReactNode;
  scrollable?: boolean;
  padding?: boolean;
}

export default function PageLayout({
  title,
  showBackButton = false,
  onBackPress,
  rightAction,
  children,
  scrollable = true,
  padding = true,
}: PageLayoutProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable ? { showsVerticalScrollIndicator: false } : {};

  return (
    <SafeAreaView style={[themedStyles.surface, { flex: 1 }]}>
      {title && (
        <TopBar
          title={title}
          showBackButton={showBackButton}
          onBackPress={onBackPress}
          rightAction={rightAction}
        />
      )}
      
      <Container
        style={[
          { flex: 1 },
          padding && { paddingHorizontal: 16, paddingVertical: 16 }
        ]}
        {...containerProps}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}
