export enum LayoutSizeEnum {
  XXS = 2,
  XS = 4,
  SM = 8,
  MD = 12,
  LG = 16,
  XL = 20,
  XL2 = 24,
  XL3 = 32,
  XL4 = 60,
  XL5 = 64,
  XL6 = 96,
}

type BorderRadius = 'small' | 'base' | 'large' | 'max' | 'xtralarge';

export const borderRadius: Record<BorderRadius, number> = {
  small: 5,
  base: 10,
  large: 15,
  xtralarge: 20,
  max: 4999,
};
