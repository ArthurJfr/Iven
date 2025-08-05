import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { useTheme } from '../../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface Expense {
  id: number;
  title: string;
  amount: number;
  paidBy: string;
  category: string;
  date: string;
  description?: string;
}

interface Budget {
  total: number;
  spent: number;
  remaining: number;
  contributions: { [key: string]: number };
}

export default function EventBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [budget, setBudget] = useState<Budget>({
    total: 150,
    spent: 80,
    remaining: 70,
    contributions: {
      'Marie': 30,
      'Jean': 25,
      'Sophie': 25
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Gâteau d'anniversaire",
      amount: 25,
      paidBy: "Marie",
      category: "Nourriture",
      date: "2024-03-14",
      description: "Gâteau au chocolat de la pâtisserie"
    },
    {
      id: 2,
      title: "Décorations",
      amount: 35,
      paidBy: "Jean",
      category: "Décoration",
      date: "2024-03-13",
      description: "Ballons, guirlandes et accessoires"
    },
    {
      id: 3,
      title: "Boissons",
      amount: 20,
      paidBy: "Sophie",
      category: "Nourriture",
      date: "2024-03-14"
    }
  ]);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: '',
    category: '',
    description: ''
  });

  const categories = ['Nourriture', 'Décoration', 'Transport', 'Loisirs', 'Autre'];

  const addExpense = () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.paidBy) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif');
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      title: newExpense.title,
      amount,
      paidBy: newExpense.paidBy,
      category: newExpense.category || 'Autre',
      date: new Date().toISOString().split('T')[0],
      description: newExpense.description
    };

    setExpenses([...expenses, expense]);
    
    // Mettre à jour le budget
    const newSpent = budget.spent + amount;
    const newRemaining = budget.total - newSpent;
    
    setBudget({
      ...budget,
      spent: newSpent,
      remaining: newRemaining
    });

    // Réinitialiser le formulaire
    setNewExpense({
      title: '',
      amount: '',
      paidBy: '',
      category: '',
      description: ''
    });
    setShowAddExpense(false);
  };

  const deleteExpense = (expenseId: number) => {
    Alert.alert(
      'Supprimer la dépense',
      'Êtes-vous sûr de vouloir supprimer cette dépense ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            const expense = expenses.find(e => e.id === expenseId);
            if (expense) {
              setExpenses(expenses.filter(e => e.id !== expenseId));
              
              // Mettre à jour le budget
              const newSpent = budget.spent - expense.amount;
              const newRemaining = budget.total - newSpent;
              
              setBudget({
                ...budget,
                spent: newSpent,
                remaining: newRemaining
              });
            }
          }
        }
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nourriture': return '#10B981';
      case 'Décoration': return '#F59E0B';
      case 'Transport': return '#3B82F6';
      case 'Loisirs': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getTotalByCategory = () => {
    const totals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Budget de l'événement</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.background }]}
          onPress={() => setShowAddExpense(!showAddExpense)}
        >
          <Ionicons 
            name={showAddExpense ? "close" : "add"} 
            size={20} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>

      {showAddExpense && (
        <Card style={styles.addForm}>
          <Text style={styles.formTitle}>Nouvelle dépense</Text>
          <Input
            placeholder="Titre de la dépense"
            value={newExpense.title}
            onChangeText={(text) => setNewExpense({...newExpense, title: text})}
            style={styles.input}
          />
          <Input
            placeholder="Montant (€)"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
            keyboardType="numeric"
            style={styles.input}
          />
          <Input
            placeholder="Payé par"
            value={newExpense.paidBy}
            onChangeText={(text) => setNewExpense({...newExpense, paidBy: text})}
            style={styles.input}
          />
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Catégorie :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newExpense.category === category && styles.categoryButtonSelected
                  ]}
                  onPress={() => setNewExpense({...newExpense, category})}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    newExpense.category === category && styles.categoryButtonTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Input
            placeholder="Description (optionnel)"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({...newExpense, description: text})}
            multiline
            style={styles.input}
          />
          <View style={styles.formButtons}>
            <Button 
              title="Annuler" 
              onPress={() => setShowAddExpense(false)}
              style={[styles.formButton, styles.cancelButton]}
            />
            <Button 
              title="Ajouter" 
              onPress={addExpense}
              style={styles.formButton}
            />
          </View>
        </Card>
      )}

      <ScrollView style={styles.content}>
        {/* Résumé du budget */}
        <Card style={styles.budgetSummary}>
          <Text style={styles.sectionTitle}>Résumé du budget</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Budget total :</Text>
            <Text style={styles.budgetValue}>{budget.total}€</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Dépensé :</Text>
            <Text style={[styles.budgetValue, { color: '#EF4444' }]}>{budget.spent}€</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Restant :</Text>
            <Text style={[styles.budgetValue, { color: budget.remaining >= 0 ? '#10B981' : '#EF4444' }]}>
              {budget.remaining}€
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(budget.spent / budget.total) * 100}%` }]} />
          </View>
        </Card>

        {/* Contributions par personne */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contributions par personne</Text>
          {Object.entries(budget.contributions).map(([name, amount]) => (
            <View key={name} style={styles.contributionRow}>
              <Text style={styles.contributionName}>{name}</Text>
              <Text style={styles.contributionAmount}>{amount}€</Text>
            </View>
          ))}
        </Card>

        {/* Dépenses par catégorie */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Dépenses par catégorie</Text>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryTotal}>{total}€</Text>
            </View>
          ))}
        </Card>

        {/* Liste des dépenses */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Détail des dépenses</Text>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                  {expense.description && (
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                  )}
                </View>
                <View style={styles.expenseActions}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(expense.category) }]}>
                    <Text style={styles.categoryBadgeText}>{expense.category}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>{expense.amount}€</Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteExpense(expense.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.expensePaidBy}>Payé par: {expense.paidBy}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addForm: {
    margin: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  content: {
    flex: 1,
  },
  budgetSummary: {
    margin: 16,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contributionName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  contributionAmount: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  categoryTotal: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  expenseCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  expenseActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expensePaidBy: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
}); 