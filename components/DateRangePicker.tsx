import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemeType, ThemeColors } from '../src/types/index';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  theme: ThemeType;
  colors: ThemeColors;
}

const DateRangePicker = ({ startDate, endDate, onDateChange, theme, colors }: DateRangePickerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const applyDates = () => {
    onDateChange(tempStartDate, tempEndDate);
    setIsVisible(false);
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    let start = new Date();
    let end = today;

    switch (preset) {
      case '24h':
        start = subDays(today, 1);
        break;
      case '7d':
        start = subDays(today, 7);
        break;
      case '30d':
        start = subDays(today, 30);
        break;
      case 'thisMonth':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case '3m':
        start = subMonths(today, 3);
        break;
      case '6m':
        start = subMonths(today, 6);
        break;
      case '1y':
        start = subMonths(today, 12);
        break;
      default:
        break;
    }

    setTempStartDate(start);
    setTempEndDate(end);
    onDateChange(start, end);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme === 'dark' ? '#333' : '#fff', borderColor: colors.border }]} 
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {format(startDate, 'dd/MM/yyyy', { locale: es })} - {format(endDate, 'dd/MM/yyyy', { locale: es })}
        </Text>
        <Ionicons name="calendar" size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Rango de Fechas</Text>
            
            <ScrollView style={styles.presetContainer}>
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('24h')}
              >
                <Text style={styles.presetButtonText}>Últimas 24 horas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('7d')}
              >
                <Text style={styles.presetButtonText}>Últimos 7 días</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('30d')}
              >
                <Text style={styles.presetButtonText}>Últimos 30 días</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('thisMonth')}
              >
                <Text style={styles.presetButtonText}>Este mes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('lastMonth')}
              >
                <Text style={styles.presetButtonText}>Mes anterior</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('3m')}
              >
                <Text style={styles.presetButtonText}>Últimos 3 meses</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('6m')}
              >
                <Text style={styles.presetButtonText}>Últimos 6 meses</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.presetButton, { backgroundColor: colors.primary }]} 
                onPress={() => applyPreset('1y')}
              >
                <Text style={styles.presetButtonText}>Último año</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.border }]} 
                onPress={() => setIsVisible(false)}
              >
                <Text style={{ color: colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]} 
                onPress={applyDates}
              >
                <Text style={{ color: '#fff' }}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  presetContainer: {
    maxHeight: 300,
  },
  presetButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  presetButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
});

export default DateRangePicker;