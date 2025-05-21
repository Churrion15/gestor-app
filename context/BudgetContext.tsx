import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaz para definir la estructura de un presupuesto
export interface Budget {
  id: string; // Identificador único
  category: string; // Categoría a la que aplica el presupuesto
  amount: number; // Monto del presupuesto
}

// Interfaz para definir el tipo del contexto
interface BudgetContextType {
  budgets: Budget[]; // Array de presupuestos
  addBudget: (budget: Budget) => void; // Función para añadir un presupuesto
  updateBudget: (updatedBudget: Budget) => void; // Función para actualizar un presupuesto
  deleteBudget: (id: string) => void; // Función para eliminar un presupuesto
  getBudgetByCategory: (category: string) => Budget | undefined; // Función para obtener presupuesto por categoría
}

// Crear el contexto con valores por defecto
const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  addBudget: () => {},
  updateBudget: () => {},
  deleteBudget: () => {},
  getBudgetByCategory: () => undefined,
});

// Hook personalizado para usar el contexto fácilmente
export const useBudgets = () => useContext(BudgetContext);

// Props para el Provider
interface BudgetProviderProps {
  children: ReactNode;
}

// Componente Provider que envuelve la aplicación
export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const storageKey = 'budgets'; // Clave para AsyncStorage

  // Cargar presupuestos desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const storedBudgets = await AsyncStorage.getItem(storageKey);
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        }
      } catch (error) {
        console.error('Error loading budgets from storage:', error);
      }
    };
    loadBudgets();
  }, []);

  // Guardar presupuestos en AsyncStorage cada vez que cambien
  useEffect(() => {
    const saveBudgets = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(budgets));
      } catch (error) {
        console.error('Error saving budgets to storage:', error);
      }
    };
    // Solo guardar si budgets ha sido inicializado (para evitar guardar el array vacío inicial antes de cargar)
    if (budgets.length > 0 || AsyncStorage.getItem(storageKey) !== null) {
       saveBudgets();
    }
  }, [budgets]);

  // Función para añadir un nuevo presupuesto
  const addBudget = (budget: Budget) => {
    // Asegurarse de no añadir duplicados por categoría si ya existe
    if (!budgets.some(b => b.category === budget.category)) {
        setBudgets((prevBudgets) => [...prevBudgets, budget]);
    } else {
        console.warn(`Budget for category "${budget.category}" already exists.`);
        // Podrías lanzar un Alert aquí si prefieres feedback directo al usuario
    }
  };

  // Función para actualizar un presupuesto existente
  const updateBudget = (updatedBudget: Budget) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  // Función para eliminar un presupuesto por su ID
  const deleteBudget = (id: string) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id)
    );
  };

  // Función para obtener un presupuesto específico por categoría
  const getBudgetByCategory = (category: string): Budget | undefined => {
    return budgets.find(budget => budget.category === category);
  };


  // Valor que proveerá el contexto
  const value = {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};