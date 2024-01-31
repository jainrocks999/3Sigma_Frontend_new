import {TextStyle} from 'react-native';
import {darkTheme} from '../colors/colors';
import {GStyle} from '../gStyle.types';
import fonts from './fonts';

export enum FontSizeEnum {
  XXS = 10,
  XS = 12,
  SM = 14,
  BASE = 16,
  LG = 18,
  XL = 20,
  XL2 = 24,
  XL3 = 24,
  XL4 = 26,
  XL5 = 36,
  XL6 = 48,
  XL7 = 64,
}

export enum FontWeightEnum {
  BOLD = 'BOLD',
  SEMI_BOLD = 'SEMI_BOLD',
  EXTRA_BOLD = 'EXTRA_BOLD',
  LIGHT_BOLD = 'LIGHT_BOLD',
  MEDIUM = 'MEDIUM',
  REGULAR = 'REGULAR',
}

export const generateFontStyle = (
  size = FontSizeEnum.BASE,
  weight = FontWeightEnum.REGULAR,
  isMonospace = false,
): GStyle => {
  const lineHeight = size * 1.5;
  let fontFamily = fonts.medium;
  if (weight === FontWeightEnum.BOLD) {
    fontFamily = fonts.bold;
  } else if (weight === FontWeightEnum.MEDIUM) {
    fontFamily = fonts.medium;
  } else if (weight === FontWeightEnum.SEMI_BOLD) {
    fontFamily = fonts.sBold;
  } else if (weight === FontWeightEnum.LIGHT_BOLD) {
    fontFamily = fonts.thin;
  } else if (weight === FontWeightEnum.EXTRA_BOLD) {
    fontFamily = fonts.eBold;
  }

  return {
    fontFamily,
    fontSize: size,
    fontStyle: 'normal',
    fontVariant: isMonospace ? ['tabular-nums'] : void 0,
    lineHeight,
  };
};

// Add generic styles for typography
type FontSize = 'x10' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70' | 'x80';
export const fontSize: Record<FontSize, TextStyle> = {
  x10: {
    fontSize: 10,
  },
  x20: {
    fontSize: 12,
  },
  x30: {
    fontSize: 13,
  },
  x40: {
    fontSize: 14,
  },
  x50: {
    fontSize: 15,
  },
  x60: {
    fontSize: 20,
  },
  x70: {
    fontSize: 24,
  },
  x80: {
    fontSize: 25,
  },
};

type LetterSpacing = 'x10' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const letterSpacing: Record<LetterSpacing, TextStyle> = {
  x10: {
    letterSpacing: 0,
  },
  x20: {
    letterSpacing: 0.12,
  },
  x30: {
    letterSpacing: 0.14,
  },
  x40: {
    letterSpacing: 0.17,
  },
  x50: {
    letterSpacing: 0.18,
  },
  x60: {
    letterSpacing: 0.24,
  },
  x70: {
    letterSpacing: 0.3,
  },
};

type LineHeight = 'x10' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70' | 'x80';
export const lineHeight: Record<LineHeight, TextStyle> = {
  x10: {
    lineHeight: 12,
  },
  x20: {
    lineHeight: 14,
  },
  x30: {
    lineHeight: 15,
  },
  x40: {
    lineHeight: 16,
  },
  x50: {
    lineHeight: 18,
  },
  x60: {
    lineHeight: 24,
  },
  x70: {
    lineHeight: 29,
  },
  x80: {
    lineHeight: 30,
  },
};

type Header = 'x10' | 'x20' | 'x30' | 'x40';
export const headerTextStyle: Record<Header, TextStyle> = {
  x10: {
    ...fontSize.x50,
    ...letterSpacing.x50,
    ...lineHeight.x50,
    fontFamily: fonts.medium,
  },
  x20: {
    ...fontSize.x60,
    ...letterSpacing.x60,
    ...lineHeight.x60,
    fontFamily: fonts.medium,
  },
  x30: {
    ...fontSize.x70,
    ...letterSpacing.x10,
    ...lineHeight.x70,
    fontFamily: fonts.medium,
  },
  x40: {
    ...fontSize.x80,
    ...letterSpacing.x70,
    ...lineHeight.x80,
    fontFamily: fonts.medium,
  },
};

type Subheader = 'x10' | 'x20';
export const subheaderTextStyle: Record<Subheader, TextStyle> = {
  x10: {
    ...fontSize.x40,
    ...letterSpacing.x40,
    ...lineHeight.x40,
    fontFamily: fonts.reg,
  },
  x20: {
    ...fontSize.x50,
    ...letterSpacing.x10,
    ...lineHeight.x50,
    fontFamily: fonts.reg,
  },
};

type Body = 'x10' | 'x20' | 'x30' | 'x40';
export const bodyTextStyle: Record<Body, TextStyle> = {
  x10: {
    ...fontSize.x10,
    ...letterSpacing.x20,
    ...lineHeight.x10,
    fontFamily: fonts.medium,
    color: darkTheme.black,
  },
  x20: {
    ...fontSize.x20,
    ...letterSpacing.x30,
    ...lineHeight.x20,
    fontFamily: fonts.medium,
    color: darkTheme.black,
  },
  x30: {
    ...fontSize.x30,
    ...letterSpacing.x10,
    ...lineHeight.x30,
    fontFamily: fonts.medium,
    color: darkTheme.black,
  },
  x40: {
    ...fontSize.x50,
    ...letterSpacing.x50,
    ...lineHeight.x50,
    fontFamily: fonts.medium,
    color: darkTheme.secondary,
  },
};
