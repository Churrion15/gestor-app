import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensesScreen = () => {
  const { expenses, addExpense, removeExpense, updateExpense } = useExpenses();
  const { colors, theme } = useTheme();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Reset form when not editing
  useEffect(() => {
    if (!editingId) {
      setTitle("");
      setAmount("");
      setCategory("");
    }
  }, [editingId]);

  const handleSaveExpense = () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (editingId) {
      // Update existing expense
      updateExpense(editingId, {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date().toLocaleDateString(),
      });
      setEditingId(null);
    } else {
      // Add new expense
      addExpense({
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        category,
        date: new Date().toLocaleDateString(),
      });
    }

    // Clear form and close modal
    setTitle("");
    setAmount("");
    setCategory("");
    setModalVisible(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setModalVisible(true);
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      "Eliminar Gasto",
      "¿Estás seguro de que quieres eliminar este gasto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => removeExpense(id),
          style: "destructive",
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={[styles.expenseItem, { 
      backgroundColor: colors.card,
      borderBottomColor: colors.border
    }]}>
      <View style={styles.expenseInfo}>
        <Text style={[styles.expenseTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.expenseCategory, { color: colors.secondaryText }]}>{item.category}</Text>
        <Text style={[styles.expenseDate, { color: colors.secondaryText }]}>{item.date}</Text>
      </View>
      <View style={styles.expenseAmount}>
        <Text style={[styles.amountText, { color: colors.primary }]}>${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.expenseActions}>
        <TouchableOpacity 
          onPress={() => handleEditExpense(item)}
          style={styles.actionButton}
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDeleteExpense(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Gastos</Text>
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setEditingId(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Nuevo Gasto</Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        ListEmptyComponent={
          <Text style={[styles.emptyMessage, { color: colors.secondaryText }]}>No hay gastos registrados</Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { 
            backgroundColor: colors.card,
            shadowColor: theme === 'dark' ? '#000' : '#666'
          }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
            </Text>
            
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: theme === 'dark' ? '#333' : '#fff'
              }]}
              placeholder="Título"
              placeholderTextColor={colors.secondaryText}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: theme === 'dark' ? '#333' : '#fff'
              }]}
              placeholder="Monto"
              placeholderTextColor={colors.secondaryText}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: theme === 'dark' ? '#333' : '#fff'
              }]}
              placeholder="Categoría"
              placeholderTextColor={colors.secondaryText}
              value={category}
              onChangeText={setCategory}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, {
                  backgroundColor: theme === 'dark' ? '#444' : '#f1f1f1'
                }]}
                onPress={() => {
                  setModalVisible(false);
                  if (editingId) setEditingId(null);
                }}
              >
                <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#333' }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveExpense}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  expenseItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  expenseAmount: {
    justifyContent: "center",
    marginRight: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  expenseActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ExpensesScreen;
