import * as Colors from '../constants/Colors';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const colorsPalette = [
    Colors.chartColor1,
    Colors.chartColor2,
    Colors.chartColor3,
    Colors.chartColor4,
    Colors.chartColor5,
    Colors.chartColor6,
    Colors.chartColor7,
    Colors.chartColor8,
    Colors.chartColor9,
    Colors.chartColor10,
];

// Implementar funciones útiles de formato de fecha
export const formatDate = {
    toReadable: (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString;
        }
    },
    toMonthYear: (dateString: string) => {
        try {
            return format(parseISO(dateString), 'MMMM yyyy', { locale: es });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString;
        }
    }
}

export const getColorByIndex = (index: number): string => {
    return colorsPalette[index % colorsPalette.length];
};