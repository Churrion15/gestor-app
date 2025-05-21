import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { BudgetProvider } from './context/BudgetContext';
import { StatusBar, Platform } from 'react-native';

// Importar las pantallas
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BudgetScreen from './screens/BudgetScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { theme, colors } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home'; // Valor por defecto

            // Lógica especial para el ícono de "Agregar Gasto"
            if (route.name === 'Agregar Gasto') {
              return <Ionicons name="add-circle" size={size * 1.2} color={colors.primary} />; // Más grande y siempre color primario
            }
            
            // Lógica para los íconos de las otras pestañas
            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Gastos') {
              iconName = focused ? 'cash' : 'cash-outline';
            } else if (route.name === 'Presupuestos') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Estadísticas') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Configuración') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            // Para todas las demás pestañas (excepto "Agregar Gasto"), usa el color y tamaño estándar
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondaryText,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        {/* Los comentarios problemáticos han sido eliminados de aquí */}
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Gastos" component={ExpensesScreen} />
        <Tab.Screen name="Agregar Gasto" component={AddExpenseScreen} />
        <Tab.Screen name="Presupuestos" component={BudgetScreen} />
        <Tab.Screen name="Estadísticas" component={StatsScreen} />
        <Tab.Screen name="Configuración" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <AppContent />
        </BudgetProvider>
      </ExpenseProvider>
    </ThemeProvider>
  );
}


