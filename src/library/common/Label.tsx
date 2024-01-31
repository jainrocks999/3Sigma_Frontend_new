import {Text, StyleSheet} from 'react-native';
import React from 'react';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

export interface LabelProps {
  text: string;
}
const Label = ({text}: LabelProps) => {
  return <Text style={styles.labelText}>{text}</Text>;
};

const styles = StyleSheet.create({
  labelText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    marginTop: 10,
  },
});

export default Label;
