import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { StatusBar } from 'react-native';
import StatsScreen from './screens/StatsScreen';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { theme, colors } = useTheme();
  
  const navigationTheme = {
    ...(theme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.notification,
    },
  };

  return (
    <>
      {Platform.OS !== 'web' && (
        <StatusBar 
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.background}
        />
      )}
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'home';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Gastos') {
                iconName = focused ? 'cash' : 'cash-outline';
              } else if (route.name === 'Estadísticas') {
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              } else if (route.name === 'Configuración') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

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
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Gastos" component={ExpensesScreen} />
          <Tab.Screen name="Estadísticas" component={StatsScreen} />
          <Tab.Screen name="Configuración" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default App;