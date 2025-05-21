import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Importar useTheme

// Define Category interface locally instead of importing from database
interface Category {
  name: string;
  id?: string;
}

interface CategoryItemProps {
  category: Category;
  color: string; // El color para el indicador se sigue pasando como prop
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, color }) => {
  const { colors } = useTheme(); // Obtener colores del tema

  return (
    // Modificado: Usar colors.card para el fondo
    <View style={[styles.categoryItem, { backgroundColor: colors.card }]}>
      <View
        style={[styles.categoryColorIndicator, { backgroundColor: color }]}
      />
      {/* Modificado: Quitar los dos puntos (:) */}
      <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 10, // Ligeramente más padding vertical
    paddingHorizontal: 15, // Ligeramente más padding horizontal
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, // Sombra más sutil
    shadowOpacity: 0.08, // Sombra más sutil
    shadowRadius: 2,
    elevation: 1, // Elevación sutil
  },
  categoryColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12, // Un poco más de espacio
  },
  categoryName: {
    fontSize: 16,
    // color: "#444", // Color ahora viene del tema
    marginRight: 5,
  },
});

export default CategoryItem;
