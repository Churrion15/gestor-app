import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../constants/categories';

interface Budget {
  category: string;
  amount: number;
}

const BudgetScreen = () => {
  const { colors, theme } = useTheme();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleSaveBudget = () => {
    if (!editingCategory || !budgetAmount) {
      Alert.alert('Error', 'Por favor selecciona una categoría y un monto');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    // Actualizar o añadir presupuesto
    const existingIndex = budgets.findIndex(b => b.category === editingCategory);
    if (existingIndex >= 0) {
      const newBudgets = [...budgets];
      newBudgets[existingIndex].amount = amount;
      setBudgets(newBudgets);
    } else {
      setBudgets([...budgets, { category: editingCategory, amount }]);
    }

    // Limpiar formulario
    setEditingCategory(null);
    setBudgetAmount('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Presupuestos</Text>
      
      <View style={styles.formContainer}>
        <TouchableOpacity 
          style={[styles.categorySelector, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}
          onPress={() => {
            // Mostrar selector de categoría
          }}
        >
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {editingCategory || 'Seleccionar categoría'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: colors.text,
              borderColor: colors.border
            }
          ]}
          placeholder="Monto"
          placeholderTextColor={colors.secondaryText}
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveBudget}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <View style={[styles.budgetItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.budgetCategory, { color: colors.text }]}>{item.category}</Text>
            <Text style={[styles.budgetAmount, { color: colors.primary }]}>${item.amount.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No hay presupuestos configurados
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectorText: {
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default BudgetScreen;