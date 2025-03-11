import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Category } from "../db/database";
import { categoryItemStyles as styles } from "../constants/Styles"; 

interface CategoryItemProps {
  category: Category;
  color: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, color }) => {
  return (
    <View style={styles.categoryItem}>
      <View
        style={[styles.categoryColorIndicator, { backgroundColor: color }]}
      />
      <Text style={styles.categoryName}>{category.name}:</Text>
    </View>
  );
};

const categoryItemStyles = StyleSheet.create({
  // Estilos locales para CategoryItem -  (¡Opcional! Podrías usar `constants/Styles.ts` también)
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Espacio entre items de categoría
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white", // Fondo blanco para cada item
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
  },
  categoryColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10, // Espacio entre el indicador de color y el texto
  },
  categoryName: {
    fontSize: 16,
    color: "#444", // Color del texto del nombre de categoría
    marginRight: 5,
  },
});

export default CategoryItem;
