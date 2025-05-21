import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useBudgets, Budget } from '../context/BudgetContext'; // <-- Revisa que la ruta y exportaciones sean correctas
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext'; // <-- Revisa que 'colors' tenga 'inputBackground', 'text', 'border'
import { Ionicons } from '@expo/vector-icons';
import { CategoryDropdown } from '../components/CategoryDropdown'; // <-- Revisa que la ruta y props ('selectedValue') sean correctas

const BudgetScreen = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();
  const { colors, theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const monthlyExpensesByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Linea 23: Asegúrate que 'budgets' sea siempre un array
    return budgets.reduce((acc, budget) => {
      const categoryExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expense.category === budget.category &&
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      acc[budget.category] = categoryExpenses;
      return acc;
    }, {} as { [key: string]: number });
  }, [expenses, budgets]);

  const handleAddOrUpdateBudget = () => {
    const numericAmount = parseFloat(amount);
    if (!selectedCategory || isNaN(numericAmount) || numericAmount <= 0) {
      // Traducido:
      Alert.alert('Error', 'Por favor selecciona una categoría e ingresa un monto positivo válido.');
      return;
    }

    if (editingBudget) {
      // Linea 50: Añadido tipo explícito (b: Budget) para consistencia
      if (selectedCategory !== editingBudget.category && budgets.some((b: Budget) => b.category === selectedCategory)) {
         // Traducido:
         Alert.alert('Error', `Ya existe un presupuesto para la categoría "${selectedCategory}".`);
         return;
      }
      updateBudget({ ...editingBudget, category: selectedCategory, amount: numericAmount });
      // Traducido:
      Alert.alert('Éxito', '¡Presupuesto actualizado exitosamente!');
    } else {
       if (budgets.some((b: Budget) => b.category === selectedCategory)) {
         // Traducido:
         Alert.alert('Error', `Ya existe un presupuesto para la categoría "${selectedCategory}".`);
         return;
       }
      addBudget({ id: Date.now().toString(), category: selectedCategory, amount: numericAmount });
      // Traducido:
      Alert.alert('Éxito', '¡Presupuesto añadido exitosamente!');
    }

    setEditingBudget(null);
    setSelectedCategory('');
    setAmount('');
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setSelectedCategory(budget.category);
    setAmount(budget.amount.toString());
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      // Traducido:
      'Confirmar Eliminación',
      // Traducido:
      '¿Estás seguro de que quieres eliminar este presupuesto?',
      [
        // Traducido (ya estaba):
        { text: 'Cancelar', style: 'cancel' },
        // Traducido (ya estaba):
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteBudget(id) },
      ]
    );
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const spentAmount = monthlyExpensesByCategory[item.category] || 0;
    const remainingAmount = item.amount - spentAmount;
    const isOverBudget = remainingAmount < 0;
    const progress = item.amount > 0 ? (spentAmount / item.amount) * 100 : 0;

    return (
      <View style={[styles.budgetItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.budgetInfo}>
          <Text style={[styles.categoryText, { color: colors.text }]}>{item.category}</Text>
          <Text style={[styles.amountText, { color: colors.secondaryText }]}>
            {/* Traducido: */}
            Presupuesto: ${item.amount.toFixed(2)}
          </Text>
          <Text style={[styles.spentText, { color: isOverBudget ? colors.notification : colors.primary }]}>
            {/* Traducido: */}
            Gastado: ${spentAmount.toFixed(2)}
          </Text>
          <Text style={[styles.remainingText, { color: isOverBudget ? colors.notification : (theme === 'dark' ? '#4CAF50' : '#2E7D32') }]}>
            {/* Traducido: */}
            {isOverBudget ? 'Excedido por:' : 'Restante:'} ${Math.abs(remainingAmount).toFixed(2)}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: isOverBudget ? colors.notification : colors.primary
             }]} />
          </View>
        </View>
        <View style={styles.budgetActions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
            <Ionicons name="trash" size={20} color={colors.notification} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContentContainer}>
      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>
          {/* Traducido: */}
          {editingBudget ? 'Editar Presupuesto' : 'Añadir Nuevo Presupuesto'}
        </Text>
        {/* Linea 138: Verifica que CategoryDropdown acepte 'selectedValue' */}
        <CategoryDropdown
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />
        {/* Linea 144: Verifica que 'styles.input' exista y 'colors' tenga las propiedades necesarias */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          // Traducido:
          placeholder="Monto"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleAddOrUpdateBudget}
        >
          {/* Traducido: */}
          <Text style={styles.buttonText}>{editingBudget ? 'Actualizar Presupuesto' : 'Añadir Presupuesto'}</Text>
        </TouchableOpacity>
        {editingBudget && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { backgroundColor: colors.secondaryText }]}
            onPress={() => {
              setEditingBudget(null);
              setSelectedCategory('');
              setAmount('');
            }}
          >
            {/* Traducido: */}
            <Text style={styles.buttonText}>Cancelar Edición</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Traducido: */}
      <Text style={[styles.listTitle, { color: colors.text }]}>Presupuestos Mensuales</Text>
      {budgets.length > 0 ? (
        <FlatList
          data={budgets}
          renderItem={renderBudgetItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          scrollEnabled={false} // Disable FlatList scrolling within ScrollView
        />
      ) : (
        <View style={styles.emptyContainer}>
            {/* Traducido: */}
            <Text style={[styles.emptyText, {color: colors.secondaryText}]}>Aún no hay presupuestos definidos.</Text>
            {/* Traducido: */}
            <Text style={[styles.emptySubText, {color: colors.secondaryText}]}>Añade un presupuesto usando el formulario de arriba.</Text>
        </View>
      )}
    </ScrollView>
  );
};

// Asegúrate que todos los estilos usados (input, etc.) estén definidos aquí abajo
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
     padding: 20,
     flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: { // <-- Asegúrate que este estilo exista
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    // Estilos específicos si son necesarios
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    // Estilos de la lista
  },
  budgetItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetInfo: {
    flex: 1,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  amountText: {
    fontSize: 14,
    marginBottom: 4,
  },
  spentText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  budgetActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  emptyText: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 10,
  },
  emptySubText: {
      fontSize: 14,
      textAlign: 'center',
  }
});

export default BudgetScreen;