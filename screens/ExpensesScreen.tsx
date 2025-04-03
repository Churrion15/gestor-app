import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from '../constants/categories';
import { CategoryDropdown } from '../components/CategoryDropdown';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
} 

const ExpensesScreen = () => {
  const { expenses, addExpense, removeExpense, updateExpense } = useExpenses();
  const { colors, theme } = useTheme();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [isModalDropdownVisible, setIsModalDropdownVisible] = useState(false);

  // Reset form when not editing
  // Eliminar este useEffect duplicado
  useEffect(() => {
    if (!editingId) {
      setTitle("");
      setAmount("");
      setCategory("");
    }
  }, [editingId]);
  
  // Mantener solo este useEffect
  const [description, setDescription] = useState("");
  
  useEffect(() => {
    if (!editingId) {
      setTitle("");
      setAmount("");
      setCategory("");
      setDescription("");
    }
  }, [editingId]);
  
  // Modificar handleSaveExpense para incluir la descripción
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
        description, // Añadir descripción
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
        description, // Añadir descripción
        date: new Date().toLocaleDateString(),
      });
    }
  
    // Clear form and close modal
    setTitle("");
    setAmount("");
    setCategory("");
    setDescription(""); // Limpiar descripción
    setModalVisible(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description || ""); // Añadir esta línea
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
          onPress: () => {
            // Añadir un pequeño retraso para evitar problemas en web
            setTimeout(() => {
              removeExpense(id);
            }, 100);
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleEditExpense(item)}
      style={[
        styles.expenseItem,
        {
          backgroundColor: colors.card,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      <View style={styles.expenseInfo}>
        <Text style={[styles.expenseTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        
        {/* Mostrar descripción si existe */}
        {item.description && (
          <Text style={[styles.expenseDescription, { color: colors.secondaryText }]}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.categoryContainer}>
          <Ionicons name="pricetag" size={14} color={colors.secondaryText} />
          <Text
            style={[styles.expenseCategory, { color: colors.secondaryText }]}
          >
            {item.category}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={14} color={colors.secondaryText} />
          <Text style={[styles.expenseDate, { color: colors.secondaryText }]}>
            {item.date}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.expenseAmount}>
          <Text style={[styles.amountText, { color: colors.primary }]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.expenseActions}>
          <TouchableOpacity
            onPress={() => handleEditExpense(item)}
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            accessibilityRole="button"
            accessibilityLabel="Editar gasto"
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Evitar que el evento se propague al TouchableOpacity padre
              handleDeleteExpense(item.id);
            }}
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            accessibilityRole="button"
            accessibilityLabel="Eliminar gasto"
          >
            <Ionicons name="trash" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modificar el filtrado de gastos
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      expense.title.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower);

    return selectedFilter === "Todas"
      ? matchesSearch
      : matchesSearch && expense.category === selectedFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Gastos</Text>

      {/* Barra de búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar gastos..."
          placeholderTextColor={colors.secondaryText}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm !== "" && (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown para filtros */}
      <CategoryDropdown
        value={selectedFilter}
        onChange={setSelectedFilter}
        isVisible={isFilterDropdownVisible}
        setIsVisible={setIsFilterDropdownVisible}
        placeholder="Todas las categorías"
        theme={theme}
        colors={colors}
      />

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
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        ListEmptyComponent={
          <Text style={[styles.emptyMessage, { color: colors.secondaryText }]}>
            {searchTerm
              ? "No se encontraron gastos"
              : "No hay gastos registrados"}
          </Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingId ? "Editar Gasto" : "Nuevo Gasto"}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                },
              ]}
              placeholder="Título"
              placeholderTextColor={colors.secondaryText}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                },
              ]}
              placeholder="Monto"
              placeholderTextColor={colors.secondaryText}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
      
            {/* Nuevo campo de descripción */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                },
              ]}
              placeholder="Descripción (opcional)"
              placeholderTextColor={colors.secondaryText}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <CategoryDropdown
              value={category}
              onChange={setCategory}
              isVisible={isModalDropdownVisible}
              setIsVisible={setIsModalDropdownVisible}
              theme={theme}
              colors={colors}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  {
                    backgroundColor: theme === "dark" ? "#444" : "#f1f1f1",
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  if (editingId) setEditingId(null);
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme === "dark" ? "#fff" : "#333" },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: colors.primary },
                ]}
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  expenseCategory: {
    fontSize: 14,
    marginLeft: 4,
  },
  expenseDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "bold",
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
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    padding: 5,
  },
  expenseDescription: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 6,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default ExpensesScreen;
