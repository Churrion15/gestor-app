import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Expense } from '../context/ExpenseContext';
import { Platform } from 'react-native';

export const exportToCSV = async (expenses: Expense[]) => {
  if (Platform.OS === 'web') {
    // Web-specific export using Blob
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'ID,Título,Monto,Categoría,Descripción,Fecha\n' +
      expenses.map(expense => 
        `${expense.id},"${expense.title}",${expense.amount},"${expense.category}","${expense.description}",${expense.date}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gastos_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
  } else {
    // Mobile export logic
    const csvContent = 
      'ID,Título,Monto,Categoría,Descripción,Fecha\n' +
      expenses.map(expense => 
        `${expense.id},"${expense.title}",${expense.amount},"${expense.category}","${expense.description}",${expense.date}`
      ).join('\n');
    
    const timestamp = new Date().getTime();
    const fileUri = `${FileSystem.documentDirectory}gastos_${timestamp}.csv`;
    
    await FileSystem.writeAsStringAsync(
      fileUri, 
      csvContent,
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exportar gastos como CSV'
      });
    } else {
      alert('La función de compartir no está disponible en este dispositivo');
    }
  }
};

// Función para exportar a JSON (alternativa útil)
export const exportToJSON = async (expenses: Expense[]) => {
  try {
    const timestamp = new Date().getTime();
    const fileUri = `${FileSystem.documentDirectory}gastos_${timestamp}.json`;
    
    await FileSystem.writeAsStringAsync(
      fileUri, 
      JSON.stringify(expenses, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar gastos como JSON'
      });
    } else {
      alert('La función de compartir no está disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error al exportar datos JSON:', error);
    alert('Error al exportar datos JSON');
  }
};