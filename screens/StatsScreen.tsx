import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { VictoryPie, VictoryChart, VictoryAxis, VictoryLine, VictoryTooltip, VictoryLegend, VictoryLabel } from 'victory-native';
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';

// Interfaces para tipado
interface ExpenseData {
  x: string;
  y: number;
}

interface Expense {
  category: string;
  amount: number;
  date: string;
}

const StatsScreen = () => {
  const { expenses } = useExpenses();
  const { colors, theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [sortOrder, setSortOrder] = useState('desc');
  const windowWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  const chartWidth = isWeb ? Math.min(500, windowWidth * 0.9) : windowWidth * 0.9;

  // Calcular estadísticas
  const totalGastado = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const promedioMensual = totalGastado / 6;
  const mayorGasto = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  // Ordenar gastos por fecha
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Función para cambiar el orden
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Función para obtener la categoría más frecuente
  const getMostFrequentCategory = (): string => {
    if (!expenses || expenses.length === 0) return 'Sin categoría';
    
    const categoryCount = expenses.reduce((acc: { [key: string]: number }, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1;
      return acc;
    }, {});
    
    const sortedCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a);
      
    return sortedCategories.length > 0 ? sortedCategories[0][0] : 'Sin categoría';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Estadísticas</Text>
        <TouchableOpacity 
          onPress={toggleSortOrder}
          style={[styles.sortButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.sortButtonText}>
            {sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: selectedPeriod === period ? '#fff' : colors.text }
              ]}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Resumen rápido */}
      <View style={[styles.quickStatsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.quickStatItem}>
          <Text style={[styles.quickStatValue, { color: colors.primary }]}>${totalGastado.toFixed(2)}</Text>
          <Text style={[styles.quickStatLabel, { color: colors.secondaryText }]}>Total</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={[styles.quickStatValue, { color: colors.primary }]}>${promedioMensual.toFixed(2)}</Text>
          <Text style={[styles.quickStatLabel, { color: colors.secondaryText }]}>Promedio</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={[styles.quickStatValue, { color: colors.primary }]}>${mayorGasto.toFixed(2)}</Text>
          <Text style={[styles.quickStatLabel, { color: colors.secondaryText }]}>Mayor</Text>
        </View>
      </View>
      
      {/* Gráfico de categorías */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Gastos por Categoría</Text>
        <View style={styles.chartWrapper}>
          <VictoryPie
            data={expenses.reduce((acc, expense) => {
              const existingCategory = acc.find(item => item.x === expense.category);
              if (existingCategory) {
                existingCategory.y += expense.amount;
              } else {
                acc.push({ x: expense.category, y: expense.amount });
              }
              return acc;
            }, [] as ExpenseData[])}
            colorScale={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA8DA', '#CE93D8']}
            width={chartWidth}
            height={isWeb ? 300 : 250}
            padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
            innerRadius={isWeb ? 50 : 30}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
            style={{
              labels: { 
                fill: colors.text, 
                fontSize: isWeb ? 14 : 12,
                display: isWeb ? 'auto' : 'none'
              },
              data: {
                fillOpacity: 0.9,
                stroke: colors.background,
                strokeWidth: 2
              }
            }}
            labelComponent={<VictoryTooltip 
              flyoutStyle={{ fill: colors.card, stroke: colors.border }}
              style={{ fill: colors.text }}
            />}
          />
        </View>
        
        {/* Leyenda para dispositivos móviles */}
        {!isWeb && (
          <View style={styles.legendContainer}>
            {expenses.reduce((acc, expense) => {
              const existingCategory = acc.find(item => item.x === expense.category);
              if (existingCategory) {
                existingCategory.y += expense.amount;
              } else {
                acc.push({ x: expense.category, y: expense.amount });
              }
              return acc;
            }, [] as ExpenseData[]).map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA8DA', '#CE93D8'][index % 8] }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>
                  {item.x}: ${item.y.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* Gráfico de tendencia mensual */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Tendencia Mensual</Text>
        <VictoryChart 
          width={chartWidth} 
          height={250} 
          padding={{ top: 20, bottom: 50, left: 60, right: 40 }}
          domainPadding={{ x: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{
              axis: { stroke: colors.text },
              tickLabels: { fill: colors.text, fontSize: 12 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `$${t}`}
            style={{
              axis: { stroke: colors.text },
              tickLabels: { fill: colors.text, fontSize: 12 }
            }}
          />
          <VictoryLine
            data={expenses.reduce((acc, expense) => {
              const date = new Date(expense.date);
              const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
              const existingMonth = acc.find(item => item.x === monthYear);
              
              if (existingMonth) {
                existingMonth.y += expense.amount;
              } else {
                acc.push({ x: monthYear, y: expense.amount });
              }
              return acc;
            }, [] as ExpenseData[]).sort((a, b) => {
              const [monthA, yearA] = a.x.split('/');
              const [monthB, yearB] = b.x.split('/');
              return new Date(+yearA, +monthA - 1).getTime() - new Date(+yearB, +monthB - 1).getTime();
            })}
            style={{
              data: { stroke: colors.primary, strokeWidth: 3 }
            }}
            labels={({ datum }) => `$${datum.y.toFixed(2)}`}
            labelComponent={
              <VictoryLabel 
                dy={-10} 
                style={{ fill: colors.primary, fontSize: 12 }}
              />
            }
          />
        </VictoryChart>
      </View>
      
      {/* Add a summary section */}
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Resumen del Período</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>
            Gasto más alto:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            ${Math.max(...expenses.map(e => e.amount)).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>
            Gasto más frecuente:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {getMostFrequentCategory()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  periodButtonText: {
    fontWeight: 'bold',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickStatLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  chartContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StatsScreen;