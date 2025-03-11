import * as Colors from '../constants/Colors';

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


export const formatDate = {
    
}

export const getColorByIndex = (index: number): string => {
    return colorsPalette[index % colorsPalette.length];
};