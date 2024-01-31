import ThemeColorEnum from './themeColor.enum';

export interface GTheme {
  color?: ThemeColorEnum;
}

export const defaultTheme: GTheme = {color: ThemeColorEnum.PURPLE};
