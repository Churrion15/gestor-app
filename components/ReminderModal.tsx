import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../src/types/index';
import { Alert } from 'react-native';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reminder: any) => void;
  theme: 'light' | 'dark';  // Add this line
  colors: ThemeColors;
}

const ReminderModal = ({ visible, onClose, onSave, theme, colors }: ReminderModalProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly'); // 'daily', 'weekly', 'monthly'
  const [enabled, setEnabled] = useState(true);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert(
        "Campos requeridos",
        "Por favor completa todos los campos",
        // Cambiado:
        [{ text: "Aceptar" }] 
      );
      return;
    }

    onSave({
      title,
      amount: parseFloat(amount),
      frequency,
      enabled,
      createdAt: new Date().toISOString(),
    });

    // Limpiar formulario
    setTitle('');
    setAmount('');
    setFrequency('monthly');
    setEnabled(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nuevo Recordatorio</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder="Título"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder="Monto"
            placeholderTextColor={colors.secondaryText}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <View style={styles.frequencyContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Frecuencia:</Text>
            <View style={styles.frequencyButtons}>
              {['daily', 'weekly', 'monthly'].map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    frequency === freq && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      { color: frequency === freq ? '#fff' : colors.text }
                    ]}
                  >
                    {freq === 'daily' ? 'Diario' : freq === 'weekly' ? 'Semanal' : 'Mensual'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Activar recordatorio</Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={enabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  frequencyContainer: {
    marginBottom: 15,
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  frequencyButtonText: {
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReminderModal;