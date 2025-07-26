import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";
import { Category } from "../../types/categories";
import categoriesData from "../../data/categories.json";
import Card from "../../components/ui/Card";
import TopBar from "../../components/ui/TopBar";
import { Ionicons } from '@expo/vector-icons';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const router = useRouter();

  // Recherche de la catégorie correspondante
  const category: Category | undefined = (categoriesData as Category[]).find(c => c.id === id);

  if (!category) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.titleLg, { color: theme.text, marginBottom: 8 }]}>Catégorie introuvable</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Aucune catégorie ne correspond à cet identifiant.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopBar 
        title="Détail de la catégorie"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card variant="elevated" padding="large" style={{ marginBottom: 16 }}>
          <View style={localStyles.header}>
            <View style={[localStyles.iconContainer, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon as any || 'folder'} size={32} color="#ffffff" />
            </View>
            <View style={localStyles.categoryInfo}>
              <Text style={[styles.titleLg, { marginBottom: 4 }]}>{category.name}</Text>
              <View style={[localStyles.eventCount, { backgroundColor: category.color }]}>
                <Text style={localStyles.eventCountText}>{category.eventCount} événement{category.eventCount > 1 ? 's' : ''}</Text>
              </View>
            </View>
          </View>
          
          {category.description && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.titleSm, { marginBottom: 4 }]}>Description</Text>
              <Text style={styles.textSm}>{category.description}</Text>
            </View>
          )}
          
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.titleSm, { marginBottom: 8 }]}>Informations</Text>
            
            <View style={localStyles.row}>
              <Ionicons name="color-palette" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>Couleur : </Text>
              <View style={[localStyles.colorPreview, { backgroundColor: category.color }]} />
            </View>
            
            <View style={localStyles.row}>
              <Ionicons name="calendar" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>Créée le {category.createdAt}</Text>
            </View>
            
            <View style={localStyles.row}>
              <Ionicons name="stats-chart" size={18} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={styles.textMd}>{category.eventCount} événement{category.eventCount > 1 ? 's' : ''} dans cette catégorie</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  eventCount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8,
  },
}); 