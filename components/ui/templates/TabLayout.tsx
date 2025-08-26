import React, { ReactNode, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles } from '../../../styles';
import Text from '../atoms/Text';
import { spacing } from '../../../styles';

interface Tab {
  id: string;
  title: string;
  icon?: string;
  content: ReactNode;
}

interface TabLayoutProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  scrollable?: boolean;
}

export default function TabLayout({
  tabs,
  defaultTab,
  onTabChange,
  scrollable = false,
}: TabLayoutProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation des onglets */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing[4],
        }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            style={{
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              marginRight: spacing[2],
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab.id ? theme.primary : 'transparent',
            }}
          >
            <Text
              variant="body"
              weight={activeTab === tab.id ? 'semibold' : 'medium'}
              style={{
                color: activeTab === tab.id ? theme.primary : theme.textSecondary,
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenu de l'onglet actif */}
      <View style={{ flex: 1 }}>
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: spacing[4] }}
          >
            {activeTabContent}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, padding: spacing[4] }}>
            {activeTabContent}
          </View>
        )}
      </View>
    </View>
  );
}
