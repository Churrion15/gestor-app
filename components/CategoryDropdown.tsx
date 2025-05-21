import React from "react";
import { View, Text, StyleSheet } from "react-native"; // Text no se usa directamente aquí, podría eliminarse si no hay otros usos.
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";

// Revertido: Lista de categorías definida aquí
const categories = [
  "Todas las categorias",
  "Comida",
  "Transporte",
  "Ocio",
  "Hogar",
  "Salud",
  "Educación",
  "Otros",
];

interface CategoryDropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedValue,
  onValueChange,
}) => {
  const { colors, theme } = useTheme(); // Obtenemos 'theme' para la lógica condicional

  // Determinar el color del texto del ítem basado en el tema
  // Si el tema es oscuro, forzamos el texto a negro para que contraste con un posible fondo blanco del desplegable nativo.
  // Si el tema es claro, usamos el color de texto normal del tema.
  const itemTextColor = theme === 'dark' ? '#333333' : colors.text;
  const placeholderTextColor = theme === 'dark' ? '#666666' : colors.secondaryText;

  return (
    <View
      style={[
        styles.pickerContainer,
        { borderColor: colors.border, backgroundColor: colors.card }, 
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={[styles.picker, { color: colors.text }]} // Color del texto del valor seleccionado (cuando está cerrado)
        dropdownIconColor={colors.text}
        mode="dropdown"
      >
        {/* Placeholder Item */}
        <Picker.Item
          label="Selecciona una categoría..."
          value=""
          color={placeholderTextColor} // Usar el color de placeholder condicional
          // Se elimina style={{ backgroundColor: colors.card }} porque no afecta el menú desplegable
        />
        {/* Mapea la lista interna 'categories' */}
        {categories.map((category) => (
          <Picker.Item
            key={category}
            label={category}
            value={category}
            color={itemTextColor} // Usar el color de ítem condicional
            // Se elimina style={{ backgroundColor: colors.card }} porque no afecta el menú desplegable
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: "100%",
    width: "100%",
  },
});