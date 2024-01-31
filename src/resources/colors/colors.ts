import {ColorValue} from 'react-native';

export const colors: {
  [key: string]: ColorValue | string | undefined;
} = {
  bgCol: '#ebf0f4',
  BgCol2: '#88bdfa1a',
  themeCol1: '#061740',
  themeCol2: '#3FAEFD',
  themeCol3: '#1D8094',
  themeCol4: '#1D4D94',
  themeCol5: '#505EAD',
  themeCol6: '#012635',
  inputGrey1: '#F1F3F4',
  labelCol1: '#667387',
  textCol1: '#ABB1B8',
  textCol2: '#717D8A',
  textColor3: '#B7B7B7',
  disabledGrey: '#e3e3e3',
  InputGrey2: '#F7F7F7',
  placeholderText: '#999999',
  InputGrey3: '#f4f4f4',
  InputGrey4: '#e1f0fa',
  stroke2: '#D1D1D1',
  stroke3: '#828282',
  white: '#FFFFFF',
  black: '#000',
  IndianRed: '#CD5C5C',
  green: 'green',
  lightBg: '#dae4eb',
  red: 'red',
  youtubeRed: '#CF3C45',
  blue: 'blue',
  gray: 'gray',
  lightgrayText: '#AFB0B5',
  yellow: '#F49619',
  transparentBlack: 'rgba(52, 52, 52, 0.4)',
  leadTextColor: 'rgba(0, 0, 0, 0.7)',
  deleteButton: '#ff47470f',
  pinkColor: 'pink',
  orangeColor: 'orange',
  lightGreenColor: 'lightgreen',
  lightgray: 'lightgray',
  bulkSelection: '#87cefa4a',
  activityBackground: '#F6F6F8',
  timelineItem: '#ebf0f4',
  blueTransparent: 'rgba(3,138,255,0.2)',
};
export const sourceColors: {[key: string]: ColorValue | string | undefined} = {
  facebook: '#151B54',
  zapier: '#FFA500',
  indiamart: '#00FFFF',
  wordpress: '#800080',
  google_lead_form: '#008000',
  tradeindia: '#808000',
  justdial: '#368BC1',
  '3sigma': '#3BB9FF',
  csv: '#A0522D',
  website: '#008B8B',
};
export const androidRipple = {color: '#ccc', borderless: false};

export enum ColorEnum {
  blue = 0,
  gray = 1,
  green = 2,
  indigo = 3,
  orange = 4,
  pink = 5,
  purple = 6,
  red = 7,
  teal = 8,
  yellow = 9,
}

export const darkTheme = {
  overlayBlack: '#00000050',

  primary: '#46B5BE',
  primaryLight: '#72DFE2',
  primaryCyan: '#58EAEF',
  primaryYello: '#BCC94D',
  //
  regular: '#707070',
  regularMLight: '#D5D5D5',
  regularLight: '#00000029',

  secondary: '#F49619',
  secondaryGreen: '#569032',
  secondaryLight: '#E4E4E4',

  green: '#569032',
  black: '#000000',
  placeholderColor: '#929DAC',
  white: '#FFFFFF',
  whiteScreen: '#FEFEFE',
  whitish: '#F6F6F6',

  warn: '',
  warm: '',
  danger: 'red',
  grayRipple: {color: '#ccc', borderless: false},
};

export interface GradientProps {
  colors: string[];
  locations?: number[];
}
