import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  // Modal, // MODAL YA NO SE USA AQUÍ
  Platform, 
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
// import { CATEGORIES } from "../constants/categories"; // Eliminada importación no utilizada
import { CategoryDropdown } from "../components/CategoryDropdown";
import { useRoute, useNavigation } from '@react-navigation/native'; // useRoute ya no es necesario para openAddModal

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

// type ExpensesScreenRouteProp = import('@react-navigation/native').RouteProp<{ params: { openAddModal?: boolean } }, 'Gastos'>; // YA NO SE NECESITA


const ExpensesScreen = () => {
  const { expenses, addExpense, removeExpense, updateExpense } = useExpenses(); // addExpense y updateExpense ya no se usan directamente aquí
  const { colors, theme } = useTheme();
  // ESTADOS DEL FORMULARIO DEL MODAL ELIMINADOS:
  // const [title, setTitle] = useState("");
  // const [amount, setAmount] = useState("");
  // const [category, setCategory] = useState("");
  // const [editingId, setEditingId] = useState<string | null>(null);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [description, setDescription] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>(
    "Todas las categorias"
  );

  // const route = useRoute<ExpensesScreenRouteProp>(); // YA NO SE NECESITA
  const navigation = useNavigation(); 

  // EFECTOS RELACIONADOS CON EL MODAL Y LIMPIEZA DE FORMULARIO ELIMINADOS
  // useEffect(() => {
  //   if (route.params?.openAddModal) {
  //     setEditingId(null); 
  //     setTitle("");
  //     setAmount("");
  //     setCategory(""); 
  //     setDescription("");
  //     setModalVisible(true);
  //     navigation.setParams({ openAddModal: false });
  //   }
  // }, [route.params?.openAddModal, navigation]);

  // useEffect(() => {
  //   if (!editingId) {
  //   }
  // }, [editingId]);

  // useEffect(() => {
  //   if (!editingId && !modalVisible) { 
  //     setTitle("");
  //     setAmount("");
  //     setCategory("");
  //     setDescription("");
  //   }
  // }, [editingId, modalVisible]);

  // handleSaveExpense SE MUEVE A AddExpenseScreen.tsx
  // const handleSaveExpense = () => { ... };

  const handleEditExpense = (expense: Expense) => {
    // NAVEGAR A AddExpenseScreen CON EL ID DEL GASTO
    navigation.navigate('Agregar Gasto', { expenseId: expense.id });
  };

  const handleDeleteExpense = (id: string) => {
    if (Platform.OS === "web") {
      // Web-specific implementation
      if (window.confirm("¿Estás seguro de que quieres eliminar este gasto?")) {
        removeExpense(id);
      }
    } else {
      // Mobile implementation
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
    }
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleEditExpense(item)} // Esto ahora navega
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
          <Text
            style={[styles.expenseDescription, { color: colors.secondaryText }]}
          >
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

    // Corregido: Comparar con el valor exacto del item del Picker
    return selectedFilter === "Todas las categorias"
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
        // Corregido: Usa selectedValue para el valor y onValueChange para la función
        selectedValue={selectedFilter}
        onValueChange={setSelectedFilter}
        // No necesita props 'theme' ni 'colors'
      />

      {/* EL BOTÓN DE "NUEVO GASTO" Y EL MODAL SE ELIMINAN DE AQUÍ */}
      
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

      {/* MODAL ELIMINADO */}
      {/* <Modal ... > ... </Modal> */}
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
    backgroundColor: "white", // Este color será sobrescrito por colors.card
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "space-between",
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      },
    }),
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
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
      },
    }),
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
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 3px rgba(0,0,0,0.1)",
      },
    }),
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
    fontStyle: "italic",
    color: "#666",
  },
});

export default ExpensesScreen;
