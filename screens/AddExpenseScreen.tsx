import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CategoryDropdown } from "../components/CategoryDropdown";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Define el tipo para los parámetros de la ruta
type AddExpenseScreenRouteParams = {
  expenseId?: string;
};
type AddExpenseScreenRouteProp = RouteProp<{ params: AddExpenseScreenRouteParams }, 'Agregar Gasto'>;

const AddExpenseScreen = () => {
  const { expenses, addExpense, updateExpense } = useExpenses();
  const { colors, theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AddExpenseScreenRouteProp>();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const expenseId = route.params?.expenseId;
    if (expenseId) {
      const expenseToEdit = expenses.find((exp) => exp.id === expenseId);
      if (expenseToEdit) {
        setEditingId(expenseToEdit.id);
        setTitle(expenseToEdit.title);
        setAmount(expenseToEdit.amount.toString());
        setCategory(expenseToEdit.category);
        setDescription(expenseToEdit.description || "");
      }
    } else {
      // Si no hay expenseId, es un nuevo gasto, limpiar campos (opcional, ya que el estado inicial es vacío)
      setTitle("");
      setAmount("");
      setCategory("");
      setDescription("");
      setEditingId(null);
    }
  }, [route.params?.expenseId, expenses]);

  const handleSaveExpense = () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "Por favor completa el título, monto y categoría.");
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "El monto debe ser un número positivo.");
      return;
    }

    const expenseData = {
      title,
      amount: numericAmount,
      category,
      description,
      date: new Date().toLocaleDateString(), // O la fecha que prefieras
    };

    if (editingId) {
      updateExpense(editingId, expenseData);
    } else {
      addExpense({ ...expenseData, id: Date.now().toString() });
    }

    // Navegar de vuelta a la pantalla de Gastos después de guardar
    // O a la pantalla de Inicio, según prefieras
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Gastos'); // Fallback si no puede ir atrás
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {editingId ? "Editar Gasto" : "Agregar Nuevo Gasto"}
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

      <TextInput
        style={[
          styles.input,
          styles.textArea,
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
        selectedValue={category}
        onValueChange={setCategory}
        // No necesita props 'theme' ni 'colors' ya que usa useTheme internamente
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cancelButton,
            {
              backgroundColor: theme === "dark" ? "#444" : "#f1f1f1",
            },
          ]}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Gastos')}
        >
          <Text style={[styles.buttonText, { color: theme === "dark" ? colors.text : "#333" }]}>
            Cancelar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleSaveExpense}
        >
          <Ionicons name="save-outline" size={20} color="white" style={{marginRight: 5}} />
          <Text style={[styles.buttonText, { color: "white" }]}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
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
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top', // Para Android
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    // backgroundColor se aplica dinámicamente
  },
  saveButton: {
    // backgroundColor se aplica dinámicamente
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddExpenseScreen;