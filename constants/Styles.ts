import { useTheme } from '@react-navigation/native';
import { useContext } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

export const useThemeStyles = () => {
  const { dark: theme, colors } = useTheme();
  const windowWidth = Dimensions.get('window').width;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: Platform.OS === 'web' ? '5%' : 15,
      paddingTop: Platform.OS === 'web' ? 20 : 10,
    },
    title: {
      color: colors.text,
      fontSize: Platform.OS === 'web' ? 28 : 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: Platform.OS === 'web' ? 'center' : 'left',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginVertical: 4,
    },
    settingLabel: {
      color: colors.text,
      fontSize: Platform.OS === 'web' ? 18 : 16,
    },
    item: {
      padding: Platform.OS === 'web' ? 15 : 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginVertical: 4,
      shadowColor: theme ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    responsiveGrid: {
      flexDirection: Platform.OS === 'web' ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: Platform.OS === 'web' ? 'space-between' : 'flex-start',
      width: '100%',
      maxWidth: Platform.OS === 'web' ? 1200 : '100%',
      alignSelf: 'center',
    },
    cardContainer: {
      width: Platform.OS === 'web' 
        ? windowWidth > 1200 
          ? '30%' 
          : windowWidth > 768 
            ? '45%' 
            : '100%'
        : '100%',
      margin: Platform.OS === 'web' ? 10 : 5,
    },
    shadow: {
      shadowColor: theme ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }
  });
};