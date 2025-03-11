import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';

export const useThemeStyles = () => {
  const { theme } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    },
    title: {
      color: theme === 'dark' ? 'white' : 'black',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    settingLabel: {
      color: theme === 'dark' ? 'lightgray' : 'darkgray',
      fontSize: 16,
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#ccc',
    },
  });
};