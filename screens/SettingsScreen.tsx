import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>

      <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          Modo Oscuro
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: colors.primary }}
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
});

export default SettingsScreen;
