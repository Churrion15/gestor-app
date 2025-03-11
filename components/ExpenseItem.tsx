import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseItemProps {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const ExpenseItem = ({ title, amount, category, date }: ExpenseItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: { 
    padding: 15, 
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  amount: { 
    fontSize: 16, 
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  category: { 
    fontSize: 14, 
    color: '#7f8c8d' 
  },
  date: { 
    fontSize: 12, 
    color: '#95a5a6',
    marginTop: 5
  },
});

export default ExpenseItem;