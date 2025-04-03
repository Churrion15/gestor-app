import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define Category interface locally instead of importing from database
interface Category {
  name: string;
  id?: string;
}

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

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: "#444",
    marginRight: 5,
  },
});

export default CategoryItem;
