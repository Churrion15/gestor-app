import React from 'react';
// Añadir TouchableOpacity
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';

interface ExpenseData {
  x: string;
  y: number;
}

const StatsScreen = () => {
  const { expenses } = useExpenses();
  const { colors, theme } = useTheme();
  const windowWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  const chartWidth = isWeb ? Math.min(500, windowWidth * 0.9) : windowWidth * 0.9;

  const [timeFilter, setTimeFilter] = React.useState("all"); 

  const filteredExpenses = React.useMemo(() => {
    const now = new Date();
    switch (timeFilter) {
      case "24h":
        // Mantener esta lógica
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneDayAgo
        );
      case "week":
        // Mantener esta lógica
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneWeekAgo
        );
      case "month":
        // Refinar cálculo para 'un mes atrás'
        const oneMonthAgo = new Date(); // Crear nueva instancia
        oneMonthAgo.setMonth(now.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0); // Opcional: asegurar inicio del día
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneMonthAgo
        );
      case "year":
        // Mantener esta lógica, pero podemos asegurar el inicio del día
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        oneYearAgo.setHours(0, 0, 0, 0); // Opcional: comparar desde el inicio del día
        return expenses.filter(
          (expense) => new Date(expense.date) >= oneYearAgo
        );
      default:
        return expenses;
    }
  }, [expenses, timeFilter]);

  const totalGastado = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const promedioGastoFiltrado = totalGastado / (filteredExpenses.length || 1);
  const numeroDeTransacciones = filteredExpenses.length; 

  let highestExpense = { title: 'N/A', amount: 0 };
  let lowestExpense = { title: 'N/A', amount: 0 };

  if (numeroDeTransacciones > 0) {
    highestExpense = filteredExpenses.reduce(
      (prev, current) => (current.amount > prev.amount ? { title: current.title, amount: current.amount } : prev),
      { title: filteredExpenses[0].title, amount: filteredExpenses[0].amount }
    );
    lowestExpense = filteredExpenses.reduce(
      (prev, current) => (current.amount < prev.amount ? { title: current.title, amount: current.amount } : prev),
      { title: filteredExpenses[0].title, amount: filteredExpenses[0].amount }
    );
  }

  // Nuevo: Calcular categoría más frecuente (por número de transacciones)
  const transactionsPerCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let mostFrequentCategory = { name: 'N/A', count: 0 };
  if (Object.keys(transactionsPerCategory).length > 0) {
    mostFrequentCategory = Object.entries(transactionsPerCategory).reduce(
      (prev, [category, count]) => (count > prev.count ? { name: category, count } : prev),
      { name: '', count: 0 } // Inicializar con valores que serán superados
    );
     // Si todos tienen 1, el primero encontrado será el "más frecuente"
    if (mostFrequentCategory.name === '' && Object.keys(transactionsPerCategory).length > 0) {
        const firstCategory = Object.keys(transactionsPerCategory)[0];
        mostFrequentCategory = { name: firstCategory, count: transactionsPerCategory[firstCategory]};
    }
  }


  const categoryData = filteredExpenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.x === expense.category);
    if (existingCategory) {
      existingCategory.y += expense.amount;
    } else {
      acc.push({ x: expense.category, y: expense.amount });
    }
    return acc;
  }, [] as ExpenseData[]);

  // Colores para el gráfico (puedes usar los mismos que en HomeScreen)
  const colorScale = [
    '#FF6B6B', '#4ECDC4', '#9b59b6', '#F9A826', '#45B7D1',
    '#2ECC71', '#FFC75F', '#a55eea', '#FF9A76', '#6C5CE7'
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* --- Filtros de Tiempo --- */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {/* Botón Todos */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === "all" && [styles.activeFilterButton, { backgroundColor: colors.primary }],
            ]}
            onPress={() => setTimeFilter("all")}
          >
            <Text style={[styles.filterButtonText, timeFilter === "all" && styles.activeFilterText]}>
              Todos
            </Text>
          </TouchableOpacity>
          {/* Botón 24h */}
          <TouchableOpacity
             style={[
              styles.filterButton,
              timeFilter === "24h" && [styles.activeFilterButton, { backgroundColor: colors.primary }],
            ]}
            onPress={() => setTimeFilter("24h")}
          >
            <Text style={[styles.filterButtonText, timeFilter === "24h" && styles.activeFilterText]}>
              24h
            </Text>
          </TouchableOpacity>
          {/* Botón Semana */}
           <TouchableOpacity
             style={[
              styles.filterButton,
              timeFilter === "week" && [styles.activeFilterButton, { backgroundColor: colors.primary }],
            ]}
            onPress={() => setTimeFilter("week")}
          >
            <Text style={[styles.filterButtonText, timeFilter === "week" && styles.activeFilterText]}>
              Semana
            </Text>
          </TouchableOpacity>
          {/* Botón Mes */}
           <TouchableOpacity
             style={[
              styles.filterButton,
              timeFilter === "month" && [styles.activeFilterButton, { backgroundColor: colors.primary }],
            ]}
            onPress={() => setTimeFilter("month")}
          >
            <Text style={[styles.filterButtonText, timeFilter === "month" && styles.activeFilterText]}>
              Mes
            </Text>
          </TouchableOpacity>
          {/* Botón Año */}
           <TouchableOpacity
             style={[
              styles.filterButton,
              timeFilter === "year" && [styles.activeFilterButton, { backgroundColor: colors.primary }],
            ]}
            onPress={() => setTimeFilter("year")}
          >
            <Text style={[styles.filterButtonText, timeFilter === "year" && styles.activeFilterText]}>
              Año
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* --- Fin: Añadir botones de filtro --- */}


      {/* --- Tarjeta de Resumen General --- */}
      <View style={[styles.card, styles.headerCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Gastos {timeFilter !== 'all' ? `(${timeFilter})` : 'Totales'}
        </Text>
        <Text style={[styles.totalAmount, { color: colors.primary }]}>
          ${totalGastado.toFixed(2)}
        </Text>
        <Text style={[styles.averageText, { color: colors.secondaryText }]}>
          Promedio por gasto: ${promedioGastoFiltrado.toFixed(2)}
        </Text>
        {/* Nuevo: Mostrar número de transacciones */}
        <Text style={[styles.averageText, { color: colors.secondaryText, marginTop: 5 }]}>
          Número de transacciones: {numeroDeTransacciones}
        </Text>
      </View>

      {/* Simplified Pie Chart - Usará categoryData (que ya está filtrada) */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Distribución por Categorías {timeFilter !== 'all' ? `(${timeFilter})` : ''}
        </Text>
        {categoryData.length > 0 ? (
          <>
            <VictoryPie
              data={categoryData}
              colorScale={colorScale}
              width={chartWidth}
              height={300} // Puedes ajustar la altura si es necesario
              padding={{ top: 20, bottom: 20, left: 40, right: 40 }} // Ajustar padding para dar espacio
              innerRadius={70} // Ligeramente más pequeño para más área de "pastel"
              padAngle={2} // Un poco más de espacio entre slices
              labels={() => null} 
            />
            <View style={styles.legendContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendDot, {
                      backgroundColor: colorScale[index % colorScale.length]
                    }]} />
                    <Text style={[styles.legendText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
                      {item.x}:
                    </Text>
                    <Text style={[styles.legendAmount, { color: colors.primary }]}>
                      ${item.y.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No hay gastos registrados {timeFilter !== 'all' ? 'en este período' : ''}
          </Text>
        )}
      </View>

      {/* Nueva Tarjeta: Detalles Adicionales */}
      {numeroDeTransacciones > 0 && (
        <View style={[styles.card, styles.detailsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>
            Detalles Adicionales {timeFilter !== 'all' ? `(${timeFilter})` : ''}
          </Text>
          
          <View style={[styles.detailItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <Text style={[styles.detailLabel, { color: colors.secondaryText }]} numberOfLines={1} ellipsizeMode="tail">
              Gasto más alto:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
              {highestExpense.title} (${highestExpense.amount.toFixed(2)})
            </Text>
          </View>

          <View style={[styles.detailItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <Text style={[styles.detailLabel, { color: colors.secondaryText }]} numberOfLines={1} ellipsizeMode="tail">
              Gasto más bajo:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
              {lowestExpense.title} (${lowestExpense.amount.toFixed(2)})
            </Text>
          </View>

          <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
            <Text style={[styles.detailLabel, { color: colors.secondaryText }]} numberOfLines={1} ellipsizeMode="tail">
              Categoría más frecuente:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
              {mostFrequentCategory.name} ({mostFrequentCategory.count} {mostFrequentCategory.count === 1 ? 'vez' : 'veces'})
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCard: {
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  detailsCard: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 32, // Ligeramente más pequeño para no ser tan abrumador
    fontWeight: 'bold',
    marginBottom: 8,
  },
  averageText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20, // Margen inferior estándar para títulos de sección
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18, // Más espacio entre elementos
    backgroundColor: 'rgba(0,0,0,0.03)', // Fondo sutil para separar
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    marginRight: 5,
    flexShrink: 1,
    maxWidth: 80, // Limita el ancho del nombre de la categoría
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    minWidth: 60,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  filterContainer: {
    marginBottom: 20,
    // Si los filtros están fuera de una tarjeta, podrías querer añadir paddingHorizontal aquí
    // paddingHorizontal: 16, // Si no está dentro del padding general del contentContainer
  },
  filterScrollContent: { // Para padding dentro del scroll horizontal de filtros
    paddingHorizontal: Platform.OS === 'android' ? 0 : 16, // Evitar doble padding en Android si container ya tiene
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e9ecef", // Un color base
    marginRight: 10,
    elevation: 1, // Sombra ligera
  },
  activeFilterButton: {
    // backgroundColor se aplica dinámicamente
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057", // Texto un poco más oscuro
  },
  activeFilterText: {
    color: "white", // Texto blanco para el botón activo
    fontWeight: "bold",
  },
  detailsCard: { // Hereda de 'card'
    // No necesita padding adicional si ya lo tiene 'card'
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Cambiado abajo
    // Usar color del tema para el borde:
    // Esta línea se aplicará dinámicamente en el componente si es necesario,
    // o puedes definirla aquí si 'colors.border' está disponible en este scope.
    // Por ahora, la dejaré comentada y puedes añadirla si 'colors' está disponible aquí
    // o aplicarla directamente en el JSX.
    // Para este ejemplo, la aplicaré directamente en el JSX usando colors.border.
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: 160,
  },
});

export default StatsScreen;