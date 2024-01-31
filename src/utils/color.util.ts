import {ColorEnum} from 'resources/colors/colors';
import R from 'resources/R';
import {Nullable} from '../models/custom.types';
import commonUtil from './common.util';

const generateRandomColor: () => string = () => {
  const randomNumber = Math.floor(Math.random() * 10);
  const colorSuffix = randomNumber === 0 ? 100 : randomNumber * 100;
  const colorKey: Nullable<string> = commonUtil.getEnumKeyByEnumValue(
    ColorEnum,
    randomNumber,
  );
  const colorProp = `${colorKey}${colorSuffix}`;
  return R.colors[colorProp];
};

export default {generateRandomColor};
