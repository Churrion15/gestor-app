import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Configuración</Text>

      <View style={[styles.settingItem, isDarkMode && styles.darkSettingItem]}>
        <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Modo Oscuro</Text>
        <Switch 
          value={isDarkMode} 
          onValueChange={toggleTheme} 
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  darkContainer: {
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  darkText: {
    color: '#ffffff'
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1'
  },
  darkSettingItem: {
    borderBottomColor: '#333333'
  },
  settingLabel: {
    fontSize: 16
  }
});

export default SettingsScreen;