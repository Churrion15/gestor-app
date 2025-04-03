import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from '../constants/categories';

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  placeholder?: string;
  theme: string;
  colors: any;
}

export const CategoryDropdown = ({
  value,
  onChange,
  isVisible,
  setIsVisible,
  placeholder = "Seleccionar categoría",
  theme,
  colors,
}: CategoryDropdownProps) => {
  
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          { backgroundColor: theme === "dark" ? "#333" : "#fff" }
        ]}
        onPress={() => setIsVisible(!isVisible)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={isVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.text}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View 
            style={[
              styles.dropdownList,
              { backgroundColor: theme === "dark" ? "#333" : "#fff" }
            ]}
          >
            <FlatList
              data={['Todas', ...CATEGORIES]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    value === item && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => {
                    onChange(item);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                    {item === 'Todas' ? 'Todas las categorías' : item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownScroll}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 15,
    zIndex: 1000,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  dropdownList: {
    width: '90%',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownScroll: {
    width: '100%',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});