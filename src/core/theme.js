import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const percentageCalculation = (max, val) => max * (val / 100);

const fontCalculation = (height, width, val) => {
    const widthDimension = height > width ? width : height;
    const aspectRatioBasedHeight = (16 / 9) * widthDimension;
    return percentageCalculation(
        Math.sqrt(
            Math.pow(aspectRatioBasedHeight, 2) + Math.pow(widthDimension, 2),
        ),
        val,
    );
};

export function responsiveFontSize(f) {
    const { height, width } = Dimensions.get('window');
    return fontCalculation(height, width, f);
}

export function responsiveHeight(h) {
    const { height } = Dimensions.get('window');
    return height * (h / 100);
}

export function responsiveWidth(w) {
    const { width } = Dimensions.get('window');
    return width * (w / 100);
}

export const COLORS = {
    // base colors
    primary: 'dodgerblue', // green
    secondary: '#ed3237', // dark green
    darkTransparent: '#000000d6',
    primaryFont: '#ffff',

    primaryFontLight: '#ffebabc7',

    green: '#66D59A',
    lightGreen: '#E6FEF0',

    lime: '#00BA63',
    emerald: '#2BC978',

    red: '#FF4134',
    lightRed: '#FFF1F0',

    purple: '#6B3CE9',
    lightpurple: '#F3EFFF',

    yellow: '#FFC664',
    lightyellow: '#FFF9EC',

    black: '#1E1F20',
    white: '#FFFFFF',

    lightGray: '#f4f4f4',
    gray: '#e9e9e9',

    darkgray: '#0007',
    darkGray: '#0007',
    transparent: 'transparent',

    seagreen: '#20b2aa',
    lightSeagreen: '#ddfffd',

    deeppink: '#ff1493',
    lightPink: '#ffebf6',

    deepskyblue: '#00bfff',
    lightSkyblue: '#def7ff',

    orange: '#ffa500',
    lightOrange: '#fff1d7',

    limegreen: '#32cd32',
    lightLimeGreen: '#d7ffd7',

    maroon: '#800000',
    lightMaroon: '#ffe2e2',

    darkGreen: '#008000',
    lightForestGreen: '#e1ffe1',

    darkmagenta: '#b700b7',
    lightMagenta: '#fff2ff',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: responsiveFontSize(5),
    radius: responsiveHeight(4),
    padding: responsiveHeight(1.3),
    padding2: 12,

    // font sizes
    largeTitle: responsiveHeight(5),
    h1: responsiveFontSize(4),
    h2: responsiveFontSize(3.6),
    h3: responsiveFontSize(2.5),
    h4: responsiveFontSize(2),
    body1: responsiveFontSize(3),
    body2: responsiveFontSize(2.5),
    body3: responsiveFontSize(2),
    body4: responsiveFontSize(1.5),
    body5: responsiveFontSize(1),

    // app dimensions
    width,
    height,
};

export const FONTS = {
    largeTitle: {
        fontFamily: 'Roboto-regular',
        fontSize: SIZES.largeTitle,
        lineHeight: responsiveFontSize(6),
        color: '#000000d6',
    },
    h1: {
        fontFamily: 'Roboto-Black',
        fontSize: SIZES.h1,
        lineHeight: responsiveFontSize(4),
        color: '#000000d6',
    },
    h2: {
        fontFamily: 'Roboto-Bold',
        fontSize: SIZES.h2,
        color: '#000000d6',
    },
    h3: {
        fontFamily: 'Roboto-Bold',
        fontSize: SIZES.h3,
        lineHeight: responsiveFontSize(2.5),
        color: '#000000d6',
    },
    h4: {
        fontFamily: 'Roboto-Bold',
        fontSize: SIZES.h4,
        lineHeight: responsiveFontSize(2),
        color: '#000000d6',
    },
    body1: {
        fontFamily: 'Roboto-Regular',
        fontSize: SIZES.body1,
        lineHeight: 36,
        color: '#000000d6',
    },
    body2: {
        fontFamily: 'Roboto-Regular',
        fontSize: SIZES.body2,
        lineHeight: 30,
        color: '#000000d6',
    },
    body3: {
        fontFamily: 'Roboto-Regular',
        fontSize: SIZES.body3,
        lineHeight: 22,
        color: '#000000d6',
    },
    body4: {
        fontFamily: 'Roboto-Regular',
        fontSize: SIZES.body4,
        lineHeight: 22,
        color: '#000000d6',
    },
    body5: {
        fontFamily: 'Roboto-Regular',
        fontSize: SIZES.body5,
        lineHeight: 22,
        color: '#000000d6',
    },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
