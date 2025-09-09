import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../../styles';
import Text from '../../../../components/ui/atoms/Text';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Header from '../../../../components/ui/organisms/Header';
import Badge from '../../../../components/ui/atoms/Badge';
import { Event } from '../../../../types/events';
import { eventService } from '../../../../services/EventService';
import { useAuth } from '../../../../contexts/AuthContext';

// Types pour le budget
interface BudgetItem {
  id: number;
  event_id: number;
  category: string;
  description: string;
  amount: number;
  paid_by: number;
  paid_by_name: string;
  created_at: string;
  updated_at: string;
}

interface BudgetSummary {
  total_budget: number;
  total_spent: number;
  remaining_budget: number;
  items_count: number;
}

interface BudgetStats {
  by_category: { [key: string]: number };
  by_participant: { [key: string]: number };
}

export default function EventBudgetScreen() {
  console.log('💰 EventBudgetScreen rendu');
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [budgetStats, setBudgetStats] = useState<BudgetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

  // Catégories de budget prédéfinies
  const budgetCategories = [
    'Toutes',
    'Nourriture',
    'Transport',
    'Hébergement',
    'Matériel',
    'Décoration',
    'Divertissement',
    'Autres'
  ];

  // Récupérer les données du budget
  const fetchBudgetData = async () => {
    if (!id || !user?.id) {
      setError('ID d\'événement ou utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventId = Number(id);
      console.log('💰 Récupération des données du budget:', eventId);
      
      // Récupérer l'événement
      const eventResponse = await eventService.getEventById(eventId);
      if (!eventResponse.success || !eventResponse.data) {
        throw new Error(eventResponse.error || 'Erreur lors de la récupération de l\'événement');
      }
      const eventData = eventResponse.data;
      // Créer un objet Event complet avec la propriété participants requise
      const completeEvent: Event = {
        ...eventData,
        participants: [] // Ajouter la propriété participants manquante
      };
      setEvent(completeEvent);
      setIsOwner(eventData.owner_id === user.id);
      
      // Simuler les données du budget (à remplacer par des appels API réels)
      const mockBudgetItems: BudgetItem[] = [
        {
          id: 1,
          event_id: eventId,
          category: 'Nourriture',
          description: 'Repas pour 20 personnes',
          amount: 150.00,
          paid_by: user.id,
          paid_by_name: user.fname + ' ' + user.lname,
          created_at: '2024-01-15 10:00:00',
          updated_at: '2024-01-15 10:00:00'
        },
        {
          id: 2,
          event_id: eventId,
          category: 'Transport',
          description: 'Location de bus',
          amount: 200.00,
          paid_by: user.id,
          paid_by_name: user.fname + ' ' + user.lname,
          created_at: '2024-01-16 14:30:00',
          updated_at: '2024-01-16 14:30:00'
        },
        {
          id: 3,
          event_id: eventId,
          category: 'Décoration',
          description: 'Ballons et guirlandes',
          amount: 75.50,
          paid_by: user.id,
          paid_by_name: user.fname + ' ' + user.lname,
          created_at: '2024-01-17 09:15:00',
          updated_at: '2024-01-17 09:15:00'
        }
      ];
      
      setBudgetItems(mockBudgetItems);
      
      // Calculer le résumé du budget
      const totalSpent = mockBudgetItems.reduce((sum, item) => sum + item.amount, 0);
      const totalBudget = 1000.00; // Budget total fixe pour l'exemple
      
      setBudgetSummary({
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining_budget: totalBudget - totalSpent,
        items_count: mockBudgetItems.length
      });
      
      // Calculer les statistiques
      const byCategory: { [key: string]: number } = {};
      const byParticipant: { [key: string]: number } = {};
      
      mockBudgetItems.forEach(item => {
        byCategory[item.category] = (byCategory[item.category] || 0) + item.amount;
        byParticipant[item.paid_by_name] = (byParticipant[item.paid_by_name] || 0) + item.amount;
      });
      
      setBudgetStats({
        by_category: byCategory,
        by_participant: byParticipant
      });
      
      console.log('✅ Données du budget récupérées avec succès');
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération du budget:', error);
      setError(error.message || 'Erreur lors de la récupération du budget');
    } finally {
      setLoading(false);
    }
  };

  // Actualiser les données
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBudgetData();
    setRefreshing(false);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchBudgetData();
  }, [id, user?.id]);

  // Filtrer les éléments par catégorie
  const filteredItems = selectedCategory === 'Toutes' 
    ? budgetItems 
    : budgetItems.filter(item => item.category === selectedCategory);

  // Formater le montant en euros
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Nourriture': '#FF6B6B',
      'Transport': '#4ECDC4',
      'Hébergement': '#45B7D1',
      'Matériel': '#96CEB4',
      'Décoration': '#FFEAA7',
      'Divertissement': '#DDA0DD',
      'Autres': '#98D8C8'
    };
    return colors[category] || theme.primary;
  };

  // Obtenir l'icône de la catégorie
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Nourriture': 'restaurant',
      'Transport': 'car',
      'Hébergement': 'bed',
      'Matériel': 'construct',
      'Décoration': 'color-palette',
      'Divertissement': 'musical-notes',
      'Autres': 'ellipsis-horizontal'
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  if (loading) {
    return (
      <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Budget"
        />
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <Text variant="body" color="secondary">Chargement du budget...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Budget"
          showBack
          onBack={() => router.back()}
        />
        <View style={[layoutStyles.center, { flex: 1, paddingHorizontal: spacing[5] }]}>
          <Ionicons name="alert-circle" size={48} color={theme.error} />
          <Text variant="h3" weight="semibold" style={{ marginTop: spacing[3], marginBottom: spacing[2] }}>
            Erreur
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
            {error}
          </Text>
          <Button
            title="Réessayer"
            onPress={fetchBudgetData}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[layoutStyles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Budget"
        showBack
        onBack={() => router.back()}
        rightAction={
          {
            icon: "add",
            onPress: () => console.log('Ajouter dépense')
          }
        }
        />
      

      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[4] }}>
          
          {/* Résumé du budget */}
          {budgetSummary && (
            <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[4] }}>
              <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
                Résumé du budget
              </Text>
              
              <View style={[layoutStyles.rowBetween, { marginBottom: spacing[3] }]}>
                <Text variant="body" color="secondary">Budget total</Text>
                <Text variant="h3" weight="semibold" color="primary">
                  {formatAmount(budgetSummary.total_budget)}
                </Text>
              </View>
              
              <View style={[layoutStyles.rowBetween, { marginBottom: spacing[3] }]}>
                <Text variant="body" color="secondary">Dépensé</Text>
                <Text variant="h3" weight="semibold" color="error">
                  {formatAmount(budgetSummary.total_spent)}
                </Text>
              </View>
              
              <View style={[layoutStyles.rowBetween, { marginBottom: spacing[3] }]}>
                <Text variant="body" color="secondary">Restant</Text>
                <Text variant="h3" weight="semibold" color={budgetSummary.remaining_budget >= 0 ? 'success' : 'error'}>
                  {formatAmount(budgetSummary.remaining_budget)}
                </Text>
              </View>
              
              {/* Barre de progression */}
              <View style={{ marginTop: spacing[3] }}>
                <View style={{
                  height: 8,
                  backgroundColor: theme.border,
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    height: '100%',
                    width: `${Math.min((budgetSummary.total_spent / budgetSummary.total_budget) * 100, 100)}%`,
                    backgroundColor: budgetSummary.total_spent > budgetSummary.total_budget ? theme.error : theme.primary,
                    borderRadius: 4
                  }} />
                </View>
                <Text variant="caption" color="secondary" style={{ marginTop: spacing[1] }}>
                  {Math.round((budgetSummary.total_spent / budgetSummary.total_budget) * 100)}% du budget utilisé
                </Text>
              </View>
            </Card>
          )}

          {/* Statistiques par catégorie */}
          {budgetStats && (
            <Card variant="elevated" padding="medium" style={{ marginBottom: spacing[4] }}>
              <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[4] }}>
                Dépenses par catégorie
              </Text>
              
              {Object.entries(budgetStats.by_category).map(([category, amount]) => (
                <View key={category} style={[layoutStyles.rowBetween, { marginBottom: spacing[2] }]}>
                  <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: getCategoryColor(category),
                      marginRight: spacing[2]
                    }} />
                    <Text variant="body">{category}</Text>
                  </View>
                  <Text variant="body" weight="semibold">
                    {formatAmount(amount)}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Filtres par catégorie */}
          <View style={{ marginBottom: spacing[4] }}>
            <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
              Catégories
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[layoutStyles.row, { gap: spacing[2] }]}>
                {budgetCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={{
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[2],
                      borderRadius: 20,
                      backgroundColor: selectedCategory === category ? theme.primary : theme.backgroundSecondary,
                      borderWidth: 1,
                      borderColor: selectedCategory === category ? theme.primary : theme.border
                    }}
                  >
                    <Text 
                      variant="caption" 
                      weight={selectedCategory === category ? 'semibold' : 'normal'}
                      color={selectedCategory === category ? 'primary' : 'secondary'}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Liste des dépenses */}
          <View>
            <View style={[layoutStyles.rowBetween, { marginBottom: spacing[3] }]}>
              <Text variant="h3" weight="semibold">
                Dépenses ({filteredItems.length})
              </Text>
              {isOwner && (
                <TouchableOpacity onPress={() => console.log('Ajouter dépense')}>
                  <Text variant="body" color="primary">Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>

            {filteredItems.length === 0 ? (
              <Card variant="outlined" padding="large">
                <View style={[layoutStyles.center, { paddingVertical: spacing[6] }]}>
                  <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
                  <Text variant="h3" weight="semibold" style={{ marginTop: spacing[3], marginBottom: spacing[2] }}>
                    Aucune dépense
                  </Text>
                  <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
                    {selectedCategory === 'Toutes' 
                      ? 'Aucune dépense enregistrée pour cet événement'
                      : `Aucune dépense dans la catégorie "${selectedCategory}"`
                    }
                  </Text>
                  {isOwner && (
                    <Button
                      title="Ajouter une dépense"
                      onPress={() => console.log('Ajouter dépense')}
                      variant="primary"
                    />
                  )}
                </View>
              </Card>
            ) : (
              <View style={{ gap: spacing[3] }}>
                {filteredItems.map((item) => (
                  <Card key={item.id} variant="elevated" padding="medium">
                    <View style={[layoutStyles.rowBetween, { alignItems: 'flex-start', marginBottom: spacing[2] }]}>
                      <View style={[layoutStyles.row, { alignItems: 'center', flex: 1 }]}>
                        <View style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: getCategoryColor(item.category) + '20',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: spacing[3]
                        }}>
                          <Ionicons 
                            name={getCategoryIcon(item.category) as any} 
                            size={20} 
                            color={getCategoryColor(item.category)} 
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text variant="body" weight="semibold" numberOfLines={1}>
                            {item.description}
                          </Text>
                          <Text variant="caption" color="secondary">
                            {item.category} • {item.paid_by_name}
                          </Text>
                        </View>
                      </View>
                      <Text variant="h3" weight="semibold" color="primary">
                        {formatAmount(item.amount)}
                      </Text>
                    </View>
                    
                    <View style={[layoutStyles.rowBetween, { alignItems: 'center' }]}>
                      <Text variant="caption" color="secondary">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </Text>
                      {isOwner && (
                        <View style={[layoutStyles.row, { gap: spacing[2] }]}>
                          <TouchableOpacity onPress={() => console.log('Modifier', item.id)}>
                            <Ionicons name="pencil" size={16} color={theme.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => console.log('Supprimer', item.id)}>
                            <Ionicons name="trash" size={16} color={theme.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>

          {/* Espace en bas */}
          <View style={{ height: spacing[8] }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
