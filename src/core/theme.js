import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const percentageCalculation = (max, val) => max * (val / 100);

const fontCalculation = (h, w, val) => {
  const widthDimension = h > w ? w : h;
  const aspectRatioBasedHeight = (16 / 9) * widthDimension;
  return percentageCalculation(
    Math.sqrt(Math.pow(aspectRatioBasedHeight, 2) + Math.pow(widthDimension, 2)),
    val
  );
};

export function responsiveFontSize(f) {
  return fontCalculation(height, width, f);
}

export function responsiveHeight(h) {
  return height * (h / 100);
}

export function responsiveWidth(w) {
  return width * (w / 100);
}

export const COLORS = {
  // base colors
  primary: '#08874c', // green
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

export const FONTS = {};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
