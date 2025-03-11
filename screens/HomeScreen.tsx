import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useExpenses } from '../context/ExpenseContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { categoriesTotal, expenses, removeExpense } = useExpenses();
  const navigation = useNavigation();

  // Prepare data for the chart
  const chartData = categoriesTotal.map((item, index) => ({
    x: item.category,
    y: item.total
  }));

  // Generate colors for the chart
  const colorScale = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9A76', '#88D8B0'];

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de que quieres eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: () => removeExpense(id),
          style: 'destructive'
        }
      ]
    );
  };

  const handleEditExpense = (expense: any) => {
    navigation.navigate('Gastos', { expense } as never);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumen de Gastos</Text>
      
      {chartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <VictoryPie
            data={chartData}
            colorScale={colorScale}
            width={300}
            height={300}
            padding={50}
            labelRadius={({ innerRadius }: { innerRadius: number }) => (innerRadius || 0) + 30}
            style={{
              labels: { fontSize: 14, fill: 'black' }
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyText}>No hay gastos registrados</Text>
          <Text style={styles.emptySubText}>Agrega gastos para ver estadísticas</Text>
        </View>
      )}

      <View style={styles.categoryList}>
        <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
        {categoriesTotal.length > 0 ? (
          categoriesTotal.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colorScale[index % colorScale.length] }]} />
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.categoryAmount}>${item.total.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCategoriesText}>Sin categorías</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Gastos' as never)}
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
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  emptyChartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d'
  },
  emptySubText: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  categoryList: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10
  },
  categoryName: {
    flex: 1,
    fontSize: 16
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  noCategoriesText: {
    textAlign: 'center',
    color: '#6c757d',
    padding: 20
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  expenseInfo: {
    flex: 1
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  expenseCategory: {
    fontSize: 14,
    color: '#666'
  },
  expenseAmount: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    padding: 8,
    marginLeft: 8
  }
});

export default HomeScreen;
