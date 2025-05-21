import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform, // <--- Añade Platform aquí
} from "react-native";
import { VictoryPie } from "victory-native";
import { useExpenses } from "../context/ExpenseContext"; // Asegúrate que la ruta sea correcta
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; // Asegúrate que la ruta sea correcta

const HomeScreen = () => {
  // Obtener 'expenses' directamente del contexto
  const { expenses } = useExpenses();
  const navigation = useNavigation();
  const { colors, theme } = useTheme(); // Asegúrate que theme esté disponible

  // Calcular totalExpenses usando 'expenses' directamente
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calcular categoriesTotal usando 'expenses' directamente
  const categoriesTotal = React.useMemo(() => {
    return expenses.reduce(
      (acc: Array<{ category: string; total: number }>, expense) => {
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
      },
      [] as Array<{ category: string; total: number }>
    );
  }, [expenses]); // Depender solo de 'expenses'

  // Preparar pieChartData usando 'categoriesTotal'
  const pieChartData = categoriesTotal.map((item) => ({
    x: item.category,
    y: item.total,
  }));

  // Group expenses by month (esto puede permanecer si es útil para otras visualizaciones futuras)
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!(monthYear in acc)) {
      acc = { ...acc, [monthYear]: 0 };
    }

    acc = {
      ...acc,
      [monthYear]: (acc[monthYear as keyof typeof acc] || 0) + expense.amount,
    };
    return acc;
  }, {});

  // Convert to array for chart (esto puede permanecer si es útil para otras visualizaciones futuras)
  const monthlyData = Object.entries(monthlyExpenses)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .slice(-6); // Show last 6 months

  // Generate colors for the chart - using a diverse color palette
  const colorScale = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#9b59b6", // Purple
    "#F9A826", // Orange
    "#45B7D1", // Blue
    "#2ECC71", // Green
    "#FFC75F", // Yellow
    "#a55eea", // Violet
    "#FF9A76", // Salmon
    "#6C5CE7", // Indigo
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Total Expenses Card - Texto ajustado */}
      <View
        style={[
          styles.totalCard,
          {
            backgroundColor: colors.card,
            borderLeftWidth: 5,
            borderLeftColor: colors.primary,
          },
        ]}
      >
        <View style={styles.totalCardContent}>
          <View>
            {/* Texto simplificado */}
            <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>
              Gastos Totales
            </Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.totalIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet-outline" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Botón de añadir gasto */}
      <TouchableOpacity
        style={[styles.addExpenseButton, { backgroundColor: colors.primary }]} // Nuevo estilo
        onPress={() => navigation.navigate("Gastos" as never)}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle-outline" size={22} color="white" />
        <Text style={styles.addExpenseButtonText}>Añadir Gasto</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Resumen de Gastos
      </Text>

      {/* Chart container - Usar pieChartData */}
      {pieChartData.length > 0 ? (
        <View
          style={[
            styles.chartContainer,
            {
              backgroundColor: colors.card,
              // Aplicación de sombra específica para web y iOS aquí
              ...(Platform.OS === "web" && {
                boxShadow: `0px 4px 8px ${
                  theme === "dark"
                    ? "rgba(0,0,0,0.3)"
                    : "rgba(102,102,102,0.15)"
                }`, // Ajusta la opacidad si es necesario
              }),
              ...(Platform.OS === "ios" && {
                shadowColor: theme === "dark" ? "#000" : "#666", // Mantener la lógica original para iOS
              }),
            },
          ]}
        >
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Distribución por Categorías
          </Text>
          <VictoryPie
            data={pieChartData} // Usar pieChartData aquí
            colorScale={colorScale}
            width={320} // Ligeramente más ancho si es posible
            height={320}
            innerRadius={75} // <-- Añadido para efecto donut
            padAngle={1} // <-- Pequeño espacio entre slices
            padding={{ top: 20, bottom: 60, left: 60, right: 60 }} // Ajustar padding
            labelRadius={({ innerRadius }) => Number(innerRadius || 0) + 25} // <-- Ajustar radio de etiquetas
            labels={({ datum }) => `${datum.x}\n($${datum.y.toFixed(2)})`} // Mostrar categoría y monto en dos líneas
            style={{
              labels: {
                fontSize: 11, // <-- Reducir tamaño de fuente
                fill: colors.text,
                padding: 5, // Añadir padding a las etiquetas
              },
              parent: { marginTop: 0 }, // Ajustar margen si es necesario
            }}
          />
        </View>
      ) : (
        // Contenedor para cuando no hay datos
        <View
          style={[styles.emptyChartContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No hay gastos registrados
          </Text>
          <Text style={[styles.emptySubText, { color: colors.secondaryText }]}>
            Agrega gastos para ver estadísticas
          </Text>
        </View>
      )}

      {/* Category list - Usar categoriesTotal */}
      <View style={[styles.categoryList, { backgroundColor: colors.card }]}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="list" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Gastos por Categoría
          </Text>
        </View>

        {/* Usar categoriesTotal */}
        {categoriesTotal.length > 0 ? (
          categoriesTotal.map((item, index) => (
            <View
              key={index}
              style={[
                styles.categoryItem,
                {
                  borderBottomColor: colors.border,
                  backgroundColor:
                    index % 2 === 0
                      ? theme === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)"
                      : "transparent",
                },
              ]}
            >
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: colorScale[index % colorScale.length] },
                ]}
              />
              <Text style={[styles.categoryName, { color: colors.text }]}>
                {item.category}
              </Text>
              <Text style={[styles.categoryAmount, { color: colors.primary }]}>
                ${item.total.toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          // Texto ajustado para cuando no hay categorías
          <Text
            style={[styles.noCategoriesText, { color: colors.secondaryText }]}
          >
            Sin gastos registrados
          </Text>
        )}
      </View>

      {/* Botón flotante eliminado de aquí */}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Color de fondo por defecto
  },
  // Estilos del total card mejorados
  totalCard: {
    borderRadius: 12,
    padding: 0,
    marginBottom: 25,
    overflow: "hidden",
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 3px 5px rgba(0,0,0,0.15)",
      },
    }),
  },
  totalCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15, // Padding interno
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "bold",
  },
  totalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilo del título mejorado
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  // Estilos del contenedor del gráfico mejorados
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
    // backgroundColor: "white", // Se aplica dinámicamente con colors.card
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // shadowColor: "#000", // Se aplica dinámicamente y ahora con Platform.select
    // Sombra actualizada (la parte del color dinámico se maneja en el componente)
    ...Platform.select({
      ios: {
        // shadowColor se aplicará inline basado en el tema
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        // El color exacto del boxShadow se definirá inline en el componente
        // Aquí solo definimos la estructura general de la sombra para web
        // boxShadow: `0px 4px 8px ${theme === "dark" ? "rgba(0,0,0,0.15)" : "rgba(102,102,102,0.15)"}`, // Esto se moverá al JSX
      },
    }),
    minHeight: 350,
  },
  chartTitle: {
    fontSize: 18, // Ligeramente más grande
    fontWeight: "600",
    marginBottom: 15, // Más espacio debajo del título
    textAlign: "center",
  },
  // Estilos para el contenedor vacío del gráfico
  emptyChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderRadius: 15,
    padding: 30,
    height: 200, // Altura fija para el placeholder
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
      },
    }),
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  // Estilos de la lista de categorías mejorados
  categoryList: {
    // backgroundColor: "white", // Se aplica dinámicamente con colors.card
    borderRadius: 15,
    padding: 20,
    marginBottom: 80, // Espacio para el botón flotante
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
      },
    }),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 6, // Bordes redondeados leves
    marginBottom: 2, // Pequeño espacio entre items
  },
  colorIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
  },
  categoryName: {
    flex: 1, // Ocupa el espacio disponible
    fontSize: 16,
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noCategoriesText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  // Estilos del botón de añadir mejorados
  addExpenseButton: {
    flexDirection: "row", // Icono y texto en fila
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10, // Espacio después de la tarjeta total
    marginBottom: 25, // Espacio antes del título "Resumen de Gastos"
    // Sombra actualizada
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
      },
    }),
  },
  addExpenseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8, // Espacio entre icono y texto
  },

  // Estilos del botón flotante (Eliminados o comentados si prefieres)
  /*
  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  */

  // ... rest of existing styles ...
});

export default HomeScreen;