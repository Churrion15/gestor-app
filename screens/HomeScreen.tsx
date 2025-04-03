import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";
import { useExpenses } from "../context/ExpenseContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = () => {
  const { expenses, categoriesTotal } = useExpenses();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const [timeFilter, setTimeFilter] = React.useState("all"); // 'all', '24h', 'week', 'month', 'year'

  // Filter expenses based on selected time period
  const filteredExpenses = React.useMemo(() => {
    const now = new Date();

    switch (timeFilter) {
      case "24h":
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneDayAgo
        );

      case "week":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneWeekAgo
        );

      case "month":
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneMonthAgo
        );

      case "year":
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneYearAgo
        );

      default:
        return expenses;
    }
  }, [expenses, timeFilter]);

  // Calculate total expenses for filtered data
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate categories total for filtered data
  const filteredCategoriesTotal = React.useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
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
    }, []);
  }, [filteredExpenses]);

  // Prepare data for the chart
  const pieChartData = filteredCategoriesTotal.map((item) => ({
    x: item.category,
    y: item.total,
  }));

  // Group expenses by month
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }

    acc[monthYear] += expense.amount;
    return acc;
  }, {});

  // Convert to array for chart
  const monthlyData = Object.entries(monthlyExpenses)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .slice(-6); // Show last 6 months

  // Prepare data for the chart
  const chartData = categoriesTotal.map((item) => ({
    x: item.category,
    y: item.total,
  }));

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
      {/* Time Filter Buttons - Improved styling */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "all" && [
                styles.activeFilterButton,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setTimeFilter("all")}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === "all" && styles.activeFilterText,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "24h" && [
                styles.activeFilterButton,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setTimeFilter("24h")}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === "24h" && styles.activeFilterText,
              ]}
            >
              24h
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "week" && [
                styles.activeFilterButton,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setTimeFilter("week")}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === "week" && styles.activeFilterText,
              ]}
            >
              Semana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "month" && [
                styles.activeFilterButton,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setTimeFilter("month")}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === "month" && styles.activeFilterText,
              ]}
            >
              Mes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "year" && [
                styles.activeFilterButton,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setTimeFilter("year")}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === "year" && styles.activeFilterText,
              ]}
            >
              Año
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Total Expenses Card - Enhanced styling */}
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
            <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>
              Gastos{" "}
              {timeFilter !== "all" ? "en el período seleccionado" : "Totales"}
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

      <Text style={[styles.title, { color: colors.text }]}>
        Resumen de Gastos
      </Text>

      {/* Chart container with improved styling */}
      {chartData.length > 0 ? (
        <View
          style={[
            styles.chartContainer,
            {
              backgroundColor: colors.card,
              shadowColor: theme === "dark" ? "#000" : "#666",
            },
          ]}
        >
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Distribución por Categorías
          </Text>
          <VictoryPie
            data={chartData}
            colorScale={colorScale}
            width={300}
            height={300}
            padding={50}
            labelRadius={({ innerRadius }: { innerRadius: number }) =>
              (innerRadius || 0) + 30
            }
            style={{
              labels: { fontSize: 14, fill: colors.text },
              parent: { marginTop: -20 },
            }}
          />
        </View>
      ) : (
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

      {/* Category list with improved styling */}
      <View style={[styles.categoryList, { backgroundColor: colors.card }]}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="list" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Gastos por Categoría
          </Text>
        </View>

        {filteredCategoriesTotal.length > 0 ? (
          filteredCategoriesTotal.map((item, index) => (
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
          <Text
            style={[styles.noCategoriesText, { color: colors.secondaryText }]}
          >
            Sin gastos en este período
          </Text>
        )}
      </View>

      {/* Improved add button with shadow and animation */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
        onPress={() => navigation.navigate("Gastos" as never)}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  // Improved filter styles
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeFilterButton: {
    backgroundColor: "#9b59b6",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
  },
  // Improved total card
  totalCard: {
    borderRadius: 12,
    padding: 0,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  totalCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
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
  // Improved title
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  // Improved chart container
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Mejoras a estilos existentes
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  // Improved category list
  categoryList: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
    borderRadius: 6,
    marginBottom: 2,
  },
  colorIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // Improved add button
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
  // Keep other existing styles
});

export default HomeScreen;
