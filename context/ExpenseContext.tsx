import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Exportar la interfaz Expense explícitamente
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface CategoryTotal {
  category: string;
  total: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, updatedExpense: Partial<Expense>) => void;
  categoriesTotal: CategoryTotal[];
}

const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  addExpense: () => {},
  removeExpense: () => {},
  updateExpense: () => {},
  categoriesTotal: [],
});

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from storage on mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const storedExpensesJson = await AsyncStorage.getItem("expenses");
        if (storedExpensesJson !== null) {
          // Comprobar explícitamente si no es null
          const parsedData = JSON.parse(storedExpensesJson);
          if (Array.isArray(parsedData)) {
            setExpenses(parsedData);
          } else {
            // Si los datos parseados no son un array (p.ej., era un string "null" o "{}")
            console.warn(
              "Los datos de gastos almacenados no son un array. Reiniciando a vacío.",
              parsedData
            );
            setExpenses([]);
          }
        } else {
          // No hay datos almacenados, inicializar con un array vacío
          setExpenses([]);
        }
      } catch (error) {
        // Capturar errores de AsyncStorage.getItem o JSON.parse
        console.error("Error al cargar los gastos del almacenamiento:", error);
        setExpenses([]); // Como fallback, usar un array vacío en caso de cualquier error
      }
    };

    loadExpenses();
  }, []); // El array de dependencias vacío significa que esto se ejecuta una vez al montar

  // Save expenses to storage whenever they change
  useEffect(() => {
    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
      } catch (error) {
        console.error("Error saving expenses:", error);
      }
    };

    saveExpenses();
  }, [expenses]);

  // Add a new expense
  const addExpense = (expense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  // Remove an expense
  const removeExpense = (id: string) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  // Calculate totals by category
  const categoriesTotal = expenses.reduce((acc: CategoryTotal[], expense) => {
    const existingCategory = acc.find(
      (item) => item.category === expense.category
    );

    if (existingCategory) {
      existingCategory.total += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        total: expense.amount,
      });
    }

    return acc;
  }, []);

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        removeExpense,
        updateExpense,
        categoriesTotal,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};